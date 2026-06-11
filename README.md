# Baton Rouge RC Club Website

Website for the Baton Rouge Radio Control Club (BRRCC), built with [Astro](https://astro.build) and deployed on [Vercel](https://vercel.com).

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) to preview the site locally.

The site shows a "parked" gate overlay on first visit (redirects to Facebook after 8 seconds, or click "parked" 10 times to unlock). Unlock state persists for the browser session.

The Home, Kissner Field, Events, and Media pages are server-rendered and fetch live data when you run dev or deploy to Vercel.

## Build

```bash
npm run build
npm run preview
```

Most pages are static. Home, Kissner Field, Events, and Media are rendered on demand via the Vercel adapter.

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the project in the [Vercel dashboard](https://vercel.com/new).
3. Vercel auto-detects Astro — build command `npm run build`.
4. Optionally connect the custom domain `batonrougerc.com`.

**Required:** Deploy on Vercel (not GitHub Pages or plain static hosting). Live features use server-side rendering and `/api/*` endpoints.

### Environment variables

| Variable | Required | Default |
|----------|----------|---------|
| `FACEBOOK_GROUP_EVENTS_URL` | No | `https://www.facebook.com/groups/BRRCC/events` |
| `FACEBOOK_GROUP_MEDIA_URL` | No | `https://www.facebook.com/groups/BRRCC/media` |
| `HTTP_PROXY` | No | Optional proxy URL if Facebook blocks Vercel IPs |
| `FIELD_LAT` | No | `30.503459` (Kissner Field latitude) |
| `FIELD_LON` | No | `-91.349838` (Kissner Field longitude) |

### Field weather

Live conditions at Kissner Field (temperature, wind, gusts, humidity, precipitation) come from [Open-Meteo](https://open-meteo.com/) — free, no API key required.

- [`src/lib/fetchFieldWeather.ts`](src/lib/fetchFieldWeather.ts) — fetches and normalizes current weather
- [`src/components/FieldWeather.astro`](src/components/FieldWeather.astro) — full panel on Kissner Field, compact summary on Home
- [`src/pages/api/weather.ts`](src/pages/api/weather.ts) — JSON endpoint with 15-minute cache

Conditions are shown in Central Time. The site notes that field conditions can differ from the reading — check the windsock before flying.

### Facebook events

The Events page pulls upcoming events from the public BRRCC Facebook group using a scraper ([`facebook-event-scraper`](https://github.com/francescov1/facebook-event-scraper)). Meta deprecated the official Groups Events API, so this is a practical workaround.

- [`src/lib/fetchGroupEvents.ts`](src/lib/fetchGroupEvents.ts) — shared scraper logic
- [`src/pages/api/events.ts`](src/pages/api/events.ts) — JSON endpoint with 6-hour cache
- [`vercel.json`](vercel.json) — daily cron job hits `/api/events` to warm the cache (Hobby plan limit)

If scraping fails, the Events page shows a fallback message with a link to the [Facebook group](https://www.facebook.com/groups/BRRCC).

### Facebook media

The Media page (`/media`) and homepage preview pull recent photos and videos from the public BRRCC Facebook group by scraping the group media pages. Meta does not offer a public API for group media, so this follows the same approach as events.

- [`src/lib/fetchGroupMedia.ts`](src/lib/fetchGroupMedia.ts) — scrapes group photo and video tabs
- [`src/pages/api/media.ts`](src/pages/api/media.ts) — JSON endpoint with 6-hour cache (supports `?limit=N`, max 50); cron target
- [`src/pages/api/media/image.ts`](src/pages/api/media/image.ts) — proxies Facebook thumbnails so they display reliably in the browser
- [`vercel.json`](vercel.json) — daily cron job hits `/api/media` to warm the cache (Hobby plan limit)

The homepage preview is server-rendered from Facebook directly. Thumbnails are served through `/api/media/image` because Facebook CDN URLs expire quickly when linked directly.

## Project structure

- `src/pages/` — site pages (Home, Kissner Field, Events, Media, About, Contact)
- `src/lib/` — server-side helpers (weather, Facebook events, Facebook media)
- `src/components/` — shared layout pieces (header, footer, hero, weather, media)
- `src/styles/global.css` — site styles
- `src/pages/api/` — JSON API endpoints (events, media, weather)
- `public/images/` — logo and hero graphics
- `archive/` — original Wix site HTML (reference only)

## Updating content

Page copy lives in the `.astro` files under `src/pages/`. Edit those files and redeploy. Event listings on `/events`, media on `/media`, and weather on Home/Kissner Field update automatically from their data sources.
