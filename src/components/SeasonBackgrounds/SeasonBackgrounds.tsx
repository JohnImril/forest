import { seasons, type SeasonId } from "../../domain/seasons";
import "./SeasonBackgrounds.css";

type SeasonBackgroundsProps = {
	activeSeasonId: SeasonId;
	highResolutionRequestedSeasonIds: ReadonlySet<SeasonId>;
	highResolutionSeasonIds: ReadonlySet<SeasonId>;
	loadedSeasonIds: ReadonlySet<SeasonId>;
	onHighResolutionLoad: (seasonId: SeasonId) => void;
	onSeasonLoad: (seasonId: SeasonId, currentSrc: string) => void;
	pngPreviewSeasonIds: ReadonlySet<SeasonId>;
	visibleSeasonId: SeasonId;
};

export function SeasonBackgrounds({
	activeSeasonId,
	highResolutionRequestedSeasonIds,
	highResolutionSeasonIds,
	loadedSeasonIds,
	onHighResolutionLoad,
	onSeasonLoad,
	pngPreviewSeasonIds,
	visibleSeasonId,
}: SeasonBackgroundsProps) {
	return (
		<div className="season-backgrounds" aria-hidden="true">
			{seasons.map((season) => (
				<div
					key={season.id}
					className="season-background"
					data-active={season.id === visibleSeasonId}
					data-loaded={loadedSeasonIds.has(season.id)}
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
							loading="eager"
							onLoad={(event) => onSeasonLoad(season.id, event.currentTarget.currentSrc)}
						/>
					</picture>
					{highResolutionRequestedSeasonIds.has(season.id) && !pngPreviewSeasonIds.has(season.id) && (
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
