<script lang="ts">
	import { seasons, type SeasonId } from "../../domain/seasons";
	import "./SeasonBackgrounds.css";

	export let activeSeasonId: SeasonId;
	export let highResolutionRequestedSeasonIds: ReadonlySet<SeasonId>;
	export let highResolutionSeasonIds: ReadonlySet<SeasonId>;
	export let loadedSeasonIds: ReadonlySet<SeasonId>;
	export let onHighResolutionLoad: (seasonId: SeasonId) => void;
	export let onSeasonLoad: (seasonId: SeasonId, currentSrc: string) => void;
	export let pngPreviewSeasonIds: ReadonlySet<SeasonId>;
	export let visibleSeasonId: SeasonId;
</script>

<div class="season-backgrounds" aria-hidden="true">
	{#each seasons as season (season.id)}
		<div
			class="season-background"
			data-active={season.id === visibleSeasonId}
			data-loaded={loadedSeasonIds.has(season.id)}
		>
			<picture class="season-background-picture">
				<source srcset={season.image.avif} type="image/avif" />
				<source srcset={season.image.webp} type="image/webp" />
				<img
					class="season-background-preview"
					src={season.image.png}
					alt=""
					aria-hidden="true"
					decoding="async"
					fetchpriority={season.id === activeSeasonId ? "high" : "low"}
					loading="eager"
					on:load={(event) => onSeasonLoad(season.id, (event.currentTarget as HTMLImageElement).currentSrc)}
				/>
			</picture>
			{#if highResolutionRequestedSeasonIds.has(season.id) && !pngPreviewSeasonIds.has(season.id)}
				<img
					class="season-background-high"
					src={season.image.png}
					alt=""
					aria-hidden="true"
					decoding="async"
					loading="eager"
					data-loaded={highResolutionSeasonIds.has(season.id)}
					on:load={() => onHighResolutionLoad(season.id)}
				/>
			{/if}
		</div>
	{/each}
</div>
