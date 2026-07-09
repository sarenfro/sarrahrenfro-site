import { Redis } from "@upstash/redis";

export interface CalendarUrl {
  id: string;
  label: string;
  url: string;
}

const REDIS_KEY = "calendar_urls";

function getRedis(): Redis | null {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  return Redis.fromEnv();
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

  const data = await redis.get<CalendarUrl[]>(REDIS_KEY);
  if (!data || !Array.isArray(data) || data.length === 0) return envFallback();
  return data;
}

export async function setCalendarUrls(urls: CalendarUrl[]): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  await redis.set(REDIS_KEY, urls);
}
