/**
 * lib/plantData.js — all the database work for plants.
 * ------------------------------------------------------------------
 * index.js (the routes) never talks to MongoDB itself. It calls one of
 * these five functions, and they use the Plant model to do the work.
 *
 * Each function is async, because the database takes time to answer.
 * The routes in index.js use await to wait for the answer.
 * ------------------------------------------------------------------
 */

import mongoose from 'mongoose';
import Plant from '../models/Plant.js';

export async function getAll(lightNeeds) {
	const filter = lightNeeds ? { lightNeeds } : {};
	return Plant.find(filter);
}

export async function getOne(id) {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return null;
	}
	return Plant.findById(id);
}

export async function create(data) {
	return Plant.create(data);
}

export async function update(id, changes) {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return null;
	}
	return Plant.findByIdAndUpdate(id, changes, { new: true, runValidators: true });
}

export async function remove(id) {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return null;
	}
	return Plant.findByIdAndDelete(id);
}
