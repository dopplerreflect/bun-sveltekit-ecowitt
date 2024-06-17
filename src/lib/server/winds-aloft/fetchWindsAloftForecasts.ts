import { error } from "@sveltejs/kit";

const N_HRS = 1;

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

  try {
    let text: string;
    if (Bun.env.USE_CACHED_WINDS_ALOFT) {
      // for constantly-reloading dev, avoid hitting external api:
      console.log("using cached winds aloft");
      const file = Bun.file("./winds-oloft-response.txt");
      text = await file.text();
    } else {
      // for real results
      const result = await fetch(url);
      text = await result.text();
      // // Bun.write("./winds-oloft-response.txt", text);
    }
    return text;
  } catch (err) {
    throw error(500, {
      message: "Could not fetch winds aloft data. Are we online?",
    });
  }
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
