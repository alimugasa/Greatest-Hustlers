# Roadmap

Seven phases. Each phase heading maps to a GitHub milestone; each checkbox is issue-ready as written.

## Phase 1 — Foundation and design system

- [ ] Scaffold Next.js App Router project with TypeScript and Tailwind
- [ ] Encode `DESIGN_SYSTEM.md` tokens as Tailwind theme values and CSS custom properties in `styles/`
- [ ] Select, license, and self-host the three typefaces (serif, sans, mono) in `public/fonts/`
- [ ] Build type scale and layout primitives in `components/ui/`
- [ ] Root layout, metadata defaults, favicon and OG asset set in `public/brand/`
- [ ] Lint, format, and CI check on pull requests

## Phase 2 — Homepage

- [ ] Define home section sequence and what each section has to prove
- [ ] Opening screen — brand statement, not a hero pattern
- [ ] Featured story treatment
- [ ] Learn and Tools entry points
- [ ] GH Dispatch signup placement
- [ ] Footer and global navigation

## Phase 3 — Motion and GH dice interactions

- [ ] Framer Motion conventions — shared easing, durations, entrance patterns
- [ ] GSAP scroll-driven sequences where timeline control is needed
- [ ] GH dice interaction: prototype in R3F, decide whether it ships as 3D or as a lighter fallback
- [ ] Lazy-load and code-split the 3D bundle; verify it never blocks first paint
- [ ] `prefers-reduced-motion` path for every animation including the dice

## Phase 4 — Content system

- [ ] Implement the entities in `CONTENT_MODEL.md`
- [ ] MDX pipeline with typed frontmatter validation
- [ ] Story and Learn index and detail routes
- [ ] Topic taxonomy pages
- [ ] Tools registry and detail route
- [ ] Editorial rendering: pull quotes, imagery, metadata treatment

## Phase 5 — Newsletter integration

- [ ] Wire signup to `NEXT_PUBLIC_NEWSLETTER_ENDPOINT`
- [ ] Validation, loading, success, duplicate, and error states
- [ ] Waitlist confirmation copy and post-signup state
- [ ] Bot mitigation on the signup path

## Phase 6 — GH+ teaser

- [ ] GH+ route with positioning and tier presentation
- [ ] `access: gh-plus` gating behaviour on locked content
- [ ] Interest capture that feeds the same list infrastructure
- [ ] Keep the route boundary clean for a future authenticated product layer

## Phase 7 — Performance, SEO, accessibility and responsive QA

- [ ] Core Web Vitals budget met on mobile, with the dice interaction enabled
- [ ] Image strategy — formats, sizing, priority hints
- [ ] `sitemap.xml`, `robots.txt`, structured data, per-route metadata
- [ ] Accessibility pass — contrast against the ivory/burgundy palette, focus states, keyboard paths, reduced motion
- [ ] Device QA across breakpoints; verify on real hardware from a Vercel preview
- [ ] 404 and error states in brand voice
