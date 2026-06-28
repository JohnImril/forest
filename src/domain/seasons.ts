export type SeasonId = "spring" | "summer" | "autumn" | "winter";

export type ImageFormat = "avif" | "webp" | "png";

export type SeasonImage = Record<ImageFormat, string>;

export type HollowPoint = {
	x: number;
	y: number;
};

export type Season = {
	id: SeasonId;
	label: string;
	image: SeasonImage;
	hollowPoint?: HollowPoint;
	particleClass: string;
	count: number;
	size: [number, number];
	duration: [number, number];
	drift: [number, number];
	opacity: [number, number];
};

export const IMAGE_SIZE = { width: 1536, height: 1024 };
export const DEFAULT_HOLLOW_POINT = { x: 0.786, y: 0.43 } satisfies HollowPoint;

const assetUrl = (fileName: string) => `${import.meta.env.BASE_URL}${fileName}`;

export const seasons: Season[] = [
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
