import { seasons, type SeasonId } from "../../domain/seasons";
import "./SeasonSwitcher.css";

type SeasonSwitcherProps = {
	activeSeasonId: SeasonId;
	onSeasonSelect: (seasonId: SeasonId) => void;
};

export function SeasonSwitcher({ activeSeasonId, onSeasonSelect }: SeasonSwitcherProps) {
	return (
		<nav className="season-switcher" aria-label="Season selector">
			{seasons.map((season) => (
				<button
					key={season.id}
					className="season-button"
					type="button"
					aria-pressed={season.id === activeSeasonId}
					onClick={() => onSeasonSelect(season.id)}
				>
					{season.label}
				</button>
			))}
		</nav>
	);
}
