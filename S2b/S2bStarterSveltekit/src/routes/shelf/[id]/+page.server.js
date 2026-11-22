import { error } from '@sveltejs/kit';
import { fetchPlant } from '#lib/server/plantApi.js';

export async function load({ params }) {
	let plant;
	try {
		// await means: pause here until Express answers, then carry on.
		plant = await fetchPlant(params.id);
	} catch (err) {
		console.error('Failed to reach the Plant API:', err.message);

		// 502 = Bad Gateway: we could not get an answer from Express.
		error(502, "Couldn't reach the Plant API. Is the Express server running?");
	}

	if (!plant) {
		error(404, `No plant with id "${params.id}" is on the shelf.`);
	}

	return { plant };
}
