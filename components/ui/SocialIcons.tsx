/**
 * lucide-react dropped brand/logo icons (licensing) — these small,
 * license-free outline glyphs stand in for Instagram/Facebook.
 */

export function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.5 8.5h2V5.6c-.35-.05-1.55-.15-2.96-.15-2.98 0-4.54 1.82-4.54 4.78v2.2H6.5v3.1h2.5V21h3.2v-5.47h2.67l.43-3.1h-3.1v-1.9c0-.93.26-1.53 1.8-1.53Z"
        fill="currentColor"
      />
    </svg>
  );
}
