// lucide-react ships no brand/logo icons, so these are minimal, generic outline
// glyphs for the social links in the footer — not a reproduction of official marks.
const PATHS = {
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  Facebook: <path d="M14 9h3V5.5h-3A4 4 0 0 0 10 9.5V12H7v3.5h3V21h3.5v-5.5H16l.5-3.5h-3V9.7c0-.4.15-.7.5-.7Z" />,
  Pinterest: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 18c.7-2 1.7-6.2 1.7-6.2M12 12a2.5 2.5 0 1 0 2.5-3.7 2.7 2.7 0 0 0-2.9 2.7c0 1 .5 1.6.5 1.6" />
    </>
  ),
};

export function SocialIcon({ name, className }) {
  const path = PATHS[name];
  if (!path) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}
