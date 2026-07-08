import { describe, expect, it } from "vitest";
import { DEFAULT_HOLLOW_POINT, IMAGE_SIZE, seasons } from "./seasons";

describe("seasons", () => {
	it("defines the four expected seasons in switcher order", () => {
		expect(seasons.map((season) => season.id)).toEqual(["spring", "summer", "autumn", "winter"]);
	});

	it("provides image formats and particle ranges for every season", () => {
		for (const season of seasons) {
			expect(season.label).toBeTruthy();
			expect(season.image.avif).toContain(`${season.id}.avif`);
			expect(season.image.webp).toContain(`${season.id}.webp`);
			expect(season.image.png).toContain(`${season.id}.png`);
			expect(season.count).toBeGreaterThan(0);
			expect(season.size[0]).toBeLessThan(season.size[1]);
			expect(season.duration[0]).toBeLessThan(season.duration[1]);
			expect(season.drift[0]).toBeLessThan(season.drift[1]);
			expect(season.opacity[0]).toBeLessThan(season.opacity[1]);
		}
	});

	it("keeps eye anchor data inside the source image bounds", () => {
		expect(IMAGE_SIZE).toEqual({ width: 1536, height: 1024 });
		expect(DEFAULT_HOLLOW_POINT.x).toBeGreaterThanOrEqual(0);
		expect(DEFAULT_HOLLOW_POINT.x).toBeLessThanOrEqual(1);
		expect(DEFAULT_HOLLOW_POINT.y).toBeGreaterThanOrEqual(0);
		expect(DEFAULT_HOLLOW_POINT.y).toBeLessThanOrEqual(1);

		for (const season of seasons) {
			if (!season.hollowPoint) {
				continue;
			}

			expect(season.hollowPoint.x).toBeGreaterThanOrEqual(0);
			expect(season.hollowPoint.x).toBeLessThanOrEqual(1);
			expect(season.hollowPoint.y).toBeGreaterThanOrEqual(0);
			expect(season.hollowPoint.y).toBeLessThanOrEqual(1);
		}
	});
});
