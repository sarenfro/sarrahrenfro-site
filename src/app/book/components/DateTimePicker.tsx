"use client";

import { useState, useMemo, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
  getDay,
} from "date-fns";
import { ChevronLeft, ChevronRight, Globe, CalendarDays, LayoutGrid } from "lucide-react";
import WeeklyGrid from "./WeeklyGrid";

interface DateTimePickerProps {
  duration: number;
  onDurationChange: (d: number) => void;
  onSelect: (date: Date, time: string) => void;
}

const DAY_NAMES    = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const DURATIONS    = [
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "1 hr",   value: 60 },
];

type ViewMode = "calendar" | "grid";

export default function DateTimePicker({
  duration,
  onDurationChange,
  onSelect,
}: DateTimePickerProps) {
  const [view,          setView]          = useState<ViewMode>("calendar");
  const [currentMonth,  setCurrentMonth]  = useState(new Date());
  const [selectedDate,  setSelectedDate]  = useState<Date | null>(null);
  const [selectedTime,  setSelectedTime]  = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loadingTimes,  setLoadingTimes]  = useState(false);

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Duration label for sidebar
  const durationLabel = DURATIONS.find((d) => d.value === duration)?.label ?? `${duration} min`;

  // Calendar grid
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end   = endOfMonth(currentMonth);
    const days  = eachDayOfInterval({ start, end });
    const pad: (Date | null)[] = Array.from({ length: getDay(start) }, () => null);
    return [...pad, ...days];
  }, [currentMonth]);

  const isDateAvailable = (date: Date) => {
    const day = getDay(date);
    return day !== 0 && day !== 6 && !isBefore(date, startOfDay(new Date()));
  };

  const isPrevMonthDisabled = () => {
    const now = new Date();
    return (
      currentMonth.getFullYear() === now.getFullYear() &&
      currentMonth.getMonth()    === now.getMonth()
    );
  };

  // Fetch time slots when date or duration changes
  useEffect(() => {
    if (!selectedDate) return;
    setLoadingTimes(true);
    setAvailableTimes([]);
    setSelectedTime(null);

    fetch(`/api/availability?date=${format(selectedDate, "yyyy-MM-dd")}&duration=${duration}`)
      .then((r) => r.json())
      .then((data) => setAvailableTimes(data.available_times ?? []))
      .catch(() => setAvailableTimes([]))
      .finally(() => setLoadingTimes(false));
  }, [selectedDate, duration]);

  function handleTimeSelect(time: string) {
    setSelectedTime(time);
    if (selectedDate) onSelect(selectedDate, time);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-0 rounded-2xl border border-pebble bg-cream overflow-hidden shadow-sm max-w-5xl mx-auto">

      {/* ── Left sidebar ─────────────────────────────────────── */}
      <div className="w-full lg:w-60 shrink-0 border-b lg:border-b-0 lg:border-r border-pebble p-6 flex flex-col gap-5">
        <div className="space-y-1">
          <p className="text-sm text-stone">Sarrah Renfro</p>
          <h2 className="text-xl font-bold text-navy font-display">Book a Meeting</h2>
        </div>

        {/* Duration picker */}
        <div>
          <p className="text-xs font-medium text-stone uppercase tracking-wide mb-2">Duration</p>
          <div className="grid grid-cols-2 gap-1.5">
            {DURATIONS.map((d) => (
              <button
                key={d.value}
                onClick={() => {
                  onDurationChange(d.value);
                  setSelectedDate(null);
                  setSelectedTime(null);
                }}
                className={[
                  "py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all",
                  duration === d.value
                    ? "bg-terracotta text-white border-terracotta"
                    : "bg-white text-navy border-pebble hover:border-terracotta hover:text-terracotta",
                ].join(" ")}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-stone">
          <span className="inline-flex items-center justify-center h-5 w-5 rounded bg-light text-xs shrink-0">🕐</span>
          {durationLabel}
        </div>

        <div className="flex items-start gap-2 text-sm text-stone">
          <span className="inline-flex items-center justify-center h-5 w-5 rounded bg-light text-xs shrink-0 mt-0.5">📹</span>
          <span>Web conferencing details provided upon confirmation.</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-stone mt-auto pt-4 border-t border-pebble">
          <Globe className="h-4 w-4 shrink-0" />
          <span className="truncate text-xs">{timezone}</span>
        </div>
      </div>

      {/* ── Main area ────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 p-6 flex flex-col gap-4">

        {/* View toggle */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-navy">Select a Date &amp; Time</h3>
          <div className="flex border border-pebble rounded-lg overflow-hidden">
            <button
              onClick={() => setView("calendar")}
              className={[
                "px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-colors",
                view === "calendar"
                  ? "bg-terracotta text-white"
                  : "bg-cream text-stone hover:text-navy",
              ].join(" ")}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              Calendar
            </button>
            <button
              onClick={() => setView("grid")}
              className={[
                "px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-colors border-l border-pebble",
                view === "grid"
                  ? "bg-terracotta text-white"
                  : "bg-cream text-stone hover:text-navy",
              ].join(" ")}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Agenda
            </button>
          </div>
        </div>

        {/* ── Calendar view ──────────────────────────────────── */}
        {view === "calendar" && (
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-0">

            {/* Month grid */}
            <div className="flex-1">
              {/* Month nav */}
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-navy">{format(currentMonth, "MMMM yyyy")}</h4>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
                    disabled={isPrevMonthDisabled()}
                    className="p-1.5 rounded-md hover:bg-light transition-colors text-stone hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
                    className="p-1.5 rounded-md hover:bg-light transition-colors text-stone hover:text-navy"
                    aria-label="Next month"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {DAY_NAMES.map((d) => (
                  <div key={d} className="text-center text-xs font-medium text-stone py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Date cells */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => {
                  if (!day) return <div key={`empty-${i}`} />;
                  const available = isDateAvailable(day);
                  const selected  = selectedDate ? isSameDay(day, selectedDate) : false;
                  const today     = isToday(day);

                  return (
                    <div key={day.toISOString()} className="flex flex-col items-center">
                      <button
                        onClick={() => {
                          if (available) {
                            setSelectedDate(day);
                            setSelectedTime(null);
                          }
                        }}
                        disabled={!available}
                        className={[
                          "relative h-10 w-full rounded-full text-sm font-medium transition-all",
                          selected
                            ? "bg-terracotta text-white shadow-sm"
                            : available
                            ? "text-navy hover:bg-light cursor-pointer"
                            : "text-stone/40 cursor-not-allowed",
                          today && !selected ? "font-bold" : "",
                        ].join(" ")}
                        aria-pressed={selected}
                        aria-label={format(day, "MMMM d, yyyy")}
                      >
                        {format(day, "d")}
                        {today && (
                          <span
                            className={[
                              "absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full",
                              selected ? "bg-white/70" : "bg-terracotta",
                            ].join(" ")}
                          />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Time slots — right of calendar after date selected */}
            {selectedDate && (
              <div className="lg:w-44 shrink-0 lg:border-l border-t lg:border-t-0 border-pebble lg:pl-4 pt-4 lg:pt-0 space-y-2 max-h-[380px] overflow-y-auto">
                <h4 className="text-sm font-semibold text-navy">
                  {format(selectedDate, "EEE, MMM d")}
                </h4>

                {loadingTimes ? (
                  <div className="flex items-center gap-2 py-4 text-stone text-sm">
                    <div className="h-4 w-4 rounded-full border-2 border-pebble border-t-terracotta animate-spin shrink-0" />
                    Loading…
                  </div>
                ) : availableTimes.length === 0 ? (
                  <p className="text-sm text-stone py-4">No available times.</p>
                ) : (
                  availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={[
                        "w-full py-2.5 rounded-xl border text-sm font-medium transition-all",
                        selectedTime === time
                          ? "bg-terracotta text-white border-terracotta"
                          : "bg-white text-navy border-pebble hover:border-terracotta hover:text-terracotta",
                      ].join(" ")}
                    >
                      {time}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Agenda / grid view ─────────────────────────────── */}
        {view === "grid" && (
          <WeeklyGrid duration={duration} onSelect={onSelect} />
        )}
      </div>
    </div>
  );
}
