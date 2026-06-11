import { c as createComponent } from './astro-component_lHQ3Yt5C.mjs';
import 'piccolore';
import { o as renderComponent, k as renderTemplate, m as maybeRenderHead, h as addAttribute } from './entrypoint_DxZenSl8.mjs';
import { $ as $$BaseLayout, a as $$HeroStrip } from './HeroStrip_CNXLU_0c.mjs';
import { f as fetchFieldWeather, F as FIELD_GOOGLE_MAPS_URL, $ as $$FieldWeather } from './fetchFieldWeather_BcNbAhmP.mjs';

const prerender = false;
const $$KissnerField = createComponent(async ($$result, $$props, $$slots) => {
  let weather = null;
  let weatherError = null;
  try {
    weather = await fetchFieldWeather();
  } catch (error) {
    weatherError = error instanceof Error ? error.message : "Unable to load current field weather right now.";
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Kissner Field", "description": "Kissner Field — home of the Baton Rouge RC Club in Port Allen, Louisiana. Grass runway, covered shelter, and AMA chartered flying site." }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "HeroStrip", $$HeroStrip, { "headline": "Kissner Field", "showButton": false, "compact": true })} ${maybeRenderHead()}<main class="page-main"> <div class="content-panel"> <section class="content-section"> <h2>About the Field</h2> <p>
Situated in West Baton Rouge Parish, Kissner Field is one of the largest dedicated RC
          fields in the South. The club has operated here for nearly 40 years on a private airstrip
          leased from the Kissner family, west of Baton Rouge near Erwinville.
</p> <p>
Members maintain the property and keep it in top condition for flying year-round. Spectators
          and guest pilots are welcome — AMA membership is required to fly.
</p> </section> <section class="content-section"> <h2>Location &amp; Hours</h2> <ul class="detail-list"> <li> <strong>Address</strong>
8940 Ronald Reagan Highway, Port Allen, LA 70767
</li> <li> <strong>Directions</strong> <a${addAttribute(FIELD_GOOGLE_MAPS_URL, "href")} target="_blank" rel="noopener noreferrer">View on Google Maps</a> </li> <li> <strong>Field hours</strong>
30 minutes after sunrise until 30 minutes before sunset as recognized by the LA Dept. of
            Wildlife &amp; Fisheries, plus one hour during Daylight Saving Time.
</li> <li><strong>Runway</strong> 700' grass runway</li> <li><strong>Altitude limit</strong> 400 feet</li> </ul> </section> ${renderComponent($$result2, "FieldWeather", $$FieldWeather, { "weather": weather, "error": weatherError })} <section class="content-section"> <h2>Field Amenities</h2> <p>The field includes:</p> <ul> <li>Grass runways and pit area</li> <li>Covered shelter with electricity</li> <li>Battery chargers, setup tables, and workbenches</li> <li>Startup stands and windsock poles</li> <li>Safety fences and fire extinguisher</li> <li>First aid kit, porta-pots, gated entrance</li> <li>Park flyer area, night flying permitted</li> <li>Handicap accessible — spectators welcome</li> </ul> </section> <section class="content-section"> <h2>Activities Permitted</h2> <p>
Fixed wing, helicopters, jets, electric, fuel/gas, giant scale, park flyers, pattern,
          soaring, 3-D, ducted fan, and more.
</p> </section> </div> </main> ` })}`;
}, "/home/cloud/Documents/BR-RC/src/pages/kissner-field.astro", void 0);

const $$file = "/home/cloud/Documents/BR-RC/src/pages/kissner-field.astro";
const $$url = "/kissner-field";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$KissnerField,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
