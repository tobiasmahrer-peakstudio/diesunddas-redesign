# ATELIER dies & das — Website & CMS

Redesign der Website für **ATELIER dies & das GmbH**, Wassertorgasse 2, 4242 Laufen.
Next.js (App Router) + TypeScript + Tailwind CSS — mit einem CMS, das **ohne
externe Datenbank** auskommt: Inhalte liegen als JSON-Dateien direkt in diesem
GitHub-Repo. Kostet nichts ausser GitHub (ohnehin vorhanden) und Cloudflare
Pages (Free-Tier).

Die Website ist **ohne** jede Konfiguration voll lauffähig — alle Inhalte
fallen dann auf die im Repo mitgelieferten Platzhalter-Dateien unter
[content/](content) zurück (siehe [lib/placeholders/content.ts](lib/placeholders/content.ts)
für die kleinen Text-Fallbacks). Sobald GitHub-Zugangsdaten hinterlegt sind,
schreibt der Admin-Bereich direkt in dieses Repo.

## Wie das CMS funktioniert — "GitHub als Datenbank"

Es gibt keine Datenbank und keinen separaten Login-Anbieter:

- **Inhalte** liegen als JSON-Dateien unter `content/` in diesem Repo
  (Kategorien, Texte, Öffnungszeiten, Kontaktnachrichten, …).
- **Lesen** passiert über `raw.githubusercontent.com` — eine kostenlose CDN,
  kein Rate-Limit-Problem für eine kleine Website. Änderungen im Admin sind
  live, **ohne** dass die Website neu gebaut werden muss.
- **Schreiben** (Admin-Bereich, Bild-Upload, Kontaktformular) passiert über
  die GitHub-API mit einem Personal Access Token — jede Änderung wird ein
  echter Commit in diesem Repo.
- **Bilder** landen unter `content/uploads/` im Repo und werden direkt über
  GitHub ausgeliefert.
- **Login** ist ein einzelnes Admin-Passwort (keine Benutzerverwaltung nötig
  für einen Ein-Personen-Betrieb).

Kompromiss gegenüber einer "echten" Datenbank: Ein Speichervorgang selbst ist
schnell (ein API-Aufruf zu GitHub), aber bis eine Änderung auf der Website
sichtbar wird, können **bis zu ~5 Minuten** vergehen — nicht wegen dieser App,
sondern weil `raw.githubusercontent.com` selbst zusätzlich cached (in einem
echten Test hat es genau das gedauert). Für "nicht viele Änderungen" ist das
kein spürbarer Nachteil, aber kein Live-Datenbank-Gefühl wie bei Supabase &
Co. — siehe auch "Änderungen im Admin erscheinen nicht sofort" unten.

## Inhalt

- [Schnellstart](#schnellstart)
- [GitHub-Einrichtung](#github-einrichtung)
- [Admin-Login einrichten](#admin-login-einrichten)
- [Projektstruktur](#projektstruktur)
- [Lokale Entwicklung](#lokale-entwicklung)
- [Deployment auf Cloudflare](#deployment-auf-cloudflare)
- [Domain-Einrichtung](#domain-einrichtung)
- [Fehlerbehebung](#fehlerbehebung)

## Schnellstart

```bash
npm install
cp .env.example .env.local
npm run dev
```

Die Website läuft dann unter [http://localhost:3000](http://localhost:3000) —
auch komplett ohne Einträge in `.env.local` (die Platzhalter-Inhalte aus
`content/` werden direkt von der Festplatte gelesen).

## GitHub-Einrichtung

Damit der Admin-Bereich tatsächlich speichern kann, braucht es ein Personal
Access Token mit Schreibrechten auf **genau dieses Repo**:

1. GitHub → **Settings → Developer settings → Personal access tokens →
   Fine-grained tokens → Generate new token**.
2. **Repository access**: "Only select repositories" → dieses Repo auswählen.
3. **Permissions → Repository permissions → Contents**: auf **Read and
   write** setzen. Sonst nichts nötig.
4. Token kopieren und in `.env.local` eintragen:

   ```bash
   GITHUB_OWNER=dein-github-benutzername
   GITHUB_REPO=diesunddas-redesign
   GITHUB_BRANCH=main
   GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
   ```

5. Dev-Server neu starten (`.env.local` wird nur beim Start eingelesen).

Ohne Token funktioniert das **Lesen** weiterhin (öffentliches Repo → über
`raw.githubusercontent.com`), aber der Admin-Bereich zeigt den Hinweis
„GitHub ist noch nicht verbunden" und kann nichts speichern.

> **Privates Repo?** Dann braucht auch das Lesen den Token — das ist im Code
> bereits vorgesehen (`lib/github.ts` sendet den Token, wenn vorhanden), es
> ist nur zusätzlicher API-Traffic statt der kostenlosen CDN-Auslieferung.

## Admin-Login einrichten

```bash
ADMIN_PASSWORD=ein-sicheres-passwort
SESSION_SECRET=  # z. B. mit: openssl rand -base64 32
```

Danach unter [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
mit diesem Passwort anmelden. Es gibt bewusst **keine** Benutzerverwaltung —
ein Passwort für die Besitzerin genügt für dieses Projekt.

## Projektstruktur

```
app/                     Next.js App Router
  (öffentliche Seiten)   /, /atelier, /sortiment, /inspiration, /geschenke,
                         /impressionen, /standort, /kontakt, /impressum, /datenschutz
  admin/(auth)/login     Admin-Login (kein CMS-Layout)
  admin/(dashboard)/     Geschütztes Dashboard, ein Ordner pro CMS-Bereich
  api/contact            Kontaktformular-Endpunkt (Honeypot, Rate-Limit, Zod)
  api/admin/             Login/Logout, Content-CRUD, Bild-Upload, Nachrichten
  sitemap.ts, robots.ts  automatisch generiert

components/
  ui/                    Button, Container, PlaceholderImage, …
  layout/                Header, Footer, SiteChrome (blendet Header/Footer im Admin aus)
  sections/               Homepage- und Unterseiten-Abschnitte
  admin/                  CollectionEditor, RecordEditor, WeeklyHoursEditor, …
                           (generische, wiederverwendbare CMS-Formulare)

lib/
  github.ts               Lesen/Schreiben von content/*.json über die GitHub-API
  auth.ts                 Admin-Passwort-Check + signierte Session-Cookies
  data.ts                 Öffentliche Datenzugriffsschicht (nutzt lib/github.ts)
  placeholders/content.ts Kleine Text-Fallbacks, falls ein Feld leer ist

types/database.ts         Typen passend zu den content/*.json-Dateien

content/                  DAS "CMS" — jede Datei hier ist eine Tabelle
  site-settings.json       Adresse, Telefon, Social-Links, Footer, Logo
  opening-hours.json       Reguläre Öffnungszeiten (7 Einträge)
  special-opening-hours.json  Sonderöffnungszeiten (Feiertage etc.)
  categories.json, products.json
  inspirations.json, gifts.json, brands.json, gallery.json, news.json, team.json
  pages/home.json, pages/atelier.json   Hero-/Editorial-Texte je Seite
  legal.json                Impressum, Datenschutz
  seo.json                  Pfad-spezifische SEO-Overrides
  uploads/                  Hochgeladene Bilder (vom Admin befüllt)
  messages/                 Kontaktanfragen (vom Kontaktformular befüllt)

```

### Warum kein `proxy.ts` (Middleware)?

Next.js 16 hat `middleware.ts` in `proxy.ts` umbenannt und lässt es nur noch
mit der Node.js-Runtime laufen. Auf Cloudflare ist genau das laut
`@opennextjs/cloudflare` noch **experimentell und "at your own risk"**. Statt
uns darauf zu verlassen, wird die Anmeldung direkt geprüft — beim Rendern
von `app/admin/(dashboard)/layout.tsx` und zusätzlich in jedem
`/api/admin/*`-Route-Handler (`lib/auth.ts` → `isRequestAuthenticated()`).
Das ist genauso sicher, nur minimal später im Request-Zyklus.

### CMS-Architektur

Fast jeder Admin-Bereich basiert auf zwei generischen Komponenten, die gegen
`/api/admin/content/<file>` sprechen:

- **`CollectionEditor`** — Liste + Formular für Sammlungen (Kategorien,
  Inspiration, Geschenke, Galerie, Labels, Team, …): Hinzufügen, Bearbeiten,
  Löschen, Veröffentlichen/Entwurf, Sortieren per Pfeiltasten. Jede Aktion
  schreibt die komplette Liste in einem Commit zurück.
- **`RecordEditor`** — Formular für einzelne Datensätze (Startseite-Inhalte,
  Einstellungen, Kontakt & Standort, Atelier-Seite inkl. eingebetteter
  Abschnitte).

Beide erkennen fehlende Inhalte automatisch (`isPlaceholder()` in
`lib/placeholders/content.ts`) und zeigen im Admin ein
„⚠ Inhalt noch nicht ausgefüllt"-Badge.

## Lokale Entwicklung

```bash
npm run dev      # Dev-Server
npm run lint     # ESLint
npx tsc --noEmit # TypeScript-Check
```

## Deployment auf Cloudflare

Das Projekt ist für **Cloudflare Pages** vorbereitet (`wrangler.toml`,
`@cloudflare/next-on-pages`).

1. Wrangler einloggen: `npx wrangler login`
2. Umgebungsvariablen im Cloudflare-Dashboard hinterlegen (Pages-Projekt →
   Settings → Environment variables) — dieselben wie in `.env.local`.
3. Build & Deploy:

   ```bash
   npm run cf:build     # erzeugt .vercel/output/static via @cloudflare/next-on-pages
   npm run cf:deploy    # lädt es zu Cloudflare Pages hoch
   ```

   Für einen lokalen Vorschau-Build mit Cloudflare-Runtime: `npm run cf:preview`.

**Wichtig zum Verständnis:** Ein Cloudflare-Rebuild ist nur nötig, wenn sich
der **Code** ändert (neues Layout, neue Funktion). Inhalts-Änderungen über
den Admin-Bereich brauchen **keinen** Rebuild — die Seiten lesen live von
`raw.githubusercontent.com`.

## Domain-Einrichtung

1. Im Cloudflare-Pages-Projekt unter **Custom domains** die Domain
   `atelierdiesunddas.ch` (bzw. `www.`) hinzufügen.
2. DNS-Einträge folgen der Anleitung im Dashboard.
3. `NEXT_PUBLIC_SITE_URL` in den Umgebungsvariablen auf die finale Domain
   setzen — wird für `sitemap.xml`, `robots.txt` und Open-Graph-Tags
   verwendet.
4. **SEO-Migration:** Sollten von der alten Website
   ([atelierdiesunddas.ch](https://www.atelierdiesunddas.ch/)) noch
   wichtige, indexierte URLs übrig sein, 301-Redirects in `next.config.ts`
   (`redirects()`) ergänzen, sobald die alten URLs bekannt sind.

## Fehlerbehebung

**„GitHub ist noch nicht verbunden"-Hinweis im Admin-Bereich**
`GITHUB_TOKEN` / `GITHUB_OWNER` / `GITHUB_REPO` fehlen. Nach dem Eintragen
den Dev-Server neu starten.

**Login funktioniert nicht**
`ADMIN_PASSWORD` und `SESSION_SECRET` müssen beide gesetzt sein. Passwort
exakt wie in `.env.local` eingeben (Gross-/Kleinschreibung zählt).

**Änderungen im Admin erscheinen nicht sofort**
Das ist normal — zwei Cache-Ebenen sind beteiligt: diese App cached
Lesezugriffe bis zu 20 Sekunden (`next: { revalidate: 20 }` in
`lib/github.ts`), und `raw.githubusercontent.com` cached zusätzlich auf
GitHubs Seite (in einem echten Test bis zu ~5 Minuten). Admin-Speichern
funktioniert sofort (im Dashboard selbst siehst du „Gespeichert."), die
öffentliche Seite zieht dann innerhalb weniger Minuten nach — kein Grund zur
Sorge, kein erneutes Speichern nötig.

**Bild-Upload schlägt fehl**
Prüfen, ob das Bild unter ca. 4 MB liegt und ob der GitHub-Token wirklich
Schreibrechte auf "Contents" hat (siehe oben).

**Kontaktformular meldet einen Fehler**
Ohne GitHub-Token kann keine Nachricht committet werden — der Endpunkt gibt
dann bewusst einen 503-Fehler zurück.

---

## Noch zu liefern

Diese Inhalte sind aktuell Platzhalter und sollten vor dem Live-Gang ersetzt
werden (siehe auch die „⚠ Inhalt noch nicht ausgefüllt"-Hinweise im Admin):

- Hero-, Laden-, Team- und Produktfotografie
- Finale Texte: Hero, Einstieg, Atelier-Geschichte, Nachhaltigkeit
- Aktuelle Öffnungszeiten, E-Mail-Adresse, Social-Media-Links
- Impressum und Datenschutzerklärung
- Markenliste / regionale Labels
- Informationen zur Geschenk-Wunsch-Box
