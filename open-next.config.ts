import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// This app doesn't rely on ISR/page revalidation — every page reads
// live from GitHub already (see lib/github.ts) — so the default
// (no incremental cache override, e.g. no R2 bucket needed) is fine.
export default defineCloudflareConfig();
