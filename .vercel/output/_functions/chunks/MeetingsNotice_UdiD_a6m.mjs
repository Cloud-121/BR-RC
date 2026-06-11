import { c as createComponent } from './astro-component_lHQ3Yt5C.mjs';
import 'piccolore';
import { m as maybeRenderHead, h as addAttribute, k as renderTemplate, o as renderComponent, q as Fragment } from './entrypoint_DxZenSl8.mjs';

const $$MeetingsNotice = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$MeetingsNotice;
  const { compact = false } = Astro2.props;
  const when = "1st Tuesday of each month, 6:30 PM";
  const where = "East Baton Rouge Parish Main Branch Library";
  return renderTemplate`${maybeRenderHead()}<aside${addAttribute(["meetings-notice", { "meetings-notice--compact": compact }], "class:list")}> <h2>Club Meetings</h2> ${compact ? renderTemplate`<p>
We meet every <strong>${when}</strong> at the ${where}. The public is welcome.
</p>` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <p>
We hold club meetings every <strong>first Tuesday of the month</strong> at${" "} <strong>6:30 PM</strong>. The public is welcome — come to a meeting to learn about
          membership.
</p> <ul class="detail-list"> <li><strong>When</strong> ${when}</li> <li><strong>Where</strong> ${where}</li> </ul> ` })}`} <p> <a href="/about">More about the club</a> </p> </aside>`;
}, "/home/cloud/Documents/BR-RC/src/components/MeetingsNotice.astro", void 0);

export { $$MeetingsNotice as $ };
