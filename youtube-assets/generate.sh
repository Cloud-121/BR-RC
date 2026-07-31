#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$(cd "$(dirname "$0")" && pwd)"
HERO="$ROOT/public/images/hero-banner.jpg"
FONT_HEAD="$OUT_DIR/fonts/bitter/Bitter-Bold-static.ttf"
FONT_BODY="$OUT_DIR/fonts/opensans/OpenSans-SemiBold.ttf"

CREAM="#f6f3eb"
WHITE="#ffffff"

make_base() {
  local width="$1" height="$2" output="$3"
  magick "$HERO" \
    -resize "${width}x${height}^" \
    -gravity center \
    -extent "${width}x${height}" \
    "$output"
}

# Site hero overlay: linear-gradient(105deg, green 0.88 → 0.05) over the photo
apply_gradient() {
  local width="$1" height="$2" input="$3" output="$4"
  local overlay="$OUT_DIR/.tmp-overlay.png"

  # Left-heavy green fade matching site hero; photo stays clear on the right
  magick -size "${width}x${height}" xc:'#1e4d3a' -alpha set \
    -channel A -fx '
      i/w < 0.35 ? (0.88 - (0.88-0.60)*((i/w)/0.35)) :
      i/w < 0.65 ? (0.60 - (0.60-0.25)*(((i/w)-0.35)/0.30)) :
                   (0.25 - (0.25-0.05)*(((i/w)-0.65)/0.35))
    ' +channel \
    PNG32:"$overlay"

  magick "$input" "$overlay" -compose over -composite "$output"
}

# Top-left text only
draw_top_left() {
  local input="$1" output="$2" x="$3"
  shift 3
  local -a args=(-gravity northwest)

  while [[ $# -gt 0 ]]; do
    local font="$1" size="$2" color="$3" y="$4" text="$5"
    shift 5
    args+=(-font "$font" -pointsize "$size" -fill "$color" -annotate "+${x}+${y}" "$text")
  done

  magick "$input" "${args[@]}" -quality 92 "$output"
}

generate_starting() {
  local w=1920 h=1080
  local base="$OUT_DIR/.tmp-base.jpg" grad="$OUT_DIR/.tmp-grad.jpg"
  local out="$OUT_DIR/youtube-live-starting.jpg"

  make_base "$w" "$h" "$base"
  apply_gradient "$w" "$h" "$base" "$grad"
  draw_top_left "$grad" "$out" 80 \
    "$FONT_HEAD" 72 "$WHITE" 100 'Meeting Starting Soon' \
    "$FONT_BODY" 36 "$CREAM" 200 'Baton Rouge Radio Control Club' \
    "$FONT_BODY" 30 'rgba(255,255,255,0.95)' 260 'Tuesday, August 4, 2026 · 6:30 PM' \
    "$FONT_BODY" 30 'rgba(255,255,255,0.95)' 310 'Goodwood Library'
  echo "Created $out"
}

generate_ending() {
  local w=1920 h=1080
  local base="$OUT_DIR/.tmp-base.jpg" grad="$OUT_DIR/.tmp-grad.jpg"
  local out="$OUT_DIR/youtube-live-ending.jpg"

  make_base "$w" "$h" "$base"
  apply_gradient "$w" "$h" "$base" "$grad"
  draw_top_left "$grad" "$out" 80 \
    "$FONT_HEAD" 72 "$WHITE" 100 'Thanks for Joining Us' \
    "$FONT_BODY" 36 "$CREAM" 200 'Baton Rouge Radio Control Club' \
    "$FONT_BODY" 28 'rgba(255,255,255,0.95)' 260 'Meetings: 1st Tuesday · 6:30 PM · Goodwood Library' \
    "$FONT_BODY" 28 'rgba(255,255,255,0.90)' 310 'batonrougerc.com'
  echo "Created $out"
}

generate_banner() {
  local w=2560 h=1440
  local base="$OUT_DIR/.tmp-base.jpg" grad="$OUT_DIR/.tmp-grad.jpg"
  local out="$OUT_DIR/youtube-channel-banner.jpg"

  make_base "$w" "$h" "$base"
  apply_gradient "$w" "$h" "$base" "$grad"
  # Text inside YouTube safe zone (vertically ~508–931)
  draw_top_left "$grad" "$out" 520 \
    "$FONT_HEAD" 64 "$WHITE" 540 'Baton Rouge Radio Control Club' \
    "$FONT_HEAD" 48 "$CREAM" 630 'Come Fly With Us' \
    "$FONT_BODY" 28 'rgba(255,255,255,0.95)' 710 'AMA chartered · Kissner Field · Port Allen, LA'
  echo "Created $out"
}

generate_thumbnail() {
  local w=1280 h=720
  local base="$OUT_DIR/.tmp-base.jpg" grad="$OUT_DIR/.tmp-grad.jpg"
  local out="$OUT_DIR/youtube-thumbnail-meeting-2026-08-04.jpg"

  make_base "$w" "$h" "$base"
  apply_gradient "$w" "$h" "$base" "$grad"
  draw_top_left "$grad" "$out" 56 \
    "$FONT_HEAD" 68 "$WHITE" 80 'CLUB MEETING' \
    "$FONT_HEAD" 52 "$CREAM" 170 'August 4, 2026' \
    "$FONT_BODY" 30 'rgba(255,255,255,0.95)' 250 '6:30 PM · Goodwood Library'
  echo "Created $out"
}

generate_starting
generate_ending
generate_banner
generate_thumbnail

rm -f "$OUT_DIR"/.tmp-*.jpg "$OUT_DIR"/.tmp-*.png "$OUT_DIR"/.tmp-*.svg
echo "Done. Assets written to $OUT_DIR"
