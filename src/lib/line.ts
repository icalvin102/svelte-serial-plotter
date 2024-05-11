export type Line = {
	data: number[];
	color: [number, number, number, number];
};

export function createLine(): Line {
	return {
		data: [],
		color: [Math.random(), Math.random(), Math.random(), 1]
	};
}