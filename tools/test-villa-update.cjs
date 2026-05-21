require("dotenv").config();

const { Pool } = require("pg");

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const result = await pool.query("update villas set max_guest = max_guest where id = 1 returning id, max_guest");
  console.log(result.rows[0]);
  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
