import type { CSSProperties } from "react";
import "./HollowEyes.css";

type HollowEyesProps = {
	position: {
		x: number;
		y: number;
	};
};

export function HollowEyes({ position }: HollowEyesProps) {
	return (
		<div
			className="hollow-eyes"
			aria-hidden="true"
			style={
				{
					"--eyes-left": `${position.x}px`,
					"--eyes-top": `${position.y}px`,
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
	);
}
