import "./App.css";
import { HollowEyes } from "./components/HollowEyes/HollowEyes";
import { ParticlesLayer } from "./components/ParticlesLayer/ParticlesLayer";
import { SceneLoader } from "./components/SceneLoader/SceneLoader";
import { SeasonBackgrounds } from "./components/SeasonBackgrounds/SeasonBackgrounds";
import { SeasonSwitcher } from "./components/SeasonSwitcher/SeasonSwitcher";
import { useSeasonScene } from "./hooks/useSeasonScene";

function App() {
	const {
		activeSeasonId,
		eyePosition,
		handleHighResolutionLoad,
		handleSeasonLoad,
		handleSeasonSelect,
		highResolutionRequestedSeasonIds,
		highResolutionSeasonIds,
		loadedSeasonIds,
		particles,
		pngPreviewSeasonIds,
		previewsReady,
		renderedSeason,
		visibleSeasonId,
	} = useSeasonScene();

	return (
		<main className="scene-page">
			<section
				className="forest-scene"
				aria-label={`${renderedSeason.label} forest background with seasonal particles`}
				aria-busy={!previewsReady}
				data-ready={previewsReady}
			>
				<SeasonBackgrounds
					activeSeasonId={activeSeasonId}
					highResolutionRequestedSeasonIds={highResolutionRequestedSeasonIds}
					highResolutionSeasonIds={highResolutionSeasonIds}
					loadedSeasonIds={loadedSeasonIds}
					onHighResolutionLoad={handleHighResolutionLoad}
					onSeasonLoad={handleSeasonLoad}
					pngPreviewSeasonIds={pngPreviewSeasonIds}
					visibleSeasonId={visibleSeasonId}
				/>

				{!previewsReady && <SceneLoader />}

				{previewsReady && (
					<>
						<SeasonSwitcher activeSeasonId={activeSeasonId} onSeasonSelect={handleSeasonSelect} />
						<HollowEyes position={eyePosition} />
						<ParticlesLayer particles={particles} season={renderedSeason} />
					</>
				)}
			</section>
		</main>
	);
}

export default App;
