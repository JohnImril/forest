import { useEffect, useMemo, useState, type CSSProperties } from "react";
import "./App.css";

type SeasonId = "spring" | "summer" | "autumn" | "winter";

type Particle = {
	id: number;
	left: number;
	top: number;
	size: number;
	duration: number;
	delay: number;
	drift: number;
	spin: number;
	opacity: number;
	variant: number;
};

type ImageFormat = "avif" | "webp" | "png";

type SeasonImage = Record<ImageFormat, string>;

type Season = {
	id: SeasonId;
	label: string;
	image: SeasonImage;
	hollowPoint?: typeof HOLLOW_POINT;
	particleClass: string;
	count: number;
	size: [number, number];
	duration: [number, number];
	drift: [number, number];
	opacity: [number, number];
};

type NetworkInformation = {
	saveData?: boolean;
	effectiveType?: string;
};

const IMAGE_SIZE = { width: 1536, height: 1024 };
const HOLLOW_POINT = { x: 0.786, y: 0.43 };
const assetUrl = (fileName: string) => `${import.meta.env.BASE_URL}${fileName}`;
const isPngImage = (src: string) => new URL(src, window.location.href).pathname.endsWith(".png");

const seasons: Season[] = [
	{
		id: "spring",
		label: "Spring",
		image: {
			avif: assetUrl("spring.avif"),
			webp: assetUrl("spring.webp"),
			png: assetUrl("spring.png"),
		},
		particleClass: "particle--spring",
		count: 42,
		size: [10, 24],
		duration: [11, 22],
		drift: [55, 170],
		opacity: [0.38, 0.76],
	},
	{
		id: "summer",
		label: "Summer",
		image: {
			avif: assetUrl("summer.avif"),
			webp: assetUrl("summer.webp"),
			png: assetUrl("summer.png"),
		},
		particleClass: "particle--summer",
		count: 36,
		size: [3, 8],
		duration: [7, 16],
		drift: [24, 120],
		opacity: [0.32, 0.72],
	},
	{
		id: "autumn",
		label: "Autumn",
		image: {
			avif: assetUrl("autumn.avif"),
			webp: assetUrl("autumn.webp"),
			png: assetUrl("autumn.png"),
		},
		hollowPoint: { x: 0.796, y: 0.43 },
		particleClass: "particle--autumn",
		count: 28,
		size: [12, 30],
		duration: [8, 18],
		drift: [40, 160],
		opacity: [0.55, 0.9],
	},
	{
		id: "winter",
		label: "Winter",
		image: {
			avif: assetUrl("winter.avif"),
			webp: assetUrl("winter.webp"),
			png: assetUrl("winter.png"),
		},
		particleClass: "particle--winter",
		count: 46,
		size: [3, 8],
		duration: [10, 22],
		drift: [18, 70],
		opacity: [0.5, 0.92],
	},
];

const makeParticles = (season: Season): Particle[] =>
	Array.from({ length: season.count }, (_, id) => ({
		id,
		left: 4 + Math.random() * 92,
		top: season.id === "summer" ? 14 + Math.random() * 76 : -12 + Math.random() * 36,
		size: season.size[0] + Math.random() * (season.size[1] - season.size[0]),
		duration: season.duration[0] + Math.random() * (season.duration[1] - season.duration[0]),
		delay: -Math.random() * season.duration[1],
		drift: season.drift[0] + Math.random() * (season.drift[1] - season.drift[0]),
		spin: Math.random() > 0.5 ? 1 : -1,
		opacity: season.opacity[0] + Math.random() * (season.opacity[1] - season.opacity[0]),
		variant: id % 4,
	}));

const shouldLoadHighResolutionImages = () => {
	const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;

	return connection?.saveData !== true && connection?.effectiveType !== "slow-2g" && connection?.effectiveType !== "2g";
};

function App() {
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
	const hollowPoint = renderedSeason.hollowPoint ?? HOLLOW_POINT;
	const [eyePosition, setEyePosition] = useState(() => ({
		x: window.innerWidth * hollowPoint.x,
		y: window.innerHeight * hollowPoint.y,
	}));
	const particles = useMemo(() => makeParticles(renderedSeason), [renderedSeason]);

	useEffect(() => {
		const updateEyePosition = () => {
			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;
			const scale = Math.max(viewportWidth / IMAGE_SIZE.width, viewportHeight / IMAGE_SIZE.height);
			const renderedWidth = IMAGE_SIZE.width * scale;
			const renderedHeight = IMAGE_SIZE.height * scale;
			const offsetX = (viewportWidth - renderedWidth) / 2;
			const offsetY = (viewportHeight - renderedHeight) / 2;

			setEyePosition({
				x: offsetX + renderedWidth * hollowPoint.x,
				y: offsetY + renderedHeight * hollowPoint.y,
			});
		};

		updateEyePosition();
		window.addEventListener("resize", updateEyePosition);

		return () => window.removeEventListener("resize", updateEyePosition);
	}, [hollowPoint]);

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

	return (
		<main className="scene-page">
			<section
				className="forest-scene"
				aria-label={`${renderedSeason.label} forest background with seasonal particles`}
				aria-busy={!previewsReady}
				data-ready={previewsReady}
			>
				<div className="season-backgrounds" aria-hidden="true">
					{seasons.map((season) => (
						<div
							key={season.id}
							className="season-background"
							data-active={season.id === visibleSeasonId}
							data-loaded={loadedSeasonIds.has(season.id)}
						>
							<picture className="season-background-picture">
								<source srcSet={season.image.avif} type="image/avif" />
								<source srcSet={season.image.webp} type="image/webp" />
								<img
									className="season-background-preview"
									src={season.image.png}
									alt=""
									aria-hidden="true"
									decoding="async"
									fetchPriority={season.id === activeSeasonId ? "high" : "low"}
									loading="eager"
									onLoad={(event) => handleSeasonLoad(season.id, event.currentTarget.currentSrc)}
								/>
							</picture>
							{highResolutionRequestedSeasonIds.has(season.id) && !pngPreviewSeasonIds.has(season.id) && (
								<img
									className="season-background-high"
									src={season.image.png}
									alt=""
									aria-hidden="true"
									decoding="async"
									loading="eager"
									data-loaded={highResolutionSeasonIds.has(season.id)}
									onLoad={() => handleHighResolutionLoad(season.id)}
								/>
							)}
						</div>
					))}
				</div>

				{!previewsReady && (
					<div className="scene-loader" role="status" aria-live="polite">
						Loading forest
					</div>
				)}

				{previewsReady && (
					<nav className="season-switcher" aria-label="Season selector">
						{seasons.map((season) => (
							<button
								key={season.id}
								className="season-button"
								type="button"
								aria-pressed={season.id === activeSeasonId}
								onClick={() => handleSeasonSelect(season.id)}
							>
								{season.label}
							</button>
						))}
					</nav>
				)}

				{previewsReady && (
					<div
						className="hollow-eyes"
						aria-hidden="true"
						style={
							{
								"--eyes-left": `${eyePosition.x}px`,
								"--eyes-top": `${eyePosition.y}px`,
							} as CSSProperties
						}
					>
						<span className="eye">
							<span className="pupil" />
						</span>
						<span className="eye">
							<span className="pupil" />
						</span>
					</div>
				)}

				{previewsReady && (
					<div className="particles-layer" aria-hidden="true">
						{particles.map((particle) => (
							<span
								key={`${renderedSeason.id}-${particle.id}`}
								className={`particle ${renderedSeason.particleClass}`}
								style={
									{
										"--particle-left": `${particle.left}%`,
										"--particle-top": `${particle.top}%`,
										"--particle-size": `${particle.size}px`,
										"--particle-duration": `${particle.duration}s`,
										"--particle-delay": `${particle.delay}s`,
										"--particle-drift": `${particle.drift}px`,
										"--particle-opacity": particle.opacity,
										"--particle-spin": particle.spin,
										"--particle-variant": particle.variant,
									} as CSSProperties
								}
							/>
						))}
					</div>
				)}
			</section>
		</main>
	);
}

export default App;
