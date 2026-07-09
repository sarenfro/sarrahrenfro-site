import { Redis } from "@upstash/redis";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

export interface CalendarUrl {
  id: string;
  label: string;
  url: string;
}

interface StoredEntry {
  id: string;
  label: string;
  encryptedUrl: string;
}

const REDIS_KEY = "calendar_urls";

function getRedis(): Redis | null {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  return Redis.fromEnv();
}

function encryptionKey(): Buffer {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error("ADMIN_SECRET not set");
  return createHash("sha256").update(secret).digest();
}

function encrypt(plaintext: string): string {
  const key = encryptionKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const data = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${data.toString("hex")}`;
}

function decrypt(ciphertext: string): string {
  const key = encryptionKey();
  const parts = ciphertext.split(":");
  if (parts.length !== 3) throw new Error("Invalid ciphertext");
  const iv = Buffer.from(parts[0], "hex");
  const tag = Buffer.from(parts[1], "hex");
  const data = Buffer.from(parts[2], "hex");
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}

function envFallback(): CalendarUrl[] {
  const urls: CalendarUrl[] = [];
  if (process.env.OUTLOOK_ICS_URL) {
    urls.push({ id: "outlook", label: "Outlook", url: process.env.OUTLOOK_ICS_URL });
  }
  if (process.env.GOOGLE_ICS_URL) {
    urls.push({ id: "google", label: "Google", url: process.env.GOOGLE_ICS_URL });
  }
  return urls;
}

export async function getCalendarUrls(): Promise<CalendarUrl[]> {
  const redis = getRedis();
  if (!redis) return envFallback();

  const data = await redis.get<StoredEntry[]>(REDIS_KEY);
  if (!data || !Array.isArray(data) || data.length === 0) return envFallback();

  // Old plaintext format had a `url` field instead of `encryptedUrl` — clear and fall back.
  const stale = data.some((e) => !("encryptedUrl" in e));
  if (stale) {
    await redis.del(REDIS_KEY);
    return envFallback();
  }

  try {
    return data.map((entry) => ({
      id: entry.id,
      label: entry.label,
      url: decrypt(entry.encryptedUrl),
    }));
  } catch {
    await redis.del(REDIS_KEY);
    return envFallback();
  }
}

export async function setCalendarUrls(urls: CalendarUrl[]): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  const stored: StoredEntry[] = urls.map((entry) => ({
    id: entry.id,
    label: entry.label,
    encryptedUrl: encrypt(entry.url),
  }));

  await redis.set(REDIS_KEY, stored);
}
