<script lang="ts">
	import { seasons, type SeasonId } from "../../domain/seasons";
	import "./SeasonSwitcher.css";

	export let activeSeasonId: SeasonId;
	export let onSeasonSelect: (seasonId: SeasonId) => void;
</script>

<nav class="season-switcher" aria-label="Season selector">
	{#each seasons as season (season.id)}
		<button
			class="season-button"
			type="button"
			aria-pressed={season.id === activeSeasonId}
			on:click={() => onSeasonSelect(season.id)}
		>
			{season.label}
		</button>
	{/each}
</nav>
