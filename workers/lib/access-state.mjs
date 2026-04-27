const memoryState = globalThis.__vtlAccessMemoryState || {
  kv: new Map(),
};

globalThis.__vtlAccessMemoryState = memoryState;

function withPrefix(prefix, key) {
  return `${prefix}:${key}`;
}

function isExpired(record) {
  return typeof record?.expiresAt === "number" && record.expiresAt <= Date.now();
}

function createMemoryStore() {
  return {
    async get(prefix, key) {
      const fullKey = withPrefix(prefix, key);
      const raw = memoryState.kv.get(fullKey);
      if (!raw) return null;
      if (isExpired(raw)) {
        memoryState.kv.delete(fullKey);
        return null;
      }
      return raw.value;
    },
    async put(prefix, key, value, { ttlSeconds } = {}) {
      memoryState.kv.set(withPrefix(prefix, key), {
        value,
        expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
      });
    },
    async delete(prefix, key) {
      memoryState.kv.delete(withPrefix(prefix, key));
    },
    async countByPrefix(prefix) {
      let count = 0;
      const pfx = `${prefix}:`;
      for (const [key, record] of memoryState.kv) {
        if (key.startsWith(pfx) && !isExpired(record)) count++;
      }
      return count;
    },
  };
}

function createKvStore(namespace) {
  return {
    async get(prefix, key) {
      const raw = await namespace.get(withPrefix(prefix, key));
      return raw ? JSON.parse(raw) : null;
    },
    async put(prefix, key, value, { ttlSeconds } = {}) {
      await namespace.put(
        withPrefix(prefix, key),
        JSON.stringify(value),
        ttlSeconds ? { expirationTtl: ttlSeconds } : undefined,
      );
    },
    async delete(prefix, key) {
      await namespace.delete(withPrefix(prefix, key));
    },
    async countByPrefix(prefix) {
      try {
        const result = await namespace.list({ prefix: `${prefix}:` });
        return result?.keys?.length || 0;
      } catch {
        return 0;
      }
    },
  };
}

export function createAccessStore(env = {}) {
  if (env.ACCESS_KV_NAMESPACE && typeof env.ACCESS_KV_NAMESPACE.get === "function") {
    return {
      mode: "kv",
      ...createKvStore(env.ACCESS_KV_NAMESPACE),
    };
  }

  return {
    mode: "memory",
    ...createMemoryStore(),
  };
}
