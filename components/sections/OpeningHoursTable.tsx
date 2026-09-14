import { weekdayLabels } from "@/lib/placeholders/content";
import type { OpeningHours, SpecialOpeningHours } from "@/types/database";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function OpeningHoursTable({
  hours,
  specialHours,
}: {
  hours: OpeningHours[];
  specialHours: SpecialOpeningHours[];
}) {
  return (
    <div className="mt-4">
      <table className="w-full border-collapse text-left">
        <tbody>
          {hours.map((day) => (
            <tr key={day.weekday} className="border-b border-[var(--color-beige)]">
              <td className="py-3 pr-4 text-sm font-medium text-[var(--color-ink)]">
                {weekdayLabels[day.weekday]}
              </td>
              <td className="py-3 text-sm text-[var(--color-ink-soft)]">
                {day.closed ? (
                  "geschlossen"
                ) : (
                  <div className="flex flex-col gap-0.5">
                    {day.morning_from && (
                      <span>
                        {day.morning_from}–{day.morning_to}
                      </span>
                    )}
                    {day.afternoon_from && (
                      <span>
                        {day.afternoon_from}–{day.afternoon_to}
                      </span>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {specialHours.length > 0 && (
        <div className="mt-8">
          <h3 className="h-eyebrow mb-3">Sonderöffnungszeiten</h3>
          <ul className="flex flex-col gap-2">
            {specialHours.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--color-terracotta)] bg-[var(--color-paper)] px-4 py-2.5 text-sm"
              >
                <span className="font-medium text-[var(--color-ink)]">
                  {formatDate(entry.date)}
                  {entry.note && <span className="ml-2 text-[var(--color-ink-muted)]">{entry.note}</span>}
                </span>
                <span className="text-[var(--color-ink-soft)]">
                  {entry.closed ? "geschlossen" : `${entry.from_time}–${entry.to_time}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
