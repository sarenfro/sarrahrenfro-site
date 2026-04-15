"use client";

import { format, parseISO } from "date-fns";
import { CheckCircle2, Calendar, Clock, User, Download, ExternalLink } from "lucide-react";

interface BookingConfirmationProps {
  date: Date;
  time: string;
  duration: number;
  bookerName: string;
  bookerEmail: string;
  onReset: () => void;
}

function durationLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} minutes`;
  return minutes === 60 ? "1 hour" : `${Math.floor(minutes / 60)} hr ${minutes % 60 > 0 ? `${minutes % 60} min` : ""}`.trim();
}

function parseTime12(time: string): { h: number; m: number } {
  const match = time.match(/^(\d{1,2}):(\d{2})(am|pm)$/i);
  if (!match) return { h: 9, m: 0 };
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const period = match[3].toLowerCase();
  if (period === "pm" && h !== 12) h += 12;
  if (period === "am" && h === 12) h = 0;
  return { h, m };
}

function toUTCDate(date: Date, time: string, durationMinutes = 30): Date {
  const { h, m } = parseTime12(time);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, 0);
}

function formatICSDate(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `T${pad(d.getHours())}${pad(d.getMinutes())}00`
  );
}

function escape(s: string) {
  return s.replace(/[\\;,]/g, (c) => "\\" + c).replace(/\n/g, "\\n");
}

function buildGoogleURL(date: Date, time: string, duration: number, title: string, details: string): string {
  const start = toUTCDate(date, time);
  const end = new Date(start.getTime() + duration * 60_000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(".000Z", "Z");
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details,
  })}`;
}

function buildOutlookURL(date: Date, time: string, duration: number, title: string, body: string): string {
  const start = toUTCDate(date, time);
  const end = new Date(start.getTime() + duration * 60_000);
  return `https://outlook.live.com/calendar/0/action/compose?${new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: title,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    body,
  })}`;
}

function downloadICS(date: Date, time: string, duration: number, bookerName: string, bookerEmail: string) {
  const start = toUTCDate(date, time);
  const end = new Date(start.getTime() + duration * 60_000);
  const now = new Date();
  const uid = `${Date.now()}@sarrahrenfro.com`;
  const title = `Meeting with Sarrah Renfro`;
  const desc = `${durationLabel(duration)} meeting with Sarrah Renfro. Web conferencing details to follow.`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//sarrahrenfro.com//Booking//EN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatICSDate(now)}`,
    `DTSTART:${formatICSDate(start)}`,
    `DTEND:${formatICSDate(end)}`,
    `SUMMARY:${escape(title)}`,
    `DESCRIPTION:${escape(desc)}`,
    `ORGANIZER;CN=Sarrah Renfro:mailto:sarenfro@uw.edu`,
    `ATTENDEE;CN=${escape(bookerName)};ROLE=REQ-PARTICIPANT;RSVP=TRUE:mailto:${bookerEmail}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "meeting.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function BookingConfirmation({
  date,
  time,
  duration,
  bookerName,
  bookerEmail,
  onReset,
}: BookingConfirmationProps) {
  const title = "Meeting with Sarrah Renfro";
  const details = `Booked by ${bookerName} (${bookerEmail}). Web conferencing details to follow.`;
  const googleURL  = buildGoogleURL(date, time, duration, title, details);
  const outlookURL = buildOutlookURL(date, time, duration, title, details);

  return (
    <div className="max-w-lg mx-auto text-center space-y-8 py-6">
      {/* Success icon */}
      <div className="space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-navy font-display">You are scheduled</h2>
          <p className="text-stone text-sm">Add this meeting to your calendar using the options below.</p>
        </div>
      </div>

      {/* Summary card */}
      <div className="rounded-2xl border border-pebble bg-cream p-6 text-left space-y-4">
        <h3 className="font-semibold text-navy">{durationLabel(duration)} Meeting</h3>
        <div className="space-y-3 text-sm text-stone">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 shrink-0 text-terracotta" />
            <span>Sarrah Renfro</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 shrink-0 text-terracotta" />
            <span>{format(date, "EEEE, MMMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 shrink-0 text-terracotta" />
            <span>{time} ({durationLabel(duration)})</span>
          </div>
        </div>
      </div>

      {/* Calendar add buttons */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-navy">Add to your calendar</p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <a
            href={googleURL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-pebble bg-cream text-navy text-sm font-medium hover:border-terracotta hover:text-terracotta transition-all"
          >
            <ExternalLink className="h-4 w-4" />
            Google Calendar
          </a>
          <a
            href={outlookURL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-pebble bg-cream text-navy text-sm font-medium hover:border-terracotta hover:text-terracotta transition-all"
          >
            <ExternalLink className="h-4 w-4" />
            Outlook Calendar
          </a>
          <button
            onClick={() => downloadICS(date, time, duration, bookerName, bookerEmail)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-pebble bg-cream text-navy text-sm font-medium hover:border-terracotta hover:text-terracotta transition-all"
          >
            <Download className="h-4 w-4" />
            Download .ics
          </button>
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl border border-pebble bg-cream text-stone text-sm font-medium hover:text-navy hover:border-navy transition-all"
      >
        Schedule another meeting
      </button>
    </div>
  );
}
