<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';
	import type { Line } from './line';
	import type { HTMLCanvasAttributes } from 'svelte/elements';

	interface ProgramInfo {
		program: WebGLProgram;
		attribLocations: {
			vertexPosition: number;
		};
		uniformLocations: {
			transform: WebGLUniformLocation | null;
			color: WebGLUniformLocation | null;
		};
	}

	let { lines = [], ...restProps }: { lines: Line[] } & HTMLCanvasAttributes = $props();
	let canvas = $state<HTMLCanvasElement>();
	let gl: WebGL2RenderingContext | null = null;
	let shaderProgram: WebGLProgram | null = null;
	let programInfo: ProgramInfo | null = null;
	let buffers: WebGLBuffer[] = [];
	let animationFrameId: number;

	onMount(() => {
		if (!canvas) return;
		gl = canvas.getContext('webgl2') as WebGL2RenderingContext | null;

		if (!gl) {
			alert('WebGL 2.0 is not supported on your browser!');
			return;
		}

		const vsSource = `#version 300 es
            precision highp float;

            in vec2 aVertexPosition;
            uniform mat3 uTransform;
            void main(void) {
                vec3 pos = vec3(aVertexPosition, 1.0);
                gl_Position = vec4(uTransform * pos, 1.0);
            }
        `;

		const fsSource = `#version 300 es
            precision highp float;

            out vec4 fragColor;
            uniform vec4 uColor;
            void main(void) {
                fragColor = uColor;
            }
        `;

		function compileShader(type: number, source: string): WebGLShader | null {
			if (!gl) return null;
			const shader = gl.createShader(type);
			if (!shader) return null;

			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
				gl.deleteShader(shader);
				return null;
			}
			return shader;
		}

		function initShaderProgram(vsSource: string, fsSource: string): WebGLProgram | null {
			const vertexShader = compileShader(gl!.VERTEX_SHADER, vsSource);
			const fragmentShader = compileShader(gl!.FRAGMENT_SHADER, fsSource);
			if (!vertexShader || !fragmentShader) return null;

			const program = gl!.createProgram();
			if (!program) return null;

			gl!.attachShader(program, vertexShader);
			gl!.attachShader(program, fragmentShader);
			gl!.linkProgram(program);

			if (!gl!.getProgramParameter(program, gl!.LINK_STATUS)) {
				console.error('Unable to initialize the shader program:', gl!.getProgramInfoLog(program));
				return null;
			}
			return program;
		}

		shaderProgram = initShaderProgram(vsSource, fsSource);
		if (!shaderProgram) return;

		programInfo = {
			program: shaderProgram,
			attribLocations: {
				vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition')
			},
			uniformLocations: {
				transform: gl.getUniformLocation(shaderProgram, 'uTransform'),
				color: gl.getUniformLocation(shaderProgram, 'uColor')
			}
		};

		resize();
		drawScene();
	});

	onDestroy(() => {
		if (!browser) return;
		cancelAnimationFrame(animationFrameId);
	});

	function resize() {
		if (!canvas) return;
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
		gl!.viewport(0, 0, gl!.drawingBufferWidth, gl!.drawingBufferHeight);
	}

	function drawScene() {
		gl!.clear(gl!.COLOR_BUFFER_BIT);

		gl!.useProgram(programInfo!.program);
		gl!.uniformMatrix3fv(programInfo!.uniformLocations.transform, false, getTransformMatrix());

		lines.forEach((line, index) => {
			const buffer = buffers[index] || (buffers[index] = gl!.createBuffer()!);
			const { data } = line;
			const vertices = new Float32Array(data.length * 2);

			for (let i = 0; i < data.length; i++) {
				vertices[i * 2] = (i / data.length - 0.5) * 2;
				vertices[i * 2 + 1] = data[i];
			}

			gl!.bindBuffer(gl!.ARRAY_BUFFER, buffer);
			gl!.bufferData(gl!.ARRAY_BUFFER, vertices, gl!.DYNAMIC_DRAW);

			gl!.uniform4fv(programInfo!.uniformLocations.color, line.color);
			gl!.vertexAttribPointer(
				programInfo!.attribLocations.vertexPosition,
				2,
				gl!.FLOAT,
				false,
				0,
				0
			);
			gl!.enableVertexAttribArray(programInfo!.attribLocations.vertexPosition);
			gl!.drawArrays(gl!.LINE_STRIP, 0, data.length);
		});

		animationFrameId = requestAnimationFrame(drawScene);
	}

	const scaleFactor = 0.5;
	// Initial transformation state
	let scale = { x: scaleFactor, y: scaleFactor }; // Individual zoom levels
	let pan = { x: 0.0, y: 0.0 }; // Pan translation
	let startPosition = { x: 0, y: 0 };
	let panOffset = { x: 0, y: 0 };
	let isDragging = false;

	function updatePanOffset(event: MouseEvent) {
		const x = (event.clientX - startPosition.x) / (canvas.clientWidth * 0.5);
		const y = (event.clientY - startPosition.y) / (canvas.clientHeight * 0.5);
		panOffset = { x, y };
	}

	function getTransformMatrix() {
		const sx = scale.x;
		const sy = scale.y;
		const tx = pan.x + panOffset.x;
		const ty = pan.y - panOffset.y;
		return new Float32Array([sx, 0, 0, 0, sy, 0, tx, ty, 1]);
	}

	function handleMousedown(event: MouseEvent) {
		startPosition.x = event.clientX;
		startPosition.y = event.clientY;
		isDragging = true;
	}

	function handleMousemove(event: MouseEvent) {
		if (!isDragging || !canvas) return;
		updatePanOffset(event);
	}

	function handleMouseup() {
		pan.x += panOffset.x;
		pan.y -= panOffset.y;
		panOffset = { x: 0, y: 0 };
		isDragging = false;
	}
</script>

<svelte:window onresize={resize} onmousemove={handleMousemove} onmouseup={handleMouseup} />
<canvas bind:this={canvas} {...restProps} onmousedown={handleMousedown}></canvas>
