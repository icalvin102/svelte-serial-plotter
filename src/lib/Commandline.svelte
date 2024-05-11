<script lang="ts">
	import { onMount } from 'svelte';
	const STORAGE_KEY = 'serialCommandHistory';
	let { onSubmit }: { onSubmit: (command: string) => void } = $props();

	let commandInput = $state('');
	let commandHistory = $state<string[]>([]);

	const storage = {
		read() {
			const data = localStorage.getItem(STORAGE_KEY);
			if (data) {
				commandHistory = JSON.parse(data);
			}
		},
		write(data: string[]) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		},
		clear() {
			localStorage.removeItem(STORAGE_KEY);
		}
	};

	onMount(() => {
		storage.read();
	});

	function handleSubmit(event: Event) {
		event.preventDefault();
		if (commandInput.trim()) {
			if (commandHistory.length === 0 || commandHistory.at(-1) !== commandInput) {
				commandHistory.push(commandInput);
				storage.write(commandHistory);
			}
			onSubmit(commandInput);
		}
	}

	function populateCommand(command: string) {
		commandInput = command;
	}

	function submitCommand(command: string) {
		commandInput = command;
		handleSubmit(new Event('submit'));
	}

	function deleteCommand(index: number) {
		commandHistory = commandHistory.filter((_, i) => i !== index);
		storage.write(commandHistory);
	}
</script>

<div class="mx-auto flex w-full flex-col rounded-md bg-gray-900 p-4 font-mono text-xs text-white">
	<ul class="command-list mb-2 flex-grow space-y-1 overflow-y-auto">
		{#each commandHistory as command, index (index)}
			<li class="command-item">
				<span>{command}</span>
				<div class="command-buttons">
					<button class="icon-button" onclick={() => populateCommand(command)} title="Edit">
						<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
							<path fill="currentColor" d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575z" />
						</svg>
					</button>
					<button class="icon-button" onclick={() => submitCommand(command)} title="Run">
						<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="m9.5 16.5l7-4.5l-7-4.5zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
							/>
						</svg>
					</button>
					<button class="icon-button" onclick={() => deleteCommand(index)} title="Delete">
						<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"
							/>
						</svg>
					</button>
				</div>
			</li>
		{/each}
	</ul>
	<form onsubmit={handleSubmit} class="flex">
		<input
			type="text"
			placeholder="Type a command and press Enter"
			bind:value={commandInput}
			class="flex-1 rounded-md bg-gray-800 p-2 text-white outline-none"
		/>
	</form>
</div>

<style>
	.command-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 4px 8px;
		background-color: #1e1e1e;
		border-radius: 5px;
		transition: background-color 0.2s;
	}

	.command-item:hover {
		background-color: #333;
	}

	.command-buttons {
		display: none;
		gap: 4px;
	}

	.command-item:hover .command-buttons {
		display: flex;
	}

	.icon-button {
		background: transparent;
		border: none;
		color: #ccc;
		cursor: pointer;
		padding: 0 4px;
	}

	.icon-button:hover {
		color: white;
	}
</style>
