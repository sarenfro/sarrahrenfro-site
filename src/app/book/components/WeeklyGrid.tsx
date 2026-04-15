"use client";

import { useState, useEffect, useMemo } from "react";
import {
  format,
  addWeeks,
  subWeeks,
  startOfWeek,
  addDays,
  isBefore,
  startOfDay,
  getDay,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WeeklyGridProps {
  duration: number;
  onSelect: (date: Date, time: string) => void;
}

// All :00 and :30 start times. Filtered per-day by the API.
const ALL_ROW_TIMES = [
  "9:00am",  "9:30am",
  "10:00am", "10:30am",
  "11:00am", "11:30am",
  "12:00pm", "12:30pm",
  "1:00pm",  "1:30pm",
  "2:00pm",  "2:30pm",
  "3:00pm",  "3:30pm",
  "4:00pm",  "4:30pm",
];

function weekdaysFrom(weekStart: Date): Date[] {
  return Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));
}

type SlotMap = Record<string, string[]>; // "YYYY-MM-DD" → available times

export default function WeeklyGrid({ duration, onSelect }: WeeklyGridProps) {
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [slotMap, setSlotMap] = useState<SlotMap>({});
  const [loading, setLoading] = useState(false);

  const weekDays = useMemo(() => weekdaysFrom(weekStart), [weekStart]);

  // Filter rows: only show times that are valid start times for this duration
  const rowTimes = useMemo(() => {
    const endHour = 17 * 60; // 5:00pm in minutes
    return ALL_ROW_TIMES.filter((t) => {
      const m = parseTime(t);
      return m + duration <= endHour;
    });
  }, [duration]);

  useEffect(() => {
    const fetchWeek = async () => {
      setLoading(true);
      const results = await Promise.all(
        weekDays.map(async (day) => {
          const isWeekend = getDay(day) === 0 || getDay(day) === 6;
          const isPast    = isBefore(day, startOfDay(new Date()));
          if (isWeekend || isPast) return { date: format(day, "yyyy-MM-dd"), times: [] };

          try {
            const res = await fetch(
              `/api/availability?date=${format(day, "yyyy-MM-dd")}&duration=${duration}`
            );
            const json = await res.json();
            return { date: format(day, "yyyy-MM-dd"), times: json.available_times ?? [] };
          } catch {
            return { date: format(day, "yyyy-MM-dd"), times: [] };
          }
        })
      );

      const map: SlotMap = {};
      for (const r of results) map[r.date] = r.times;
      setSlotMap(map);
      setLoading(false);
    };

    fetchWeek();
  }, [weekStart, duration]);

  const isPrevDisabled = isBefore(
    subWeeks(weekStart, 1),
    startOfWeek(startOfDay(new Date()), { weekStartsOn: 1 })
  );

  const headerLabel = `${format(weekDays[0], "MMM d")} – ${format(weekDays[4], "MMM d, yyyy")}`;

  return (
    <div className="space-y-4">
      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setWeekStart((w) => subWeeks(w, 1))}
          disabled={isPrevDisabled}
          className="p-1.5 rounded-md hover:bg-light transition-colors text-stone hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous week"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="text-base font-semibold text-navy">{headerLabel}</h3>
        <button
          onClick={() => setWeekStart((w) => addWeeks(w, 1))}
          className="p-1.5 rounded-md hover:bg-light transition-colors text-stone hover:text-navy"
          aria-label="Next week"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Grid */}
      <div className="rounded-xl border border-pebble bg-cream overflow-x-auto">
        <div className="min-w-[540px]">
          {/* Day header row */}
          <div
            className="grid border-b border-pebble"
            style={{ gridTemplateColumns: "72px repeat(5, 1fr)" }}
          >
            <div className="p-2 border-r border-pebble" />
            {weekDays.map((day) => {
              const today = isToday(day);
              return (
                <div
                  key={day.toISOString()}
                  className="p-2 text-center border-r border-pebble last:border-r-0"
                >
                  <p className={`text-xs font-medium ${today ? "text-terracotta" : "text-stone"}`}>
                    {format(day, "EEE")}
                  </p>
                  <p
                    className={[
                      "text-sm font-bold mt-0.5 mx-auto w-7 h-7 flex items-center justify-center rounded-full",
                      today ? "bg-terracotta text-white" : "text-navy",
                    ].join(" ")}
                  >
                    {format(day, "d")}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Time rows */}
          {loading ? (
            <div className="py-16 text-center text-stone text-sm">
              <div className="inline-flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-pebble border-t-terracotta animate-spin" />
                Loading schedule…
              </div>
            </div>
          ) : (
            rowTimes.map((time, rowIdx) => (
              <div
                key={time}
                className={[
                  "grid border-b border-pebble last:border-b-0",
                  rowIdx % 2 === 0 ? "" : "bg-sand/40",
                ].join(" ")}
                style={{ gridTemplateColumns: "72px repeat(5, 1fr)" }}
              >
                {/* Time label */}
                <div className="p-2 text-xs text-stone border-r border-pebble flex items-center justify-end pr-3 font-medium">
                  {time}
                </div>

                {/* Day cells */}
                {weekDays.map((day) => {
                  const dateStr    = format(day, "yyyy-MM-dd");
                  const daySlots   = slotMap[dateStr] ?? [];
                  const available  = daySlots.includes(time);
                  const isPastDay  = isBefore(day, startOfDay(new Date()));
                  const isWeekend  = getDay(day) === 0 || getDay(day) === 6;

                  return (
                    <div
                      key={day.toISOString()}
                      className="p-1 border-r border-pebble last:border-r-0 min-h-[40px] flex items-center justify-center"
                    >
                      {available ? (
                        <button
                          onClick={() => onSelect(day, time)}
                          className="w-full rounded-lg px-2 py-1.5 text-xs font-semibold bg-terracotta/10 text-terracotta border border-terracotta/30 hover:bg-terracotta hover:text-white transition-all"
                        >
                          {time}
                        </button>
                      ) : !isPastDay && !isWeekend ? (
                        <div className="w-full rounded-lg px-2 py-1.5 bg-light/60 border border-pebble/50 min-h-[32px]" />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>

      <p className="text-xs text-stone text-center">All times in Pacific Time (PT)</p>
    </div>
  );
}

/** Convert "9:00am" → total minutes since midnight */
function parseTime(time: string): number {
  const m = time.match(/^(\d{1,2}):(\d{2})(am|pm)$/i);
  if (!m) return 0;
  let h   = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (m[3].toLowerCase() === "pm" && h !== 12) h += 12;
  if (m[3].toLowerCase() === "am" && h === 12) h = 0;
  return h * 60 + min;
}
