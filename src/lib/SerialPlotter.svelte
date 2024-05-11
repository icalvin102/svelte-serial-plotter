<script lang="ts">
	import { onMount } from 'svelte';
	import Commandline from './Commandline.svelte';
	import Plot from './Plot.svelte';
	import { createLine, type Line } from './line';

	type ConnectionStatus = 'connected' | 'disconnected' | 'error';

	let port: SerialPort | null;
	let writer: WritableStreamDefaultWriter<Uint8Array> | null;
	const textDecoder = new TextDecoderStream();
	let output = $state('');
	let inputBuffer = '';
	let connectionStatus: ConnectionStatus = $state('disconnected');
	let availablePorts: SerialPort[] = $state([]);
	let selectedPort: SerialPort | null = $state(null);
	let baudRate = $state(115200);
	let lines: Line[] = $state([createLine(), createLine()]);

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

			connectionStatus = 'connected';
		} catch (err) {
			console.error('Connection error:', err);
			connectionStatus = 'error';
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
				connectionStatus = 'disconnected';
			}
		}
	}

	function handleIncomingData(value: string) {
		value.trim();
		if (value === 'clear') {
			lines = [];
			return;
		}

		const data = value
			.split(',')
			.map(parseFloat)
			.filter((x) => !isNaN(x))
			.forEach((x, i) => {
				const line = lines[i] || (lines[i] = createLine());
				line.data.push(x);
			});
	}

	function handleIncomingDataRaw(value: string) {
		const delimiter = '\r\n';
		inputBuffer += value;

		let i = inputBuffer.indexOf(delimiter);
		while (i >= 0) {
			handleIncomingData(inputBuffer.slice(0, i));
			inputBuffer = inputBuffer.slice(i + 2);
			i = inputBuffer.indexOf(delimiter);
		}
		output += value;
	}

	async function readLoop(reader: ReadableStreamDefaultReader<string>) {
		try {
			while (true) {
				const { value, done } = await reader.read();
				if (done) {
					reader.releaseLock();
					break;
				}
				handleIncomingDataRaw(value);
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
</script>

<main class="grid grid-cols-6 gap-2 p-4">
	<div class="col-span-2 flex flex-col">
		<h1 class="mb-4 text-2xl font-bold">Serial Communication</h1>

		<div class="mb-2 flex w-full max-w-md flex-row items-center space-x-2">
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
			{#if connectionStatus === 'connected'}
				<button onclick={disconnectSerial} class="rounded bg-red-500 px-2 py-1 text-white"
					>Disconnect</button
				>
			{:else}
				<button onclick={connectSerial} class="rounded bg-blue-500 px-2 py-1 text-white"
					>Connect</button
				>
			{/if}
		</div>

		<textarea
			readonly
			class="mb-auto h-48 w-full flex-grow resize-none rounded border bg-slate-900 p-2 text-xs text-white"
			>{output}</textarea
		>
	</div>

	<Plot {lines} class="col-span-4 block h-96 w-full rounded bg-slate-900" />
	<div class="col-span-full"><Commandline onSubmit={sendMessage} /></div>
</main>
