import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { RecordEditor } from "@/components/admin/RecordEditor";

export default function AdminEinstellungenPage() {
  return (
    <div>
      <AdminPageHeader
        title="Einstellungen"
        description="Allgemeine Angaben, Social Media, Logo und Footer-Text."
      />
      <RecordEditor
        file="site-settings"
        fields={[
          { key: "company_name", label: "Firmenname", type: "text" },
          { key: "logo_url", label: "Logo", type: "image", folder: "hero" },
          { key: "favicon_url", label: "Favicon", type: "image", folder: "hero" },
          { key: "instagram_url", label: "Instagram-Link", type: "text" },
          { key: "facebook_url", label: "Facebook-Link", type: "text" },
          { key: "footer_text", label: "Footer-Text", type: "textarea" },
          { key: "copyright_text", label: "Copyright-Text", type: "text" },
        ]}
      />
    </div>
  );
}
