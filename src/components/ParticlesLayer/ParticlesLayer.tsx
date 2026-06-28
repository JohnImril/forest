import type { CSSProperties } from "react";
import type { Season } from "../../domain/seasons";
import type { Particle } from "../../lib/particles";
import "./ParticlesLayer.css";

type ParticlesLayerProps = {
	particles: Particle[];
	season: Season;
};

export function ParticlesLayer({ particles, season }: ParticlesLayerProps) {
	return (
		<div className="particles-layer" aria-hidden="true">
			{particles.map((particle) => (
				<span
					key={`${season.id}-${particle.id}`}
					className={`particle ${season.particleClass}`}
					style={
						{
							"--particle-left": `${particle.left}%`,
							"--particle-top": `${particle.top}%`,
							"--particle-size": `${particle.size}px`,
							"--particle-duration": `${particle.duration}s`,
							"--particle-delay": `${particle.delay}s`,
							"--particle-drift": `${particle.drift}px`,
							"--particle-opacity": particle.opacity,
							"--particle-spin": particle.spin,
							"--particle-variant": particle.variant,
						} as CSSProperties
					}
				/>
			))}
		</div>
	);
}
