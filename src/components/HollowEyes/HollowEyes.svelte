<script lang="ts">
	import "./HollowEyes.css";

	export let position: {
		x: number;
		y: number;
		scale: number;
	};

	$: eyeStyle = [
		`--eyes-left: ${position.x}px`,
		`--eyes-top: ${position.y}px`,
		`--eye-width: ${Math.min(12, Math.max(7, 14.5 * position.scale))}px`,
		`--eye-height: ${Math.min(8, Math.max(5, 9.6 * position.scale))}px`,
		`--eye-gap: ${Math.min(9, Math.max(5, 11 * position.scale))}px`,
		`--pupil-width: ${Math.min(3, Math.max(2, 3.6 * position.scale))}px`,
		`--pupil-height: ${Math.min(4, Math.max(2.5, 4.8 * position.scale))}px`,
	].join("; ");
</script>

<div class="hollow-eyes" aria-hidden="true" style={eyeStyle}>
	<span class="eye">
		<span class="pupil"></span>
	</span>
	<span class="eye">
		<span class="pupil"></span>
	</span>
</div>
