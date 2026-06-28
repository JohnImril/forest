import { useEffect, useMemo, useState } from "react";
import { DEFAULT_HOLLOW_POINT, seasons, type SeasonId } from "../domain/seasons";
import { isPngImage, shouldLoadHighResolutionImages } from "../lib/imageLoading";
import { makeParticles } from "../lib/particles";
import { useEyePosition } from "./useEyePosition";

const INITIAL_SEASON_ID: SeasonId = "autumn";

const addSeasonId = (seasonIds: ReadonlySet<SeasonId>, seasonId: SeasonId) => {
	if (seasonIds.has(seasonId)) {
		return seasonIds;
	}

	const nextSeasonIds = new Set(seasonIds);
	nextSeasonIds.add(seasonId);

	return nextSeasonIds;
};

const removeSeasonId = (seasonIds: ReadonlySet<SeasonId>, seasonId: SeasonId) => {
	if (!seasonIds.has(seasonId)) {
		return seasonIds;
	}

	const nextSeasonIds = new Set(seasonIds);
	nextSeasonIds.delete(seasonId);

	return nextSeasonIds;
};

export const useSeasonScene = () => {
	const [activeSeasonId, setActiveSeasonId] = useState<SeasonId>(INITIAL_SEASON_ID);
	const [pendingSeasonId, setPendingSeasonId] = useState<SeasonId | null>(null);
	const [requestedPreviewSeasonIds, setRequestedPreviewSeasonIds] = useState<ReadonlySet<SeasonId>>(
		() => new Set([INITIAL_SEASON_ID]),
	);
	const [loadedPreviewSeasonIds, setLoadedPreviewSeasonIds] = useState<ReadonlySet<SeasonId>>(() => new Set());
	const [failedPreviewSeasonIds, setFailedPreviewSeasonIds] = useState<ReadonlySet<SeasonId>>(() => new Set());
	const [pngPreviewSeasonIds, setPngPreviewSeasonIds] = useState<ReadonlySet<SeasonId>>(() => new Set());
	const [highResolutionRequestedSeasonIds, setHighResolutionRequestedSeasonIds] = useState<ReadonlySet<SeasonId>>(
		() => new Set(),
	);
	const [highResolutionSeasonIds, setHighResolutionSeasonIds] = useState<ReadonlySet<SeasonId>>(() => new Set());
	const activeSeason = seasons.find((season) => season.id === activeSeasonId) ?? seasons[2];
	const previewsReady = loadedPreviewSeasonIds.has(activeSeasonId);
	const isSwitchingSeason = pendingSeasonId !== null;
	const hollowPoint = activeSeason.hollowPoint ?? DEFAULT_HOLLOW_POINT;
	const eyePosition = useEyePosition(hollowPoint);
	const particles = useMemo(() => makeParticles(activeSeason), [activeSeason]);

	useEffect(() => {
		if (!previewsReady || requestedPreviewSeasonIds.size === seasons.length) {
			return;
		}

		const nextSeason = seasons.find(
			(season) => !requestedPreviewSeasonIds.has(season.id) && !failedPreviewSeasonIds.has(season.id),
		);

		if (!nextSeason) {
			return;
		}

		let idleCallbackId: number | undefined;
		let timeoutId: number | undefined;
		const requestNextPreview = () => {
			setRequestedPreviewSeasonIds((currentSeasonIds) => addSeasonId(currentSeasonIds, nextSeason.id));
		};

		if ("requestIdleCallback" in window) {
			idleCallbackId = window.requestIdleCallback(requestNextPreview, { timeout: 3500 });
		} else {
			timeoutId = setTimeout(requestNextPreview, 1400);
		}

		return () => {
			if (idleCallbackId !== undefined) {
				window.cancelIdleCallback(idleCallbackId);
			}

			if (timeoutId !== undefined) {
				clearTimeout(timeoutId);
			}
		};
	}, [failedPreviewSeasonIds, previewsReady, requestedPreviewSeasonIds]);

	useEffect(() => {
		if (
			!previewsReady ||
			pngPreviewSeasonIds.has(activeSeasonId) ||
			highResolutionRequestedSeasonIds.has(activeSeasonId) ||
			highResolutionSeasonIds.has(activeSeasonId) ||
			!shouldLoadHighResolutionImages()
		) {
			return;
		}

		let idleCallbackId: number | undefined;
		let timeoutId: number | undefined;
		const requestHighResolutionImage = () => {
			setHighResolutionRequestedSeasonIds((currentSeasonIds) => addSeasonId(currentSeasonIds, activeSeasonId));
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
		activeSeasonId,
		highResolutionRequestedSeasonIds,
		highResolutionSeasonIds,
		pngPreviewSeasonIds,
		previewsReady,
	]);

	const handleSeasonLoad = (seasonId: SeasonId, currentSrc: string) => {
		setLoadedPreviewSeasonIds((currentSeasonIds) => addSeasonId(currentSeasonIds, seasonId));
		setFailedPreviewSeasonIds((currentSeasonIds) => removeSeasonId(currentSeasonIds, seasonId));

		if (isPngImage(currentSrc)) {
			setPngPreviewSeasonIds((currentSeasonIds) => addSeasonId(currentSeasonIds, seasonId));
			setHighResolutionSeasonIds((currentSeasonIds) => addSeasonId(currentSeasonIds, seasonId));
		}

		if (seasonId === pendingSeasonId) {
			setActiveSeasonId(seasonId);
			setPendingSeasonId(null);
		}
	};

	const handleSeasonError = (seasonId: SeasonId) => {
		setFailedPreviewSeasonIds((currentSeasonIds) => addSeasonId(currentSeasonIds, seasonId));
		setRequestedPreviewSeasonIds((currentSeasonIds) => removeSeasonId(currentSeasonIds, seasonId));

		if (seasonId === pendingSeasonId) {
			setPendingSeasonId(null);
		}
	};

	const handleHighResolutionLoad = (seasonId: SeasonId) => {
		setHighResolutionSeasonIds((currentSeasonIds) => addSeasonId(currentSeasonIds, seasonId));
	};

	const handleSeasonSelect = (seasonId: SeasonId) => {
		if (seasonId === activeSeasonId) {
			setPendingSeasonId(null);
			return;
		}

		setFailedPreviewSeasonIds((currentSeasonIds) => removeSeasonId(currentSeasonIds, seasonId));

		if (loadedPreviewSeasonIds.has(seasonId)) {
			setActiveSeasonId(seasonId);
			setPendingSeasonId(null);
			return;
		}

		setPendingSeasonId(seasonId);
		setRequestedPreviewSeasonIds((currentSeasonIds) => addSeasonId(currentSeasonIds, seasonId));
	};

	return {
		activeSeasonId,
		activeSeason,
		eyePosition,
		handleHighResolutionLoad,
		handleSeasonError,
		handleSeasonLoad,
		handleSeasonSelect,
		failedPreviewSeasonIds,
		highResolutionRequestedSeasonIds,
		highResolutionSeasonIds,
		isSwitchingSeason,
		loadedPreviewSeasonIds,
		pendingSeasonId,
		particles,
		pngPreviewSeasonIds,
		previewsReady,
		requestedPreviewSeasonIds,
	};
};
