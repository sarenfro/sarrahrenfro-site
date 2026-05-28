import { Redis } from "@upstash/redis";

export interface BookingRecord {
  name: string;
  email: string;
  date: string;
  time: string;
  duration_minutes: number;
  notes?: string;
  bookedAt: string;
}

const MAX_ENTRIES = 200;
const LIST_KEY = "bookings";

function getRedis(): Redis | null {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  return Redis.fromEnv();
}

export async function logBooking(record: Omit<BookingRecord, "bookedAt">): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  const entry: BookingRecord = { ...record, bookedAt: new Date().toISOString() };
  await redis.lpush(LIST_KEY, JSON.stringify(entry));
  await redis.ltrim(LIST_KEY, 0, MAX_ENTRIES - 1);
}

export async function getBookings(): Promise<BookingRecord[]> {
  const redis = getRedis();
  if (!redis) return [];

  const raw = await redis.lrange<string>(LIST_KEY, 0, -1);
  return raw.map((item) => (typeof item === "string" ? JSON.parse(item) : item));
}
