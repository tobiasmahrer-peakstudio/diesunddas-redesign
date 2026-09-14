import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { RecordEditor } from "@/components/admin/RecordEditor";

export default function AdminRechtlichesPage() {
  return (
    <div>
      <AdminPageHeader
        title="Rechtliches"
        description="Impressum und Datenschutzerklärung. Bitte keine rechtlichen Texte erfinden — im Zweifel von einer Fachperson prüfen lassen."
      />
      <RecordEditor
        file="legal"
        fields={[
          { key: "impressum", label: "Impressum", type: "textarea" },
          { key: "datenschutz", label: "Datenschutzerklärung", type: "textarea" },
          { key: "lieferbedingungen", label: "Liefer- & Zahlungsbedingungen (optional)", type: "textarea" },
        ]}
      />
    </div>
  );
}
