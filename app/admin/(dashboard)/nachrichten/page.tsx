import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MessagesList } from "@/components/admin/MessagesList";

export default function AdminNachrichtenPage() {
  return (
    <div>
      <AdminPageHeader
        title="Nachrichten"
        description="Eingegangene Anfragen über das Kontaktformular."
      />
      <MessagesList />
    </div>
  );
}
