import { type NextRequest } from "next/server";
import ICAL from "ical.js";
import { parseISO, getDay, isBefore } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

const PT = "America/Los_Angeles";
const DAY_START_H = 9;
const DAY_END_H   = 17;

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

function parseICSBusy(icsText: string, dateStr: string): BusyRange[] {
  const [yr, mo, dy] = dateStr.split("-").map(Number);
  const dayStart = fromZonedTime(new Date(yr, mo - 1, dy, 0,  0,  0), PT);
  const dayEnd   = fromZonedTime(new Date(yr, mo - 1, dy, 23, 59, 59), PT);

  let jCal: unknown;
  try {
    jCal = ICAL.parse(icsText);
  } catch {
    return [];
  }

  const vcal = new ICAL.Component(jCal as ICAL.Component["jCal"]);

  // Register all VTIMEZONE components so ical.js resolves them correctly
  for (const vtz of vcal.getAllSubcomponents("vtimezone")) {
    try {
      ICAL.TimezoneService.register(new ICAL.Timezone(vtz));
    } catch {
      // ignore unknown/malformed timezones
    }
  }

  const busy: BusyRange[] = [];

  for (const vevent of vcal.getAllSubcomponents("vevent")) {
    const transp      = vevent.getFirstPropertyValue("transp");
    const busyStatus  = vevent.getFirstPropertyValue("x-microsoft-cdo-busystatus");

    if (typeof transp     === "string" && transp.toUpperCase()     === "TRANSPARENT") continue;
    if (typeof busyStatus === "string" && busyStatus.toUpperCase() === "FREE")        continue;

    const event = new ICAL.Event(vevent);

    if (event.isRecurring()) {
      const iter = event.iterator();
      let next: ICAL.Time | null;
      let count = 0;

      while (count++ < 1000 && !iter.complete && (next = iter.next())) {
        const occStart = next.toJSDate();
        if (occStart > dayEnd) break;

        const details  = event.getOccurrenceDetails(next);
        const occEnd   = details.endDate.toJSDate();

        if (occStart < dayEnd && occEnd > dayStart) {
          busy.push({ start: occStart, end: occEnd });
        }
      }
    } else {
      const start = event.startDate.toJSDate();
      const end   = event.endDate.toJSDate();

      if (start < dayEnd && end > dayStart) {
        busy.push({ start, end });
      }
    }
  }

  return busy;
}

function overlaps(slotStart: Date, slotEnd: Date, busy: BusyRange[]): boolean {
  return busy.some((b) => slotStart < b.end && slotEnd > b.start);
}

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
