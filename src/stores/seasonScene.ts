import { writable } from "svelte/store";
import { seasons, type Season, type SeasonId } from "../domain/seasons";
import { isPngImage } from "../lib/imageLoading";
import { makeParticles, type Particle } from "../lib/particles";

export type SeasonSceneState = {
	activeSeasonId: SeasonId;
	visibleSeasonId: SeasonId;
	loadedSeasonIds: ReadonlySet<SeasonId>;
	pngPreviewSeasonIds: ReadonlySet<SeasonId>;
	highResolutionRequestedSeasonIds: ReadonlySet<SeasonId>;
	highResolutionSeasonIds: ReadonlySet<SeasonId>;
	previewsReady: boolean;
	renderedSeason: Season;
	particles: Particle[];
};

const initialSeasonId = "autumn" satisfies SeasonId;

const findSeason = (seasonId: SeasonId) => seasons.find((season) => season.id === seasonId) ?? seasons[2];

const withDerivedState = (
	state: Omit<SeasonSceneState, "previewsReady" | "renderedSeason" | "particles">,
	previousRenderedSeasonId?: SeasonId,
): SeasonSceneState => {
	const visibleSeason = findSeason(state.visibleSeasonId);
	const activeSeason = findSeason(state.activeSeasonId);
	const renderedSeason = state.loadedSeasonIds.has(state.activeSeasonId) ? activeSeason : visibleSeason;

	return {
		...state,
		previewsReady: state.loadedSeasonIds.size === seasons.length,
		renderedSeason,
		particles:
			previousRenderedSeasonId === renderedSeason.id ? [] : makeParticles(renderedSeason),
	};
};

const createInitialState = (): SeasonSceneState => ({
	activeSeasonId: initialSeasonId,
	visibleSeasonId: initialSeasonId,
	loadedSeasonIds: new Set(),
	pngPreviewSeasonIds: new Set(),
	highResolutionRequestedSeasonIds: new Set(),
	highResolutionSeasonIds: new Set(),
	previewsReady: false,
	renderedSeason: findSeason(initialSeasonId),
	particles: makeParticles(findSeason(initialSeasonId)),
});

const cloneSetWith = <T>(values: ReadonlySet<T>, value: T) => {
	if (values.has(value)) {
		return values;
	}

	const nextValues = new Set(values);
	nextValues.add(value);

	return nextValues;
};

export const getNextHighResolutionSeasonId = (state: SeasonSceneState) => {
	const activeSeason = findSeason(state.activeSeasonId);

	return [
		activeSeason,
		...seasons.filter((season) => season.id !== activeSeason.id),
	].find(
		(season) =>
			state.loadedSeasonIds.has(season.id) &&
			!state.pngPreviewSeasonIds.has(season.id) &&
			!state.highResolutionRequestedSeasonIds.has(season.id) &&
			!state.highResolutionSeasonIds.has(season.id),
	)?.id;
};

export const createSeasonScene = () => {
	const store = writable<SeasonSceneState>(createInitialState());

	const updateWithDerivedState = (
		updater: (
			state: SeasonSceneState,
		) => Omit<SeasonSceneState, "previewsReady" | "renderedSeason" | "particles">,
	) => {
		store.update((state) => {
			const nextBaseState = updater(state);
			const nextState = withDerivedState(nextBaseState, state.renderedSeason.id);

			if (nextState.particles.length === 0) {
				return {
					...nextState,
					particles: state.particles,
				};
			}

			return nextState;
		});
	};

	return {
		subscribe: store.subscribe,
		getNextHighResolutionSeasonId,
		handleSeasonLoad: (seasonId: SeasonId, currentSrc: string) => {
			updateWithDerivedState((state) => {
				const loadedSeasonIds = cloneSetWith(state.loadedSeasonIds, seasonId);
				const visibleSeasonId = seasonId === state.activeSeasonId ? seasonId : state.visibleSeasonId;
				const pngPreviewSeasonIds = isPngImage(currentSrc)
					? cloneSetWith(state.pngPreviewSeasonIds, seasonId)
					: state.pngPreviewSeasonIds;
				const highResolutionSeasonIds = isPngImage(currentSrc)
					? cloneSetWith(state.highResolutionSeasonIds, seasonId)
					: state.highResolutionSeasonIds;

				return {
					activeSeasonId: state.activeSeasonId,
					visibleSeasonId,
					loadedSeasonIds,
					pngPreviewSeasonIds,
					highResolutionRequestedSeasonIds: state.highResolutionRequestedSeasonIds,
					highResolutionSeasonIds,
				};
			});
		},
		handleHighResolutionLoad: (seasonId: SeasonId) => {
			updateWithDerivedState((state) => ({
				activeSeasonId: state.activeSeasonId,
				visibleSeasonId: state.visibleSeasonId,
				loadedSeasonIds: state.loadedSeasonIds,
				pngPreviewSeasonIds: state.pngPreviewSeasonIds,
				highResolutionRequestedSeasonIds: state.highResolutionRequestedSeasonIds,
				highResolutionSeasonIds: cloneSetWith(state.highResolutionSeasonIds, seasonId),
			}));
		},
		handleSeasonSelect: (seasonId: SeasonId) => {
			updateWithDerivedState((state) => ({
				activeSeasonId: seasonId,
				visibleSeasonId: state.loadedSeasonIds.has(seasonId) ? seasonId : state.visibleSeasonId,
				loadedSeasonIds: state.loadedSeasonIds,
				pngPreviewSeasonIds: state.pngPreviewSeasonIds,
				highResolutionRequestedSeasonIds: state.highResolutionRequestedSeasonIds,
				highResolutionSeasonIds: state.highResolutionSeasonIds,
			}));
		},
		requestHighResolution: (seasonId: SeasonId) => {
			updateWithDerivedState((state) => ({
				activeSeasonId: state.activeSeasonId,
				visibleSeasonId: state.visibleSeasonId,
				loadedSeasonIds: state.loadedSeasonIds,
				pngPreviewSeasonIds: state.pngPreviewSeasonIds,
				highResolutionRequestedSeasonIds: cloneSetWith(state.highResolutionRequestedSeasonIds, seasonId),
				highResolutionSeasonIds: state.highResolutionSeasonIds,
			}));
		},
	};
};
