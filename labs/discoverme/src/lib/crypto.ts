const enc = new TextEncoder();

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, key, 256);
  const hash = new Uint8Array(bits);
  return `pbkdf2$100000$${b64(salt)}$${b64(hash)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, iterStr, saltB64, hashB64] = stored.split("$");
  if (algo !== "pbkdf2") return false;
  const iterations = parseInt(iterStr, 10);
  const salt = unb64(saltB64);
  const expected = unb64(hashB64);
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: salt.buffer as ArrayBuffer, iterations, hash: "SHA-256" }, key, 256);
  const actual = new Uint8Array(bits);
  if (actual.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < actual.length; i++) diff |= actual[i] ^ expected[i];
  return diff === 0;
}

export function randomToken(bytes = 32): string {
  const buf = crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(buf).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function sha256(input: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", enc.encode(input));
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function b64(buf: Uint8Array): string { return btoa(String.fromCharCode(...buf)); }
function unb64(s: string): Uint8Array { return Uint8Array.from(atob(s), (c) => c.charCodeAt(0)); }

export function slugify(input: string): string {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80) || "item";
}