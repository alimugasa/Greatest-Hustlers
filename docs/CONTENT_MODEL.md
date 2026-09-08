# Content Model

Content entities and their fields. The storage layer (local MDX in `data/` vs. a headless CMS) is an open decision — see the end of this file. The model below holds either way.

## Story

Editorial narrative.

| Field | Type | Notes |
| --- | --- | --- |
| `slug` | string | URL identity, stable and never reused |
| `title` | string | |
| `dek` | string | One-line standfirst under the title |
| `subject` | string | Person, company, or market the story is about |
| `topics` | string[] | See taxonomy |
| `publishedAt` | date | |
| `updatedAt` | date | Optional |
| `readingTime` | number | Derived, minutes |
| `cover` | image | Path + alt text, required |
| `body` | rich text | |
| `access` | enum | `public` \| `gh-plus` |
| `featured` | boolean | Eligible for home placement |
| `seo` | object | Title, description, OG image override |

## Learn Entry

Instructional material — mechanics, frameworks, how a thing actually works.

Same base fields as Story, plus:

| Field | Type | Notes |
| --- | --- | --- |
| `level` | enum | `foundational` \| `intermediate` \| `advanced` |
| `series` | string | Optional grouping |
| `order` | number | Position within a series |

## Tool

| Field | Type | Notes |
| --- | --- | --- |
| `slug` | string | |
| `name` | string | |
| `summary` | string | What it answers, in one line |
| `component` | string | Key of the React component that implements it |
| `access` | enum | `public` \| `gh-plus` |
| `status` | enum | `live` \| `beta` \| `coming-soon` |

## Taxonomy

`topics` is a controlled vocabulary, not free tags. Initial set, extended deliberately:

`money` · `leverage` · `ownership` · `strategy` · `risk` · `culture` · `ambition`

## Authorship

The brand is the author. There is no author entity and no bylines.

## Open decisions

- Local MDX in `data/` versus a headless CMS. MDX until content volume or a non-technical editing need forces the change.
- Whether GH+ gating is enforced at render time or behind an authenticated route boundary. Depends on how far the product layer in `SITE_ARCHITECTURE.md` goes.
