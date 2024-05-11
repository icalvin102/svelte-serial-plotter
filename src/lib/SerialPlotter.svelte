<script lang="ts">
	import { onMount } from 'svelte';
	import Commandline from './Commandline.svelte';
	import Plot from './Plot.svelte';

	let port: SerialPort | null;
	let writer: WritableStreamDefaultWriter<Uint8Array> | null;
	const textDecoder = new TextDecoderStream();
	let output = $state('');
	let connectionStatus = $state('Disconnected');
	let availablePorts: SerialPort[] = $state([]);
	let selectedPort: SerialPort | null = $state(null);
	let baudRate = $state(115200);

	const boudRates = [9600, 14400, 19200, 38400, 57600, 115200];

	// Fetch available serial ports on component mount
	onMount(async () => {
		if ('serial' in navigator) {
			availablePorts = await navigator.serial.getPorts();
			if (availablePorts.length > 0) {
				selectedPort = availablePorts[0];
			}
		}
	});

	async function connectSerial() {
		try {
			if (!selectedPort) {
				selectedPort = await navigator.serial.requestPort();
			}
			port = selectedPort; // Assign the selected port to the port variable
			await port.open({ baudRate });

			if (!(port.readable && port.writable)) return;
			const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
			writer = port.writable.getWriter();

			const reader = textDecoder.readable.getReader();
			readLoop(reader);

			connectionStatus = 'Connected';
		} catch (err) {
			console.error('Connection error:', err);
			connectionStatus = 'Error';
		}
	}

	async function disconnectSerial() {
		if (port && writer) {
			try {
				await writer.close();
				await port.close();
			} catch (err) {
				console.error('Disconnection error:', err);
			} finally {
				writer = null;
				port = null;
				connectionStatus = 'Disconnected';
			}
		}
	}

	async function readLoop(reader: ReadableStreamDefaultReader<string>) {
		try {
			while (true) {
				const { value, done } = await reader.read();
				if (done) {
					reader.releaseLock();
					break;
				}
				output += value;
			}
		} catch (error) {
			console.error('Read error:', error);
		}
	}

	async function sendMessage(command: string) {
		const message = command + '\n';
		if (!writer) return;
		await writer.write(new TextEncoder().encode(message));
	}

	let t = $state(0);
	onMount(() => {
		const interval = setInterval(() => (t += 0.01), 1000 / 60);
		return () => clearInterval(interval);
	});

	function generateLines(t: number = 0) {
		const lines: Array<{ data: number[]; color: [number, number, number, number] }> = [
			{ data: [], color: [1, 0, 0, 1] },
			{ data: [], color: [0, 1, 0, 1] }
		];
		for (let i = 0; i < 1000; i++) {
			lines[0].data.push(Math.sin(i * 0.1 + t));
			lines[1].data.push(Math.cos(i * 0.1 + t));
		}
		return lines;
	}
</script>

<main class="flex flex-col items-center p-4">
	<h1 class="mb-4 text-2xl font-bold">Serial Communication</h1>

	<div class="mb-4 flex w-full max-w-md flex-row items-center space-x-2">
		<select bind:value={selectedPort} class="flex-1 rounded border p-1">
			{#each availablePorts as port, index}
				<option value={port}>{`Port ${index + 1}`}</option>
			{/each}
		</select>
		<select bind:value={baudRate} class="flex-1 rounded border p-1">
			{#each boudRates as value}
				<option {value}>{value}</option>
			{/each}
		</select>
		{#if connectionStatus === 'Connected'}
			<button onclick={disconnectSerial} class="rounded bg-red-500 p-2 text-white"
				>Disconnect</button
			>
		{:else}
			<button onclick={connectSerial} class="rounded bg-blue-500 p-2 text-white">Connect</button>
		{/if}
	</div>
	<p class="mt-2">Status: {connectionStatus}</p>

	<div class="mb-4 w-full max-w-md overflow-y-scroll">
		<textarea readonly bind:value={output} class="h-48 w-full resize-none rounded border p-2" />
	</div>
	<Plot lines={generateLines(t)} class="block h-96 w-full rounded bg-slate-900" />
	<Commandline onSubmit={sendMessage} />
</main>
