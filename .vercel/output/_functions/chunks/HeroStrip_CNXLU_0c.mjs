import { c as createComponent } from './astro-component_lHQ3Yt5C.mjs';
import 'piccolore';
import { m as maybeRenderHead, h as addAttribute, k as renderTemplate, w as defineScriptVars, o as renderComponent, p as renderSlot, x as renderHead } from './entrypoint_DxZenSl8.mjs';
import 'clsx';

const $$Header = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Header;
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/kissner-field", label: "Kissner Field" },
    { href: "/events", label: "Events" },
    { href: "/media", label: "Media" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" }
  ];
  const currentPath = Astro2.url.pathname.replace(/\/$/, "") || "/";
  function isActive(href) {
    if (href === "/") return currentPath === "/";
    return currentPath === href || currentPath.startsWith(`${href}/`);
  }
  return renderTemplate`${maybeRenderHead()}<header class="site-header"> <p class="header-top">AMA Chartered · Meetings 1st Tuesday, 6:30 PM · Kissner Field, Port Allen</p> <div class="header-inner"> <a href="/" class="brand"> <img src="/images/logo.jpg" alt="Baton Rouge RC Club logo" width="120" height="56"> <span class="brand-title">Baton Rouge Radio Control Club</span> </a> <nav class="site-nav" aria-label="Main"> <input type="checkbox" id="nav-toggle" class="nav-toggle"> <label for="nav-toggle" class="nav-toggle-label">Menu</label> <ul> ${navItems.map(({ href, label }) => renderTemplate`<li> <a${addAttribute(href, "href")}${addAttribute(isActive(href) ? "page" : void 0, "aria-current")}> ${label} </a> </li>`)} </ul> </nav> </div> </header>`;
}, "/home/cloud/Documents/BR-RC/src/components/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate`${maybeRenderHead()}<footer class="site-footer"> <div class="footer-inner"> <div> <p class="footer-club">Baton Rouge Radio Control Club</p> <p class="footer-meta">&copy; ${year} · Flying at Kissner Field since the 1980s</p> </div> <a href="https://www.facebook.com/groups/BRRCC" class="social-link" target="_blank" rel="noopener noreferrer"> <svg viewBox="0 0 24 24" aria-hidden="true"> <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path> </svg>
Facebook Group
</a> </div> </footer>`;
}, "/home/cloud/Documents/BR-RC/src/components/Footer.astro", void 0);

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$ParkedGate = createComponent(($$result, $$props, $$slots) => {
  const REDIRECT_MS = 8e3;
  const FACEBOOK_URL = "https://www.facebook.com/groups/BRRCC";
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", '<div class="parked-gate" id="parked-gate" data-astro-cid-zwbqjuuf> <div class="parked-gate__content" data-astro-cid-zwbqjuuf> <p class="parked-gate__text" id="parked-text" data-astro-cid-zwbqjuuf>parked</p> <p class="parked-gate__redirect" id="parked-redirect" data-astro-cid-zwbqjuuf>redirecting…</p> <div class="parked-gate__runway" data-astro-cid-zwbqjuuf> <div class="parked-gate__runway-field" aria-hidden="true" data-astro-cid-zwbqjuuf> <div class="parked-gate__runway-strip" data-astro-cid-zwbqjuuf> <div class="parked-gate__runway-threshold" data-astro-cid-zwbqjuuf> <span data-astro-cid-zwbqjuuf></span> <span data-astro-cid-zwbqjuuf></span> <span data-astro-cid-zwbqjuuf></span> <span data-astro-cid-zwbqjuuf></span> <span data-astro-cid-zwbqjuuf></span> <span data-astro-cid-zwbqjuuf></span> </div> <div class="parked-gate__runway-centerline" data-astro-cid-zwbqjuuf></div> <div class="parked-gate__runway-numbers" data-astro-cid-zwbqjuuf>27</div> </div> </div> <img class="parked-gate__plane parked-gate__plane--takeoff" id="parked-plane" src="/images/rc-plane.svg" alt="" width="320" height="120" loading="eager" decoding="async" data-astro-cid-zwbqjuuf> </div> </div> </div> <script>(function(){', "\n  const STORAGE_KEY = 'brrc-unlocked';\n  const CLICKS_NEEDED = 10;\n\n  const gate = document.getElementById('parked-gate');\n  const text = document.getElementById('parked-text');\n  const plane = document.getElementById('parked-plane');\n\n  if (gate && text && sessionStorage.getItem(STORAGE_KEY) !== 'true') {\n    let clicks = 0;\n    let unlocked = false;\n    let redirectTimer;\n\n    function cancelRedirect() {\n      window.clearTimeout(redirectTimer);\n      plane?.classList.remove('parked-gate__plane--takeoff');\n    }\n\n    function unlock() {\n      unlocked = true;\n      cancelRedirect();\n      sessionStorage.setItem(STORAGE_KEY, 'true');\n      document.documentElement.removeAttribute('data-parked');\n      gate.hidden = true;\n    }\n\n    text.addEventListener('click', () => {\n      clicks += 1;\n      if (clicks >= CLICKS_NEEDED) {\n        unlock();\n      }\n    });\n\n    redirectTimer = window.setTimeout(() => {\n      if (!unlocked) {\n        window.location.href = FACEBOOK_URL;\n      }\n    }, REDIRECT_MS);\n  } else if (gate) {\n    gate.hidden = true;\n  }\n})();<\/script>"])), maybeRenderHead(), defineScriptVars({ REDIRECT_MS, FACEBOOK_URL }));
}, "/home/cloud/Documents/BR-RC/src/components/ParkedGate.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title, description = "Baton Rouge Radio Control Club — AMA chartered club flying at Kissner Field in Port Allen, Louisiana." } = Astro2.props;
  const fullTitle = title === "Home" ? "Baton Rouge Radio Control Club" : `${title} | Baton Rouge RC Club`;
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description"', '><link rel="icon" type="image/jpeg" href="/images/logo.jpg"><title>', "</title><script>\n      if (sessionStorage.getItem('brrc-unlocked') !== 'true') {\n        document.documentElement.dataset.parked = 'true';\n      }\n    <\/script><style>\n      html[data-parked] .page-layout {\n        visibility: hidden;\n      }\n      html:not([data-parked]) .parked-gate {\n        display: none;\n      }\n    </style>", "</head> <body> ", ' <div class="page-layout"> ', " ", " ", " </div> </body></html>"])), addAttribute(description, "content"), fullTitle, renderHead(), renderComponent($$result, "ParkedGate", $$ParkedGate, {}), renderComponent($$result, "Header", $$Header, {}), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer", $$Footer, {}));
}, "/home/cloud/Documents/BR-RC/src/layouts/BaseLayout.astro", void 0);

const $$HeroStrip = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$HeroStrip;
  const {
    headline = "Come Fly With Us",
    subtitle,
    showButton = true,
    buttonHref = "/about",
    buttonText = "Learn About the Club",
    compact = false
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section${addAttribute(["hero", { "hero--compact": compact }], "class:list")}> <div class="hero-inner"> <h1>${headline}</h1> ${subtitle && renderTemplate`<p class="hero-subtitle">${subtitle}</p>`} ${showButton && renderTemplate`<a${addAttribute(buttonHref, "href")} class="btn btn-outline"> ${buttonText} </a>`} </div> </section>`;
}, "/home/cloud/Documents/BR-RC/src/components/HeroStrip.astro", void 0);

export { $$BaseLayout as $, $$HeroStrip as a };
