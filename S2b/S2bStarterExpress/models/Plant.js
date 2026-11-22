/**
 * models/Plant.js — the SCHEMA and the MODEL for a plant.
 * ------------------------------------------------------------------
 * A schema describes the shape of one document: which fields it has,
 * their types, and which are required.
 *
 * A model is made from the schema. It is what the rest of the code uses
 * to talk to the database. The model's name decides the collection:
 * Mongoose lowercases it and makes it plural, so 'Plant' is stored in
 * a collection called "plants".
 * ------------------------------------------------------------------
 */

import mongoose from 'mongoose';

export const LIGHT_LEVELS = ['low', 'medium', 'bright'];

const plantSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		species: { type: String, required: true, trim: true },
		lightNeeds: {
			type: String,
			required: true,
			enum: LIGHT_LEVELS,
			lowercase: true,
			trim: true
		},
		swapped: { type: Boolean, default: false }
	},
	{
		toJSON: { virtuals: true },
		timestamps: true
	}
);

const Plant = mongoose.model('Plant', plantSchema);

export default Plant;
