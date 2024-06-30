import { parseForecastText } from "$lib/forecast-parser.js";
import { fetchWindsAloftForecasts } from "$lib/server/winds-aloft/fetchWindsAloftForecasts.js";
import { LAT, LON, ELEVATION } from "$lib/constants.js";

export async function GET({ request }) {
  const forecasts = parseForecastText(await fetchWindsAloftForecasts(LAT, LON));
  // const alt = await fetchElevation(LAT, LON);
  return new Response(JSON.stringify({ forecasts, alt: ELEVATION }), {
    status: 200,
  });
}
