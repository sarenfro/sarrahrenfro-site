"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ChevronLeft, Calendar, Clock, User } from "lucide-react";

interface BookingFormProps {
  date: Date;
  time: string;
  duration: number;
  onBack: () => void;
  onSubmit: (data: { name: string; email: string; notes: string }) => void;
  isSubmitting: boolean;
}

function durationLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} minutes`;
  return minutes === 60 ? "1 hour" : `${Math.floor(minutes / 60)} hr ${minutes % 60 > 0 ? `${minutes % 60} min` : ""}`.trim();
}

export default function BookingForm({
  date,
  time,
  duration,
  onBack,
  onSubmit,
  isSubmitting,
}: BookingFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ name, email, notes });
  }

  return (
    <div className="flex flex-col lg:flex-row gap-0 rounded-2xl border border-pebble bg-cream overflow-hidden shadow-sm max-w-3xl mx-auto">
      {/* Left panel — summary */}
      <div className="w-full lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-pebble p-6 space-y-4">
        <button
          onClick={onBack}
          className="text-sm text-stone hover:text-navy transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>

        <div className="space-y-1">
          <p className="text-sm text-stone">Sarrah Renfro</p>
          <h2 className="text-xl font-bold text-navy font-display">30 Minute Meeting</h2>
        </div>

        <div className="space-y-3 text-sm text-stone">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0 text-terracotta" />
            <span>{format(date, "EEEE, MMMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-terracotta" />
            <span>{time} ({durationLabel(duration)})</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 shrink-0 text-terracotta" />
            <span>Sarrah Renfro</span>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 p-6">
        <h3 className="text-lg font-semibold text-navy mb-6">Enter Details</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-navy">
              Name <span className="text-terracotta">*</span>
            </label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full border border-pebble rounded-xl px-4 py-3 text-charcoal text-sm placeholder:text-stone focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/10 transition-all bg-sand"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-navy">
              Email <span className="text-terracotta">*</span>
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full border border-pebble rounded-xl px-4 py-3 text-charcoal text-sm placeholder:text-stone focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/10 transition-all bg-sand"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-navy">
              Additional Notes{" "}
              <span className="text-stone font-normal">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Please share anything that will help prepare for our meeting."
              rows={4}
              className="w-full border border-pebble rounded-xl px-4 py-3 text-charcoal text-sm placeholder:text-stone focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/10 transition-all bg-sand resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-terracotta text-white font-medium py-3 rounded-xl hover:bg-terracotta-dark transition-colors disabled:opacity-60"
          >
            {isSubmitting ? "Scheduling..." : "Schedule Event"}
          </button>
        </form>
      </div>
    </div>
  );
}
