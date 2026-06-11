import { c as createComponent } from './astro-component_LPgCNcwW.mjs';
import 'piccolore';
import { m as maybeRenderHead, h as addAttribute, k as renderTemplate, o as renderComponent } from './entrypoint_DPvAqX-D.mjs';
import { $ as $$BaseLayout, a as $$HeroStrip } from './HeroStrip_WuSwtO3z.mjs';
import 'clsx';
import { $ as $$MeetingsNotice } from './MeetingsNotice_DA3yv-Yj.mjs';
import { scrapeFbEventList, EventType } from 'facebook-event-scraper';

const $$EventCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$EventCard;
  const { event } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<article class="event-card"> <h3> <a${addAttribute(event.url, "href")} target="_blank" rel="noopener noreferrer">${event.title}</a> </h3> <p class="event-date">${event.startTime}</p> ${event.location && renderTemplate`<p>${event.location}</p>`} ${event.description && renderTemplate`<p>${event.description}</p>`} <a${addAttribute(event.url, "href")} class="btn btn-small" target="_blank" rel="noopener noreferrer">View on Facebook</a> </article>`;
}, "/home/cloud/Documents/BR-RC/src/components/EventCard.astro", void 0);

class FacebookEventsError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "FacebookEventsError";
  }
}
const DEFAULT_GROUP_EVENTS_URL = "https://www.facebook.com/groups/BRRCC/events";
function getScrapeOptions() {
  const proxyUrl = process.env.HTTP_PROXY;
  if (!proxyUrl) return void 0;
  try {
    const parsed = new URL(proxyUrl);
    return {
      proxy: {
        host: parsed.hostname,
        port: Number(parsed.port) || (parsed.protocol === "https:" ? 443 : 80),
        protocol: parsed.protocol.replace(":", ""),
        auth: parsed.username && parsed.password ? { username: parsed.username, password: parsed.password } : void 0
      }
    };
  } catch {
    return void 0;
  }
}
function getGroupEventsUrl() {
  return process.env.FACEBOOK_GROUP_EVENTS_URL ?? DEFAULT_GROUP_EVENTS_URL;
}
function normalizeEvent(event) {
  if (event.isCanceled || event.isPast) return null;
  return {
    id: event.id,
    title: event.name,
    startTime: event.date,
    url: event.url
  };
}
async function fetchGroupEvents() {
  const url = getGroupEventsUrl();
  try {
    const rawEvents = await scrapeFbEventList(url, EventType.Upcoming, getScrapeOptions());
    return rawEvents.map(normalizeEvent).filter((event) => event !== null);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error while fetching Facebook events";
    throw new FacebookEventsError(`Failed to load events from Facebook: ${message}`, {
      cause: error
    });
  }
}

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const FACEBOOK_GROUP_URL = "https://www.facebook.com/groups/BRRCC";
  let events = [];
  let loadError = null;
  try {
    events = await fetchGroupEvents();
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Unable to load events from Facebook right now.";
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Events", "description": "Upcoming events at Baton Rouge RC Club — fly-ins and competitions at Kissner Field." }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "HeroStrip", $$HeroStrip, { "headline": "Events", "showButton": false, "compact": true })} ${maybeRenderHead()}<main class="page-main"> <div class="content-panel"> <p>
The club hosts competitions, fun flies, and informal gatherings throughout the year at
        Kissner Field. Upcoming events from our Facebook group are listed below.
</p> </div> ${renderComponent($$result2, "MeetingsNotice", $$MeetingsNotice, { "compact": true })} ${loadError ? renderTemplate`<div class="content-panel events-status events-status--error"> <p>${loadError}</p> <p> <a${addAttribute(FACEBOOK_GROUP_URL, "href")} target="_blank" rel="noopener noreferrer">
View events on Facebook
</a> </p> </div>` : events.length === 0 ? renderTemplate`<div class="content-panel events-status"> <p>No upcoming events posted yet.</p> <p> <a${addAttribute(FACEBOOK_GROUP_URL, "href")} target="_blank" rel="noopener noreferrer">
Check the BRRCC Facebook group
</a>${" "}
for the latest announcements.
</p> </div>` : events.map((event) => renderTemplate`${renderComponent($$result2, "EventCard", $$EventCard, { "event": event })}`)} ${!loadError && events.length > 0 && renderTemplate`<div class="facebook-cta"> <p>
More details and additional announcements on${" "} <a${addAttribute(FACEBOOK_GROUP_URL, "href")} target="_blank" rel="noopener noreferrer">
our Facebook group
</a>
.
</p> </div>`} </main> ` })}`;
}, "/home/cloud/Documents/BR-RC/src/pages/events/index.astro", void 0);

const $$file = "/home/cloud/Documents/BR-RC/src/pages/events/index.astro";
const $$url = "/events";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
