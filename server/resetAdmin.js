import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;

function normalizePhone(raw) {
  if (typeof raw !== "string") {
    return "";
  }

  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) {
    return "";
  }

  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }

  if (digits.startsWith("8")) {
    return `62${digits}`;
  }

  return digits;
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL tidak ditemukan.");
  }

  const phone = normalizePhone(process.env.ADMIN_PHONE || "628111111111");
  const email = process.env.ADMIN_EMAIL ? String(process.env.ADMIN_EMAIL).trim().toLowerCase() : "admin@villa.local";
  const password = String(process.env.ADMIN_PASSWORD || "AdminBaleAur123!");
  const name = String(process.env.ADMIN_NAME || "Admin Bale Aur").trim() || "Admin Bale Aur";

  const pool = new Pool({ connectionString });
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("alter table users add column if not exists phone varchar(30)");
    await pool.query("alter table users alter column email drop not null");
    await pool.query("create unique index if not exists users_phone_unique_idx on users(phone) where phone is not null");

    const result = await pool.query(
      `
        insert into users (name, phone, email, password, role)
        values ($1, $2, $3, $4, 'admin')
        on conflict (email)
        do update set name = excluded.name, phone = excluded.phone, password = excluded.password, role = 'admin'
        returning id, name, phone, email, role
      `,
      [name, phone, email, hashedPassword],
    );

    const user = result.rows[0];
    process.stdout.write(`Admin reset OK: ${JSON.stringify(user)}\n`);
    process.stdout.write(`Login with WA: ${phone}\n`);
    process.stdout.write(`Password: ${password}\n`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
