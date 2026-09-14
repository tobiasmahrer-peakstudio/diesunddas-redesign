import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CollectionEditor } from "@/components/admin/CollectionEditor";

export default function AdminInspirationPage() {
  return (
    <div>
      <AdminPageHeader
        title="Inspiration"
        description="Outfit-Inspirationen, Geschenkideen, Neuheiten und saisonale Inspiration."
      />
      <CollectionEditor
        file="inspirations"
        titleKey="title"
        subtitleKey="description"
        addLabel="Neue Inspiration"
        fields={[
          { key: "title", label: "Titel", type: "text", required: true },
          { key: "description", label: "Beschreibung", type: "textarea" },
          { key: "image_url", label: "Bild", type: "image", folder: "inspiration" },
          {
            key: "category",
            label: "Kategorie",
            type: "select",
            options: [
              { value: "outfit", label: "Outfit-Inspiration" },
              { value: "geschenkidee", label: "Geschenkidee" },
              { value: "neuheit", label: "Neuheit" },
              { value: "saisonal", label: "Saisonale Inspiration" },
            ],
          },
        ]}
      />
    </div>
  );
}
