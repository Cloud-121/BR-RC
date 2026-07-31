# YouTube Graphics — Agent Instructions

This folder contains **standalone YouTube graphics** for the Baton Rouge Radio Control Club (BRRCC). They are **not** part of the website — nothing here should be copied into `public/` or wired into Next.js pages unless the user explicitly asks.

## What exists here

| File | Size | Purpose |
|------|------|---------|
| `youtube-live-starting.jpg` | 1920×1080 | Hold screen before/during a YouTube live meeting stream |
| `youtube-live-ending.jpg` | 1920×1080 | Hold screen after a live stream ends |
| `youtube-channel-banner.jpg` | 2560×1440 | YouTube channel art upload |
| `youtube-thumbnail-meeting-2026-08-04.jpg` | 1280×720 | Thumbnail for the Aug 4, 2026 club meeting |
| `generate.sh` | — | Regenerates all four images |
| `fonts/` | — | Static fonts used by ImageMagick (see Font section) |

Upload these JPEGs to YouTube manually. No deploy step is required.

---

## Quick start (regenerate everything)

**Prerequisites:** ImageMagick 7 (`magick` on PATH).

```bash
cd youtube-assets
./generate.sh
```

Outputs are overwritten in place. Temp files (`.tmp-*.jpg`, `.tmp-*.png`) are deleted automatically.

---

## Design rules (follow these)

These were set by the user after several iterations. **Do not deviate** unless the user asks.

1. **Background:** Always use the homepage hero photo — `public/images/hero-banner.jpg` (aerial Kissner Field + RC plane). Center-crop to fill each target size.
2. **Gradient:** A **left-heavy green overlay** on top of the photo. The right side stays bright so the plane/field remain visible. Match the site hero feel (`styles/globals.css` → `.hero-bg::before`).
3. **Text:** **Top-left only.** No logos, LIVE badges, or extra decorations composited onto the image unless the user explicitly requests them.
4. **Typography:**
   - Headlines → **Bitter Bold** (`fonts/bitter/Bitter-Bold-static.ttf`)
   - Body/details → **Open Sans SemiBold** (`fonts/opensans/OpenSans-SemiBold.ttf`)
5. **Do not touch the website** when working on these assets. Keep changes inside `youtube-assets/`.

---

## Brand reference (from the site)

| Token | Value | Use |
|-------|-------|-----|
| Green | `#1e4d3a` | Gradient overlay color |
| Cream | `#f6f3eb` | Secondary headline text |
| White | `#ffffff` | Primary headline text |
| Rust | `#c45c2a` | Site accent (nav active state) — not currently used on these graphics |

**Meeting info (club default):**
- When: 1st Tuesday of each month, 6:30 PM
- Where: Goodwood Library (`lib/fieldLocation.ts` → `MEETING_LIBRARY_NAME`)
- Homepage headline: "Come Fly With Us"
- Site URL: `batonrougerc.com`

**Source image paths (repo root relative):**
- Hero background: `public/images/hero-banner.jpg`
- Club logo (not composited on current graphics): `public/images/logo.jpg`

---

## How `generate.sh` works

The script has four layers:

```
hero-banner.jpg
  → make_base()        resize/center-crop to target WxH
  → apply_gradient()   green overlay with alpha fade (photo visible on right)
  → draw_top_left()    Bitter/Open Sans text, top-left only
  → output .jpg        quality 92
```

### `make_base(width, height, output)`

Crops `hero-banner.jpg` to fill the canvas:

```bash
magick "$HERO" -resize "${width}x${height}^" -gravity center -extent "${width}x${height}" "$output"
```

### `apply_gradient(width, height, input, output)`

Builds a **green PNG with a real alpha channel**, then composites it over the photo.

**Critical:** Do **not** use an SVG gradient or a solid-color gradient without alpha — those wipe out the photo and produce a flat green/gray background. The working approach is ImageMagick `-fx` on the alpha channel:

```bash
magick -size "${width}x${height}" xc:'#1e4d3a' -alpha set \
  -channel A -fx '
    i/w < 0.35 ? (0.88 - (0.88-0.60)*((i/w)/0.35)) :
    i/w < 0.65 ? (0.60 - (0.60-0.25)*(((i/w)-0.35)/0.30)) :
                 (0.25 - (0.25-0.05)*(((i/w)-0.65)/0.35))
  ' +channel \
  PNG32:"$overlay"

magick "$input" "$overlay" -compose over -composite "$output"
```

This approximates the site CSS gradient stops (0.88 → 0.60 → 0.25 → 0.05 opacity left to right).

### `draw_top_left(input, output, x, lines...)`

Draws text with northwest gravity. Each line is five arguments:

```
font  pointsize  color  y_offset  "text"
```

Example:

```bash
draw_top_left "$grad" "$out" 80 \
  "$FONT_HEAD" 72 "$WHITE" 100 'Meeting Starting Soon' \
  "$FONT_BODY" 36 "$CREAM" 200 'Baton Rouge Radio Control Club'
```

`x` is the left margin; each `y` is pixels from the top.

---

## Per-image text content

### Live starting (`1920×1080`)

```
Meeting Starting Soon                          (Bitter 72, white, y=100)
Baton Rouge Radio Control Club                 (Open Sans 36, cream, y=200)
Tuesday, August 4, 2026 · 6:30 PM              (Open Sans 30, white, y=260)
Goodwood Library                               (Open Sans 30, white, y=310)
```

Left margin: `x=80`

### Live ending (`1920×1080`)

```
Thanks for Joining Us                          (Bitter 72, white, y=100)
Baton Rouge Radio Control Club                 (Open Sans 36, cream, y=200)
Meetings: 1st Tuesday · 6:30 PM · Goodwood Library  (Open Sans 28, y=260)
batonrougerc.com                               (Open Sans 28, y=310)
```

Left margin: `x=80`

### Channel banner (`2560×1440`)

YouTube crops channel art aggressively on mobile/TV. Keep all text inside the **safe zone** (~1546×423 px, vertically centered on a 2560×1440 canvas → roughly y 508–931).

```
Baton Rouge Radio Control Club                 (Bitter 64, white, y=540)
Come Fly With Us                               (Bitter 48, cream, y=630)
AMA chartered · Kissner Field · Port Allen, LA (Open Sans 28, y=710)
```

Left margin: `x=520` (intentionally inset for safe zone)

### Meeting thumbnail (`1280×720`)

Filename includes the date: `youtube-thumbnail-meeting-YYYY-MM-DD.jpg`

```
CLUB MEETING                                   (Bitter 68, white, y=80)
August 4, 2026                                 (Bitter 52, cream, y=170)
6:30 PM · Goodwood Library                     (Open Sans 30, y=250)
```

Left margin: `x=56`

---

## Adding a new meeting thumbnail

1. Copy the `generate_thumbnail()` function in `generate.sh` (or add parameters to it).
2. Change the output filename to include the date: `youtube-thumbnail-meeting-2026-09-01.jpg`.
3. Update the date/time lines. Confirm the date with the user — club meetings are the **1st Tuesday** of each month (e.g. Aug 4, 2026, not Apr 8).
4. Run `./generate.sh`.
5. Verify text is readable at ~320 px wide (YouTube thumbnail preview size).

---

## Fonts

ImageMagick needs **static** TTF files. Variable fonts render broken text.

| File | Role |
|------|------|
| `fonts/bitter/Bitter-Bold-static.ttf` | **Use this.** Instantiated from the variable font at weight 700. |
| `fonts/bitter/Bitter-Bold.ttf` | Variable font — **do not use** with ImageMagick annotate. |
| `fonts/opensans/OpenSans-SemiBold.ttf` | Body text |
| `fonts/opensans/OpenSans-Bold.ttf` | Available if bolder body text is needed |

### Regenerating `Bitter-Bold-static.ttf` (if missing)

Requires Python `fonttools`:

```bash
cd youtube-assets/fonts/bitter
python3 <<'PY'
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
font = TTFont("Bitter-Bold.ttf")
inst = instantiateVariableFont(font, {"wght": 700})
inst.save("Bitter-Bold-static.ttf")
print("saved Bitter-Bold-static.ttf")
PY
```

Open Sans can be copied from the system if needed:

```bash
cp /usr/share/fonts/TTF/OpenSans-SemiBold.ttf fonts/opensans/
```

---

## Common pitfalls

| Problem | Cause | Fix |
|---------|-------|-----|
| Flat green/gray background, no photo | SVG or opaque gradient replaced the image | Use the `-fx` alpha overlay in `apply_gradient()` |
| Thin/wrong/garbled fonts | Variable font (`Bitter-Bold.ttf`) used directly | Use `Bitter-Bold-static.ttf` |
| Text hard to read | Text placed on the bright (right) side of the image | Keep text top-**left** where the gradient is darkest |
| Banner text cropped on YouTube | Text too close to edges | Keep within safe zone (x≈520, y≈540–710 on 2560×1440) |
| Logo clutter | User asked for text only | Do not composite `logo.jpg` unless requested |

---

## Verifying output

After regenerating, check:

```bash
magick identify -format '%f: %wx%h %b\n' youtube-*.jpg
```

Expected dimensions:

```
youtube-channel-banner.jpg: 2560x1440
youtube-live-ending.jpg: 1920x1080
youtube-live-starting.jpg: 1920x1080
youtube-thumbnail-meeting-2026-08-04.jpg: 1280x720
```

Visually confirm:
- Photo visible (especially plane/field on the right)
- Green gradient darkest on the left
- Text readable, top-left only
- No extra badges or composited logos

---

## What not to do

- Do not edit `pages/`, `components/`, `public/`, or `styles/` for YouTube asset work
- Do not commit or deploy these as part of the site unless asked
- Do not use AI image generation for these — they are composited from existing site assets
- Do not use `GenerateImage` or similar for replacements; edit `generate.sh` and re-run

---

## File map

```
youtube-assets/
├── AGENTS.md                          ← this file
├── generate.sh                        ← regeneration script
├── fonts/
│   ├── bitter/
│   │   ├── Bitter-Bold-static.ttf     ← heading font (use this)
│   │   └── Bitter-Bold.ttf            ← variable source (don't annotate with)
│   └── opensans/
│       ├── OpenSans-SemiBold.ttf      ← body font
│       └── OpenSans-Bold.ttf          ← optional
├── youtube-live-starting.jpg
├── youtube-live-ending.jpg
├── youtube-channel-banner.jpg
└── youtube-thumbnail-meeting-2026-08-04.jpg
```
