import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { RecordEditor } from "@/components/admin/RecordEditor";

export default function AdminStartseitePage() {
  return (
    <div>
      <AdminPageHeader
        title="Startseite"
        description="Hero-Bild, Titel und Einstiegstext auf der Startseite."
      />
      <RecordEditor
        file="pages/home"
        fields={[
          { key: "hero_title", label: "Hero-Titel", type: "text" },
          { key: "hero_subtitle", label: "Hero-Untertitel", type: "textarea" },
          { key: "hero_image_url", label: "Hero-Bild", type: "image", folder: "hero" },
          { key: "hero_cta_label", label: "Button 1 – Text", type: "text" },
          { key: "hero_cta_href", label: "Button 1 – Link", type: "text", help: "z. B. /atelier" },
          { key: "hero_cta_secondary_label", label: "Button 2 – Text", type: "text" },
          { key: "hero_cta_secondary_href", label: "Button 2 – Link", type: "text", help: "z. B. /standort" },
          { key: "intro_heading", label: "Einstieg – Überschrift", type: "text" },
          { key: "intro_text", label: "Einstieg – Text", type: "textarea" },
        ]}
      />
    </div>
  );
}
