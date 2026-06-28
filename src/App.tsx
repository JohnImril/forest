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

type Season = {
	id: SeasonId;
	label: string;
	image: string;
	hollowPoint?: typeof HOLLOW_POINT;
	particleClass: string;
	count: number;
	size: [number, number];
	duration: [number, number];
	drift: [number, number];
	opacity: [number, number];
};

const IMAGE_SIZE = { width: 1536, height: 1024 };
const HOLLOW_POINT = { x: 0.786, y: 0.43 };
const assetUrl = (fileName: string) => `${import.meta.env.BASE_URL}${fileName}`;

const seasons: Season[] = [
	{
		id: "spring",
		label: "Spring",
		image: assetUrl("spring.png"),
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
		image: assetUrl("summer.png"),
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
		image: assetUrl("autumn.png"),
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
		image: assetUrl("winter.png"),
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

const preloadImage = (src: string) =>
	new Promise<void>((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve();
		image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
		image.src = src;
	});

function App() {
	const [imagesReady, setImagesReady] = useState(false);
	const [activeSeasonId, setActiveSeasonId] = useState<SeasonId>("autumn");
	const activeSeason = seasons.find((season) => season.id === activeSeasonId) ?? seasons[2];
	const hollowPoint = activeSeason.hollowPoint ?? HOLLOW_POINT;
	const [eyePosition, setEyePosition] = useState(() => ({
		x: window.innerWidth * hollowPoint.x,
		y: window.innerHeight * hollowPoint.y,
	}));
	const particles = useMemo(() => makeParticles(activeSeason), [activeSeason]);

	useEffect(() => {
		let isMounted = true;

		Promise.all(seasons.map((season) => preloadImage(season.image)))
			.then(() => {
				if (isMounted) {
					setImagesReady(true);
				}
			})
			.catch((error: unknown) => {
				console.error(error);
			});

		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		if (!imagesReady) {
			return;
		}

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
	}, [hollowPoint, imagesReady]);

	if (!imagesReady) {
		return (
			<main className="scene-page scene-page--loading" aria-busy="true">
				<div className="scene-loader" role="status" aria-live="polite">
					Loading forest
				</div>
			</main>
		);
	}

	return (
		<main className="scene-page">
			<section
				className="forest-scene"
				aria-label={`${activeSeason.label} forest background with seasonal particles`}
				style={{ "--scene-image": `url("${activeSeason.image}")` } as CSSProperties}
			>
				<nav className="season-switcher" aria-label="Season selector">
					{seasons.map((season) => (
						<button
							key={season.id}
							className="season-button"
							type="button"
							aria-pressed={season.id === activeSeasonId}
							onClick={() => setActiveSeasonId(season.id)}
						>
							{season.label}
						</button>
					))}
				</nav>

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

				<div className="particles-layer" aria-hidden="true">
					{particles.map((particle) => (
						<span
							key={`${activeSeason.id}-${particle.id}`}
							className={`particle ${activeSeason.particleClass}`}
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
			</section>
		</main>
	);
}

export default App;
