import { getWindsAloft } from "$lib/server/ppg.report/rapidRefresh.js";

const LAT = 29.3576;
const LON = -95.4581;

export async function GET() {
  const response = await getWindsAloft(LAT, LON);
  return new Response(JSON.stringify(response), { status: 200 });
}
