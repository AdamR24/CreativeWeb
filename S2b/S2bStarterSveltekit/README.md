# S2bStarterSveltekit

The SvelteKit app for the Plant Swap Shelf. It never talks to MongoDB, and the browser never talks to Express. The browser calls this app's own routes, and this app calls the Express API (`S2bStarterExpress`).

## Run it

Start `S2bStarterExpress` first, then:

```
npm install
npm run dev
```

Open http://localhost:5173

`PLANT_API_URL` in `.env` is the address of the Express API (see `.env.example`).

## Where things are

| File | What it does |
|---|---|
| `src/routes/shelf/+page.server.js` | `load({ url })`: reads the `?light` filter from the URL, gets the plants from Express before the page is sent. |
| `src/routes/shelf/+page.svelte` | The shelf: filter links, the plant cards, the add form, the swap and ✕ buttons. Each button does a `fetch()` to this app's own `/api/plants` routes. |
| `src/routes/shelf/[id]/+page.server.js` | `load({ params })`: gets ONE plant from Express for `/shelf/<id>`. A bad or unknown id becomes a proper 404 page. |
| `src/routes/shelf/[id]/+page.svelte` | One plant's own page. |
| `src/routes/api/plants/+server.js` | Add a plant (POST). Forwards to Express. |
| `src/routes/api/plants/[id]/+server.js` | Change (PATCH) or delete (DELETE) one plant. Forwards to Express. |
| `src/lib/server/plantApi.js` | The only file that calls Express. |
| `src/env.js` | Lists the variables from `.env` the app may use. |
| `src/routes/+error.svelte` | The page shown when `load()` calls `error()`. |

## The flow

```
page button → fetch('/api/plants/...') → [id]/+server.js → plantApi.js → Express → MongoDB
filter link → /shelf?light=low → +page.server.js load() → plantApi.js → Express → MongoDB
```
