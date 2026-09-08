# Site Architecture

Routes and their intent. Placeholders — copy, layout, and section breakdown are decided during the build phases.

| Route | Page | Intent |
| --- | --- | --- |
| `/` | Home | The front door. Establishes the brand in the first screen. Not a feed. |
| `/stories` | Stories | Editorial narrative — people, decisions, outcomes, the price paid. |
| `/learn` | Learn | Instructional and explanatory material. Mechanics rather than narrative. |
| `/tools` | Tools | Interactive utilities and calculators. |
| `/gh-plus` | GH+ | Membership layer. See below. |
| `/about` | About | What the brand is and who it is for. Faceless — the brand is the author. |
| `/contact` | Contact | Inbound: press, partnerships, submissions. |
| `/privacy` | Privacy | Legal. |
| `/terms` | Terms | Legal. |

## Navigation

Primary: Stories, Learn, Tools, GH+. Secondary (footer): About, Contact, Privacy, Terms.

## GH+

GH+ starts as a marketing and teaser surface inside the marketing site. It may eventually become a more application-like product layer — authenticated accounts, gated content, member state, saved material, and its own navigation — rather than a set of static marketing routes.

Architectural implication: keep GH+ isolated behind its own route segment and avoid coupling shared components to marketing-only assumptions, so the product layer can be introduced (or split out) without a rewrite.

## Site-wide

- Metadata, Open Graph, and canonical URLs derive from `NEXT_PUBLIC_SITE_URL`.
- `sitemap.xml` and `robots.txt` generated from the route table.
- A 404 that stays in the brand voice.
