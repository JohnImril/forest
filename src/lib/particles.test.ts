import { describe, expect, it } from "vitest";
import type { Season } from "../domain/seasons";
import { makeParticles } from "./particles";

const baseSeason = {
	label: "Test",
	image: {
		avif: "/test.avif",
		webp: "/test.webp",
		png: "/test.png",
	},
	particleClass: "particle--test",
	count: 8,
	size: [10, 20],
	duration: [5, 15],
	drift: [30, 90],
	opacity: [0.25, 0.75],
} satisfies Omit<Season, "id">;

describe("makeParticles", () => {
	it("creates the configured number of particles with stable ids and variants", () => {
		const particles = makeParticles({ ...baseSeason, id: "autumn" });

		expect(particles).toHaveLength(baseSeason.count);
		expect(particles.map((particle) => particle.id)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
		expect(particles.map((particle) => particle.variant)).toEqual([0, 1, 2, 3, 0, 1, 2, 3]);
	});

	it("keeps generated particle values inside the season ranges", () => {
		const particles = makeParticles({ ...baseSeason, id: "winter" });

		for (const particle of particles) {
			expect(particle.left).toBeGreaterThanOrEqual(4);
			expect(particle.left).toBeLessThan(96);
			expect(particle.top).toBeGreaterThanOrEqual(-12);
			expect(particle.top).toBeLessThan(24);
			expect(particle.size).toBeGreaterThanOrEqual(baseSeason.size[0]);
			expect(particle.size).toBeLessThan(baseSeason.size[1]);
			expect(particle.duration).toBeGreaterThanOrEqual(baseSeason.duration[0]);
			expect(particle.duration).toBeLessThan(baseSeason.duration[1]);
			expect(particle.delay).toBeGreaterThanOrEqual(-baseSeason.duration[1]);
			expect(particle.delay).toBeLessThanOrEqual(0);
			expect(particle.drift).toBeGreaterThanOrEqual(baseSeason.drift[0]);
			expect(particle.drift).toBeLessThan(baseSeason.drift[1]);
			expect(particle.opacity).toBeGreaterThanOrEqual(baseSeason.opacity[0]);
			expect(particle.opacity).toBeLessThan(baseSeason.opacity[1]);
			expect([-1, 1]).toContain(particle.spin);
		}
	});

	it("uses the summer vertical spawn range for summer particles", () => {
		const particles = makeParticles({ ...baseSeason, id: "summer" });

		for (const particle of particles) {
			expect(particle.top).toBeGreaterThanOrEqual(14);
			expect(particle.top).toBeLessThan(90);
		}
	});
});
