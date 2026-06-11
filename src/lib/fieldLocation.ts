export const FIELD_LAT = 30.503459;
export const FIELD_LON = -91.349838;
export const FIELD_NAME = 'Kissner Field';
export const FIELD_TIMEZONE = 'America/Chicago';
export const FIELD_GOOGLE_MAPS_URL =
  'https://www.google.com/maps/place/BRRC+Club+Runway+at+Kissner+Field/@30.503459,-91.3524129,620m/data=!3m1!1e3!4m12!1m5!3m4!2zMzDCsDMwJzEyLjUiTiA5McKwMjAnNTkuNCJX!8m2!3d30.503459!4d-91.349838!3m5!1s0x8624181383fe48c3:0xaf280e4c173f1a43!8m2!3d30.5040508!4d-91.3496256!16s%2Fg%2F11cjy2ny82?entry=ttu&g_ep=EgoyMDI2MDYwMS4wIKXMDSoASAFQAw%3D%3D';

function parseCoord(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function getFieldCoordinates(): { lat: number; lon: number } {
  return {
    lat: parseCoord(
      import.meta.env.FIELD_LAT ?? process.env.FIELD_LAT,
      FIELD_LAT,
    ),
    lon: parseCoord(
      import.meta.env.FIELD_LON ?? process.env.FIELD_LON,
      FIELD_LON,
    ),
  };
}
