import type { Season } from "../domain/seasons";

export type Particle = {
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

export const makeParticles = (season: Season): Particle[] =>
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
