// Herramienta one-shot para listar admins existentes y resetear su password.
// Usa SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY desde .env (no requiere DB_URL).
//
// Uso:
//   node scripts/admin-tool.mjs list
//   node scripts/admin-tool.mjs reset <email> <newpassword>

import { existsSync, readFileSync } from "node:fs";
import { pbkdf2Sync, randomBytes } from "node:crypto";

function loadDotEnv() {
  if (!existsSync(".env")) return;
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

loadDotEnv();

const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env");
  process.exit(1);
}

const command = process.argv[2];

function hashPassword(password) {
  const iterations = 210_000;
  const salt = randomBytes(16);
  const hash = pbkdf2Sync(password, salt, iterations, 32, "sha256");
  return `pbkdf2_sha256$${iterations}$${salt.toString("base64")}$${hash.toString("base64")}`;
}

async function rest(method, path, body) {
  const res = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      "accept-profile": "lamultiventas",
      "content-profile": "lamultiventas",
      "content-type": "application/json",
      prefer: "return=representation",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${text}`);
  return text ? JSON.parse(text) : [];
}

if (command === "list") {
  const rows = await rest(
    "GET",
    "admin_users?select=id,email,full_name,role,is_active,last_login_at,created_at",
  );
  if (!rows.length) {
    console.log("No hay admins en lamultiventas.admin_users.");
    process.exit(0);
  }
  console.log(`${rows.length} admin(s) encontrado(s):\n`);
  for (const r of rows) {
    console.log(`  email:        ${r.email}`);
    console.log(`  full_name:    ${r.full_name || "(vacio)"}`);
    console.log(`  role:         ${r.role}`);
    console.log(`  is_active:    ${r.is_active}`);
    console.log(`  last_login:   ${r.last_login_at || "(nunca)"}`);
    console.log(`  created_at:   ${r.created_at}`);
    console.log("");
  }
} else if (command === "reset") {
  const email = process.argv[3];
  const password = process.argv[4];
  if (!email || !password) {
    console.error("Uso: node scripts/admin-tool.mjs reset <email> <newpassword>");
    process.exit(1);
  }
  const passwordHash = hashPassword(password);
  const existing = await rest("GET", `admin_users?email=eq.${encodeURIComponent(email.toLowerCase())}&select=id`);
  if (existing.length === 0) {
    // crear
    await rest("POST", "admin_users", {
      email: email.toLowerCase(),
      password_hash: passwordHash,
      full_name: "Admin",
      role: "admin",
      is_active: true,
    });
    console.log(`Admin creado: ${email}`);
  } else {
    // actualizar
    await rest(
      "PATCH",
      `admin_users?email=eq.${encodeURIComponent(email.toLowerCase())}`,
      { password_hash: passwordHash, is_active: true },
    );
    console.log(`Password actualizado para: ${email}`);
  }
} else {
  console.error("Comandos: list | reset <email> <newpassword>");
  process.exit(1);
}
