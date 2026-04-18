import { type CSSProperties } from "react";
import "./App.css";

type Leaf = {
	id: number;
	left: number;
	top: number;
	size: number;
	duration: number;
	delay: number;
	drift: number;
	spin: number;
	opacity: number;
};

const LEAF_COUNT = 28;
const HOLLOW_POINT = { x: 0.786, y: 0.43 };

const leaves: Leaf[] = Array.from({ length: LEAF_COUNT }, (_, id) => ({
	id,
	left: 6 + Math.random() * 88,
	top: 6 + Math.random() * 28,
	size: 12 + Math.random() * 18,
	duration: 8 + Math.random() * 10,
	delay: -Math.random() * 12,
	drift: 40 + Math.random() * 120,
	spin: Math.random() > 0.5 ? 1 : -1,
	opacity: 0.55 + Math.random() * 0.35,
}));

function App() {
	return (
		<main className="scene-page">
			<div className="scene-stack">
				<div
					className="underworld-scene"
					aria-label="Forest underground cross-section"
				>
					<img
						className="underworld-image"
						src="/d1e27d43-9c83-400f-a423-04eaccb86fd8.png"
						alt=""
						aria-hidden="true"
					/>
				</div>

				<section
					className="forest-scene"
					aria-label="Forest background with flying leaves"
				>
					<div
						className="hollow-eyes"
						aria-hidden="true"
						style={
							{
								"--eyes-left": `${HOLLOW_POINT.x * 100}%`,
								"--eyes-top": `${HOLLOW_POINT.y * 100}%`,
							} as CSSProperties
						}
					>
						<span className="eye">
							<span className="pupil" />
						</span>
						<span className="eye">
							<span className="pupil" />
						</span>
					</div>

					<div className="leaves-layer" aria-hidden="true">
						{leaves.map((leaf) => (
							<span
								key={leaf.id}
								className="leaf"
								style={
									{
										"--leaf-left": `${leaf.left}%`,
										"--leaf-top": `${leaf.top}%`,
										"--leaf-size": `${leaf.size}px`,
										"--leaf-duration": `${leaf.duration}s`,
										"--leaf-delay": `${leaf.delay}s`,
										"--leaf-drift": `${leaf.drift}px`,
										"--leaf-opacity": leaf.opacity,
										"--leaf-spin": leaf.spin,
									} as CSSProperties
								}
							/>
						))}
					</div>
				</section>
			</div>
		</main>
	);
}

export default App;
