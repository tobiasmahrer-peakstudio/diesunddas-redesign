import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { RecordEditor } from "@/components/admin/RecordEditor";
import { CollectionEditor } from "@/components/admin/CollectionEditor";

export default function AdminUeberUnsPage() {
  return (
    <div>
      <AdminPageHeader
        title="Über uns"
        description="Die Geschichte des ATELIERs, persönliche Vorstellung und das Team."
      />

      <section className="mb-14">
        <h2 className="h-eyebrow mb-4">Geschichte, Hero & weitere Abschnitte</h2>
        <RecordEditor
          file="pages/atelier"
          fields={[
            { key: "hero_title", label: "Titel", type: "text" },
            { key: "hero_image_url", label: "Hero-Bild", type: "image", folder: "team" },
            { key: "intro_heading", label: "Zwischentitel (optional)", type: "text" },
            { key: "intro_text", label: "Geschichte des Ateliers", type: "textarea" },
            {
              key: "sections",
              label: "Weitere Abschnitte",
              type: "list",
              itemLabel: "Abschnitt",
              itemFields: [
                { key: "heading", label: "Überschrift", type: "text" },
                { key: "text", label: "Text", type: "textarea" },
                { key: "image_url", label: "Bild (optional)", type: "image", folder: "team" },
              ],
            },
          ]}
        />
      </section>

      <section>
        <h2 className="h-eyebrow mb-4">Team</h2>
        <CollectionEditor
          file="team"
          titleKey="name"
          subtitleKey="role"
          addLabel="Teammitglied hinzufügen"
          fields={[
            { key: "name", label: "Name", type: "text", required: true },
            { key: "role", label: "Rolle", type: "text" },
            { key: "photo_url", label: "Foto", type: "image", folder: "team" },
            { key: "bio", label: "Kurzer persönlicher Text", type: "textarea" },
          ]}
        />
      </section>
    </div>
  );
}
