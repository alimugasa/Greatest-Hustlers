# Greatest Hustlers

Official website for **Greatest Hustlers** — a premium business, money, leverage, ownership, strategy, culture, and ambition media brand.

Production domain: `greatesthustlers.com`

---

## Brand purpose

Greatest Hustlers is an editorial publication about ambition — the mentality, the mechanics, and the price. It covers how people build leverage, take calculated risk, and own something.

It is not a motivation page. The site should read like a publication with a point of view, not a content archive and not a product marketing site.

Non-goals, stated plainly:

- It must not look like a generic SaaS website — no feature grids, no gradient hero, no logo cloud, no pricing-page energy on the front door.
- It must not look like an archive or a blog index — a wall of cards with dates is a failure state.
- No hustle/grindset visual clichés.

The brand system in `docs/DESIGN_SYSTEM.md` is binding. Read it before writing UI.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js (App Router) |
| UI | React + TypeScript |
| Styling | Tailwind CSS |
| Motion | Framer Motion (component/layout motion), GSAP (timeline and scroll-driven sequences) |
| 3D | Three.js / React Three Fiber — scoped to the GH dice interaction, optional and lazy-loaded |
| Hosting | Vercel |

Framer Motion, GSAP and R3F are listed for the phases that need them and are deliberately not installed yet — the pre-launch front door runs on CSS transforms and a single `requestAnimationFrame` loop, and nothing else has been built.

---

## Current state — the pre-launch front door

`/` is a coming-soon page and the only route with any UI. It is one viewport, pure black, and the GH dice mark carries it alone.

- **The mark.** The supplied dice artwork, unaltered — cropped to its bounding box and converted to an alpha mask so it composites over `#000000` exactly as delivered. Served as WebP at three widths with a PNG fallback, from `public/brand/`.
- **Motion.** It emerges out of black over 1.5s (opacity, a 6% scale, a small rise), then drifts on a sum of sines that never visibly repeats. On a fine pointer it tilts toward the cursor through a damped spring — it lags, then settles on its own — and compresses about 1.5% when pressed, with a slight bounce on release. Two transform writes per frame on composited layers; the loop stops in a background tab.
- **Touch.** No cursor interaction. The drift continues, and `deviceorientation` is used only if the browser gives it without a permission prompt.
- **Reduced motion.** `prefers-reduced-motion: reduce` replaces the entrance with a plain fade and binds no listeners at all.
- **Metadata, not navigation.** Wordmark, `IG`, `GH / 2026` and `COMING SOON` sit at the four margins. The middle of the screen belongs to the mark.
- **Atmosphere.** A masked film grain at 4.5% opacity gathers around the mark. No glow, no shadow, no visible gradient.

Setting `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` reveals a single `GET NOTIFIED` label at the foot of the page, which opens one ruled email field in place and `POST`s `{ email, source }` as JSON. With the variable unset the affordance does not render and the page stays sparse.

---

## Local development

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Runs on `http://localhost:3000`.

## Build

```bash
npm run build     # production build
npm run start     # serve the production build locally
npm run lint      # lint
```

---

## Environment variables

Copy the example file and fill it in locally. `.env.local` is gitignored and never committed.

```bash
cp .env.example .env.local
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin. Used for metadata, Open Graph, sitemap, canonical tags. |
| `NEXT_PUBLIC_GA_ID` | Analytics measurement ID. Absent in development. |
| `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` | Signup POST endpoint for GH Dispatch. Also the switch that reveals the `GET NOTIFIED` capture on `/` — unset, it is not rendered. |

`NEXT_PUBLIC_` variables are exposed to the browser. Any future key that must stay secret gets an unprefixed name and lives only in Vercel project settings.

---

## Deployment

Vercel, connected to this repository.

- `main` deploys to production.
- Every other branch and pull request gets a preview deployment.
- Environment variables are set per environment (Production / Preview / Development) in Vercel, not in the repo.
- Preview builds are the review surface — motion and 3D work gets reviewed on a real device from a preview URL, not from a local dev server.

---

## Project structure

```
app/                    routes, layouts, metadata (App Router)
components/
  ui/                   primitives — button, field, type, layout atoms
  sections/             composed page sections
  motion/               reusable motion + GSAP/R3F wrappers
lib/                    utilities, config, data access, formatters
data/                   structured content and static datasets
public/
  images/               editorial imagery
  brand/                logo, dice mark, favicons, OG assets
  fonts/                self-hosted fonts
styles/                 global CSS, design tokens
docs/                   design system, architecture, content model, roadmap
```

## Brand assets and licensing

`public/brand/gh-dice-*` is derived from the supplied master artwork by cropping and alpha extraction only. Nothing about the mark itself has been redrawn, simplified or recoloured; regenerate from the master rather than editing these files by hand.

`public/fonts/DMMono-Regular.woff2` is DM Mono, © the DM Mono Project Authors, under the SIL Open Font License 1.1 (`public/fonts/OFL.txt`). It carries the metadata role in `DESIGN_SYSTEM.md`; the editorial serif and body sans are still to be chosen.

---

## Documentation

- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — colour, typography, surfaces, tone
- [`docs/SITE_ARCHITECTURE.md`](docs/SITE_ARCHITECTURE.md) — routes and page intent
- [`docs/CONTENT_MODEL.md`](docs/CONTENT_MODEL.md) — content entities and fields
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — build phases, written as issue-ready items

---

## Branching

`main` is the default and deployable branch. Work happens on short-lived branches merged by pull request.
