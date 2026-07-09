import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const COOKIE_NAME = "admin_session";
const PAYLOAD = "authenticated";

function getSecret(): string {
  return process.env.ADMIN_SECRET ?? "";
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSessionToken(): string {
  return `${PAYLOAD}.${sign(PAYLOAD)}`;
}

export function verifySessionToken(token: string): boolean {
  const secret = getSecret();
  if (!secret) return false;
  const dotIndex = token.indexOf(".");
  if (dotIndex === -1) return false;
  const payload = token.slice(0, dotIndex);
  const sig = token.slice(dotIndex + 1);
  if (payload !== PAYLOAD) return false;
  const expected = sign(PAYLOAD);
  try {
    return timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}
