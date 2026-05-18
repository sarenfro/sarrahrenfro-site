import { type NextRequest } from "next/server";
import { Resend } from "resend";
import { fromZonedTime } from "date-fns-tz";
import { generateICS } from "@/lib/generateICS";

const MY_NAME = "Sarrah Renfro";
const PT = "America/Los_Angeles";

function parseSlotUTC(dateStr: string, timeStr: string): Date {
  // timeStr format from availability API: "9:00am", "10:30pm", etc.
  const match = timeStr.match(/^(\d+):(\d{2})(am|pm)$/i);
  if (!match) throw new Error(`Invalid time format: ${timeStr}`);
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const period = match[3].toLowerCase();
  if (period === "pm" && h !== 12) h += 12;
  if (period === "am" && h === 12) h = 0;
  const [yr, mo, dy] = dateStr.split("-").map(Number);
  return fromZonedTime(new Date(yr, mo - 1, dy, h, m, 0), PT);
}

function buildConfirmationHTML(params: {
  bookerName: string;
  date: string;
  time: string;
  notes?: string;
  isHost: boolean;
}): string {
  const { bookerName, date, time, notes, isHost } = params;
  const intro = isHost
    ? `<p><strong>${bookerName}</strong> just booked a 30-minute meeting with you.</p>`
    : `<p>Hi ${bookerName},</p><p>Your 30-minute meeting with ${MY_NAME} is confirmed.</p>`;

  return `
    <div style="font-family: sans-serif; max-width: 540px; margin: 0 auto; color: #1E293B;">
      <h2 style="color: #0F172A;">${isHost ? `New booking: ${bookerName}` : "Your meeting is confirmed"}</h2>
      ${intro}
      <table style="margin: 20px 0; border-collapse: collapse; width: 100%;">
        <tr>
          <td style="padding: 8px 0; color: #64748B; width: 100px; vertical-align: top;">Date</td>
          <td style="padding: 8px 0; font-weight: 600;">${date}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748B; vertical-align: top;">Time</td>
          <td style="padding: 8px 0; font-weight: 600;">${time} (Pacific Time)</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748B; vertical-align: top;">Duration</td>
          <td style="padding: 8px 0;">30 minutes</td>
        </tr>
        ${notes ? `<tr><td style="padding: 8px 0; color: #64748B; vertical-align: top;">Notes</td><td style="padding: 8px 0;">${notes}</td></tr>` : ""}
      </table>
      <p style="color: #64748B; font-size: 14px;">Web conferencing details will be shared before the meeting.</p>
    </div>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, notes, date, time, duration_minutes } = body as {
      name: string;
      email: string;
      notes?: string;
      date: string;
      time: string;
      duration_minutes?: number;
    };

    if (!name || !email || !date || !time) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const MY_EMAIL = process.env.MY_EMAIL;
    const RESEND_KEY = process.env.RESEND_API_KEY;

    // Send emails if Resend is configured
    if (RESEND_KEY && MY_EMAIL) {
      const resend = new Resend(RESEND_KEY);

      const durationMins = duration_minutes ?? 30;
      const startUTC = parseSlotUTC(date, time);
      const endUTC   = new Date(startUTC.getTime() + durationMins * 60_000);

      const ics = generateICS({
        title:          `Meeting: ${name} + ${MY_NAME}`,
        description:    notes ?? "",
        startISO:       startUTC.toISOString(),
        endISO:         endUTC.toISOString(),
        organizerEmail: MY_EMAIL,
        organizerName:  MY_NAME,
        attendeeEmail:  email,
        attendeeName:   name,
      });

      const icsAttachment = {
        filename:     "meeting.ics",
        content:      Buffer.from(ics),
        content_type: "text/calendar; method=REQUEST",
      };

      await Promise.all([
        // Confirmation to booker
        resend.emails.send({
          from:        `${MY_NAME} <bookings@sarrahrenfro.com>`,
          to:          email,
          subject:     "Your meeting is confirmed",
          html:        buildConfirmationHTML({ bookerName: name, date, time, notes, isHost: false }),
          attachments: [icsAttachment],
        }),
        // Notification to Sarrah
        resend.emails.send({
          from:        `Booking System <bookings@sarrahrenfro.com>`,
          to:          MY_EMAIL,
          subject:     `New booking: ${name} — ${date} at ${time}`,
          html:        buildConfirmationHTML({ bookerName: name, date, time, notes, isHost: true }),
          attachments: [icsAttachment],
        }),
      ]);
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Booking error:", err);
    return Response.json({ error: "Booking failed. Please try again." }, { status: 500 });
  }
}
