require("dotenv").config();

const { Pool } = require("pg");

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const result = await pool.query(
    "select column_name from information_schema.columns where table_schema='public' and table_name='villas' order by ordinal_position",
  );
  console.log(result.rows.map((row) => row.column_name));
  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
