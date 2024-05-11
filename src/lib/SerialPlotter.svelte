<script lang="ts">
	import Commandline from './Commandline.svelte';
	import Plot from './Plot.svelte';

    let port;
    let writer;
    let output = "";
    let inputValue = "";
    const textDecoder = new TextDecoderStream();

    async function connectSerial() {
        try {
            // Request a serial port
            port = await navigator.serial.requestPort();
            // Open the serial port with a specified baud rate
            await port.open({ baudRate: 115200 });

            // Set up the reader and writer
            const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
            writer = port.writable.getWriter();

            // Read serial data and append it to the output string
            const reader = textDecoder.readable.getReader();
            readLoop(reader);

        } catch (err) {
            console.error('Connection error:', err);
        }
    }

    async function readLoop(reader) {
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
        await writer.write(new TextEncoder().encode(message));
    }
</script>

<main>
    <h1>Serial Communication</h1>
    <div>
        <button on:click={connectSerial}>Connect to Serial Device</button>
    </div>
    <div>
        <textarea readonly bind:value={output} style="width: 100%; height: 200px; border: 1px solid black; padding: 5px;"></textarea>
    </div>
	<Plot class="w-full h-96 block" />
    <Commandline onSubmit={sendMessage} />
</main>

<style>
    main {
        font-family: Arial, sans-serif;
        margin: 0 auto;
        text-align: center;
    }
    textarea {
        overflow-y: scroll;
    }
</style>
