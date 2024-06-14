import { dev } from "$app/environment";
import type { EcowittData } from "../../app";
import Database from "./database";

export default function processWeatherData(formData: FormData) {
  echoDataToThinkpad(formData).catch(error => {
    console.error("Error:", error);
  });
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

async function echoDataToThinkpad(formData: FormData) {
  let data = [...formData.entries()]
    .map(entry => {
      return `${entry[0]}=${entry[1]}`;
    })
    .join("&");
  const response = await fetch("http://192.168.12.10:5173/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": data.length,
      "Connection": "close",
    },
    body: `${data}\n\n`,
  });
  console.log(data);
}
