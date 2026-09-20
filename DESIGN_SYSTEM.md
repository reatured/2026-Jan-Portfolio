# Design system

Lingyi Zhou's portfolio. This file describes the system **as it is actually implemented**.

Source of truth order: the CSS files → `../AGENTS.md` (content and behaviour rules) → this file.
If this file disagrees with the CSS, the CSS wins and this file is out of date. Fix the file.

There is no component library, no Storybook, no `tokens.ts`, and no `tailwind.config`.
Tailwind v4 is installed and its `@theme` block is where the global tokens are *declared*,
but the site is overwhelmingly hand-written CSS with semantic class names.

---

## 1. The two layers

The page is built from two visual systems that coexist on the same screen. This is deliberate.

| | **Poster shell** | **Apple content layer** |
|---|---|---|
| Where | Everything on the page surface | Inside an expanded Index project |
| Root class | `body` / `:root` | `.project-story` |
| Defined in | `src/index.css` | `src/components/project-story-ribbon.css` |
| Reference | `style-probes/05-poster-grid.html` | Apple HIG (interpreted in plain HTML/CSS) |
| Ground | cream `#fbf7f1`, faint 12-column rules | light grey `#f5f5f7` canvas, white cards |
| Type | Archivo, high contrast, tight tracking | system UI font, 14px / 1.5 |
| Ink | `#1a1714` | `#1d1d1f` |

### How the hand-off works

`.project-story` does not invent new names for the shell's tokens — it **remaps** them
(`project-story-ribbon.css:8-10`):

```css
.project-story {
  --color-ink:      var(--story-ink);     /* #1a1714 → #1d1d1f */
  --color-ink-soft: var(--story-body);    /* #4a443c → #646469 */
  --color-mut:      var(--story-muted);
  --color-cream:    var(--story-surface); /* #fbf7f1 → #fff    */
  --color-bone:     var(--story-paper);   /*           → #f5f5f7 */
  --color-rule:     var(--story-line);    /* #e2d9cc → #dedee2 */
  --font-sans:      -apple-system, …;     /* Archivo  → system UI */
}
```

Consequence: CSS written against the global token names automatically renders in Apple
materials once it is mounted inside `.project-story`. `project-archive.css` relies on this —
it declares `var(--color-cream)` and `var(--color-orange-deep)` and gets white cards and
`#a83900` links without knowing which layer it is in. **Prefer token names over raw hex so a
component keeps working in both layers.** `--color-orange` is intentionally *not* remapped:
orange is the one accent that crosses the boundary unchanged.

---

## 2. Colour

### Poster shell — `src/index.css:26-38` (`@theme`)

| Token | Hex | Role |
|---|---|---|
| `--color-cream` | `#fbf7f1` | Page ground. Never pure white. |
| `--color-bone` | `#f5efe6` | Recessed ground: detail scroller, chart gutters. |
| `--color-bone-deep` | `#d3c2a5` | Scrollbar thumbs, inactive chart frames. |
| `--color-index-number` | `#f0dcc3` | Index row numerals at rest. |
| `--color-ink` | `#1a1714` | Primary text, inverted surfaces, 3px rules. |
| `--color-ink-soft` | `#4a443c` | Body copy. |
| `--color-mut` | `#6b6459` | Metadata, captions, mono labels. |
| `--color-rule` | `#e2d9cc` | 1px hairlines. |
| `--color-orange` | `#ff6b1a` | **The only accent.** Selection, active state, emphasis. |
| `--color-orange-deep` | `#b34700` | Orange as text on light; focus outlines. |

Tailwind exposes these as `bg-cream`, `text-ink`, `text-mut`, `bg-orange`, `border-rule`, …

### Apple content layer — `project-story-ribbon.css:3-7`

| Token | Hex | Role |
|---|---|---|
| `--story-paper` | `#f5f5f7` | Canvas behind the cards. |
| `--story-surface` | `#fff` | Card and media surface. |
| `--story-ink` | `#1d1d1f` | Headings, primary text. |
| `--story-body` / `--story-muted` | `#646469` | Body copy and metadata (same value). |
| `--story-line` | `#dedee2` | Card borders. |
| `--story-media` | `#f0f0f2` | Media stage surround for non-landscape art. |
| `--story-accent` | `var(--color-orange)` | Selected chapter, active control. |
| `--story-accent-ink` | `#a83900` | Orange as text/links inside the layer. |

Emphasis card (the one headline number per project): `#fff1e6` ground, `#f4dac8` border,
`#7d4329` detail text. Technology chips: `#f3f3f5` on `#4c4c50`.

### Orchia diagram palette — `src/index.css:225-243`

The violet/green set (`#ccb7f0`, `#ad71ec`, `#9857df`, `#63ae88`, `#c7ddcf`, `#f8f5ff`, …)
belongs to the **Orchia product's own workflow graph**, reproduced accurately inside that one
demo. It is scoped to `.orchia-production-*` / `.orchia-reference-group` / `.orchia-shot-group`
selectors only. **Never reuse it for portfolio chrome.** Portfolio chrome is cream + ink + orange.

### Prohibited

- **No blue** anywhere in the content layer.
- **No violet, rose, or red/green as an accent** in portfolio chrome — that is the old
  portfolio's palette, which this site exists to leave behind.
- **No near-black page grounds.** Dark surfaces are allowed only as *inverted components*
  (Hero title rows at rest, the Orchia product hero), never as the page background.
- **No black surround around project media.** Media stages use `--story-media` / cream.
  Black pixels that belong to the original media or an embedded provider stay untouched.

---

## 3. Typography

Two families, clearly separated by job.

| Face | Tokens | Used for |
|---|---|---|
| **Archivo** | `--font-display`, `--font-sans` | Everything in the poster shell: headings, body, résumé bullets, capability copy, project body. |
| **IBM Plex Mono** | `--font-mono` | Metadata only: dates, locations, legends, counters, tech tags, colophon, section labels. |
| **System UI** | `.project-story` local `--font-sans` | Everything inside the Apple content layer. |

The shell is deliberately one hard grotesque for both display and reading — the poster look
does not use a soft serif body face.

### Shell scale

| Element | Size | Weight | Tracking | Line height |
|---|---|---|---|---|
| Index heading | `clamp(40px, 7.4vw, 104px)` | 900 | `-0.045em` | 0.86 · uppercase |
| Footer email | `clamp(28px, 6vw, 92px)` | 900 | `-0.045em` | 0.86 · uppercase |
| `h1`–`h4` base | — | 800 | `-0.025em` (`h1` `-0.04em`) | 1.05 |
| Hero heading | `clamp(24px, 2.5vw, 36px)` | 800 | `-0.03em` | 1.08 |
| Index title | `clamp(16px, 1.72vw, 25px)` | 700 | `-0.025em` | 1.16 |
| Section `h3` | 22px | 800 | — | 1.2 |
| Body / résumé bullets | 14px | 400 | 0 | **1.8** |
| Subtitle / small | 12px | 400 | 0 | 1.5–1.6 |
| Mono label | 10–11px | 400 | `0.12–0.2em` | 1.5–2.1 · uppercase |

Uppercase + wide tracking is reserved for mono metadata and the two poster-scale display
elements. Body copy and project titles stay in normal case with tight negative tracking.

**No all-cap text in new work.** Agents must not introduce all-cap text anywhere: no
`text-transform: uppercase`, no uppercased strings in new components, labels, diagrams, or
previews — write everything in normal letter case. The uppercase elements listed above are
legacy shell typography; do not extend them to new components, and replace them with normal
case whenever that text is rewritten.

### Content-layer scale

| Element | Desktop | Mobile (≤760px) |
|---|---|---|
| Section heading (`h3`) | 22px / 600 | 20px |
| Chapter heading (`h4`) | 22px / 600, `-0.025em` | 20px |
| Body copy | **14px / 1.5** | 14px / 1.5 |
| Card label / `dt` | 12px / 400 muted | 12px |
| Delivery fact | 16px / 500 | 16px / 500 |
| Emphasised fact | 28px, `-0.03em` | 28px |
| Chip | 11px | 11px |

Measure: keep body copy under ~65ch; the shell caps long prose at `52ch`–`64ch`.

---

## 4. Layout and spacing

### Content column

```css
--cw:  min(calc(100vw - 48px), 1240px);
--pad: max(24px, calc((100vw - 1240px) / 2));
--gut: 24px;              /* 16px at ≤760px */
--nav-height: 56px;
```

`.site-container` is `width: calc(100% - 48px); max-width: 1240px; margin-inline: auto`.
**Content never touches the viewport edge** — a minimum 24px margin is required at every
width, so wide displays show generous side margins rather than a full-bleed spread.

`.grid-paper` draws the shell's signature faint twelve-column rules, inset by `--pad` so the
rules align with the gutters instead of spanning the viewport. Hidden below 760px.

### Grids

- Poster sections use a literal 12-column grid with `--gut`: Index heading (6 / 1 spine / 5),
  Experience (7 history + 4 capabilities), About (3 + 8), Footer (8 + 3 + colophon).
- Expanded details use fractional grids: `5fr / 6fr` with media, aside `minmax(240px, .75fr)`
  beside `minmax(0, 1.65fr)` content at ≥1000px.

### Spacing scale

The shell is loose and uses `clamp()` tied to viewport height for section rhythm
(`clamp(48px, 8vh, 96px)` between major sections). The content layer is compact and fixed:

`4 · 6 · 8 · 10 · 12 · 14 · 16 · 20 · 24 · 28 · 32px`

- Section spacing inside a project: **12–20px**.
- Card padding: **16px desktop / 14px mobile**.
- Story gutter: `clamp(16px, 2vw, 28px)`.

---

## 5. Shape, surface, elevation

### Radii — four steps, by hierarchy

| Token | Value | Applies to |
|---|---|---|
| `--radius-card` / `--story-radius` | **10px** | Outer cards, panels, info cards, chapter rail |
| `--radius-inset` / `--story-radius-inset` | **6px** | Media frames, inset controls, thumbnails |
| `--story-radius-small` | **4px** | Technology chips |
| (literal) | **8px** | Hero media, top gallery surfaces, Artly/Orchia media wrappers |
| (literal) | **50%** | Circular 44px paging arrows |

Radii are not interchangeable. Outer container 10px, anything nested inside it 6px, the
smallest elements 4px.

### Surfaces and shadows — `src/index.css:12-16`

```css
--surface-card: #fff;
--surface-hair: rgb(26 23 20 / 6%);   /* 1px ring, always paired with a shadow */
--shadow-1: 0 1px 2px …4%, 0 2px 8px …5%;      /* at rest */
--shadow-2: 0 2px 6px …5%, 0 12px 30px …9%;    /* hovered / lifted */
--shadow-3: 0 6px 18px …9%, 0 24px 56px …15%;  /* floating overlays */
```

Shadows are warm-tinted (`rgb(26 23 20 / …)` — ink, not black) so they sit on cream.
The standard lifted-card recipe is:

```css
border-radius: var(--radius-card);
background: var(--surface-card);
box-shadow: 0 0 0 1px var(--surface-hair), var(--shadow-1);
```

The content layer uses its own flatter, cooler shadows (`0 2px 8px rgba(0,0,0,.035)`) plus a
`1px rgba(0,0,0,.045)` border — do not mix the two shadow vocabularies in one component.

---

## 6. Motion

| Token | Value | Use |
|---|---|---|
| `--spring` | `cubic-bezier(.34, 1.24, .5, 1)` | Lifts and settles — small overshoot |
| `--spring-out` | `cubic-bezier(.32, .72, 0, 1)` | Apple's ease-out — width/height/geometry |
| `--lift` | `-2px` | Hover translate on cards and icon links |

Durations: 160–240ms for colour/opacity, 260–420ms for transform and elevation, **560ms**
for Hero geometry (`--hero-motion-duration`).

Two rules worth preserving:

1. **Geometry and image motion share one duration and curve.** The Hero column widths and the
   image transform both use `--hero-motion`, so they cannot drift apart mid-transition.
2. **Promotional copy is revealed *after* the panel finishes expanding** — 240ms opacity
   delayed by `--hero-motion-duration`. Outgoing copy hides immediately and any pending reveal
   is cancelled. This is what stops headline text from being visible inside a narrow column.

Motion answers a person's action. There is no ambient looping animation on the page surface;
the only continuous motions are the Orchia video carousel and its running-edge demo, both of
which the user can pause.

### Reduced motion

`src/index.css:546-549` is a global kill switch — `animation`, `transition`, and smooth
scrolling are all disabled under `prefers-reduced-motion: reduce`. Components that gate
behaviour on motion (Hero selection, accordion alignment, chapter rail, shader previews) must
still work when this fires; several provide a manual step/replay control for that case.
`prefers-reduced-transparency: reduce` separately drops the mobile chapter rail's blur.

---

## 7. Interaction states

**Focus.** Shell: `outline: 2px solid var(--color-orange-deep); outline-offset: 3px`.
Content layer: `outline: 3px solid var(--story-accent-ink); outline-offset: -3px` (inset, so
it is visible against white cards). Archive and pinned Index rows use `-2px` inset.
Never remove a focus ring without replacing it.

**Hover.** Only inside `@media (hover: hover)`. Cards translate `var(--lift)` and step from
`--shadow-1` to `--shadow-2`. Index rows invert to ink-on-cream with a 14px left padding shift.
Text links darken to `--color-orange-deep`.

**Selection / active.** Orange background with dark ink text (Hero expanded title row,
`aria-pressed` chapter buttons use white-on-paper with `--story-accent-ink` text).
At rest, Hero title rows are ink-black with cream text and a satin graphite finish built from
two non-interactive pseudo-element layers that fade out on selection.

**Touch targets.** 44px minimum everywhere (`story-paging` arrows, gallery controls, delivery
links, footer icons); **48px** for mobile chapter buttons and disclosure summaries.

**Text selection.** `::selection` is orange ground with ink text.

---

## 8. Breakpoints

Viewport media queries:

| Query | What changes |
|---|---|
| `max-width: 1080px` | 12-column poster grids collapse; Index spine hidden; capabilities sidebar un-sticks |
| `min-width: 1000px` | Archive/story aside goes two-column and sticky |
| `max-width: 999px` / `1000px` | Aside stacks above content; notes go to 2 columns |
| **`max-width: 760px`** | Primary mobile switch: `--gut` → 16px, Hero becomes a swipe rail, stacked story cards, grid-paper off |
| `max-height: 620px` | Sticky positioning dropped, Hero footer shrinks |
| `max-width: 600px` | Portrait archive media switches to a 4:5 stage |
| `max-width: 460px` | Résumé entries go single-column |

Container queries: `@container (max-width: 740px)` and `460px` inside the Orchia details;
`@container story-main (max-width: 620px)` for the story card grids. **Prefer container queries
inside project panels** — the panel width is not the viewport width.

---

## 9. File map and naming

| File | Owns |
|---|---|
| `src/index.css` | Global tokens, base layer, shell components (nav, Hero, Index, Experience, About, Footer, Orchia details), grid paper, breakpoints, reduced motion |
| `src/components/project-story-ribbon.css` | `.project-story` — the Apple content layer and its token remap |
| `src/components/project-archive.css` | Migrated January projects: galleries, media stages, notes |
| `src/components/flagship-project-details.css` | Per-project overrides for Artly (`.artly-story`) and Orchia (`.orchia-story`) inside the story layer |
| `src/pages/artly-graph-preview.css` | Standalone preview route only |

**Class naming.** Semantic kebab-case with a domain prefix: `index-*`, `hero-*`, `story-*`,
`archive-*`, `orchia-*`, `artly-*`, `experience-*`, `footer-*`. State lives in `is-*` /
`has-*` classes (`is-open`, `is-expanded`, `has-image`, `has-video`) or `data-*` attributes
(`data-status`, `data-selected`, `data-emphasis`, `data-overflowing`, `data-portrait`).
No utility-first class soup: Tailwind utilities appear in only a handful of places.

---

## 10. Node & edge graphs

Workflow editors with editable nodes, connections, and live execution status are a
résumé-backed capability (`reference/Lingyi-Zhou-Resume-20260919-01.html`: "responsive React
workflow editors with editable nodes, connections, and live execution status"). The site renders
graphs twice, and they form a **third visual subsystem with two dialects**. Same anatomy,
different questions — never mix the two palettes.

| | **Dialect A — structure** | **Dialect B — execution** |
|---|---|---|
| Question | What connects to what | What is running right now |
| Where | Artly system architecture (`ArtlyArchitectureGraph.tsx`, `artly-architecture-graph.ts`) | Orchia production graph (`OrchiaWorkflowDemo.tsx`, `orchia-production-graph.ts`) |
| CSS | `flagship-project-details.css:32-59` | `index.css:220-243` |
| Layer | Apple content layer — story tokens | Poster shell — Orchia product palette |
| Edge colour | `--story-accent` 1.6px; cloud/swap edges `#8e8e93` dashed 5-4 | idle `#ccb7f0` 1.3 · done `#aa87df` · running `#ad71ec` 2.2 dashed, animated |
| Container | Zone `#efeff1` / `#d9d9de`, radius 10 | Group: reference `#f8f5ff`, shot `#f5faff` |

### Anatomy (dialect A)

- **Node** 180×86, radius 6. Four kinds: `panel` white on `--story-line`; `hub` solid
  `--story-ink` with `#f5f5f7` title and `#a1a1a6` meta; `machine` the warm emphasis tint
  `#fff7f0` / `#f4dac8`; `external` paper fill with a dashed `#8e8e93` stroke.
- **Type in node:** title 12px weight 500 `--story-ink`; meta lines mono 9px `--story-body`.
  Weight 500 is the intent — dense 650 titles read as shouting inside a quiet diagram.
- **Ports:** 3.5r circles, `--story-accent` fill with a white ring, at the left and right
  mid-height. They are the edge anchors.
- **Edges:** cubic beziers between port points, arrow marker in `context-stroke`. Same-column
  pairs bow sideways. Every label reads horizontally: column gaps are sized ≥96px to hold the
  longest label, and a label that still cannot fit is shortened — never rotated.
- **Edge labels:** mono 10px `--story-accent-ink` with a `paint-order: stroke` halo of the canvas
  colour, so a label stays legible where it crosses an edge.
- **Zones:** labelled containers in mono 10.5px, normal case, `#6e6e73`. No all-caps text and no
  vertical text anywhere inside a graph — labels, zone names, legends and status all read
  horizontally in sentence case.

### Status (dialect B)

Status is carried redundantly and the three carriers always agree: the node's stroke, its status
dot, and the edge leaving it — plus a text status inside the node. Idle dot `#c3b7d4`, running
`#9857df`, done `#63ae88`. Running edges flow via a `stroke-dashoffset` animation at 0.7s linear;
the global reduced-motion kill switch stops the flow and the graph still reads as a static state
diagram. This violet/green palette is Orchia's product colour and stays scoped to execution
graphs — it never touches portfolio chrome.

### Interaction

- **Trace:** hover or focus a node dims everything it is not connected to, opacity 0.2 over
  180ms. Structure graphs only; execution graphs tell their story through status, not topology.
- **Zoom:** − / Fit / + in 0.5 steps, clamped 1–2. Fit resets horizontal scroll.
- **Keyboard:** the canvas is focusable with a visible ring; ArrowLeft/ArrowRight pan 180px.
- **Mobile:** graphs keep reading size and scroll sideways natively — they never fold vertical.
  Zoom buttons grow to 48px below 760px.

---

## 11. Adding something new

1. **Which layer?** Page surface → shell tokens. Inside an expanded project → write it against
   token names and mount it under `.project-story`; do not hardcode shell hex values.
2. **Take tokens, not values.** If you need a new colour, ask whether an existing one is wrong
   first. New tokens go in `@theme` (shell) or the `.project-story` block (content layer).
3. **Radii follow nesting:** 10 outer → 6 inset → 4 chip.
4. **Match the left and right content edges** of the hero media, chapter navigation, slides,
   and card rows. No independent width caps, no next-card peek.
5. **Touch targets ≥44px**, focus ring present, hover gated behind `@media (hover: hover)`,
   and the component still usable with transitions disabled.
6. **Media keeps its source aspect ratio** with `object-fit: contain`, sized to the source
   inside its stage so native controls stay inside the frame. Reserve dimensions so lazy
   loading cannot jump the accordion height.
7. Verify with `npm run build`, then review at desktop and mobile widths.

---

## 12. Known debt

Tracked here so it does not get mistaken for intent.

- **Dead tokens.** `--cw`, `--color-skel`, `--color-orange-tint` are declared and never used.
  `--animate-enter`, `--animate-enter-delay`, and `@keyframes enter` are defined but no element
  references them. `.site-container` hardcodes the column width instead of using `--cw`.
- **Hardcoded greys in the content layer.** `#ececee`, `#e9e9ec`, `#eeeef0`, `#f3f3f5`,
  `#4c4c50` are one-off values rather than tokens; `--story-body` and `--story-muted` are two
  names for the same hex.
- **Arbitrary Tailwind values** (`text-[1.05rem]`, `gap-[11px]`, `max-w-[52ch]`) bypass the
  type and spacing scales.
- **No shared primitives.** Buttons, cards, and chips are re-declared per component; there is
  no `Button`/`Card`/`Chip` to inherit from.
- **The 8px radius is a literal**, not a token, even though it is a documented step.
- **Graph node titles still ship at 650** in `flagship-project-details.css:53-56`, while the
  documented intent is 500. Soften them to match.
- **Live graph components still rotate narrow-gap edge labels** (the `rotate` flag in
  `artly-architecture-graph.ts`) and uppercase their zone labels
  (`flagship-project-details.css:44`). Intent is horizontal, sentence-case labels everywhere
  inside a graph.
- **Nothing enforces this file.** The rules live in prose here and in `../AGENTS.md`; there is
  no lint or token check. Adherence depends on the editor.
