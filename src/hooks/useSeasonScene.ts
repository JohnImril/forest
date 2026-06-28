import { useEffect, useMemo, useState } from "react";
import { DEFAULT_HOLLOW_POINT, seasons, type SeasonId } from "../domain/seasons";
import { isPngImage, shouldLoadHighResolutionImages } from "../lib/imageLoading";
import { makeParticles } from "../lib/particles";
import { useEyePosition } from "./useEyePosition";

export const useSeasonScene = () => {
	const [activeSeasonId, setActiveSeasonId] = useState<SeasonId>("autumn");
	const [visibleSeasonId, setVisibleSeasonId] = useState<SeasonId>("autumn");
	const [loadedSeasonIds, setLoadedSeasonIds] = useState<ReadonlySet<SeasonId>>(() => new Set());
	const [pngPreviewSeasonIds, setPngPreviewSeasonIds] = useState<ReadonlySet<SeasonId>>(() => new Set());
	const [highResolutionRequestedSeasonIds, setHighResolutionRequestedSeasonIds] = useState<ReadonlySet<SeasonId>>(
		() => new Set(),
	);
	const [highResolutionSeasonIds, setHighResolutionSeasonIds] = useState<ReadonlySet<SeasonId>>(() => new Set());
	const visibleSeason = seasons.find((season) => season.id === visibleSeasonId) ?? seasons[2];
	const activeSeason = seasons.find((season) => season.id === activeSeasonId) ?? visibleSeason;
	const renderedSeason = loadedSeasonIds.has(activeSeasonId) ? activeSeason : visibleSeason;
	const previewsReady = loadedSeasonIds.size === seasons.length;
	const hollowPoint = renderedSeason.hollowPoint ?? DEFAULT_HOLLOW_POINT;
	const eyePosition = useEyePosition(hollowPoint);
	const particles = useMemo(() => makeParticles(renderedSeason), [renderedSeason]);

	useEffect(() => {
		if (!previewsReady || !loadedSeasonIds.has(activeSeasonId) || !shouldLoadHighResolutionImages()) {
			return;
		}

		const nextSeason = [
			activeSeason,
			...seasons.filter((season) => season.id !== activeSeason.id),
		].find(
			(season) =>
				loadedSeasonIds.has(season.id) &&
				!pngPreviewSeasonIds.has(season.id) &&
				!highResolutionRequestedSeasonIds.has(season.id) &&
				!highResolutionSeasonIds.has(season.id),
		);

		if (!nextSeason) {
			return;
		}

		let idleCallbackId: number | undefined;
		let timeoutId: number | undefined;
		const requestHighResolutionImage = () => {
			setHighResolutionRequestedSeasonIds((currentSeasonIds) => {
				if (currentSeasonIds.has(nextSeason.id)) {
					return currentSeasonIds;
				}

				const nextSeasonIds = new Set(currentSeasonIds);
				nextSeasonIds.add(nextSeason.id);

				return nextSeasonIds;
			});
		};

		if ("requestIdleCallback" in window) {
			idleCallbackId = window.requestIdleCallback(requestHighResolutionImage, { timeout: 2400 });
		} else {
			timeoutId = setTimeout(requestHighResolutionImage, 900);
		}

		return () => {
			if (idleCallbackId !== undefined) {
				window.cancelIdleCallback(idleCallbackId);
			}

			if (timeoutId !== undefined) {
				clearTimeout(timeoutId);
			}
		};
	}, [
		activeSeason,
		activeSeasonId,
		highResolutionRequestedSeasonIds,
		highResolutionSeasonIds,
		loadedSeasonIds,
		pngPreviewSeasonIds,
		previewsReady,
	]);

	const handleSeasonLoad = (seasonId: SeasonId, currentSrc: string) => {
		setLoadedSeasonIds((currentSeasonIds) => {
			if (currentSeasonIds.has(seasonId)) {
				return currentSeasonIds;
			}

			const nextSeasonIds = new Set(currentSeasonIds);
			nextSeasonIds.add(seasonId);

			return nextSeasonIds;
		});

		if (seasonId === activeSeasonId) {
			setVisibleSeasonId(seasonId);
		}

		if (isPngImage(currentSrc)) {
			setPngPreviewSeasonIds((currentSeasonIds) => {
				if (currentSeasonIds.has(seasonId)) {
					return currentSeasonIds;
				}

				const nextSeasonIds = new Set(currentSeasonIds);
				nextSeasonIds.add(seasonId);

				return nextSeasonIds;
			});
			setHighResolutionSeasonIds((currentSeasonIds) => {
				if (currentSeasonIds.has(seasonId)) {
					return currentSeasonIds;
				}

				const nextSeasonIds = new Set(currentSeasonIds);
				nextSeasonIds.add(seasonId);

				return nextSeasonIds;
			});
		}
	};

	const handleHighResolutionLoad = (seasonId: SeasonId) => {
		setHighResolutionSeasonIds((currentSeasonIds) => {
			if (currentSeasonIds.has(seasonId)) {
				return currentSeasonIds;
			}

			const nextSeasonIds = new Set(currentSeasonIds);
			nextSeasonIds.add(seasonId);

			return nextSeasonIds;
		});
	};

	const handleSeasonSelect = (seasonId: SeasonId) => {
		setActiveSeasonId(seasonId);

		if (loadedSeasonIds.has(seasonId)) {
			setVisibleSeasonId(seasonId);
		}
	};

	return {
		activeSeasonId,
		eyePosition,
		handleHighResolutionLoad,
		handleSeasonLoad,
		handleSeasonSelect,
		highResolutionRequestedSeasonIds,
		highResolutionSeasonIds,
		loadedSeasonIds,
		particles,
		pngPreviewSeasonIds,
		previewsReady,
		renderedSeason,
		visibleSeasonId,
	};
};
