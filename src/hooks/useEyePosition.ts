import { useEffect, useState } from "react";
import { IMAGE_SIZE, type HollowPoint } from "../domain/seasons";

export const useEyePosition = (hollowPoint: HollowPoint) => {
	const [eyePosition, setEyePosition] = useState(() => ({
		x: window.innerWidth * hollowPoint.x,
		y: window.innerHeight * hollowPoint.y,
	}));

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

	return eyePosition;
};
