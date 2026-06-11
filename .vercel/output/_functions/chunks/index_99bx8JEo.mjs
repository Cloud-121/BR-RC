import { c as createComponent } from './astro-component_lHQ3Yt5C.mjs';
import 'piccolore';
import { m as maybeRenderHead, p as renderSlot, h as addAttribute, k as renderTemplate, o as renderComponent } from './entrypoint_DxZenSl8.mjs';
import { $ as $$BaseLayout, a as $$HeroStrip } from './HeroStrip_CNXLU_0c.mjs';
import 'clsx';
import { $ as $$MeetingsNotice } from './MeetingsNotice_UdiD_a6m.mjs';
import { f as fetchFieldWeather, $ as $$FieldWeather } from './fetchFieldWeather_BcNbAhmP.mjs';
import { $ as $$MediaGrid } from './MediaGrid_BFTkBv9V.mjs';
import { a as fetchGroupMedia } from './fetchGroupMedia_BLp_9br5.mjs';

const $$InfoCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$InfoCard;
  const { title, href } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<article class="info-card"> <h3>${title}</h3> <p>${renderSlot($$result, $$slots["default"])}</p> <a${addAttribute(href, "href")} class="btn btn-small">More info</a> </article>`;
}, "/home/cloud/Documents/BR-RC/src/components/InfoCard.astro", void 0);

const $$MediaPreview = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$MediaPreview;
  const FACEBOOK_GROUP_MEDIA_URL = "https://www.facebook.com/groups/BRRCC/media";
  const { media = [], error = null } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="media-preview" aria-labelledby="media-preview-heading"> <div class="media-preview__header"> <h2 id="media-preview-heading">From the Field</h2> <a href="/media">View all media</a> </div> ${error ? renderTemplate`<p class="media-preview__fallback">
Photos and videos are shared in our${" "} <a${addAttribute(FACEBOOK_GROUP_MEDIA_URL, "href")} target="_blank" rel="noopener noreferrer">
Facebook group
</a>
.
</p>` : media.length === 0 ? renderTemplate`<p class="media-preview__fallback">
No recent photos or videos yet. Check our${" "} <a${addAttribute(FACEBOOK_GROUP_MEDIA_URL, "href")} target="_blank" rel="noopener noreferrer">
Facebook group
</a>
.
</p>` : renderTemplate`${renderComponent($$result, "MediaGrid", $$MediaGrid, { "media": media, "showFilters": false })}`} </section>`;
}, "/home/cloud/Documents/BR-RC/src/components/MediaPreview.astro", void 0);

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  let weather = null;
  let weatherError = null;
  let mediaPreview = [];
  let mediaError = null;
  try {
    weather = await fetchFieldWeather();
  } catch (error) {
    weatherError = error instanceof Error ? error.message : "Unable to load current field weather right now.";
  }
  try {
    mediaPreview = await fetchGroupMedia({ limit: 6 });
  } catch (error) {
    mediaError = error instanceof Error ? error.message : "Unable to load recent photos and videos right now.";
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Home" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "HeroStrip", $$HeroStrip, { "subtitle": "AMA chartered club on one of the South's largest dedicated RC flying fields — fixed wing, helicopters, jets, and more." })} ${maybeRenderHead()}<main class="page-main page-main--wide"> ${renderComponent($$result2, "MeetingsNotice", $$MeetingsNotice, { "compact": true })} ${renderComponent($$result2, "FieldWeather", $$FieldWeather, { "weather": weather, "error": weatherError, "compact": true })} <div class="cards-grid"> ${renderComponent($$result2, "InfoCard", $$InfoCard, { "title": "Kissner Field", "href": "/kissner-field" }, { "default": async ($$result3) => renderTemplate`
Situated in West Baton Rouge Parish, Kissner Field is one of the largest dedicated RC
        fields in the South — grass runways, covered shelter, and room for everyone.
` })} ${renderComponent($$result2, "InfoCard", $$InfoCard, { "title": "Events", "href": "/events" }, { "default": async ($$result3) => renderTemplate`
We host competitions and fun flies throughout the year. Check our Facebook group for
        upcoming dates and details.
` })} ${renderComponent($$result2, "InfoCard", $$InfoCard, { "title": "Join the Club", "href": "/about" }, { "default": async ($$result3) => renderTemplate`
Meetings are the 1st Tuesday of each month at 6:30 PM. The public is welcome — come to a
        meeting to learn about membership.
` })} </div> ${renderComponent($$result2, "MediaPreview", $$MediaPreview, { "media": mediaPreview, "error": mediaError })} <div class="facebook-cta"> <p>
Fly days, weather updates, and event announcements —
<a href="https://www.facebook.com/groups/BRRCC" target="_blank" rel="noopener noreferrer">join the BRRCC Facebook group</a>.
</p> </div> </main> ` })}`;
}, "/home/cloud/Documents/BR-RC/src/pages/index.astro", void 0);

const $$file = "/home/cloud/Documents/BR-RC/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
