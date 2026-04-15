"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import DateTimePicker from "./components/DateTimePicker";
import BookingForm from "./components/BookingForm";
import BookingConfirmation from "./components/BookingConfirmation";

type Step = "datetime" | "form" | "confirmed";

export default function BookPage() {
  const [step,         setStep]         = useState<Step>("datetime");
  const [duration,     setDuration]     = useState(30);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [bookerName,   setBookerName]   = useState("");
  const [bookerEmail,  setBookerEmail]  = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError,  setSubmitError]  = useState("");

  function handleDateTimeSelect(date: Date, time: string) {
    setSelectedDate(date);
    setSelectedTime(time);
    setStep("form");
  }

  async function handleFormSubmit(data: { name: string; email: string; notes: string }) {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:             data.name,
          email:            data.email,
          notes:            data.notes,
          date:             selectedDate!.toISOString().split("T")[0],
          time:             selectedTime,
          duration_minutes: duration,
        }),
      });

      if (res.ok) {
        setBookerName(data.name);
        setBookerEmail(data.email);
        setStep("confirmed");
      } else {
        const json = await res.json();
        setSubmitError(json.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setStep("datetime");
    setSelectedDate(null);
    setSelectedTime("");
    setBookerName("");
    setBookerEmail("");
    setSubmitError("");
  }

  return (
    <div className="min-h-screen bg-light">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 py-4 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-terracotta">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-navy font-display">Book a Meeting</span>
        </div>

        {step === "datetime" && (
          <DateTimePicker
            duration={duration}
            onDurationChange={setDuration}
            onSelect={handleDateTimeSelect}
          />
        )}

        {step === "form" && selectedDate && (
          <>
            <BookingForm
              date={selectedDate}
              time={selectedTime}
              duration={duration}
              onBack={() => setStep("datetime")}
              onSubmit={handleFormSubmit}
              isSubmitting={isSubmitting}
            />
            {submitError && (
              <p className="mt-4 text-center text-sm text-red-500">{submitError}</p>
            )}
          </>
        )}

        {step === "confirmed" && selectedDate && (
          <BookingConfirmation
            date={selectedDate}
            time={selectedTime}
            duration={duration}
            bookerName={bookerName}
            bookerEmail={bookerEmail}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}
