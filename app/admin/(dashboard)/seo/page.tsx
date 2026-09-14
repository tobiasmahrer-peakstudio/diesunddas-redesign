import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CollectionEditor } from "@/components/admin/CollectionEditor";

export default function AdminSeoPage() {
  return (
    <div>
      <AdminPageHeader
        title="SEO"
        description="Suchmaschinen-Titel, Beschreibung und Vorschaubild pro Seite. Ohne Eintrag wird der Standardtext der jeweiligen Seite verwendet."
      />
      <CollectionEditor
        file="seo"
        titleKey="path"
        subtitleKey="title"
        hasActive={false}
        hasSortOrder={false}
        addLabel="Neue Seiten-Einstellung"
        emptyLabel="Noch keine eigenen SEO-Einstellungen hinterlegt."
        fields={[
          { key: "path", label: "Seiten-Pfad (z. B. /sortiment/wohnen)", type: "text", required: true },
          { key: "title", label: "SEO-Titel", type: "text" },
          { key: "description", label: "Meta-Beschreibung", type: "textarea" },
          { key: "og_image_url", label: "Vorschaubild", type: "image", folder: "hero" },
        ]}
      />
    </div>
  );
}
