"use client";

import { useEffect, useState } from "react";
import { NotConnectedNotice } from "@/components/admin/NotConnectedNotice";
import { weekdayLabels } from "@/lib/placeholders/content";
import type { OpeningHours, Weekday } from "@/types/database";

const weekdayOrder: Weekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const defaultHours: OpeningHours[] = weekdayOrder.map((weekday) => ({
  weekday,
  closed: weekday === "monday" || weekday === "sunday",
  morning_from: null,
  morning_to: null,
  afternoon_from: null,
  afternoon_to: null,
}));

export function WeeklyHoursEditor() {
  const [hours, setHours] = useState<OpeningHours[]>(defaultHours);
  const [loading, setLoading] = useState(true);
  const [notConnected, setNotConnected] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch("/api/admin/content/opening-hours");
      if (res.status === 401) {
        setNotConnected(true);
        setLoading(false);
        return;
      }
      const body = await res.json();
      const data: OpeningHours[] | null = body.data;
      if (data && data.length > 0) {
        setHours(weekdayOrder.map((w) => data.find((d) => d.weekday === w) ?? defaultHours.find((d) => d.weekday === w)!));
      }
      setLoading(false);
    }
    load();
  }, []);

  function update(weekday: Weekday, patch: Partial<OpeningHours>) {
    setHours((prev) => prev.map((h) => (h.weekday === weekday ? { ...h, ...patch } : h)));
  }

  async function handleSave() {
    setSaving(true);
    const payload = hours.map((day) => ({
      weekday: day.weekday,
      closed: day.closed,
      morning_from: day.closed ? null : day.morning_from || null,
      morning_to: day.closed ? null : day.morning_to || null,
      afternoon_from: day.closed ? null : day.afternoon_from || null,
      afternoon_to: day.closed ? null : day.afternoon_to || null,
    }));

    const res = await fetch("/api/admin/content/opening-hours", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.status === 503) setNotConnected(true);
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  if (notConnected) return <NotConnectedNotice />;
  if (loading) return <p className="text-[var(--color-ink-muted)]">Wird geladen …</p>;

  return (
    <div>
      <div className="flex flex-col gap-3">
        {hours.map((day) => (
          <div
            key={day.weekday}
            className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-[var(--color-beige)] bg-[var(--color-paper)] p-4 sm:flex-row sm:items-center"
          >
            <p className="w-28 shrink-0 font-medium text-[var(--color-ink)]">
              {weekdayLabels[day.weekday]}
            </p>

            <label className="flex shrink-0 items-center gap-2 text-sm text-[var(--color-ink-soft)]">
              <input
                type="checkbox"
                checked={day.closed}
                onChange={(e) => update(day.weekday, { closed: e.target.checked })}
                className="h-4 w-4"
              />
              geschlossen
            </label>

            {!day.closed && (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <TimeInput
                  value={day.morning_from}
                  onChange={(v) => update(day.weekday, { morning_from: v })}
                />
                <span>–</span>
                <TimeInput
                  value={day.morning_to}
                  onChange={(v) => update(day.weekday, { morning_to: v })}
                />
                <span className="text-[var(--color-ink-muted)]">Pause</span>
                <TimeInput
                  value={day.afternoon_from}
                  onChange={(v) => update(day.weekday, { afternoon_from: v })}
                />
                <span>–</span>
                <TimeInput
                  value={day.afternoon_to}
                  onChange={(v) => update(day.weekday, { afternoon_to: v })}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-ink)] px-6 py-3 text-sm font-medium text-[var(--color-cream)] hover:bg-[var(--color-terracotta-dark)] disabled:opacity-60"
        >
          {saving ? "Speichert …" : "Änderungen veröffentlichen"}
        </button>
        {saved && <span className="text-sm text-[var(--color-sage-dark)]">Gespeichert.</span>}
      </div>
    </div>
  );
}

function TimeInput({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="time"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-[var(--radius-sm)] border border-[var(--color-beige)] bg-[var(--color-cream)] px-2 py-1.5 text-[var(--color-ink)] outline-none focus:border-[var(--color-terracotta)]"
    />
  );
}
