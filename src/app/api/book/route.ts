import { type NextRequest } from "next/server";
import { Resend } from "resend";
import { fromZonedTime } from "date-fns-tz";
import { generateICS } from "@/lib/generateICS";
import { logBooking } from "@/lib/bookingLog";

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
  duration_minutes: number;
  notes?: string;
  isHost: boolean;
}): string {
  const { bookerName, date, time, duration_minutes, notes, isHost } = params;
  const durationLabel = duration_minutes < 60
    ? `${duration_minutes} minutes`
    : duration_minutes === 60 ? "1 hour" : `${Math.floor(duration_minutes / 60)} hr ${duration_minutes % 60 > 0 ? `${duration_minutes % 60} min` : ""}`.trim();

  const heading = isHost ? `New booking: ${bookerName}` : "Your meeting is confirmed";
  const intro   = isHost
    ? `<strong style="color:#0F172A;">${bookerName}</strong> just booked a ${durationLabel} meeting with you.`
    : `Hi ${bookerName}, your ${durationLabel} meeting with ${MY_NAME} is confirmed.`;

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:#94A3B8;white-space:nowrap;vertical-align:top;border-bottom:1px solid #F1F5F9;">${label}</td>
      <td style="padding:10px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;color:#1E293B;vertical-align:top;border-bottom:1px solid #F1F5F9;">${value}</td>
    </tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#F0F6FF;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F0F6FF;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;">

        <!-- Header card -->
        <tr><td style="background-color:#FFFFFF;border:1px solid #CBD5E1;border-bottom:none;border-radius:12px 12px 0 0;padding:32px 32px 28px;">
          <div style="width:36px;height:3px;background-color:#4D9EFF;border-radius:2px;margin-bottom:20px;"></div>
          <p style="margin:0 0 6px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#94A3B8;">Sarrah Renfro</p>
          <h1 style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:22px;font-weight:700;color:#0F172A;letter-spacing:-0.01em;">${heading}</h1>
        </td></tr>

        <!-- Intro -->
        <tr><td style="background-color:#FFFFFF;border-left:1px solid #CBD5E1;border-right:1px solid #CBD5E1;padding:0 32px 24px;">
          <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;color:#475569;line-height:1.65;">${intro}</p>
        </td></tr>

        <!-- Details table -->
        <tr><td style="background-color:#FFFFFF;border-left:1px solid #CBD5E1;border-right:1px solid #CBD5E1;padding:0 32px 28px;">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border:1px solid #E2E8F0;border-radius:8px;overflow:hidden;border-collapse:collapse;">
            ${row("Date", date)}
            ${row("Time", `${time} <span style="color:#94A3B8;font-size:12px;">Pacific Time</span>`)}
            ${row("Duration", durationLabel)}
            ${notes ? row("Notes", notes) : ""}
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background-color:#F8FAFD;border:1px solid #CBD5E1;border-top:1px solid #E2E8F0;border-radius:0 0 12px 12px;padding:20px 32px;">
          <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#64748B;line-height:1.5;">Web conferencing details will be shared before the meeting.</p>
          <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;color:#94A3B8;">sarrahrenfro.com</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
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

    const durationMins = duration_minutes ?? 30;
    await logBooking({ name, email, date, time, duration_minutes: durationMins, notes });

    const MY_EMAIL = process.env.MY_EMAIL;
    const RESEND_KEY = process.env.RESEND_API_KEY;

    // Send emails if Resend is configured
    if (RESEND_KEY && MY_EMAIL) {
      const resend = new Resend(RESEND_KEY);

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

      const [bookerResult, hostResult] = await Promise.all([
        // Confirmation to booker
        resend.emails.send({
          from:        `${MY_NAME} <bookings@sarrahrenfro.com>`,
          to:          email,
          subject:     "Your meeting is confirmed",
          html:        buildConfirmationHTML({ bookerName: name, date, time, duration_minutes: durationMins, notes, isHost: false }),
          attachments: [icsAttachment],
        }),
        // Notification to Sarrah
        resend.emails.send({
          from:        `Booking System <bookings@sarrahrenfro.com>`,
          to:          MY_EMAIL,
          subject:     `New booking: ${name} — ${date} at ${time}`,
          html:        buildConfirmationHTML({ bookerName: name, date, time, duration_minutes: durationMins, notes, isHost: true }),
          attachments: [icsAttachment],
        }),
      ]);

      if (bookerResult.error || hostResult.error) {
        const err = bookerResult.error ?? hostResult.error;
        console.error("Resend error:", err);
        return Response.json({ error: "Failed to send confirmation emails." }, { status: 500 });
      }
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Booking error:", err);
    return Response.json({ error: "Booking failed. Please try again." }, { status: 500 });
  }
}
