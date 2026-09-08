import localFont from "next/font/local";

/**
 * Metadata typeface. Mono is the role that carries anything reading as data —
 * labels, years, counters. Self-hosted from public/fonts (SIL OFL 1.1, see
 * public/fonts/OFL.txt).
 */
export const mono = localFont({
  src: [{ path: "../public/fonts/DMMono-Regular.woff2", weight: "400", style: "normal" }],
  variable: "--font-dm-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});
