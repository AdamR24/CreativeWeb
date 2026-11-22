<script>
	// `data` holds what load() in +page.server.js returned.
	let { data } = $props();

	// Our own copy of the list, seeded from load()'s data — a cache that the
	// buttons below change straight away, without asking the server again.
	// When a filter link re-runs load() with the new URL, the $effect pulls
	// the fresh list from MongoDB back into the cache, so it always ends up
	// matching the database.
	let plants = $state(data.plants);
	$effect(() => {
		plants = data.plants;
	});

	// The add form's fields. lightNeeds comes from the <select>.
	let name = $state('');
	let species = $state('');
	let lightNeeds = $state('medium');
	let submitting = $state(false);
	let submitError = $state('');
	let listError = $state('');

	// Light needs are shown as plain text on the cards: low / medium / bright.

	// ADD — the form. A plain fetch() to OUR OWN /api/plants route
	// (src/routes/api/plants/+server.js), never straight to Express.
	// SvelteKit forwards it to Express.
	async function handleSubmit(event) {
		event.preventDefault(); // stop the browser reloading the page
		submitting = true;
		submitError = '';

		try {
			// await means: pause here until the server answers, then carry on.
			const res = await fetch('/api/plants', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, species, lightNeeds })
			});

			if (!res.ok) {
				throw new Error(`Request failed with status ${res.status}`);
			}

			// The API sends back the saved plant (with its id). Add it to our list.
			const newPlant = await res.json();
			plants.push(newPlant);

			name = '';
			species = '';
			lightNeeds = 'medium';
		} catch (err) {
			submitError = 'Could not add that plant. Is the API running?';
			console.error(err);
		} finally {
			submitting = false;
		}
	}

	// UPDATE — the swap button. A PATCH to OUR OWN /api/plants/<id>
	// route (src/routes/api/plants/[id]/+server.js), sending only the
	// field that changes.
	async function toggleSwapped(plant) {
		listError = '';

		try {
			const res = await fetch(`/api/plants/${plant.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ swapped: !plant.swapped })
			});

			if (!res.ok) {
				throw new Error(`Request failed with status ${res.status}`);
			}

			// The API sends back the updated plant. Copy the new value onto
			// the plant in our cached list and the badge changes.
			const updated = await res.json();
			plant.swapped = updated.swapped;
		} catch (err) {
			listError = 'Could not update that plant. Is the API running?';
			console.error(err);
		}
	}

	// DELETE — the ✕ button. A successful delete answers 204 (No Content),
	// so there is no body to read.
	async function removePlant(plant) {
		listError = '';

		try {
			const res = await fetch(`/api/plants/${plant.id}`, {
				method: 'DELETE'
			});

			if (!res.ok) {
				throw new Error(`Request failed with status ${res.status}`);
			}

			// Rebuild our list without that plant: filter keeps every plant
			// whose id is NOT the one we deleted.
			plants = plants.filter((p) => p.id !== plant.id);
		} catch (err) {
			listError = 'Could not remove that plant. Is the API running?';
			console.error(err);
		}
	}
</script>

<main>
	<h1>Plant Swap Shelf</h1>
	<p><a href="/">← Home</a></p>

	<nav class="filters" aria-label="Filter by light needs">
		<a href="/shelf" class:active={!data.light}>All</a>
		<a href="/shelf?light=low" class:active={data.light === 'low'}>Low</a>
		<a href="/shelf?light=medium" class:active={data.light === 'medium'}>Medium</a>
		<a href="/shelf?light=bright" class:active={data.light === 'bright'}>Bright</a>
	</nav>

	{#if data.light}
		<p class="filter-note">Showing plants that need {data.light} light.</p>
	{/if}

	{#if listError}
		<p class="error">{listError}</p>
	{/if}

	{#if plants.length === 0}
		<p class="empty">Nothing on the shelf for this filter yet.</p>
	{/if}

	<ul class="plant-list">
		{#each plants as plant (plant.id)}
			<li class="plant-card" class:is-swapped={plant.swapped}>
				<div>
					<a class="plant-link" href={`/shelf/${plant.id}`}>
						<strong>{plant.name}</strong>
					</a>
					<span class="species">{plant.species}</span>
					<span class="badge light">{plant.lightNeeds}</span>
					{#if plant.swapped}
						<span class="badge swapped">Swapped</span>
					{/if}
				</div>
				<div class="buttons">
					<button onclick={() => toggleSwapped(plant)} title="Mark as swapped, or back on the shelf">
						{plant.swapped ? 'Back on the shelf' : 'Mark swapped'}
					</button>
					<button class="delete" onclick={() => removePlant(plant)} title="Remove this plant">
						✕
					</button>
				</div>
			</li>
		{/each}
	</ul>

	<h2>Add a plant</h2>
	<form onsubmit={handleSubmit}>
		<label>
			Name
			<input type="text" bind:value={name} required />
		</label>
		<label>
			Species
			<input type="text" bind:value={species} required placeholder="e.g. Monstera deliciosa" />
		</label>
		<label>
			Light needs
			<select bind:value={lightNeeds}>
				<option value="low">Low</option>
				<option value="medium">Medium</option>
				<option value="bright">Bright</option>
			</select>
		</label>
		<button type="submit" disabled={submitting}>
			{submitting ? 'Adding…' : 'Add plant'}
		</button>
		{#if submitError}
			<p class="error">{submitError}</p>
		{/if}
	</form>
</main>

<style>
	main {
		max-width: 40rem;
		margin: 2rem auto;
		padding: 0 1.5rem;
		font-family: system-ui, sans-serif;
	}
	.filters {
		display: flex;
		gap: 0.5rem;
		margin: 1rem 0;
	}
	.filters a {
		padding: 0.25rem 0.9rem;
		border: 1px solid #ccc;
		border-radius: 999px;
		text-decoration: none;
		color: #333;
	}
	.filters a.active {
		background: #2e7d32;
		border-color: #2e7d32;
		color: #fff;
	}
	.filter-note {
		color: #666;
		font-size: 0.9rem;
		margin-top: 0;
	}
	.plant-list {
		list-style: none;
		padding: 0;
	}
	.plant-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
		border-left: 6px solid #81c784;
		background: #f4faf4;
		padding: 0.75rem 1rem;
		margin-bottom: 0.5rem;
		border-radius: 4px;
	}
	.plant-card.is-swapped {
		opacity: 0.6;
		border-left-color: #ccc;
	}
	.plant-link {
		color: inherit;
		text-decoration: none;
	}
	.plant-link:hover {
		text-decoration: underline;
	}
	.species {
		color: #666;
		font-style: italic;
		margin-left: 0.5rem;
		font-size: 0.9rem;
	}
	.badge {
		display: inline-block;
		font-size: 0.75rem;
		border-radius: 999px;
		padding: 0.1rem 0.55rem;
		margin-left: 0.5rem;
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
		gap: 0.25rem;
		flex-shrink: 0;
	}
	.buttons button {
		cursor: pointer;
		border: 1px solid #ccc;
		background: #fff;
		border-radius: 4px;
		padding: 0.3rem 0.7rem;
		font-size: 0.85rem;
	}
	.buttons button.delete:hover {
		color: #b91c1c;
		border-color: #b91c1c;
	}
	.empty {
		color: #666;
		font-style: italic;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		max-width: 20rem;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.9rem;
	}
	.error {
		color: #b91c1c;
	}
</style>
