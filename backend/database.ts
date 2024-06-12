import { Database } from "bun:sqlite";
import type { EcowittData } from "../types";

const MINUTES_TO_KEEP_DATA = 60;

export function saveRow(ecowittData: EcowittData) {
  _saveRow(ecowittData);
  deleteOldRows();
}

export function allRows() {
  return db.query("select * from ecowittData order by dateutc asc").all();
}

function _saveRow(ecowittData: EcowittData) {
  let ecowittDataClone: any = { ...ecowittData };
  let { dateutc } = ecowittDataClone;
  delete ecowittDataClone.dateutc;
  let keys = Object.keys(ecowittDataClone);
  let values = Object.values(ecowittDataClone);
  let queryString = `INSERT INTO ecowittData (dateutc, ${keys.join(
    ",",
  )}) VALUES ('${dateutc}',${values.join(",")})`;
  let query = db.query(queryString);
  query.run();
}

function deleteOldRows() {
  const current = new Date().getTime();
  const past = new Date(
    current - MINUTES_TO_KEEP_DATA * 60 * 1000,
  ).toISOString();
  const queryString = `delete from ecowittData where dateutc < '${past}'`;
  db.query(queryString).run();
}

const db = new Database("./backend/db.sqlite3", { create: true });

db.query(
  "CREATE TABLE IF NOT EXISTS ecowittData(dateutc STRING PRIMARY KEY,tempinf REAL,humidityin REAL,baromrelin REAL,baromabsin REAL,tempf REAL,humidity REAL,winddir REAL,windspeedmph REAL,windgustmph REAL,maxdailygust REAL,solarradiation REAL,uv REAL) ",
).run();
