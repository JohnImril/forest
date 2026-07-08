<script lang="ts">
	import type { Season } from "../../domain/seasons";
	import type { Particle } from "../../lib/particles";
	import "./ParticlesLayer.css";

	export let particles: Particle[];
	export let season: Season;

	const particleStyle = (particle: Particle) =>
		[
			`--particle-left: ${particle.left}%`,
			`--particle-top: ${particle.top}%`,
			`--particle-size: ${particle.size}px`,
			`--particle-duration: ${particle.duration}s`,
			`--particle-delay: ${particle.delay}s`,
			`--particle-drift: ${particle.drift}px`,
			`--particle-opacity: ${particle.opacity}`,
			`--particle-spin: ${particle.spin}`,
			`--particle-variant: ${particle.variant}`,
		].join("; ");
</script>

<div class="particles-layer" aria-hidden="true">
	{#each particles as particle (season.id + "-" + particle.id)}
		<span class={`particle ${season.particleClass}`} style={particleStyle(particle)}></span>
	{/each}
</div>
