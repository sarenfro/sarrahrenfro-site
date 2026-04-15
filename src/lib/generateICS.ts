export interface ICSEventParams {
  title: string;
  description: string;
  startISO: string; // ISO 8601 UTC string
  endISO: string;
  organizerEmail: string;
  organizerName: string;
  attendeeEmail: string;
  attendeeName: string;
}

function toICSDate(iso: string): string {
  // Convert ISO string to ICS YYYYMMDDTHHMMSSZ format
  return iso.replace(/[-:]/g, "").replace(".000", "");
}

function escapeICS(str: string): string {
  return str.replace(/[\\;,]/g, (c) => "\\" + c).replace(/\n/g, "\\n");
}

export function generateICS(params: ICSEventParams): string {
  const now = toICSDate(new Date().toISOString());
  const start = toICSDate(params.startISO);
  const end = toICSDate(params.endISO);
  const uid = `${now}-booking@sarrahrenfro.com`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//sarrahrenfro.com//Booking//EN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeICS(params.title)}`,
    `DESCRIPTION:${escapeICS(params.description)}`,
    `ORGANIZER;CN=${escapeICS(params.organizerName)}:mailto:${params.organizerEmail}`,
    `ATTENDEE;CN=${escapeICS(params.attendeeName)};ROLE=REQ-PARTICIPANT;RSVP=TRUE:mailto:${params.attendeeEmail}`,
    `ATTENDEE;CN=${escapeICS(params.organizerName)};ROLE=REQ-PARTICIPANT:mailto:${params.organizerEmail}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Meeting reminder",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
