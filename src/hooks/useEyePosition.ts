import { useEffect, useState, type RefObject } from "react";
import { IMAGE_SIZE, type HollowPoint } from "../domain/seasons";

const getSceneSize = (sceneElement: HTMLElement | null) => {
	if (sceneElement) {
		const { width, height } = sceneElement.getBoundingClientRect();

		return { width, height };
	}

	return {
		width: window.innerWidth,
		height: window.innerHeight,
	};
};

export const useEyePosition = (hollowPoint: HollowPoint, sceneRef: RefObject<HTMLElement | null>) => {
	const [eyePosition, setEyePosition] = useState(() => ({
		x: window.innerWidth * hollowPoint.x,
		y: window.innerHeight * hollowPoint.y,
		scale: Math.max(window.innerWidth / IMAGE_SIZE.width, window.innerHeight / IMAGE_SIZE.height),
	}));

	useEffect(() => {
		const updateEyePosition = () => {
			const { width: viewportWidth, height: viewportHeight } = getSceneSize(sceneRef.current);
			const scale = Math.max(viewportWidth / IMAGE_SIZE.width, viewportHeight / IMAGE_SIZE.height);
			const renderedWidth = IMAGE_SIZE.width * scale;
			const renderedHeight = IMAGE_SIZE.height * scale;
			const offsetX = (viewportWidth - renderedWidth) / 2;
			const offsetY = (viewportHeight - renderedHeight) / 2;

			setEyePosition({
				x: offsetX + renderedWidth * hollowPoint.x,
				y: offsetY + renderedHeight * hollowPoint.y,
				scale,
			});
		};

		updateEyePosition();
		let animationFrameId: number | undefined;
		let timeoutId: number | undefined;
		const queueEyePositionUpdate = () => {
			if (animationFrameId !== undefined) {
				window.cancelAnimationFrame(animationFrameId);
			}

			animationFrameId = window.requestAnimationFrame(() => {
				animationFrameId = undefined;
				updateEyePosition();
			});
		};
		const queueDelayedEyePositionUpdate = () => {
			if (timeoutId !== undefined) {
				window.clearTimeout(timeoutId);
			}

			timeoutId = window.setTimeout(() => {
				timeoutId = undefined;
				updateEyePosition();
			}, 150);
		};
		const resizeObserver = new ResizeObserver(updateEyePosition);

		if (sceneRef.current) {
			resizeObserver.observe(sceneRef.current);
		}

		window.addEventListener("resize", updateEyePosition);
		window.addEventListener("orientationchange", queueDelayedEyePositionUpdate);
		window.visualViewport?.addEventListener("resize", queueEyePositionUpdate);

		return () => {
			if (animationFrameId !== undefined) {
				window.cancelAnimationFrame(animationFrameId);
			}

			if (timeoutId !== undefined) {
				window.clearTimeout(timeoutId);
			}

			resizeObserver.disconnect();
			window.removeEventListener("resize", updateEyePosition);
			window.removeEventListener("orientationchange", queueDelayedEyePositionUpdate);
			window.visualViewport?.removeEventListener("resize", queueEyePositionUpdate);
		};
	}, [hollowPoint, sceneRef]);

	return eyePosition;
};
