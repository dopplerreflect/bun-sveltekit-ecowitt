import type { EcowittData } from "../types";
import { saveRow } from "./database";

type WeatherData = {
  data: EcowittData;
  sanitize: Function;
};

const weatherData: WeatherData = {
  data: {} as EcowittData,
  sanitize,
};

function sanitize(data: FormData): EcowittData {
  const output = {} as EcowittData;
  const stringFields = ["PASSKEY", "stationtype", "dateutc", "freq", "model"];
  data.forEach((value, key) => {
    output[key] = stringFields.includes(key) ? value : Number(value);
  });
  output.dateutc = new Date(
    output.dateutc.replace(/ /, "T").replace(/$/, ".000Z"),
  ).toISOString();
  let ignoredFields = [
    "PASSKEY",
    "stationtype",
    "runtime",
    "heap",
    "rrain_piezo",
    "erain_piezo",
    "hrain_piezo",
    "drain_piezo",
    "wrain_piezo",
    "mrain_piezo",
    "yrain_piezo",
    "ws90cap_volt",
    "ws90_ver",
    "wh90batt",
    "freq",
    "model",
    "interval",
  ];
  ignoredFields.forEach(field => delete output[field]);
  saveRow(output);
  return output;
}

export default weatherData;
