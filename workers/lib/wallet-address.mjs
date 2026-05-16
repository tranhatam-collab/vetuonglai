const BECH32_ALPHABET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
const ADDRESS_PREFIX = "vtl1";
const BODY_LENGTH = 32;

function toBytes(value) {
  return new TextEncoder().encode(String(value));
}

async function hmacSha256(secret, message) {
  const key = await crypto.subtle.importKey(
    "raw",
    toBytes(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, toBytes(message));
  return new Uint8Array(signature);
}

export function normalizeWalletEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export async function deriveWalletAddress(email, env = {}) {
  const normalized = normalizeWalletEmail(email);
  if (!normalized) return "";
  const secret = (env && typeof env.WALLET_ADDRESS_SECRET === "string" && env.WALLET_ADDRESS_SECRET)
    || "debug-wallet-addr-secret";
  const digest = await hmacSha256(secret, `wallet:v1:${normalized}`);
  let body = "";
  for (let i = 0; i < BODY_LENGTH; i += 1) {
    body += BECH32_ALPHABET[digest[i] % BECH32_ALPHABET.length];
  }
  return `${ADDRESS_PREFIX}${body}`;
}

export function isValidWalletAddress(value) {
  const raw = String(value || "").trim();
  if (!raw.startsWith(ADDRESS_PREFIX)) return false;
  const body = raw.slice(ADDRESS_PREFIX.length);
  if (body.length !== BODY_LENGTH) return false;
  for (let i = 0; i < body.length; i += 1) {
    if (!BECH32_ALPHABET.includes(body[i])) return false;
  }
  return true;
}
