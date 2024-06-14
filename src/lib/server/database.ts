import { Database as Sqlite } from "bun:sqlite";
import type { EcowittData } from "../../app";

const MINUTES_TO_KEEP_DATA = 60;

let sqliteDB = "/tmp/bun-sveltekit-ecowitt.db.sqlite3";
console.log(`Using database ${sqliteDB}`);

const SqliteDB = new Sqlite(sqliteDB, { create: true });

const Database = {
  insertEcowittRow: (ecowittData: EcowittData) => insertEcowittRow(ecowittData),
  allRows: () =>
    SqliteDB.query("SELECT * FROM ecowittData ORDER BY dateutc ASC").all(),
  init: () => {
    SqliteDB.query(
      "CREATE TABLE IF NOT EXISTS ecowittData(dateutc STRING PRIMARY KEY,tempinf REAL,humidityin REAL,baromrelin REAL,baromabsin REAL,tempf REAL,humidity REAL,winddir REAL,windspeedmph REAL,windgustmph REAL,maxdailygust REAL,solarradiation REAL,uv REAL) ",
    ).run();
  },
};

export default Database;

Database.init();

function insertEcowittRow(ecowittData: EcowittData) {
  let ecowittDataClone: any = { ...ecowittData };
  let { dateutc } = ecowittDataClone;
  delete ecowittDataClone.dateutc;
  let keys = Object.keys(ecowittDataClone);
  let values = Object.values(ecowittDataClone);
  let queryString = `INSERT INTO ecowittData (dateutc, ${keys.join(
    ",",
  )}) VALUES ('${dateutc}',${values.join(",")})`;
  let query = SqliteDB.query(queryString);
  query.run();
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
