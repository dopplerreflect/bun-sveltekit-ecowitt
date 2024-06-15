import type { EcowittData } from "../../app";
import { IgnoredFields } from "$lib/weather-schema";
import Database from "./database";

export default function processWeatherData(formData: FormData) {
  let sanitizedData = sanitize(formData);
  Database.insertEcowittRow(sanitizedData);
  return sanitizedData;
}

function sanitize(formData: FormData): EcowittData {
  let sanitizedData = {} as EcowittData;
  let stringFields = ["PASSKEY", "stationtype", "dateutc", "freq", "model"];
  let tempObj: any = {};
  formData.forEach((value, key) => {
    tempObj[key] = stringFields.includes(key) ? value : Number(value);
  });
  sanitizedData = tempObj;
  sanitizedData.dateutc = new Date(
    sanitizedData.dateutc.replace(/ /, "T").replace(/$/, ".000Z"),
  ).toISOString();
  IgnoredFields.forEach(
    field => delete sanitizedData[field as keyof EcowittData],
  );
  return sanitizedData;
}
