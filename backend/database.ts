import { Database } from "bun:sqlite";
import type { EcowittData } from "../types";

const db = new Database("./db.sqlite3", { create: true });

const create = db.query(
  "CREATE TABLE IF NOT EXISTS ecowittData(dateutc STRING PRIMARY KEY,tempinf REAL,humidityin REAL,baromrelin REAL,baromabsin REAL,tempf REAL,humidity REAL,winddir REAL,windspeedmph REAL,windgustmph REAL,maxdailygust REAL,solarradiation REAL,uv REAL) ",
);

create.run();

export function saveRow(ecowittData: EcowittData) {
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

export function allRows() {
  return db.query("select * from ecowittData order by dateutc asc").all();
}
