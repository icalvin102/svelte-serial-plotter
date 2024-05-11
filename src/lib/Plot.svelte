<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';

	// Types
	interface Line {
		data: number[];
		color: [number, number, number, number];
	}

	interface ProgramInfo {
		program: WebGLProgram;
		attribLocations: {
			vertexPosition: number;
		};
		uniformLocations: {
			zoom: WebGLUniformLocation | null;
			color: WebGLUniformLocation | null;
		};
	}

	let { lines = [], ...restProps }: { lines: Line[] } = $props();
	let canvas = $state<HTMLCanvasElement>();
	let gl: WebGLRenderingContext | null = null;
	let zoom = { x: 1.0, y: 1.0 };
	let shaderProgram: WebGLProgram | null = null;
	let programInfo: ProgramInfo | null = null;
	let buffers: WebGLBuffer[] = [];
	let animationFrameId: number;

	onMount(() => {
		// Initialize WebGL context
		if (!canvas) return;
		gl =
			canvas.getContext('webgl') ||
			(canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

		if (!gl) {
			alert('WebGL is not supported on your browser!');
			return;
		}

		// Vertex shader source code with zooming
		const vsSource = `
        attribute vec2 aVertexPosition;
        uniform vec2 uZoom;
        void main(void) {
          gl_Position = vec4(aVertexPosition * uZoom, 0.0, 1.0);
        }
      `;

		// Fragment shader source code
		const fsSource = `
        precision mediump float;
        uniform vec4 uColor;
        void main(void) {
          gl_FragColor = uColor;
        }
      `;

		// Compile shader programs
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

		// Initialize the shader program
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
				zoom: gl.getUniformLocation(shaderProgram, 'uZoom'),
				color: gl.getUniformLocation(shaderProgram, 'uColor')
			}
		};

		// Create buffers for each line
		buffers = lines.map(() => gl!.createBuffer()!);

		drawScene();
	});

	onDestroy(() => {
		if (!browser) return;
		cancelAnimationFrame(animationFrameId);
	});

	function resize() {
		if (!canvas) return;
		// Resize the canvas according to its container size
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
		gl!.viewport(0, 0, gl!.drawingBufferWidth, gl!.drawingBufferHeight);
	}

	function handleZoom(event: WheelEvent) {
		const zoomFactor = 0.05;
		if (event.shiftKey) {
			zoom.x *= event.deltaY > 0 ? 1 + zoomFactor : 1 - zoomFactor;
		} else {
			zoom.y *= event.deltaY > 0 ? 1 + zoomFactor : 1 - zoomFactor;
		}
	}

	function drawScene() {
		gl!.clear(gl!.COLOR_BUFFER_BIT);

		gl!.useProgram(programInfo!.program);
		gl!.uniform2fv(programInfo!.uniformLocations.zoom, [zoom.x, zoom.y]);

		// Draw each line
		lines.forEach((line, index) => {
			const { data } = line;
			const vertices = new Float32Array(data.length * 2);

			for (let i = 0; i < data.length; i++) {
				vertices[i * 2] = (i / data.length - 0.5) * 2;
				vertices[i * 2 + 1] = data[i];
			}

			gl!.bindBuffer(gl!.ARRAY_BUFFER, buffers[index]);
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

	onMount(resize);
</script>

<svelte:window onresize={resize} />
<canvas bind:this={canvas} {...restProps} onwheel={handleZoom}></canvas>
