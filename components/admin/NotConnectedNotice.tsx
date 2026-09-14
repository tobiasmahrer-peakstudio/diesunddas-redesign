export function NotConnectedNotice() {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-terracotta)] bg-[var(--color-paper)] px-5 py-4 text-sm text-[var(--color-ink-soft)]">
      ⚠ GitHub ist noch nicht verbunden. Trage <code>GITHUB_TOKEN</code>,{" "}
      <code>GITHUB_OWNER</code> und <code>GITHUB_REPO</code> in <code>.env.local</code> ein,
      damit dieser Bereich bearbeitet werden kann. Siehe README.
    </div>
  );
}
