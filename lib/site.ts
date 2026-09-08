const fallbackUrl = "https://greatesthustlers.com";

export const site = {
  name: "Greatest Hustlers",
  url: process.env.NEXT_PUBLIC_SITE_URL || fallbackUrl,
  /** Kept short and unexplanatory on purpose — the launch state is the message. */
  description:
    "A publication on leverage, ownership and the price of ambition. Launching 2026.",
  year: "2026",
  instagram: {
    handle: "greatesthustlers",
    url: "https://www.instagram.com/greatesthustlers/",
  },
  /**
   * Optional. When set, the front door reveals the GH Dispatch capture behind a
   * single "get notified" affordance; when unset the page stays sparse.
   */
  newsletterEndpoint: process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT || "",
} as const;
