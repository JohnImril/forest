<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import HollowEyes from "./components/HollowEyes/HollowEyes.svelte";
	import ParticlesLayer from "./components/ParticlesLayer/ParticlesLayer.svelte";
	import SceneLoader from "./components/SceneLoader/SceneLoader.svelte";
	import SeasonBackgrounds from "./components/SeasonBackgrounds/SeasonBackgrounds.svelte";
	import SeasonSwitcher from "./components/SeasonSwitcher/SeasonSwitcher.svelte";
	import { DEFAULT_HOLLOW_POINT, IMAGE_SIZE } from "./domain/seasons";
	import { shouldLoadHighResolutionImages } from "./lib/imageLoading";
	import { createSeasonScene, type SeasonSceneState } from "./stores/seasonScene";

	type EyePosition = {
		x: number;
		y: number;
		scale: number;
	};

	let sceneElement: HTMLElement;
	let sceneState: SeasonSceneState;
	let eyePosition: EyePosition = {
		x: window.innerWidth * DEFAULT_HOLLOW_POINT.x,
		y: window.innerHeight * DEFAULT_HOLLOW_POINT.y,
		scale: Math.max(window.innerWidth / IMAGE_SIZE.width, window.innerHeight / IMAGE_SIZE.height),
	};
	let animationFrameId: number | undefined;
	let orientationTimeoutId: number | undefined;
	let idleCallbackId: number | undefined;
	let highResolutionTimeoutId: number | undefined;
	let lastHighResolutionScheduleKey = "";
	let resizeObserver: ResizeObserver | undefined;

	const scene = createSeasonScene();

	const getSceneSize = () => {
		if (sceneElement) {
			const { width, height } = sceneElement.getBoundingClientRect();

			return { width, height };
		}

		return {
			width: window.innerWidth,
			height: window.innerHeight,
		};
	};

	const updateEyePosition = (hollowPoint = sceneState?.renderedSeason.hollowPoint ?? DEFAULT_HOLLOW_POINT) => {
		const { width: viewportWidth, height: viewportHeight } = getSceneSize();
		const scale = Math.max(viewportWidth / IMAGE_SIZE.width, viewportHeight / IMAGE_SIZE.height);
		const renderedWidth = IMAGE_SIZE.width * scale;
		const renderedHeight = IMAGE_SIZE.height * scale;
		const offsetX = (viewportWidth - renderedWidth) / 2;
		const offsetY = (viewportHeight - renderedHeight) / 2;

		eyePosition = {
			x: offsetX + renderedWidth * hollowPoint.x,
			y: offsetY + renderedHeight * hollowPoint.y,
			scale,
		};
	};

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
		if (orientationTimeoutId !== undefined) {
			window.clearTimeout(orientationTimeoutId);
		}

		orientationTimeoutId = window.setTimeout(() => {
			orientationTimeoutId = undefined;
			updateEyePosition();
		}, 150);
	};

	const cancelHighResolutionSchedule = () => {
		if (idleCallbackId !== undefined) {
			window.cancelIdleCallback(idleCallbackId);
			idleCallbackId = undefined;
		}

		if (highResolutionTimeoutId !== undefined) {
			window.clearTimeout(highResolutionTimeoutId);
			highResolutionTimeoutId = undefined;
		}
	};

	const scheduleHighResolutionLoad = (state: SeasonSceneState) => {
		const nextSeasonId = scene.getNextHighResolutionSeasonId(state);
		const scheduleKey = [
			state.activeSeasonId,
			state.loadedSeasonIds.size,
			state.highResolutionRequestedSeasonIds.size,
			state.highResolutionSeasonIds.size,
			state.pngPreviewSeasonIds.size,
			nextSeasonId ?? "none",
		].join(":");

		if (
			!state.previewsReady ||
			!state.loadedSeasonIds.has(state.activeSeasonId) ||
			!shouldLoadHighResolutionImages() ||
			!nextSeasonId
		) {
			lastHighResolutionScheduleKey = scheduleKey;
			cancelHighResolutionSchedule();
			return;
		}

		if (scheduleKey === lastHighResolutionScheduleKey) {
			return;
		}

		lastHighResolutionScheduleKey = scheduleKey;
		cancelHighResolutionSchedule();

		const requestHighResolutionImage = () => {
			scene.requestHighResolution(nextSeasonId);
		};

		if ("requestIdleCallback" in window) {
			idleCallbackId = window.requestIdleCallback(requestHighResolutionImage, { timeout: 2400 });
		} else {
			highResolutionTimeoutId = globalThis.setTimeout(requestHighResolutionImage, 900);
		}
	};

	const handleResize = () => updateEyePosition();

	const unsubscribe = scene.subscribe((state) => {
		sceneState = state;
		scheduleHighResolutionLoad(state);
		updateEyePosition(state.renderedSeason.hollowPoint ?? DEFAULT_HOLLOW_POINT);
	});

	onMount(() => {
		updateEyePosition();
		resizeObserver = new ResizeObserver(() => updateEyePosition());
		resizeObserver.observe(sceneElement);

		window.addEventListener("resize", handleResize);
		window.addEventListener("orientationchange", queueDelayedEyePositionUpdate);
		window.visualViewport?.addEventListener("resize", queueEyePositionUpdate);
	});

	onDestroy(() => {
		unsubscribe();
		cancelHighResolutionSchedule();
		resizeObserver?.disconnect();

		if (animationFrameId !== undefined) {
			window.cancelAnimationFrame(animationFrameId);
		}

		if (orientationTimeoutId !== undefined) {
			window.clearTimeout(orientationTimeoutId);
		}

		window.removeEventListener("resize", handleResize);
		window.removeEventListener("orientationchange", queueDelayedEyePositionUpdate);
		window.visualViewport?.removeEventListener("resize", queueEyePositionUpdate);
	});
</script>

{#if sceneState}
	<main class="scene-page">
		<section
			bind:this={sceneElement}
			class="forest-scene"
			aria-label={`${sceneState.renderedSeason.label} forest background with seasonal particles`}
			aria-busy={!sceneState.previewsReady}
			data-ready={sceneState.previewsReady}
		>
			<SeasonBackgrounds
				activeSeasonId={sceneState.activeSeasonId}
				highResolutionRequestedSeasonIds={sceneState.highResolutionRequestedSeasonIds}
				highResolutionSeasonIds={sceneState.highResolutionSeasonIds}
				loadedSeasonIds={sceneState.loadedSeasonIds}
				onHighResolutionLoad={scene.handleHighResolutionLoad}
				onSeasonLoad={scene.handleSeasonLoad}
				pngPreviewSeasonIds={sceneState.pngPreviewSeasonIds}
				visibleSeasonId={sceneState.visibleSeasonId}
			/>

			{#if !sceneState.previewsReady}
				<SceneLoader />
			{:else}
				<SeasonSwitcher activeSeasonId={sceneState.activeSeasonId} onSeasonSelect={scene.handleSeasonSelect} />
				<HollowEyes position={eyePosition} />
				<ParticlesLayer particles={sceneState.particles} season={sceneState.renderedSeason} />
			{/if}
		</section>
	</main>
{/if}
