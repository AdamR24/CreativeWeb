<script>
	let { data } = $props();
	let plant = $state(data.plant);

	import { goto } from '$app/navigation';

	let busy = $state(false);
	let error_ = $state('');

	async function toggleSwapped() {
		busy = true;
		error_ = '';

		try {
			const res = await fetch(`/api/plants/${plant.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ swapped: !plant.swapped })
			});

			if (!res.ok) {
				throw new Error(`Request failed with status ${res.status}`);
			}

			plant = await res.json();
		} catch (err) {
			error_ = 'Could not update that plant. Is the API running?';
			console.error(err);
		} finally {
			busy = false;
		}
	}

	async function removePlant() {
		busy = true;
		error_ = '';

		try {
			const res = await fetch(`/api/plants/${plant.id}`, {
				method: 'DELETE'
			});

			if (!res.ok) {
				throw new Error(`Request failed with status ${res.status}`);
			}

			await goto('/shelf');
		} catch (err) {
			error_ = 'Could not remove that plant. Is the API running?';
			console.error(err);
		} finally {
			busy = false;
		}
	}

	const addedOn = plant.createdAt ? new Date(plant.createdAt).toLocaleDateString('en-GB') : null;
</script>

<main>
	<p><a href="/shelf">← Back to the shelf</a></p>

	<h1>{plant.name}</h1>

	<dl>
		<dt>Species</dt>
		<dd class="species">{plant.species}</dd>

		<dt>Light needs</dt>
		<dd>{plant.lightNeeds}</dd>

		<dt>Status</dt>
		<dd>
			{#if plant.swapped}
				<span class="badge swapped">Swapped — gone to a new home</span>
			{:else}
				<span class="badge">Still on the shelf</span>
			{/if}
		</dd>

		{#if addedOn}
			<dt>On the shelf since</dt>
			<dd>{addedOn}</dd>
		{/if}
	</dl>

	<div class="buttons">
		<button onclick={toggleSwapped} disabled={busy}>
			{plant.swapped ? 'Put back on the shelf' : 'Mark swapped'}
		</button>
		<button class="delete" onclick={removePlant} disabled={busy}>Remove from shelf</button>
	</div>

	{#if error_}
		<p class="error">{error_}</p>
	{/if}
</main>

<style>
	main {
		max-width: 36rem;
		margin: 2rem auto;
		padding: 0 1.5rem;
		font-family: system-ui, sans-serif;
	}
	h1 {
		margin-bottom: 1rem;
	}
	dl {
		display: grid;
		grid-template-columns: 10rem 1fr;
		row-gap: 0.75rem;
		background: #f4faf4;
		border-left: 6px solid #81c784;
		border-radius: 4px;
		padding: 1rem;
	}
	dt {
		color: #666;
		font-size: 0.9rem;
	}
	dd {
		margin: 0;
	}
	.species {
		font-style: italic;
	}
	.badge {
		display: inline-block;
		font-size: 0.8rem;
		border-radius: 999px;
		padding: 0.15rem 0.7rem;
		background: #e8f5e9;
		color: #2e7d32;
		text-transform: capitalize;
	}
	.badge.swapped {
		background: #fff8e1;
		color: #a07d00;
	}
	.buttons {
		display: flex;
		gap: 0.5rem;
		margin-top: 1.5rem;
	}
	.buttons button {
		cursor: pointer;
		border: 1px solid #ccc;
		background: #fff;
		border-radius: 4px;
		padding: 0.4rem 0.9rem;
	}
	.buttons button.delete:hover {
		color: #b91c1c;
		border-color: #b91c1c;
	}
	.error {
		color: #b91c1c;
	}
</style>
