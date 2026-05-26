import { existsSync, readFileSync } from "node:fs";
import { pbkdf2Sync, randomBytes } from "node:crypto";
import postgres from "postgres";

function loadDotEnv() {
  if (!existsSync(".env")) return;
  const lines = readFileSync(".env", "utf8").split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

function hashPassword(password) {
  const iterations = 210_000;
  const salt = randomBytes(16);
  const hash = pbkdf2Sync(password, salt, iterations, 32, "sha256");
  return `pbkdf2_sha256$${iterations}$${salt.toString("base64")}$${hash.toString("base64")}`;
}

loadDotEnv();

const connectionString = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const fullName = process.env.ADMIN_FULL_NAME?.trim() || null;

if (!connectionString) {
  console.error("Falta SUPABASE_DB_URL o DATABASE_URL.");
  process.exit(1);
}

if (!email || !password) {
  console.error("Faltan ADMIN_EMAIL y/o ADMIN_PASSWORD.");
  process.exit(1);
}

const sql = postgres(connectionString, { ssl: "require" });

try {
  const passwordHash = hashPassword(password);
  await sql`
    INSERT INTO lamultiventas.admin_users (email, password_hash, full_name, role, is_active)
    VALUES (${email}, ${passwordHash}, ${fullName}, 'admin', true)
    ON CONFLICT (email) DO UPDATE SET
      password_hash = EXCLUDED.password_hash,
      full_name = EXCLUDED.full_name,
      role = 'admin',
      is_active = true,
      updated_at = now()
  `;
  console.log(`Admin listo: ${email}`);
} finally {
  await sql.end();
}
