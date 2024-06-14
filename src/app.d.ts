// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};

export type EcowittData = {
  PASSKEY?: string;
  stationtype?: string;
  runtime?: number;
  heap?: number;
  dateutc: string;
  tempinf: number;
  humidityin: number;
  baromrelin: number;
  baromabsin: number;
  tempf: number;
  humidity: number;
  winddir: number;
  windspeedmph: number;
  windgustmph: number;
  maxdailygust: number;
  solarradiation: number;
  uv: number;
  rrain_piezo?: number;
  erain_piezo?: number;
  hrain_piezo?: number;
  drain_piezo?: number;
  wrain_piezo?: number;
  mrain_piezo?: number;
  yrain_piezo?: number;
  ws90cap_volt?: number;
  ws90_ver?: number;
  wh90batt?: number;
  freq?: string;
  model?: string;
  interval?: number;
};

type WindData = {
  windspeedmph: EcowittData.windspeedmph;
  winddir: EcowittData.winddir;
  windgustmph: EcowittData.windgustmph;
};
