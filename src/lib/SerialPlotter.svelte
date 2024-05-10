<script>
    let port;
    let writer;
    let output = "";
    let inputValue = "";
    const textDecoder = new TextDecoderStream();
    let commandHistory = [];
    let historyIndex = -1;

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

    async function sendMessage(event) {
        if (event.key === "Enter" && writer) {
            event.preventDefault();
            // Send the input value over the serial connection
            const message = inputValue + '\n';
            await writer.write(new TextEncoder().encode(message));

            // Add message to command history
            commandHistory.push(inputValue);
            historyIndex = commandHistory.length; // Reset history index

            // Append the command to output
            output += `> ${inputValue}\n`;

            // Clear input value
            inputValue = '';
        }
    }

    function navigateHistory(event) {
        if (event.key === "ArrowUp") {
            if (historyIndex > 0) {
                historyIndex--;
                inputValue = commandHistory[historyIndex];
            }
        } else if (event.key === "ArrowDown") {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                inputValue = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                inputValue = '';
            }
        }
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
    <div>
        <input
            type="text"
            placeholder="Type a message and press Enter"
            bind:value={inputValue}
            on:keypress={sendMessage}
            on:keydown={navigateHistory}
            style="width: 100%;"
        />
    </div>
</main>

<style>
    main {
        font-family: Arial, sans-serif;
        margin: 0 auto;
        max-width: 600px;
        text-align: center;
    }
    textarea {
        overflow-y: scroll;
    }
</style>
