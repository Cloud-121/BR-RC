# Baton Rouge RC Club Website

Website for the Baton Rouge Radio Control Club (BRRCC), built with [Next.js](https://nextjs.org) and deployed on [Vercel](https://vercel.com).

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to preview the site locally.

The Home, Kissner Field, Events, Meetings, and Media pages are server-rendered and fetch live data when you run dev or deploy to Vercel.

## Build

```bash
npm run build
npm start
```

Most pages are static. Home, Kissner Field, Events, Meetings, and Media are rendered on demand via `getServerSideProps`.

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the project in the [Vercel dashboard](https://vercel.com/new).
3. Vercel auto-detects Next.js — build command `npm run build`.
4. Optionally connect the custom domain `batonrougerc.com`.

**Required:** Deploy on Vercel (not GitHub Pages or plain static hosting). Live features use server-side rendering and `/api/*` endpoints.

### Environment variables

| Variable | Required | Default |
|----------|----------|---------|
| `FACEBOOK_GROUP_EVENTS_URL` | No | `https://www.facebook.com/groups/BRRCC/events` |
| `FACEBOOK_GROUP_MEDIA_URL` | No | `https://www.facebook.com/groups/BRRCC/media` |
| `HTTP_PROXY` | No | Optional proxy URL if Facebook blocks Vercel IPs |
| `YOUTUBE_CHANNEL_HANDLE` | No | `BatonRougeRC` (YouTube handle for meeting stream links) |
| `FIELD_LAT` | No | `30.503459` (Kissner Field latitude) |
| `FIELD_LON` | No | `-91.349838` (Kissner Field longitude) |

### Field weather

Live conditions at Kissner Field (temperature, wind, gusts, humidity, precipitation) come from [Open-Meteo](https://open-meteo.com/) — free, no API key required.

- [`lib/fetchFieldWeather.ts`](lib/fetchFieldWeather.ts) — fetches and normalizes current weather
- [`components/FieldWeather.tsx`](components/FieldWeather.tsx) — full panel on Kissner Field, compact summary on Home
- [`pages/api/weather.ts`](pages/api/weather.ts) — JSON endpoint with 15-minute cache

Conditions are shown in Central Time. The site notes that field conditions can differ from the reading — check the windsock before flying.

### Facebook events

The Events page pulls upcoming events from the public BRRCC Facebook group using a scraper ([`facebook-event-scraper`](https://github.com/francescov1/facebook-event-scraper)). Meta deprecated the official Groups Events API, so this is a practical workaround.

- [`lib/fetchGroupEvents.ts`](lib/fetchGroupEvents.ts) — shared scraper logic
- [`pages/api/events.ts`](pages/api/events.ts) — JSON endpoint with 6-hour cache
- [`vercel.json`](vercel.json) — daily cron job hits `/api/events` to warm the cache (Hobby plan limit)

If scraping fails, the Events page shows a fallback message with a link to the [Facebook group](https://www.facebook.com/groups/BRRCC).

### Facebook media

The Media page (`/media`) and homepage preview pull recent photos and videos from the public BRRCC Facebook group by scraping the group media pages. Meta does not offer a public API for group media, so this follows the same approach as events.

- [`lib/fetchGroupMedia.ts`](lib/fetchGroupMedia.ts) — scrapes group photo and video tabs
- [`pages/api/media.ts`](pages/api/media.ts) — JSON endpoint with 6-hour cache (supports `?limit=N`, max 50); cron target
- [`pages/api/media/image.ts`](pages/api/media/image.ts) — proxies Facebook thumbnails so they display reliably in the browser
- [`vercel.json`](vercel.json) — daily cron job hits `/api/media` to warm the cache (Hobby plan limit)

The homepage preview is server-rendered from Facebook directly. Thumbnails are served through `/api/media/image` because Facebook CDN URLs expire quickly when linked directly.

### YouTube meeting streams

The Meetings page (`/meetings`, member-gated) lists streams from [`data/youtube-streams.json`](data/youtube-streams.json). Entries are classified by `date` (upcoming vs past), sorted by age, and linked by YouTube video `id` — works for unlisted videos.

```json
{
  "channelUrl": "https://www.youtube.com/@BatonRougeRC",
  "streams": [
    {
      "id": "VIDEO_ID",
      "title": "Club Meeting — August 4, 2026",
      "date": "2026-08-04T18:30:00-05:00"
    }
  ]
}
```

Optional `status`: `"live"`, `"upcoming"`, or `"completed"` to override date-based classification. Optional `thumbnailUrl` overrides the default YouTube thumbnail.

- [`lib/fetchYouTubeStreams.ts`](lib/fetchYouTubeStreams.ts) — reads and sorts the JSON file
- [`pages/api/youtube.ts`](pages/api/youtube.ts) — JSON endpoint for the same data

Add a new meeting by appending an entry and redeploying.

## Project structure

- `data/` — editable content such as YouTube meeting streams JSON
- `pages/` — site pages (Home, Kissner Field, Events, Meetings, Media, About, Contact) and API routes
- `lib/` — server-side helpers (weather, Facebook events, Facebook media, YouTube streams)
- `components/` — shared layout pieces (header, footer, hero, weather, media)
- `styles/globals.css` — Tailwind base styles and theme
- `public/images/` — logo and hero graphics
- `archive/` — original Wix site HTML (reference only)

## Updating content

Page copy lives in the `.tsx` files under `pages/`. Meeting stream links live in [`data/youtube-streams.json`](data/youtube-streams.json). Event listings on `/events`, media on `/media`, and weather on Home/Kissner Field update automatically from their data sources.

## Security notes

`npm audit fix` resolves what it can without breaking changes. As of the last review:

| Package | Severity | Status |
|---------|----------|--------|
| `form-data` (via `facebook-event-scraper`) | high | Fixed by `npm audit fix` |
| `postcss` (bundled inside `next`) | moderate | No safe fix yet — requires a future Next.js release; do not run `npm audit fix --force` (it downgrades Next.js) |

Re-run `npm audit` after dependency updates. To debug Facebook events scraping locally: `npx tsx scripts/debug-events.ts`.

## Future improvements

**Image optimization (`next/image`):** Not migrated yet. The logo (`Header.tsx`) is a good candidate for `next/image`. Media thumbnails (`MediaCard.tsx`) load through `/api/media/image` — decide whether to use `next/image` with `unoptimized` for proxied images or keep plain `<img>` tags to avoid Vercel image optimization quota usage.
