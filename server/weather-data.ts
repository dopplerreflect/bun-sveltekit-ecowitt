import type { EcowittData } from "../types";
import Database from "./database";

export default function processWeatherData(formData: FormData) {
  let sanitizedData = sanitize(formData);
  Database.insertEcowittRow(sanitizedData);
  return sanitizedData;
}

function sanitize(formData: FormData): EcowittData {
  let sanitizedData = {} as EcowittData;
  let stringFields = ["PASSKEY", "stationtype", "dateutc", "freq", "model"];
  formData.forEach((value, key) => {
    sanitizedData[key] = stringFields.includes(key) ? value : Number(value);
  });
  sanitizedData.dateutc = new Date(
    sanitizedData.dateutc.replace(/ /, "T").replace(/$/, ".000Z"),
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
  ignoredFields.forEach(field => delete sanitizedData[field]);
  return sanitizedData;
}
