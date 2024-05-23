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

export function createLineGenerator(fn: (t: number) => number) {
	return (length: number, multiplier = 1) => {
		const line = createLine();
		for (let i = 0; i < length; i++) {
			line.data.push(fn(i * multiplier));
		}
		return line;
	};
}

export const createSinLine = createLineGenerator(Math.sin);
export const createCosLine = createLineGenerator(Math.cos);
