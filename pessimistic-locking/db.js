import pg from "pg";
const { Client } = pg;

export function getClient() {
  return new Client({
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: 5432,
    database: "airlines_demo",
  });
}
