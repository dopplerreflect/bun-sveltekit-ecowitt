import { error } from "@sveltejs/kit";

const N_HRS = 1;
const TEMPFILE = "/var/tmp/bun-svelte-ecowitt-winds-aloft-response.txt";

export const fetchWindsAloftForecasts = async (lat: string, lon: string) => {
  const queryParams = {
    data_source: "Op40",
    fcst_len: "shortest",
    startSecs: Math.round(Date.now() / 1000) - 3600,
    endSecs: Math.round(Date.now() / 1000) - 3600 + 60 * 60 * N_HRS,
    n_hrs: N_HRS,
    airport: [lat, lon].join(),
  };

  const queryString = Object.entries(queryParams)
    .map(pair => pair.join("="))
    .join("&");

  const url = `https://rucsoundings.noaa.gov/get_soundings.cgi?${queryString}`;

  let text: string = "";
  let cacheFile = Bun.file(TEMPFILE);
  let cacheHour: string = "";
  if (cacheFile.size) {
    text = await cacheFile.text();
    cacheHour = text.split(/\n/)[1].split(/\s+/)[1];
  }
  let hourStr = new Date().getUTCHours().toString();
  if (cacheHour && cacheHour === hourStr) {
    console.info("using cached winds aloft", TEMPFILE);
  } else {
    console.info(`fetching ${url}`);
    try {
      const result = await fetch(url);
      text = await result.text();
      Bun.write(TEMPFILE, text);
    } catch (error) {
      console.log("Error fetching winds aloft", error);
    }
  }
  return text;
};

/** from docs 
start_year=2016&
start_month_name=Jan&
start_mday=12&
start_hour=20&
start_min=0&
n_hrs=1.0& (n_hrs defaults to ‘1’)
(these will be ignored if the parameters startSecs and endSecs are present, or if “start=latest” is
present.)
*/
