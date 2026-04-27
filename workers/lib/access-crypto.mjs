function toBytes(value) {
  return new TextEncoder().encode(String(value));
}

function fromBytes(bytes) {
  return new TextDecoder().decode(bytes);
}

export function encodeBase64Url(input) {
  const bytes = input instanceof Uint8Array ? input : toBytes(input);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export function decodeBase64Url(value) {
  const normalized = String(value).replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function importHmacKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    toBytes(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function signToken(payload, secret) {
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const key = await importHmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, toBytes(encodedPayload));
  return `${encodedPayload}.${encodeBase64Url(new Uint8Array(signature))}`;
}

export async function verifyToken(token, secret) {
  const [encodedPayload, encodedSignature] = String(token || "").split(".");
  if (!encodedPayload || !encodedSignature) {
    return { ok: false, reason: "malformed_token" };
  }

  const key = await importHmacKey(secret);
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    decodeBase64Url(encodedSignature),
    toBytes(encodedPayload),
  );

  if (!valid) {
    return { ok: false, reason: "invalid_signature" };
  }

  try {
    return {
      ok: true,
      payload: JSON.parse(fromBytes(decodeBase64Url(encodedPayload))),
    };
  } catch {
    return { ok: false, reason: "invalid_payload" };
  }
}
