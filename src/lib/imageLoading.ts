export type NetworkInformation = {
	saveData?: boolean;
	effectiveType?: string;
};

const getNetworkConnection = () => {
	if (typeof navigator === "undefined") {
		return undefined;
	}

	return (navigator as Navigator & { connection?: NetworkInformation }).connection;
};

export const isPngImage = (src: string, baseUrl = globalThis.location?.href ?? "http://localhost/") =>
	new URL(src, baseUrl).pathname.endsWith(".png");

export const shouldLoadHighResolutionImages = (connection = getNetworkConnection()) => {
	return connection?.saveData !== true && connection?.effectiveType !== "slow-2g" && connection?.effectiveType !== "2g";
};
