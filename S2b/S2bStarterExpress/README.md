# S2bStarterExpress

The Express API for the Plant Swap Shelf. It is the only program that talks to MongoDB, through Mongoose. The SvelteKit app (`S2bStarterSveltekit`) talks to this.

## Run it

```
npm install
npm run dev
```

It listens on http://localhost:3001.

## Where things are

| File | What it does |
|---|---|
| `index.js` | Connects to MongoDB (using `MONGODB_URI` from `.env`), then the five routes. Each route checks the request, calls one function from `lib/plantData.js`, and sends a status code. |
| `lib/plantData.js` | The database work: `getAll`, `getOne`, `create`, `update`, `remove`. |
| `models/Plant.js` | The schema (the shape of a plant) and the model. The model's name decides the collection name. |
| `.env` | Secret settings. Not committed. `.env.example` lists the names. |

## Routes

| Method | Path | Success |
|---|---|---|
| GET | `/api/plants?light=low\|medium\|bright` | 200 and the (filtered) list |
| GET | `/api/plants/:id` | 200 and one plant |
| POST | `/api/plants` | 201 and the new plant |
| PATCH | `/api/plants/:id` | 200 and the updated plant (body: `{ "swapped": true }`) |
| DELETE | `/api/plants/:id` | 204 |
