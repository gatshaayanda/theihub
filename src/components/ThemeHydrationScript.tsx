// src/components/ThemeHydrationScript.tsx

/**
 * This script runs before hydration to prevent theme flashing.
 * It sets `data-theme` on <html> based on localStorage or system preference.
 *
 * IMPORTANT: Do NOT add "use client" here.
 * We want this script tag to be emitted by the server.
 */
export default function ThemeHydrationScript() {
  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `
(function() {
  try {
    var theme = localStorage.getItem('theme');
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
  } catch(e) {}
})();
        `,
      }}
    />
  );
}
