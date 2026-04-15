import { type NextRequest } from "next/server";
import { parseISO, getDay, isBefore } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

const PT = "America/Los_Angeles";
const DAY_START_H = 9;
const DAY_END_H   = 17;

// ── Windows → IANA timezone map (covers Outlook's common values) ──────────────
const WIN_TZ: Record<string, string> = {
  "Pacific Standard Time":   "America/Los_Angeles",
  "Mountain Standard Time":  "America/Denver",
  "US Mountain Standard Time": "America/Phoenix",
  "Central Standard Time":   "America/Chicago",
  "Eastern Standard Time":   "America/New_York",
  "UTC":                     "UTC",
  "Greenwich Standard Time": "UTC",
  "GMT Standard Time":       "Europe/London",
  "Romance Standard Time":   "Europe/Paris",
  "W. Europe Standard Time": "Europe/Berlin",
  "AUS Eastern Standard Time": "Australia/Sydney",
};

function winToIana(tz: string): string {
  return WIN_TZ[tz] ?? tz; // fall back to the raw value (may already be IANA)
}

// ── Slot generation ───────────────────────────────────────────────────────────

function to12h(h: number, m: number): string {
  const period = h < 12 ? "am" : "pm";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m.toString().padStart(2, "0")}${period}`;
}

function generateSlots(durationMinutes: number): { h: number; m: number }[] {
  const slots: { h: number; m: number }[] = [];
  for (let h = DAY_START_H; h < DAY_END_H; h++) {
    for (const m of [0, 30]) {
      if (h * 60 + m + durationMinutes <= DAY_END_H * 60) {
        slots.push({ h, m });
      }
    }
  }
  return slots;
}

// ── ICS fetching + parsing ────────────────────────────────────────────────────

interface BusyRange { start: Date; end: Date }

async function fetchBusyRanges(dateStr: string): Promise<BusyRange[]> {
  const icsUrl = process.env.OUTLOOK_ICS_URL;
  if (!icsUrl) return [];
  try {
    const res = await fetch(icsUrl, {
      headers: { "User-Agent": "sarrahrenfro-booking/1.0" },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const text = await res.text();
    return parseICSBusy(text, dateStr);
  } catch (err) {
    console.error("ICS fetch error:", err);
    return [];
  }
}

/** Unfold ICS line continuations (CRLF + whitespace) */
function unfold(ics: string): string {
  return ics.replace(/\r?\n[ \t]/g, "");
}

/**
 * Extract VEVENT properties including the TZID parameter.
 * Returns { value, tzid } for a given property name.
 */
function extractProp(block: string, prop: string): { value: string; tzid: string | null } | null {
  // Matches: PROP:value  OR  PROP;PARAM=...:value
  const re = new RegExp(
    `^${prop}((?:;[^:]+)*):(.*?)$`,
    "im"
  );
  const m = block.match(re);
  if (!m) return null;

  const params = m[1] ?? "";
  const value  = m[2].trim();

  // Extract TZID from params like ";TZID=Pacific Standard Time"
  const tzMatch = params.match(/;TZID=([^;:]+)/i);
  const tzid    = tzMatch ? tzMatch[1].trim() : null;

  return { value, tzid };
}

/** Parse an ICS datetime string to a UTC Date, respecting TZID. */
function parseICSDatetime(value: string, tzid: string | null): Date | null {
  // Normalise: remove any embedded Z or non-alphanumeric except T
  const clean = value.replace(/[^0-9T]/g, "");

  // All-day: YYYYMMDD
  if (clean.length === 8) {
    return new Date(`${clean.slice(0,4)}-${clean.slice(4,6)}-${clean.slice(6,8)}T00:00:00Z`);
  }

  // Datetime: YYYYMMDDTHHmmss
  if (clean.length < 15) return null;
  const y  = clean.slice(0, 4);
  const mo = clean.slice(4, 6);
  const d  = clean.slice(6, 8);
  const hh = clean.slice(9, 11);
  const mm = clean.slice(11, 13);
  const ss = clean.slice(13, 15);
  const local = new Date(`${y}-${mo}-${d}T${hh}:${mm}:${ss}`);

  // UTC (value ends in Z before normalisation)
  if (value.trimEnd().endsWith("Z")) {
    return new Date(`${y}-${mo}-${d}T${hh}:${mm}:${ss}Z`);
  }

  // Floating with TZID
  if (tzid) {
    const iana = winToIana(tzid);
    try {
      return fromZonedTime(local, iana);
    } catch {
      return fromZonedTime(local, PT); // safe fallback
    }
  }

  // Floating with no timezone — assume PT (most of Sarrah's events will be)
  return fromZonedTime(local, PT);
}

function parseICSBusy(ics: string, dateStr: string): BusyRange[] {
  const unfolded = unfold(ics);
  const events   = unfolded.split(/BEGIN:VEVENT/i);
  const busy: BusyRange[] = [];

  // Boundary of the target date in PT
  const [yr, mo, dy] = dateStr.split("-").map(Number);
  const dayStart = fromZonedTime(new Date(yr, mo - 1, dy, 0,  0,  0), PT);
  const dayEnd   = fromZonedTime(new Date(yr, mo - 1, dy, 23, 59, 59), PT);

  for (let i = 1; i < events.length; i++) {
    const block = events[i];

    // Skip transparent / free events
    const transp = extractProp(block, "TRANSP");
    if (transp?.value.toUpperCase() === "TRANSPARENT") continue;

    const busyStatus = extractProp(block, "X-MICROSOFT-CDO-BUSYSTATUS");
    if (busyStatus?.value.toUpperCase() === "FREE") continue;

    const startProp = extractProp(block, "DTSTART");
    const endProp   = extractProp(block, "DTEND");
    if (!startProp || !endProp) continue;

    const start = parseICSDatetime(startProp.value, startProp.tzid);
    const end   = parseICSDatetime(endProp.value,   endProp.tzid);
    if (!start || !end) continue;

    // Keep only events that overlap the target date
    if (start < dayEnd && end > dayStart) {
      busy.push({ start, end });
    }
  }

  return busy;
}

function overlaps(slotStart: Date, slotEnd: Date, busy: BusyRange[]): boolean {
  return busy.some((b) => slotStart < b.end && slotEnd > b.start);
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const dateParam     = searchParams.get("date");
  const durationParam = searchParams.get("duration");

  if (!dateParam || !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    return Response.json({ error: "Invalid date" }, { status: 400 });
  }

  const duration    = Math.max(15, Math.min(120, parseInt(durationParam ?? "30", 10) || 30));
  const localDate   = parseISO(dateParam);
  const dayOfWeek   = getDay(localDate);

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return Response.json({ available_times: [] });
  }

  const now  = new Date();
  const busy = await fetchBusyRanges(dateParam);

  const available = generateSlots(duration)
    .filter(({ h, m }) => {
      const slotStart = fromZonedTime(
        new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), h, m, 0),
        PT
      );
      const slotEnd = new Date(slotStart.getTime() + duration * 60_000);
      return !isBefore(slotStart, now) && !overlaps(slotStart, slotEnd, busy);
    })
    .map(({ h, m }) => to12h(h, m));

  return Response.json({ available_times: available });
}
