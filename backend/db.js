const { Pool } = require("pg");

const useSsl = String(process.env.DATABASE_SSL || "false").toLowerCase() === "true";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
