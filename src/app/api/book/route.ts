import { type NextRequest } from "next/server";
import { Resend } from "resend";

const MY_NAME = "Sarrah Renfro";

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
    const { name, email, notes, date, time } = body as {
      name: string;
      email: string;
      notes?: string;
      date: string;
      time: string;
    };

    if (!name || !email || !date || !time) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const MY_EMAIL = process.env.MY_EMAIL;
    const RESEND_KEY = process.env.RESEND_API_KEY;

    // Send emails if Resend is configured
    if (RESEND_KEY && MY_EMAIL) {
      const resend = new Resend(RESEND_KEY);

      await Promise.all([
        // Confirmation to booker
        resend.emails.send({
          from: `${MY_NAME} <onboarding@resend.dev>`,
          to: email,
          subject: "Your meeting is confirmed",
          html: buildConfirmationHTML({ bookerName: name, date, time, notes, isHost: false }),
        }),
        // Notification to Sarrah
        resend.emails.send({
          from: `Booking System <onboarding@resend.dev>`,
          to: MY_EMAIL,
          subject: `New booking: ${name} — ${date} at ${time}`,
          html: buildConfirmationHTML({ bookerName: name, date, time, notes, isHost: true }),
        }),
      ]);
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Booking error:", err);
    return Response.json({ error: "Booking failed. Please try again." }, { status: 500 });
  }
}
