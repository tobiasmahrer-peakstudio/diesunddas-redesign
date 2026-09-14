import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CollectionEditor } from "@/components/admin/CollectionEditor";

export default function AdminAktuellesPage() {
  return (
    <div>
      <AdminPageHeader
        title="Aktuelles"
        description="Neuigkeiten, Kollektionen, saisonale Dekoration oder Events."
      />
      <CollectionEditor
        file="news"
        titleKey="title"
        subtitleKey="excerpt"
        hasSortOrder={false}
        addLabel="Neuer Beitrag"
        fields={[
          { key: "title", label: "Titel", type: "text", required: true },
          { key: "slug", label: "URL (Slug)", type: "text", required: true },
          { key: "cover_image_url", label: "Titelbild", type: "image", folder: "gallery" },
          { key: "published_at", label: "Datum (JJJJ-MM-TT)", type: "text" },
          { key: "category", label: "Kategorie (optional)", type: "text" },
          { key: "excerpt", label: "Kurztext", type: "textarea" },
          { key: "content", label: "Langtext", type: "textarea" },
        ]}
      />
    </div>
  );
}
