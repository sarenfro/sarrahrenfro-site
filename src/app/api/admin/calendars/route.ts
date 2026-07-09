import { type NextRequest } from "next/server";
import { isAuthenticated } from "@/lib/adminAuth";
import { getCalendarUrls, setCalendarUrls, type CalendarUrl } from "@/lib/calendarUrls";

async function guard(): Promise<Response | null> {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;

  const urls = await getCalendarUrls();
  return Response.json({ urls });
}

export async function POST(request: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const { label, url } = await request.json() as { label?: string; url?: string };
  if (!label?.trim() || !url?.trim()) {
    return Response.json({ error: "label and url are required" }, { status: 400 });
  }

  const urls = await getCalendarUrls();
  const entry: CalendarUrl = { id: Date.now().toString(), label: label.trim(), url: url.trim() };
  await setCalendarUrls([...urls, entry]);
  return Response.json({ success: true, entry });
}

export async function PUT(request: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const { id, label, url } = await request.json() as { id?: string; label?: string; url?: string };
  if (!id || !label?.trim() || !url?.trim()) {
    return Response.json({ error: "id, label, and url are required" }, { status: 400 });
  }

  const urls = await getCalendarUrls();
  const updated = urls.map((u) =>
    u.id === id ? { ...u, label: label.trim(), url: url.trim() } : u
  );
  await setCalendarUrls(updated);
  return Response.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const { id } = await request.json() as { id?: string };
  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }

  const urls = await getCalendarUrls();
  await setCalendarUrls(urls.filter((u) => u.id !== id));
  return Response.json({ success: true });
}
