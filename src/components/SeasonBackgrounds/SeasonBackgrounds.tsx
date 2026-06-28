import { seasons, type SeasonId } from "../../domain/seasons";
import "./SeasonBackgrounds.css";

type SeasonBackgroundsProps = {
	activeSeasonId: SeasonId;
	highResolutionRequestedSeasonIds: ReadonlySet<SeasonId>;
	highResolutionSeasonIds: ReadonlySet<SeasonId>;
	loadedPreviewSeasonIds: ReadonlySet<SeasonId>;
	onHighResolutionLoad: (seasonId: SeasonId) => void;
	onSeasonError: (seasonId: SeasonId) => void;
	onSeasonLoad: (seasonId: SeasonId, currentSrc: string) => void;
	pngPreviewSeasonIds: ReadonlySet<SeasonId>;
	requestedPreviewSeasonIds: ReadonlySet<SeasonId>;
};

export function SeasonBackgrounds({
	activeSeasonId,
	highResolutionRequestedSeasonIds,
	highResolutionSeasonIds,
	loadedPreviewSeasonIds,
	onHighResolutionLoad,
	onSeasonError,
	onSeasonLoad,
	pngPreviewSeasonIds,
	requestedPreviewSeasonIds,
}: SeasonBackgroundsProps) {
	return (
		<div className="season-backgrounds" aria-hidden="true">
			{seasons.filter((season) => requestedPreviewSeasonIds.has(season.id)).map((season) => (
				<div
					key={season.id}
					className="season-background"
					data-active={season.id === activeSeasonId}
					data-loaded={loadedPreviewSeasonIds.has(season.id)}
				>
					<picture className="season-background-picture">
						<source srcSet={season.image.avif} type="image/avif" />
						<source srcSet={season.image.webp} type="image/webp" />
						<img
							className="season-background-preview"
							src={season.image.png}
							alt=""
							aria-hidden="true"
							decoding="async"
							fetchPriority={season.id === activeSeasonId ? "high" : "low"}
							loading={season.id === activeSeasonId ? "eager" : "lazy"}
							onError={() => onSeasonError(season.id)}
							onLoad={(event) => onSeasonLoad(season.id, event.currentTarget.currentSrc)}
						/>
					</picture>
					{season.id === activeSeasonId &&
						highResolutionRequestedSeasonIds.has(season.id) &&
						!pngPreviewSeasonIds.has(season.id) && (
						<img
							className="season-background-high"
							src={season.image.png}
							alt=""
							aria-hidden="true"
							decoding="async"
							loading="eager"
							data-loaded={highResolutionSeasonIds.has(season.id)}
							onLoad={() => onHighResolutionLoad(season.id)}
						/>
					)}
				</div>
			))}
		</div>
	);
}
