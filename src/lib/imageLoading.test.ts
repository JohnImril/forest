import { describe, expect, it } from "vitest";
import { isPngImage, shouldLoadHighResolutionImages } from "./imageLoading";

describe("isPngImage", () => {
	it("detects png paths with absolute and relative urls", () => {
		expect(isPngImage("/forest/autumn.png", "https://example.com/forest/")).toBe(true);
		expect(isPngImage("spring.png", "https://example.com/forest/")).toBe(true);
		expect(isPngImage("summer.webp", "https://example.com/forest/")).toBe(false);
	});

	it("ignores query strings when checking the image extension", () => {
		expect(isPngImage("winter.png?v=1", "https://example.com/forest/")).toBe(true);
	});
});

describe("shouldLoadHighResolutionImages", () => {
	it("allows high-resolution loading when no restrictive network data is available", () => {
		expect(shouldLoadHighResolutionImages(undefined)).toBe(true);
		expect(shouldLoadHighResolutionImages({ effectiveType: "4g" })).toBe(true);
	});

	it("blocks high-resolution loading for data saver and very slow connections", () => {
		expect(shouldLoadHighResolutionImages({ saveData: true })).toBe(false);
		expect(shouldLoadHighResolutionImages({ effectiveType: "2g" })).toBe(false);
		expect(shouldLoadHighResolutionImages({ effectiveType: "slow-2g" })).toBe(false);
	});
});
