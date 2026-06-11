import { c as createComponent } from './astro-component_LPgCNcwW.mjs';
import 'piccolore';
import { v as createRenderInstruction, m as maybeRenderHead, h as addAttribute, k as renderTemplate, o as renderComponent } from './entrypoint_DPvAqX-D.mjs';
import 'clsx';
import { g as getMediaThumbnailUrl } from './fetchGroupMedia_BLp_9br5.mjs';

async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}</script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"></script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}

const $$MediaCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$MediaCard;
  const { item } = Astro2.props;
  const label = item.caption ?? (item.type === "video" ? "Video from BRRCC Facebook group" : "Photo from BRRCC Facebook group");
  const thumbnailUrl = getMediaThumbnailUrl(item.id, item.type);
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(item.postUrl, "href")} class="media-card" target="_blank" rel="noopener noreferrer"${addAttribute(item.type, "data-type")}> <img${addAttribute(thumbnailUrl, "src")}${addAttribute(label, "alt")} loading="lazy" width="280" height="280"> ${item.type === "video" && renderTemplate`<span class="media-card__play" aria-hidden="true"> <svg viewBox="0 0 24 24" fill="currentColor"> <path d="M8 5v14l11-7z"></path> </svg> </span>`} </a>`;
}, "/home/cloud/Documents/BR-RC/src/components/MediaCard.astro", void 0);

const $$MediaGrid = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$MediaGrid;
  const { media, showFilters = true } = Astro2.props;
  const hasPhotos = media.some((item) => item.type === "photo");
  const hasVideos = media.some((item) => item.type === "video");
  return renderTemplate`${showFilters && hasPhotos && hasVideos && renderTemplate`${maybeRenderHead()}<div class="media-filters" role="tablist" aria-label="Filter media"><button type="button" class="media-filter is-active" data-filter="all" role="tab" aria-selected="true">
All
</button><button type="button" class="media-filter" data-filter="photo" role="tab" aria-selected="false">
Photos
</button><button type="button" class="media-filter" data-filter="video" role="tab" aria-selected="false">
Videos
</button></div>`}<div class="media-grid" data-media-grid> ${media.map((item) => renderTemplate`${renderComponent($$result, "MediaCard", $$MediaCard, { "item": item })}`)} </div> ${showFilters && hasPhotos && hasVideos && renderTemplate`${renderScript($$result, "/home/cloud/Documents/BR-RC/src/components/MediaGrid.astro?astro&type=script&index=0&lang.ts")}`}`;
}, "/home/cloud/Documents/BR-RC/src/components/MediaGrid.astro", void 0);

export { $$MediaGrid as $ };
