import { a as fetchGroupMedia, F as FacebookMediaError } from './fetchGroupMedia_BLp_9br5.mjs';

const prerender = false;
const MAX_LIMIT = 50;
function parseLimit(value) {
  if (!value) return void 0;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return void 0;
  return Math.min(parsed, MAX_LIMIT);
}
const GET = async ({ url }) => {
  try {
    const limit = parseLimit(url.searchParams.get("limit"));
    const media = await fetchGroupMedia(limit ? { limit } : void 0);
    return new Response(
      JSON.stringify({
        media,
        fetchedAt: (/* @__PURE__ */ new Date()).toISOString()
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "s-maxage=21600, stale-while-revalidate=86400"
        }
      }
    );
  } catch (error) {
    const message = error instanceof FacebookMediaError ? error.message : "Unable to load media from Facebook.";
    return new Response(
      JSON.stringify({
        media: [],
        fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
        error: message
      }),
      {
        status: 502,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "s-maxage=300, stale-while-revalidate=600"
        }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
