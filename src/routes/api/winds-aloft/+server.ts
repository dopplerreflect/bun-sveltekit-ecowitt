import { parseForecastText } from "$lib/forecast-parser.js";
import { fetchWindsAloftForecasts } from "$lib/server/winds-aloft/fetchWindsAloftForecasts.js";

const LAT = "29.3576";
const LON = "-95.4581";

export async function GET({ request }) {
  const forecasts = parseForecastText(await fetchWindsAloftForecasts(LAT, LON));
  // const alt = await fetchElevation(LAT, LON);
  const alt = 16;
  return new Response(JSON.stringify({ forecasts, alt }), { status: 200 });
}
