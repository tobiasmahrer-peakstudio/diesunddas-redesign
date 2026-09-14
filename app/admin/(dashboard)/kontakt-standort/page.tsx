import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { RecordEditor } from "@/components/admin/RecordEditor";

export default function AdminKontaktStandortPage() {
  return (
    <div>
      <AdminPageHeader
        title="Kontakt & Standort"
        description="Adresse, Telefon, E-Mail und Google-Maps-Link. Öffnungszeiten pflegst du auf der eigenen Seite."
      />
      <RecordEditor
        file="site-settings"
        fields={[
          { key: "street", label: "Strasse & Hausnummer", type: "text" },
          { key: "postal_code", label: "PLZ", type: "text" },
          { key: "city", label: "Ort", type: "text" },
          { key: "country", label: "Land", type: "text" },
          { key: "phone", label: "Telefon", type: "text" },
          { key: "email", label: "E-Mail", type: "text" },
          {
            key: "google_maps_url",
            label: "Google-Maps-Link (optional)",
            type: "text",
            help: "Wird für den „Route planen“-Button verwendet. Ohne Link wird die Adresse automatisch verwendet.",
          },
        ]}
      />
    </div>
  );
}
