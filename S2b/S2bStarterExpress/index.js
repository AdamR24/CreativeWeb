/**
 * index.js — the Plant Swap Shelf API (Express).
 * ------------------------------------------------------------------
 * This is a separate program from the SvelteKit app, with its own
 * package.json, its own port and its own .env.
 *
 * It connects to MongoDB Atlas, then answers five routes. Each route
 * checks the request, calls ONE function from ./lib/plantData.js, and
 * sends back the result with a status code. The database work lives in
 * plantData.js, not here.
 * ------------------------------------------------------------------
 */

import 'dotenv/config'; // reads the .env file into process.env
import express from 'express';
import mongoose from 'mongoose';
import { LIGHT_LEVELS } from './models/Plant.js';
import * as plantData from './lib/plantData.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Parses incoming JSON request bodies into req.body.
app.use(express.json());

// A request logger, handy when two servers are running side by side.
app.use((req, res, next) => {
	console.log(`[plant-api] ${req.method} ${req.path}`);
	next();
});

// --- GET /api/plants — list the plants, optionally filtered by light --------
app.get('/api/plants', async (req, res) => {
	try {
		const light = LIGHT_LEVELS.includes(req.query.light) ? req.query.light : null;

		// await means: pause here until the database answers, then carry on.
		const plants = await plantData.getAll(light);
		res.json(plants);
	} catch (err) {
		console.error('Failed to read plants:', err.message);
		res.status(500).json({ error: 'Could not read plants' });
	}
});

app.get('/api/plants/:id', async (req, res) => {
	try {
		const plant = await plantData.getOne(req.params.id);

		if (!plant) {
			return res.status(404).json({ error: `No plant found with id ${req.params.id}` });
		}

		res.json(plant);
	} catch (err) {
		console.error('Failed to read plant:', err.message);
		res.status(500).json({ error: 'Could not read plant' });
	}
});

// --- POST /api/plants — add a new plant --------------------------------------
app.post('/api/plants', async (req, res) => {
	try {
		// With no Content-Type header, req.body is undefined, so check first.
		if (!req.body) {
			return res.status(400).json({ error: 'name, species and lightNeeds are all required' });
		}

		const { name, species, lightNeeds } = req.body;

		// 400 = Bad Request: the caller left out something we need.
		if (!name || !species || !lightNeeds) {
			return res.status(400).json({ error: 'name, species and lightNeeds are all required' });
		}

		if (!LIGHT_LEVELS.includes(lightNeeds)) {
			return res
				.status(400)
				.json({ error: `lightNeeds must be one of: ${LIGHT_LEVELS.join(', ')}` });
		}

		const newPlant = await plantData.create({ name, species, lightNeeds });

		// 201 = Created: it worked AND a new plant now exists.
		res.status(201).json(newPlant);
	} catch (err) {
		console.error('Failed to create plant:', err.message);
		res.status(500).json({ error: 'Could not create plant' });
	}
});

// --- PATCH /api/plants/:id — mark one plant as swapped (or back again) -------
// The URL says WHICH plant (:id). The JSON body says WHAT to change,
// e.g. { "swapped": true }.
app.patch('/api/plants/:id', async (req, res) => {
	try {
		if (!req.body) {
			return res.status(400).json({ error: 'a JSON body with swapped is required' });
		}

		const { swapped } = req.body;

		// Only the swapped status changes through this route, and only a
		// real true or false is accepted.
		if (typeof swapped !== 'boolean') {
			return res.status(400).json({ error: 'swapped must be true or false' });
		}

		// The id stays as text: MongoDB ids are text, so there is no Number() here.
		const updated = await plantData.update(req.params.id, { swapped });

		// 404 = Not Found: the request was fine, but no plant has this id.
		if (!updated) {
			return res.status(404).json({ error: `No plant found with id ${req.params.id}` });
		}

		res.json(updated);
	} catch (err) {
		console.error('Failed to update plant:', err.message);
		res.status(500).json({ error: 'Could not update plant' });
	}
});

// --- DELETE /api/plants/:id — remove one plant -------------------------------
app.delete('/api/plants/:id', async (req, res) => {
	try {
		const removed = await plantData.remove(req.params.id);

		if (!removed) {
			return res.status(404).json({ error: `No plant found with id ${req.params.id}` });
		}

		// 204 = No Content: it worked, and there is nothing left to send back.
		res.status(204).send();
	} catch (err) {
		console.error('Failed to delete plant:', err.message);
		res.status(500).json({ error: 'Could not delete plant' });
	}
});

// --- Connect to MongoDB, then start listening --------------------------------
// The connection string (MONGODB_URI) comes from .env. The database name is
// part of that string. The collection comes from the model's name (see
// models/Plant.js).
async function start() {
	try {
		// await means: pause here until Atlas answers, then carry on.
		await mongoose.connect(process.env.MONGODB_URI);
		console.log('Connected to MongoDB');
	} catch (err) {
		console.error('Could not connect to MongoDB. Check MONGODB_URI in .env:', err.message);
		process.exit(1);
	}

	app.listen(PORT, () => {
		console.log(`Plant Swap Shelf API listening on http://localhost:${PORT}`);
	});
}

start();
