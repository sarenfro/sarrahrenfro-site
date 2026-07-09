import { type NextRequest } from "next/server";
import { timingSafeEqual } from "crypto";
import { createSessionToken, COOKIE_NAME } from "@/lib/adminAuth";

function safeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, bufA); // consume constant time
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: NextRequest) {
  const { password } = await request.json() as { password?: string };
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || !process.env.ADMIN_SECRET) {
    return Response.json({ error: "Admin not configured" }, { status: 503 });
  }

  if (!safeEquals(password ?? "", adminPassword)) {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = createSessionToken();
  const maxAge = 60 * 60 * 24 * 7; // 7 days
  const response = Response.json({ success: true });
  response.headers.set(
    "Set-Cookie",
    `${COOKIE_NAME}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}`
  );
  return response;
}
