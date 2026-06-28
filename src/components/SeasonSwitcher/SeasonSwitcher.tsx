import { seasons, type SeasonId } from "../../domain/seasons";
import "./SeasonSwitcher.css";

type SeasonSwitcherProps = {
	activeSeasonId: SeasonId;
	failedSeasonIds: ReadonlySet<SeasonId>;
	pendingSeasonId: SeasonId | null;
	onSeasonSelect: (seasonId: SeasonId) => void;
};

export function SeasonSwitcher({
	activeSeasonId,
	failedSeasonIds,
	pendingSeasonId,
	onSeasonSelect,
}: SeasonSwitcherProps) {
	return (
		<nav className="season-switcher" aria-label="Season selector">
			{seasons.map((season) => {
				const isPending = pendingSeasonId === season.id;
				const hasFailed = failedSeasonIds.has(season.id);

				return (
					<button
						key={season.id}
						className="season-button"
						type="button"
						aria-busy={isPending}
						aria-pressed={season.id === activeSeasonId}
						data-error={hasFailed}
						data-pending={isPending}
						onClick={() => onSeasonSelect(season.id)}
					>
						<span className="season-button__label">{season.label}</span>
						{isPending && <span className="season-button__status">Loading</span>}
						{hasFailed && !isPending && <span className="season-button__status">Retry</span>}
					</button>
				);
			})}
		</nav>
	);
}
