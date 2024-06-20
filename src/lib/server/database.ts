import { Database as Sqlite } from "bun:sqlite";
import type { EcowittData } from "../../app";
import { WeatherSchema, IgnoredFields } from "../weather-schema";
const MINUTES_TO_KEEP_DATA = 60;

let sqliteDB = "/var/tmp/bun-sveltekit-ecowitt.db.sqlite3";
console.log(`Using database ${sqliteDB}`);

const SqliteDB = new Sqlite(sqliteDB, { create: true });

const Database = {
  insertEcowittRow: (ecowittData: EcowittData) => insertEcowittRow(ecowittData),
  allRows: (querySource: string = "") => {
    let ago = new Date(new Date().getTime() - 1000 * 60 * 60).toISOString();
    let query = `SELECT * FROM ecowittData WHERE dateutc > '${ago}' ORDER BY dateutc ASC`;
    return SqliteDB.query(query).all();
  },
  init: () => createTable(),
};

export default Database;

Database.init();

function insertEcowittRow(ecowittData: EcowittData) {
  let ecowittDataClone: any = { ...ecowittData };
  let { dateutc } = ecowittDataClone;
  delete ecowittDataClone.dateutc;
  let keys = Object.keys(ecowittDataClone);
  let values = Object.values(ecowittDataClone).map(value => {
    return typeof value === "string" ? `'${value}'` : value;
  });
  let queryString = `INSERT INTO ecowittData (dateutc, ${keys.join(
    ",",
  )}) VALUES ('${dateutc}',${values.join(",")})`;
  let query = SqliteDB.query(queryString);
  try {
    query.run();
  } catch (error) {
    console.log(error);
  }
  deleteOldRows();
}

function deleteOldRows() {
  const current = new Date().getTime();
  const past = new Date(
    current - MINUTES_TO_KEEP_DATA * 60 * 1000,
  ).toISOString();
  const queryString = `DELETE FROM ecowittData WHERE dateutc < '${past}'`;
  SqliteDB.query(queryString).run();
}

function createTable() {
  const schema: any = WeatherSchema;
  delete schema.dateutc;
  const stanzaElements = Object.entries(schema)
    .map(([key, value]) => {
      if (!IgnoredFields.includes(key))
        return `${key} ${typeof value === "string" ? "STRING" : "REAL"}`;
    })
    .filter(e => e !== undefined);
  stanzaElements.push("dateutc STRING PRIMARY KEY");
  const queryStr = `CREATE TABLE IF NOT EXISTS ecowittData (${stanzaElements.join(
    ",",
  )})`;
  SqliteDB.query(queryStr).run();
}
