import { c as createComponent } from './astro-component_LPgCNcwW.mjs';
import 'piccolore';
import { o as renderComponent, k as renderTemplate, m as maybeRenderHead, h as addAttribute } from './entrypoint_DPvAqX-D.mjs';
import { $ as $$BaseLayout, a as $$HeroStrip } from './HeroStrip_WuSwtO3z.mjs';
import { $ as $$MediaGrid } from './MediaGrid_e7UOnJ5T.mjs';
import { a as fetchGroupMedia } from './fetchGroupMedia_BLp_9br5.mjs';

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const FACEBOOK_GROUP_MEDIA_URL = "https://www.facebook.com/groups/BRRCC/media";
  const FACEBOOK_GROUP_URL = "https://www.facebook.com/groups/BRRCC";
  let media = [];
  let loadError = null;
  try {
    media = await fetchGroupMedia();
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Unable to load media from Facebook right now.";
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Media", "description": "Photos and videos from the Baton Rouge RC Club — fly days, events, and life at Kissner Field." }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "HeroStrip", $$HeroStrip, { "headline": "Media", "showButton": false, "compact": true })} ${maybeRenderHead()}<main class="page-main"> <div class="content-panel"> <p>
Recent photos and videos shared by club members in our Facebook group — fly days at Kissner
        Field, events, and more.
</p> </div> ${loadError ? renderTemplate`<div class="content-panel events-status events-status--error"> <p>${loadError}</p> <p> <a${addAttribute(FACEBOOK_GROUP_MEDIA_URL, "href")} target="_blank" rel="noopener noreferrer">
View media on Facebook
</a> </p> </div>` : media.length === 0 ? renderTemplate`<div class="content-panel events-status"> <p>No photos or videos posted yet.</p> <p> <a${addAttribute(FACEBOOK_GROUP_MEDIA_URL, "href")} target="_blank" rel="noopener noreferrer">
Check the BRRCC Facebook group
</a>${" "}
for the latest media.
</p> </div>` : renderTemplate`${renderComponent($$result2, "MediaGrid", $$MediaGrid, { "media": media })}`} ${!loadError && media.length > 0 && renderTemplate`<div class="facebook-cta"> <p>
More photos and videos on${" "} <a${addAttribute(FACEBOOK_GROUP_URL, "href")} target="_blank" rel="noopener noreferrer">
our Facebook group
</a>
.
</p> </div>`} </main> ` })}`;
}, "/home/cloud/Documents/BR-RC/src/pages/media/index.astro", void 0);

const $$file = "/home/cloud/Documents/BR-RC/src/pages/media/index.astro";
const $$url = "/media";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
