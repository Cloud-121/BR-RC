import { c as createComponent } from './astro-component_LPgCNcwW.mjs';
import 'piccolore';
import { m as maybeRenderHead, h as addAttribute, k as renderTemplate, o as renderComponent, q as Fragment } from './entrypoint_DPvAqX-D.mjs';
import 'clsx';

const MAX_WIND_MPH = 15;
const MAX_GUST_MPH = 20;
function isAdverseWeatherCode(code) {
  if (code === 45 || code === 48) return true;
  if (code >= 51 && code <= 67) return true;
  if (code >= 71 && code <= 77) return true;
  if (code >= 80 && code <= 86) return true;
  if (code >= 95 && code <= 99) return true;
  return false;
}
function assessFlyability(weather) {
  if (weather.windSpeedMph > MAX_WIND_MPH) return "not-great";
  if (weather.windGustMph != null && weather.windGustMph > MAX_GUST_MPH) return "not-great";
  if (weather.precipitationIn > 0) return "not-great";
  if (isAdverseWeatherCode(weather.weatherCode)) return "not-great";
  return "good";
}

const FIELD_LAT = 30.503459;
const FIELD_LON = -91.349838;
const FIELD_NAME = "Kissner Field";
const FIELD_TIMEZONE = "America/Chicago";
const FIELD_GOOGLE_MAPS_URL = "https://www.google.com/maps/place/BRRC+Club+Runway+at+Kissner+Field/@30.503459,-91.3524129,620m/data=!3m1!1e3!4m12!1m5!3m4!2zMzDCsDMwJzEyLjUiTiA5McKwMjAnNTkuNCJX!8m2!3d30.503459!4d-91.349838!3m5!1s0x8624181383fe48c3:0xaf280e4c173f1a43!8m2!3d30.5040508!4d-91.3496256!16s%2Fg%2F11cjy2ny82?entry=ttu&g_ep=EgoyMDI2MDYwMS4wIKXMDSoASAFQAw%3D%3D";
function parseCoord(value, fallback) {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
function getFieldCoordinates() {
  return {
    lat: parseCoord(
      process.env.FIELD_LAT,
      FIELD_LAT
    ),
    lon: parseCoord(
      process.env.FIELD_LON,
      FIELD_LON
    )
  };
}

const $$FlyabilityBadge = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$FlyabilityBadge;
  const { flyability } = Astro2.props;
  const isGood = flyability === "good";
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["field-weather__flyability", `field-weather__flyability--${flyability}`], "class:list")}> ${isGood ? renderTemplate`<svg class="field-weather__flyability-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"> <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"></circle> <path d="M7.5 12.5 L10.5 15.5 L16.5 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </svg>` : renderTemplate`<svg class="field-weather__flyability-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"> <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"></circle> <path d="M12 7 V13" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path> <circle cx="12" cy="16.5" r="1.25" fill="currentColor"></circle> </svg>`} <span>${isGood ? "Good to fly" : "Not so great to fly"}</span> </div>`;
}, "/home/cloud/Documents/BR-RC/src/components/FlyabilityBadge.astro", void 0);

const $$FieldWeather = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$FieldWeather;
  const { weather, error = null, compact = false } = Astro2.props;
  const flyability = weather ? assessFlyability(weather) : null;
  function formatObservedAt(iso) {
    return new Date(iso).toLocaleString("en-US", {
      timeZone: FIELD_TIMEZONE,
      dateStyle: "medium",
      timeStyle: "short"
    });
  }
  function formatPrecip(inches) {
    if (inches <= 0) return "None";
    if (inches < 0.01) return "Trace";
    return `${inches.toFixed(2)} in`;
  }
  return renderTemplate`${compact ? renderTemplate`${maybeRenderHead()}<aside class="field-weather field-weather--compact">${error ? renderTemplate`<p>Field weather unavailable. <a href="/kissner-field">View Kissner Field</a></p>` : weather ? renderTemplate`<div class="field-weather__compact-row"><div class="field-weather__compact-details"><p class="field-weather__compact-summary"><strong>${FIELD_NAME}:</strong>${" "}${weather.temperatureF}°F · Wind ${weather.windSpeedMph} mph ${weather.windDirection}${weather.windGustMph != null && ` · Gusts ${weather.windGustMph} mph`} ·${" "}${weather.conditions} · Rain 24h: ${formatPrecip(weather.rainfall24hIn)}</p><p class="field-weather__compact-link"><a href="/kissner-field">Full conditions</a></p></div>${flyability && renderTemplate`${renderComponent($$result, "FlyabilityBadge", $$FlyabilityBadge, { "flyability": flyability })}`}</div>` : null}</aside>` : renderTemplate`<aside class="field-weather"><h2>Current Conditions at ${FIELD_NAME}</h2>${error ? renderTemplate`<p>${error}</p>` : weather ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${flyability && renderTemplate`${renderComponent($$result2, "FlyabilityBadge", $$FlyabilityBadge, { "flyability": flyability })}`}<div class="field-weather__grid"><div class="field-weather__stat"><span class="field-weather__label">Temperature</span><span class="field-weather__value">${weather.temperatureF}°F</span></div><div class="field-weather__stat"><span class="field-weather__label">Feels like</span><span class="field-weather__value">${weather.feelsLikeF}°F</span></div><div class="field-weather__stat"><span class="field-weather__label">Wind</span><span class="field-weather__value">${weather.windSpeedMph} mph ${weather.windDirection}</span></div><div class="field-weather__stat"><span class="field-weather__label">Gusts</span><span class="field-weather__value">${weather.windGustMph != null ? `${weather.windGustMph} mph` : "—"}</span></div><div class="field-weather__stat"><span class="field-weather__label">Humidity</span><span class="field-weather__value">${weather.humidity}%</span></div><div class="field-weather__stat"><span class="field-weather__label">Current hour</span><span class="field-weather__value">${formatPrecip(weather.precipitationIn)}</span></div><div class="field-weather__stat"><span class="field-weather__label">Rainfall (24 hr)</span><span class="field-weather__value">${formatPrecip(weather.rainfall24hIn)}</span></div><div class="field-weather__stat field-weather__stat--wide"><span class="field-weather__label">Conditions</span><span class="field-weather__value">${weather.conditions}</span></div></div><p class="field-weather__updated">
Last updated ${formatObservedAt(weather.observedAt)} (Central Time)
</p><p class="field-weather__disclaimer">
Conditions at the field can differ from this reading. Check the windsock before flying.
</p>` })}` : null}</aside>`}`;
}, "/home/cloud/Documents/BR-RC/src/components/FieldWeather.astro", void 0);

class FieldWeatherError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "FieldWeatherError";
  }
}
const COMPASS = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW"
];
const WMO_LABELS = {
  0: "Clear",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  56: "Freezing drizzle",
  57: "Freezing drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Freezing rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Light showers",
  81: "Showers",
  82: "Heavy showers",
  85: "Snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with hail"
};
function sumHourlyPrecipitation(values) {
  if (!values?.length) return 0;
  return values.reduce((total, amount) => total + amount, 0);
}
function degreesToCompass(degrees) {
  const normalized = (degrees % 360 + 360) % 360;
  const index = Math.round(normalized / 22.5) % 16;
  return COMPASS[index];
}
function weatherCodeToLabel(code) {
  return WMO_LABELS[code] ?? "Unknown";
}
async function fetchFieldWeather() {
  const { lat, lon } = getFieldCoordinates();
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "wind_speed_10m",
      "wind_direction_10m",
      "wind_gusts_10m",
      "precipitation",
      "weather_code"
    ].join(","),
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    precipitation_unit: "inch",
    timezone: FIELD_TIMEZONE,
    hourly: "precipitation",
    past_hours: "24",
    forecast_hours: "0"
  });
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new FieldWeatherError(`Weather service returned ${response.status}`);
    }
    const data = await response.json();
    if (!data.current) {
      throw new FieldWeatherError("Weather service returned no current conditions");
    }
    const current = data.current;
    return {
      temperatureF: Math.round(current.temperature_2m),
      feelsLikeF: Math.round(current.apparent_temperature),
      humidity: Math.round(current.relative_humidity_2m),
      windSpeedMph: Math.round(current.wind_speed_10m),
      windGustMph: current.wind_gusts_10m != null ? Math.round(current.wind_gusts_10m) : null,
      windDirection: degreesToCompass(current.wind_direction_10m),
      precipitationIn: current.precipitation,
      rainfall24hIn: sumHourlyPrecipitation(data.hourly?.precipitation),
      conditions: weatherCodeToLabel(current.weather_code),
      weatherCode: current.weather_code,
      observedAt: current.time
    };
  } catch (error) {
    if (error instanceof FieldWeatherError) throw error;
    const message = error instanceof Error ? error.message : "Unknown error while fetching weather";
    throw new FieldWeatherError(`Failed to load field weather: ${message}`, { cause: error });
  }
}

export { $$FieldWeather as $, FIELD_GOOGLE_MAPS_URL as F, fetchFieldWeather as f };
