# Design System

The initial brand system. Treat these values as the source of truth and reference them as tokens — no hardcoded hex in components.

## Colour

| Role | Value |
| --- | --- |
| Background | `#000000` |
| Primary text | `#F0EDE6` |
| Brand burgundy | `#6E1F1F` |
| Secondary / muted text | `#8F8A82` (approximate) |
| Surface 1 | `#0B0B0B` |
| Surface 2 | `#111111` |
| Surface 3 | `#151515` |
| Border | `rgba(240, 237, 230, 0.10)` |

Notes:

- Pure black is the ground, not a surface. Surfaces 1–3 create depth without introducing grey panels.
- Burgundy is an accent of emphasis, not a brand wash. Used for a single word, a state, a mark — not for large fills or as a button colour by default.
- Borders are the ivory at 10% opacity. Divider lines stay near-invisible; separation comes from spacing first.

## Typography

Three roles. Families are chosen at implementation and self-hosted from `public/fonts/`.

| Role | Use |
| --- | --- |
| Editorial serif | Headlines, pull quotes, story titles. Carries the publication voice. |
| Modern sans-serif | Body copy, navigation, UI. Neutral and legible at long lengths. |
| Monospace | Metadata — dates, issue numbers, tags, labels, counters. |

Monospace is what makes the site read as intelligent rather than decorative. Use it for anything that reads as data.

## Surfaces and depth

Depth is built from surface value, spacing, and grain — not from shadows, gradients, or glassmorphism.

## Motion

Motion is cinematic and deliberate: fewer moves, longer eases, nothing bouncy. Every animation should feel authored. Reduced-motion preferences are honoured everywhere, including the dice interaction.

## How it should feel

- premium
- modern
- cinematic
- intelligent
- interactive
- street-rooted but credible
- minimal without feeling empty
- editorial without feeling like an archive
- tech-forward without feeling like SaaS

## Failure states

If a screen could be relabelled for a B2B SaaS product without changing anything but the copy, it is wrong. Same for a page that reads as a dated list of posts.
