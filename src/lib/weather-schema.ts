import type { EcowittData } from "../app";

export const WeatherSchema: EcowittData = {
  PASSKEY: "string",
  stationtype: "string",
  runtime: 0,
  heap: 0,
  dateutc: "string",
  tempinf: 0,
  humidityin: 0,
  baromrelin: 0,
  baromabsin: 0,
  tempf: 0,
  humidity: 0,
  winddir: 0,
  windspeedmph: 0,
  windgustmph: 0,
  maxdailygust: 0,
  solarradiation: 0,
  uv: 0,
  vpd: 0,
  rrain_piezo: 0,
  srain_piezo: 0,
  erain_piezo: 0,
  hrain_piezo: 0,
  drain_piezo: 0,
  wrain_piezo: 0,
  mrain_piezo: 0,
  yrain_piezo: 0,
  ws90cap_volt: 0,
  ws90_ver: 0,
  wh90batt: 0,
  freq: "string",
  model: "string",
  interval: 0,
};

export const IgnoredFields = [
  "PASSKEY",
  "stationtype",
  "runtime",
  "heap",
  "rrain_piezo",
  "srain_piezo",
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
