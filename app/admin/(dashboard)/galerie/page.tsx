import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CollectionEditor } from "@/components/admin/CollectionEditor";

export default function AdminGaleriePage() {
  return (
    <div>
      <AdminPageHeader
        title="Galerie"
        description="Impressionen aus dem ATELIER — Laden, Produkte, Details, Stimmungen. Mit den Pfeilen änderst du die Reihenfolge."
      />
      <CollectionEditor
        file="gallery"
        titleKey="title"
        addLabel="Neues Bild"
        emptyLabel="Noch keine Bilder in der Galerie."
        fields={[
          { key: "image_url", label: "Bild", type: "image", folder: "gallery" },
          { key: "title", label: "Titel (optional)", type: "text" },
          { key: "description", label: "Beschreibung (optional)", type: "textarea" },
          { key: "category", label: "Kategorie (optional)", type: "text" },
        ]}
      />
    </div>
  );
}
