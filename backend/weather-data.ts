import type { EcowittData } from "../types";

type WeatherData = {
  data: EcowittData;
  sanitize: Function;
};

const weatherData: WeatherData = {
  data: {},
  sanitize,
};

function sanitize(data: FormData): EcowittData {
  const output = {} as EcowittData;
  const stringFields = ["PASSKEY", "stationtype", "dateutc", "freq", "model"];
  data.forEach((value, key) => {
    output[key] = stringFields.includes(key) ? value : Number(value);
  });
  return output;
}

export default weatherData;
