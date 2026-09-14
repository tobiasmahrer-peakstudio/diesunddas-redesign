import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { WeeklyHoursEditor } from "@/components/admin/WeeklyHoursEditor";
import { CollectionEditor } from "@/components/admin/CollectionEditor";

export default function AdminOeffnungszeitenPage() {
  return (
    <div>
      <AdminPageHeader
        title="Öffnungszeiten"
        description="Reguläre Öffnungszeiten pro Wochentag sowie Sonderöffnungszeiten für Feiertage & Co."
      />

      <section className="mb-14">
        <h2 className="h-eyebrow mb-4">Reguläre Öffnungszeiten</h2>
        <WeeklyHoursEditor />
      </section>

      <section>
        <h2 className="h-eyebrow mb-4">Sonderöffnungszeiten</h2>
        <p className="mb-4 text-sm text-[var(--color-ink-muted)]">
          Werden auf der Standort-Seite bevorzugt angezeigt, z. B. an Feiertagen.
        </p>
        <CollectionEditor
          file="special-opening-hours"
          titleKey="date"
          hasActive={false}
          hasSortOrder={false}
          addLabel="Sondertermin hinzufügen"
          emptyLabel="Keine Sonderöffnungszeiten eingetragen."
          fields={[
            { key: "date", label: "Datum (JJJJ-MM-TT)", type: "text", required: true },
            { key: "closed", label: "An diesem Tag geschlossen", type: "checkbox" },
            { key: "from_time", label: "Von (HH:MM)", type: "text" },
            { key: "to_time", label: "Bis (HH:MM)", type: "text" },
            { key: "note", label: "Notiz (optional)", type: "text" },
          ]}
        />
      </section>
    </div>
  );
}
