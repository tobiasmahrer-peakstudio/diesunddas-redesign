import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CollectionEditor } from "@/components/admin/CollectionEditor";
import { getCategories } from "@/lib/data";

export default async function AdminSortimentPage() {
  const categories = await getCategories();
  const categoryOptions = [
    { value: "", label: "Keiner Kategorie zugeordnet" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <div>
      <AdminPageHeader
        title="Sortiment"
        description="Kategorien und einzelne Highlight-Produkte. Kein Warenkorb, keine Preise nötig — es geht um Inspiration."
      />

      <section className="mb-14">
        <h2 className="h-eyebrow mb-4">Kategorien</h2>
        <CollectionEditor
          file="categories"
          titleKey="name"
          subtitleKey="description"
          addLabel="Neue Kategorie"
          fields={[
            { key: "name", label: "Name", type: "text", required: true },
            { key: "slug", label: "URL (Slug)", type: "text", required: true },
            { key: "description", label: "Beschreibung", type: "textarea" },
            { key: "image_url", label: "Bild", type: "image", folder: "categories" },
          ]}
        />
      </section>

      <section>
        <h2 className="h-eyebrow mb-4">Highlight-Produkte</h2>
        <p className="mb-4 text-sm text-[var(--color-ink-muted)]">
          Als Highlight markierte Produkte erscheinen im Bereich „Immer wieder etwas Neues“ auf
          der Startseite.
        </p>
        <CollectionEditor
          file="products"
          titleKey="title"
          subtitleKey="brand"
          addLabel="Neues Produkt"
          fields={[
            { key: "title", label: "Titel", type: "text", required: true },
            { key: "description", label: "Beschreibung", type: "textarea" },
            { key: "image_url", label: "Bild", type: "image", folder: "products" },
            { key: "category_id", label: "Kategorie", type: "select", options: categoryOptions },
            { key: "brand", label: "Marke (optional)", type: "text" },
            { key: "featured", label: "Als Highlight auf der Startseite zeigen", type: "checkbox" },
          ]}
        />
      </section>
    </div>
  );
}
