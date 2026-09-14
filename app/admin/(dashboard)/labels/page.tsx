import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CollectionEditor } from "@/components/admin/CollectionEditor";

export default function AdminLabelsPage() {
  return (
    <div>
      <AdminPageHeader
        title="Labels"
        description="Regionale Marken und kleine Labels, die im ATELIER geführt werden."
      />
      <CollectionEditor
        file="brands"
        titleKey="name"
        subtitleKey="description"
        addLabel="Neues Label"
        fields={[
          { key: "name", label: "Labelname", type: "text", required: true },
          { key: "description", label: "Beschreibung", type: "textarea" },
          { key: "logo_url", label: "Logo", type: "image", folder: "brands" },
          { key: "image_url", label: "Bild (optional)", type: "image", folder: "brands" },
          { key: "website_url", label: "Website (optional)", type: "text" },
        ]}
      />
    </div>
  );
}
