import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CollectionEditor } from "@/components/admin/CollectionEditor";

export default function AdminGeschenkePage() {
  return (
    <div>
      <AdminPageHeader
        title="Geschenke"
        description="Geschenkkörbe, Geschenksets, Mitbringsel und individuelle Ideen. Preis ist optional."
      />
      <CollectionEditor
        file="gifts"
        titleKey="title"
        subtitleKey="description"
        addLabel="Neue Geschenkidee"
        fields={[
          { key: "title", label: "Titel", type: "text", required: true },
          { key: "description", label: "Beschreibung", type: "textarea" },
          { key: "image_url", label: "Bild", type: "image", folder: "products" },
          {
            key: "type",
            label: "Art",
            type: "select",
            options: [
              { value: "geschenkkorb", label: "Geschenkkorb" },
              { value: "geschenkset", label: "Geschenkset" },
              { value: "mitbringsel", label: "Kleines Mitbringsel" },
              { value: "individuell", label: "Individuelle Geschenkidee" },
            ],
          },
          { key: "price", label: "Preis in CHF (optional)", type: "number" },
          { key: "link_href", label: "Link (optional)", type: "text" },
        ]}
      />
    </div>
  );
}
