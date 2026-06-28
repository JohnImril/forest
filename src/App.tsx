import "./App.css";
import { HollowEyes } from "./components/HollowEyes/HollowEyes";
import { ParticlesLayer } from "./components/ParticlesLayer/ParticlesLayer";
import { SeasonBackgrounds } from "./components/SeasonBackgrounds/SeasonBackgrounds";
import { SeasonSwitcher } from "./components/SeasonSwitcher/SeasonSwitcher";
import { useSeasonScene } from "./hooks/useSeasonScene";

function App() {
	const {
		activeSeasonId,
		activeSeason,
		eyePosition,
		failedPreviewSeasonIds,
		handleHighResolutionLoad,
		handleSeasonError,
		handleSeasonLoad,
		handleSeasonSelect,
		highResolutionRequestedSeasonIds,
		highResolutionSeasonIds,
		isSwitchingSeason,
		loadedPreviewSeasonIds,
		pendingSeasonId,
		particles,
		pngPreviewSeasonIds,
		previewsReady,
		requestedPreviewSeasonIds,
	} = useSeasonScene();

	return (
		<main className="scene-page">
			<section
				className="forest-scene"
				aria-label={`${activeSeason.label} forest background with seasonal particles`}
				aria-busy={!previewsReady || isSwitchingSeason}
				data-ready={previewsReady}
			>
				<SeasonBackgrounds
					activeSeasonId={activeSeasonId}
					highResolutionRequestedSeasonIds={highResolutionRequestedSeasonIds}
					highResolutionSeasonIds={highResolutionSeasonIds}
					loadedPreviewSeasonIds={loadedPreviewSeasonIds}
					onHighResolutionLoad={handleHighResolutionLoad}
					onSeasonError={handleSeasonError}
					onSeasonLoad={handleSeasonLoad}
					pngPreviewSeasonIds={pngPreviewSeasonIds}
					requestedPreviewSeasonIds={requestedPreviewSeasonIds}
				/>

				{previewsReady && (
					<>
						<SeasonSwitcher
							activeSeasonId={activeSeasonId}
							failedSeasonIds={failedPreviewSeasonIds}
							pendingSeasonId={pendingSeasonId}
							onSeasonSelect={handleSeasonSelect}
						/>
						<HollowEyes position={eyePosition} />
						<ParticlesLayer particles={particles} season={activeSeason} />
					</>
				)}
			</section>
		</main>
	);
}

export default App;
