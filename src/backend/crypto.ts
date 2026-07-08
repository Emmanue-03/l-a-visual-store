const encoder = new TextEncoder();

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function base64ToBytes(value: string) {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export async function hashPassword(password: string, saltBytes?: Uint8Array) {
  const iterations = 210_000;
  const salt = saltBytes ?? crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations },
    key,
    256,
  );
  return `pbkdf2_sha256$${iterations}$${bytesToBase64(salt)}$${bytesToBase64(new Uint8Array(bits))}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, iterationsRaw, saltRaw, hashRaw] = storedHash.split("$");
  if (algorithm !== "pbkdf2_sha256" || !iterationsRaw || !saltRaw || !hashRaw) return false;

  const iterations = Number(iterationsRaw);
  const salt = base64ToBytes(saltRaw);
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations },
    key,
    256,
  );
  const candidate = bytesToBase64(new Uint8Array(bits));

  if (candidate.length !== hashRaw.length) return false;
  let diff = 0;
  for (let index = 0; index < candidate.length; index += 1) {
    diff |= candidate.charCodeAt(index) ^ hashRaw.charCodeAt(index);
  }
  return diff === 0;
}
