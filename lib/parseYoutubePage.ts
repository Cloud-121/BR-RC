/** Extract a top-level JSON object assigned to a variable in YouTube page HTML. */
export function extractJsonAssignment(html: string, variableName: string): unknown | null {
  const markers = [`var ${variableName} = `, `${variableName} = `];
  let start = -1;
  let markerLength = 0;

  for (const marker of markers) {
    const idx = html.indexOf(marker);
    if (idx >= 0) {
      start = idx;
      markerLength = marker.length;
      break;
    }
  }

  if (start < 0) return null;

  const jsonStart = start + markerLength;
  const firstChar = html[jsonStart];
  if (firstChar !== '{' && firstChar !== '[') return null;

  const endChar = firstChar === '{' ? '}' : ']';
  let depth = 0;
  let inStr = false;
  let esc = false;

  for (let i = jsonStart; i < html.length; i++) {
    const c = html[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === '"') inStr = false;
    } else {
      if (c === '"') inStr = true;
      else if (c === firstChar) depth++;
      else if (c === endChar) {
        depth--;
        if (depth === 0) {
          return JSON.parse(html.slice(jsonStart, i + 1));
        }
      }
    }
  }

  return null;
}

export function videoIdFromThumbnailUrl(url: string): string | null {
  const match = url.match(/\/vi\/([a-zA-Z0-9_-]{11})/);
  return match?.[1] ?? null;
}

export function isDurationBadge(text: string): boolean {
  return /^\d+:\d{2}(:\d{2})?$/.test(text);
}
