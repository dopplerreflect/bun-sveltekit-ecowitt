import processWeatherData from "$lib/server/weather-data.js";

export async function POST({ request, cookies }) {
  const formData = await request.formData();

  let weatherData = processWeatherData(formData);

  console.log(weatherData.dateutc);

  return new Response("ok", { status: 201 });
}
