import { URLSearchParams } from "svelte/reactivity";

export async function GET({ params }) {
  const search = new URLSearchParams(params);

  let url = `https://rucsoundings.noaa.gov/get_soundings.cgi?${params}`;

  console.log(url);

  const response = await fetch(url);

  console.log(response);

  return new Response("ok", { status: 200 });
}
