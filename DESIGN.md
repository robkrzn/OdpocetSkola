---
name: Odchodová tabuľa
description: A Pragotron split-flap departure board recessed into an institutional enamel wall.
colors:
  enamel: "#2A5346"
  board: "#0F1215"
  gap: "#050708"
  flap-t1: "#3C434A"
  flap-t2: "#2B3138"
  flap-b1: "#262C32"
  flap-b2: "#171C21"
  ink: "#F0EBDD"
  ink-2: "#C3CFC7"
  ink-3: "#94A69B"
  wall-ink: "#DEE9E2"
  signal: "#E8543B"
  hw-pin: "#79838C"
  hw-screw: "#6E7A72"
  hw-dk: "#272D33"
  shade-0: "rgba(0,0,0,.022)"
  shade-1: "rgba(0,0,0,.13)"
  shade-2: "rgba(0,0,0,.4)"
  shade-3: "rgba(0,0,0,.55)"
  shade-4: "rgba(0,0,0,.7)"
  shade-5: "rgba(0,0,0,.85)"
  sheen-0: "rgba(255,255,255,.02)"
  sheen-1: "rgba(255,255,255,.05)"
  sheen-2: "rgba(255,255,255,.09)"
  sheen-3: "rgba(255,255,255,.14)"
typography:
  display:
    fontFamily: "Archivo Narrow, system-ui, sans-serif"
    fontSize: "calc(var(--c) * 1.44)"
    fontWeight: 700
    lineHeight: "calc(var(--c) * 1.55)"
    letterSpacing: "normal"
    fontFeature: "tabular-nums"
  headline:
    fontFamily: "Archivo Narrow, system-ui, sans-serif"
    fontSize: "clamp(17px, 4.6vw, 26px)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.17em"
  headline-preview:
    fontFamily: "Archivo Narrow, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.17em"
  title:
    fontFamily: "Archivo Narrow, system-ui, sans-serif"
    fontSize: "clamp(12px, 1.7vw, 16px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.22em"
  label:
    fontFamily: "Archivo Narrow, system-ui, sans-serif"
    fontSize: "clamp(11px, 1.5vw, 14px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.19em"
  label-strong:
    fontFamily: "Archivo Narrow, system-ui, sans-serif"
    fontSize: "clamp(11px, 1.5vw, 14px)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.19em"
    fontFeature: "tabular-nums"
  caption:
    fontFamily: "Archivo Narrow, system-ui, sans-serif"
    fontSize: "clamp(10px, 1.35vw, 13px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.22em"
  body:
    fontFamily: "Archivo Narrow, system-ui, sans-serif"
    fontSize: "clamp(16px, 4.2vw, 18px)"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
  option:
    fontFamily: "Archivo Narrow, system-ui, sans-serif"
    fontSize: "clamp(15px, 3.8vw, 17px)"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0"
  answer:
    fontFamily: "Archivo Narrow, system-ui, sans-serif"
    fontSize: "clamp(16px, 4.2vw, 18px)"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "0"
    fontFeature: "tabular-nums"
  stat:
    fontFamily: "Archivo Narrow, system-ui, sans-serif"
    fontSize: "clamp(32px, 10vw, 52px)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0"
    fontFeature: "tabular-nums"
rounded:
  cell: "3px"
  panel: "4px"
  pin: "50%"
  focus: "2px"
spacing:
  cell: "clamp(34px, 8.2vw, 72px)"
  lead: "clamp(70px, 24vw, 124px)"
  page: "clamp(14px, 4vw, 48px)"
  stack: "clamp(18px, 3.4vw, 34px)"
  board-x: "clamp(14px, 3vw, 34px)"
  board-y: "clamp(18px, 3vw, 30px)"
  units: "clamp(10px, 1.8vw, 22px)"
  hairline: "clamp(12px, 2.2vw, 20px)"
  glyph-gap: "3px"
  leaf-gap: "2px"
components:
  board-panel:
    backgroundColor: "{colors.board}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "clamp(18px,3vw,30px) clamp(14px,3vw,34px) clamp(14px,2.4vw,24px)"
    width: "min(100%, 1180px)"
  flap-cell:
    backgroundColor: "{colors.gap}"
    textColor: "{colors.ink}"
    typography: "{typography.display}"
    rounded: "{rounded.cell}"
    width: "var(--c)"
    height: "calc(var(--c) * 1.55)"
  flap-leaf-upper:
    backgroundColor: "{colors.flap-t1}"
    textColor: "{colors.ink}"
    rounded: "{rounded.cell}"
    height: "calc(var(--c) * 1.55 / 2 - 1px)"
  flap-leaf-lower:
    backgroundColor: "{colors.flap-b1}"
    textColor: "{colors.ink}"
    rounded: "{rounded.cell}"
    height: "calc(var(--c) * 1.55 / 2 - 1px)"
  rail-key:
    textColor: "{colors.ink-3}"
    typography: "{typography.label}"
  rail-value:
    textColor: "{colors.ink-2}"
    typography: "{typography.label-strong}"
  unit-cap:
    textColor: "{colors.ink-3}"
    typography: "{typography.caption}"
  unit-cap-lead:
    textColor: "{colors.ink-2}"
    typography: "{typography.title}"
  departed-note:
    textColor: "{colors.signal}"
    typography: "{typography.label}"
  preview-sentence:
    textColor: "{colors.wall-ink}"
    typography: "{typography.headline}"
  screw:
    backgroundColor: "{colors.hw-screw}"
    rounded: "{rounded.pin}"
    size: "9px"
  axle-pin:
    backgroundColor: "{colors.hw-pin}"
    rounded: "{rounded.pin}"
    size: "calc(var(--c) * .085)"
  corner-board:
    backgroundColor: "{colors.board}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "8px clamp(12px,3vw,18px)"
  countdown-line:
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    minHeight: "30px"
  view-tab:
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
  view-tab-current:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
  section-cap:
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
  task-panel:
    backgroundColor: "{colors.board}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
  stimulus-pin:
    backgroundColor: "{colors.board}"
    maxHeight: "36dvh"
    collapsedHeight: "44px"
  stimulus-summary:
    textColor: "{colors.ink-3}"
    typography: "{typography.label}"
    minHeight: "44px"
  option-row:
    textColor: "{colors.ink-2}"
    typography: "{typography.option}"
    minHeight: "44px"
  answer-field:
    backgroundColor: "{colors.gap}"
    rounded: "{rounded.cell}"
    minHeight: "44px"
  progress-pip:
    refersTo: "flap-cell"
    size: "clamp(20px,6.4vw,28px)"
  day-pip:
    refersTo: "flap-cell"
    size: "clamp(14px,4vw,20px)"
  stat-figure:
    textColor: "{colors.ink}"
    typography: "{typography.stat}"
---

# Design System: Odchodová tabuľa

## Overview

**Creative North Star: "The Pragotron Wall"**

One room, two materials. A painted institutional wall fills the viewport; a dark
split-flap departure board is bolted into it with four visible screws. Nothing floats
and nothing is decorative for its own sake: every gradient in the build is either the
sheen of enamel paint, the recess of a panel into a wall, the bevel of a flap leaf, or
the shadow one leaf throws on the one below it. The system is a photograph of hardware,
not a UI theme.

Density is extreme in one direction only. The countdown digits are enormous, far past
the usual 6rem display ceiling, because the product is a single number and the reference
device is a phone in a chat app's in-app browser. Everything else — the departure rail,
the unit captions, the departed-service note — is small, wide-tracked uppercase running
along the board's edges, the way real station signage labels its own hardware. Colour is
withheld almost entirely: institutional green holds the wall, near-black holds the board,
bone ink carries the characters, and one signal orange-red appears on exactly one line.

The build has no interactive control of any kind. There is no button, no link, no field,
no navigation. Reflow of the board and the enormous number is the entire interface. A
second surface exists: the 1200×630 link-preview frame, which is not a crop of the page
but its own composition, with its own type sizes and its own visible sentence.

**v2 adds a third surface: the game.** The countdown shrinks into a corner fixture and
the rest of the screen becomes a daily set of exam questions — the first buttons,
links, inputs, and navigation this system has ever had. They are built from the same
two materials and the same Flap Cell, described in full under "Game Components (v2)"
below; nothing above this note describes the game, only the countdown and its preview.

**Key Characteristics:**
- Two materials only: enamel wall and recessed dark board.
- One accent (signal red-orange), one line of it, ever.
- Uppercase, wide-tracked, tabular Archivo Narrow throughout.
- Every depth cue drawn from a single black/white alpha ramp.
- All geometry `calc()`ed off one per-unit cell variable.
- No interactive control; nothing hovers, nothing is clickable-looking.

## Colors

Institutional paint against station hardware: one saturated green, four steps of
near-black metal, three tints of bone ink, and a single alarm colour.

### Primary
- **Institutional Enamel** (`{colors.enamel}`): the wall. A flat painted field covering
  the entire viewport, given its material by noise, one raking highlight, a brush-stroke
  band, and a vignette — never by a second green. It is now a single flat colour with no
  ramp; a painted wall is one coat of paint.

### Secondary
- **Signal Red-Orange** (`{colors.signal}`): the departed-service note and its short rule,
  plus `::selection`. It is the only chromatic accent in the build and appears on one line.

### Neutral
- **Board Black** (`{colors.board}`): the board face, the material the flaps sit in.
- **Cell Gap** (`{colors.gap}`): the seam behind each flap cell, darker than the board so
  the split line reads even when a leaf is mid-flight.
- **Flap Upper / Lower** (`{colors.flap-t1}` → `{colors.flap-t2}`, `{colors.flap-b1}` →
  `{colors.flap-b2}`): the two leaf gradients. The upper half is lighter than the lower
  because the light source is above the board.
- **Bone Ink** (`{colors.ink}`): every character on a flap, and body colour.
- **Chalk Ink** (`{colors.ink-2}`): the departure value and the lead unit's caption —
  secondary information that still has to be read from across a room.
- **Faded Ink** (`{colors.ink-3}`): rail keys and small unit captions; the quietest legible
  step **on the board**. It is not available on the wall — see the Board-Ink Rule.
- **Wall Ink** (`{colors.wall-ink}`): the preview sentence painted on the wall, brighter
  and cooler than board ink because it sits on green, not on black.
- **Pin / Screw / Hardware Dark** (`{colors.hw-pin}`, `{colors.hw-screw}`, `{colors.hw-dk}`):
  the light and dark stops of the two-stop gradients on the axle pins and corner screws.
  Hardware is metal, so it never uses ink colours.
- **Shade 0–5 / Sheen 0–3**: the one alpha ramp. Every shadow, bevel, hairline, vignette,
  and material layer in the build resolves to one of these ten values.

### Named Rules

**The One-Ramp Rule.** Depth is drawn exclusively from `shade-0`…`shade-5` and
`sheen-0`…`sheen-3`. A new shadow, bevel, or hairline picks the nearest existing step and
never introduces a fresh alpha. If nothing on the ramp fits, the effect is wrong, not the ramp.

**The One Signal Rule (v2: signal marks what you missed).** The signal colour marks
what is gone — the departed service, and now also the wrong answer. It is still never
used for emphasis, a heading, or decoration; its rarity is what makes it read as an
alarm, and it appears in only one place per screen. **The correct answer never gets
green.** The wall is green; a second green on the same screen would read as a second
material, not a second meaning, and would quietly break the One-Ramp Rule's promise
that colour is scarce. Correctness is announced by **material**, not colour: a flap
cell flips to a fully-lit `--ink` fill (dark glyph on bone, the inverse of every other
cell in the build) the way a punched ticket looks different from an unpunched one.
Every answer state — correct or wrong — also carries a **glyph** (`✓` / `✕`), never
colour or brightness alone; this is accessibility as a side effect of using the
system's own materials rather than an accommodation bolted on afterward.

**The Board-Ink Rule (`--ink-3` is a colour on the board, not on the wall).** The three
ink tints are calibrated against `--board`, not against `--enamel`. On the board
`--ink-3` is ~7:1 and is the correct quietest step: rail keys, unit captions, the
stimulus label, the source citation, a disabled button. On the wall the same tint is
**3,38:1** — a fail for the small tracked uppercase it is always used for, and the
whole of v2's chrome (view tabs, section captions, stat captions, hints, the countdown
signage line) stands on the wall. There the quietest legible step is **`--ink-2`
(5,39:1)**, and that is the floor. No new tint is introduced to bridge the gap: the
ramp was never wrong, the surface was. The check is mechanical — if the element's
painted background is `--enamel`, `--ink-3` is not available to it.

**The Metal Is Not Ink Rule.** Screws and axle pins draw from the hardware tokens, not
from the ink tints. Anything that is supposed to be a physical fastener is grey-green
metal with a two-stop gradient and a `shade-4` seat shadow.

## Typography

**Display / Body / Label Font:** Archivo Narrow (self-hosted woff2, latin + latin-ext
subsets, variable weight 400–700), falling back to `system-ui, sans-serif`.

**Character:** One narrow grotesque doing every job, which is exactly how real signage
works — a station board does not change typeface between the destination and the clock.
Narrow letterforms are load-bearing: they let a 13-cell destination row and three enormous
day digits fit a 390px phone without shrinking.

### Hierarchy
- **Display** (700, `calc(var(--c) * 1.44)`, line-height = full cell height): the flap
  characters. Sized off the cell, never off rem, so the glyph and its housing scale as one
  object. This is the only place the build exceeds the usual display ceiling, and it does
  so deliberately: the product is a single enormous number.
- **Headline** (700, fluid `clamp(17px, 4.6vw, 26px)`, 0.17em, uppercase): the wall
  sentence. Its fluid base is never rendered, since the element is hidden on the page; the
  preview frame overrides it to a fixed 32px. Both steps are kept so the sentence has a
  working size if it is ever unhidden.
- **Title** (400, `clamp(12px, 1.7vw, 16px)`, 0.22em, uppercase): the lead unit's caption
  ("dní"), one step up from the other captions because it labels the number that matters.
- **Label** (400/700, `clamp(11px, 1.5vw, 14px)`, 0.19em, uppercase): the departure rail
  key and value, and the departed-service note. Value is 700 and tabular.
- **Caption** (400, `clamp(10px, 1.35vw, 13px)`, 0.22em, uppercase): the small unit captions.
- **Body** (400, `clamp(16px, 4.2vw, 18px)`, sentence case, tracking 0, line-height 1.5):
  the exam question and reading passage. New in v2 — the first prose on the board.
- **Option** (400, `clamp(15px, 3.8vw, 17px)`, `--ink-2`, sentence case): answer-option
  text, one step below `body` so the question itself stays the loudest line on the panel.
- **Answer** (700, `clamp(16px, 4.2vw, 18px)`, tabular, sentence case): the answer as
  given or revealed — a typed number, a struck-through word, a "Správne: C" line.
- **Stat** (700, `clamp(32px, 10vw, 52px)`, tabular): success percentages on the report.
  The only number in the build that is large and outside a flap cell; large enough to
  read as a headline figure without being mistaken for the countdown's own digits.

### Named Rules

**The Tabular Rule.** Every numeral in the build sets `font-variant-numeric: tabular-nums`.
At 100 updates per second, proportional figures make the layout twitch. This is
correctness, not polish.

**The All-Caps Signage Rule (v2: signage governs chrome, not content).** Chrome — rails,
tabs, unit captions, section headings, source citations, the departed-service note —
stays uppercase with 0.14–0.22em tracking; this is signage, and signage shouts quietly.
But v2 puts prose on the board for the first time: an exam question, a reading passage,
an answer option. Verzálky on two to five lines of próza is not signage, it is
unreadable — the game tested this on real Testovanie 9 items (a four-paragraph SJL
passage in caps is a wall of noise) and the rule did not survive contact. **Content is
a sentence:** lower case, tracking 0, line-height 1.5, in the four roles below. The
line between the two is simple — if a real board would stencil it onto hardware
(a label, a key), it is signage; if a person wrote it to be read (a question, an
answer, a passage), it is content.

| Role | Used for | Size | Weight | Case / tracking |
|---|---|---|---|---|
| `body` | question text, reading passages | `clamp(16px,4.2vw,18px)` | 400 | sentence, 0 |
| `option` | answer-option text (A–D) | `clamp(15px,3.8vw,17px)`, one step below `body` | 400, `--ink-2` | sentence, 0 |
| `answer` | the given/correct answer, inline or in an input | `clamp(16px,4.2vw,18px)` | 700, tabular | sentence, 0 |
| `stat` | success percentages on the report — the one place a number appears outside a flap cell | `clamp(32px,10vw,52px)` | 700, tabular | — |

**The Cell-Derived Type Rule.** Flap type size, line height, pin diameter, and spin blur are
all `calc()` expressions on `--c`. Never hard-code a font size inside a flap; change `--c`
and the whole unit rescales correctly.

## Layout

A single centred column. The body is a `place-items: center` grid with a
`clamp(14px, 4vw, 48px)` gutter that respects `env(safe-area-inset-bottom)`, because the
reference device is a phone inside a chat app's in-app browser. The wall column stacks the
board and (in the preview frame only) the sentence with `clamp(18px, 3.4vw, 34px)` between them.

The board is `min(100%, 1180px)` wide with asymmetric padding — more at the top than the
bottom, the way a real board's frame is deeper above the flaps. Inside it, three bands
separated by two gradient hairlines: the departure rail, the two-row destination in small
flaps, and the time field. The departed-service note closes the panel.

The time field is a wrapping flex row of units, `clamp(10px, 1.8vw, 22px)` apart, aligned to
their baselines so the small units sit level with the bottom of the lead unit. Each unit is a
column of flap cells (3px apart) over its caption.

Sizing runs off two variables, `--cell` and `--lead`, which each unit copies into `--c`:

- **Below 560px:** four small units reflow to two per row (`flex-basis: calc(50% - 5px)`)
  with the days unit full-width above them, so digits stay enormous instead of shrinking to
  fit five units on one line. Destination-flap axle pins are hidden at this size — at 16px
  wide they were dirt, not hardware.
- **560–899px:** `--cell` narrows to `clamp(44px, 7.4vw, 60px)`.
- **900px and up:** the lead unit rejoins the row with a right margin.
- **Height under 800px:** hairline margins, board padding, and column gaps all tighten.
  Combined with the narrow-phone rule, cell sizing uses `min(vw, vh)` so cell height is
  bounded by viewport height as well as width.

### Named Rules

**The No-Scroll Rule (v2: chrome doesn't scroll, content does).** The original rule —
the board fits one viewport, full stop — still governs the countdown itself: `#/tabula`
and the `?og=1` preview never scroll, and cell size is still bounded by `min(vw, vh)`,
not width alone (375×667 overflowed by 111px before that bound existed; any change to
cell sizing is re-checked at 375×667 first). The game breaks this on the one screen
where it cannot hold: a reading passage plus a table plus four options does not fit
667px tall on a phone, and shrinking it to fit would make the text illegible, which is
a worse failure than a scrollbar. The rule now has two tiers. **Chrome is pinned**: the
corner countdown and the progress strip are `position:sticky` at the top and never
leave the viewport. **Content scrolls**: the question body, the reading passage, and
the answer options move under that chrome exactly like a normal document. A visitor
never loses the countdown or their place in today's set, but a four-paragraph passage
gets the space it needs instead of being crushed into `min(vw, vh)`.

**The Sticky-Stimulus Rule (open once, then a pinned line).** A question that shares a
reading passage with its siblings (`sjl-2024-a-s1` ties four questions to one text)
keeps that passage `position:sticky` at the top of its panel. The goal is unchanged
and non-negotiable — **the passage must be reachable at the fourth question of the
group**, because an ungrounded question is worse than an unscrolled one — but the
means are not "keep it open".

**Open at the first question of the group, collapsed from the second on.** A person
reads a passage once. After that they need it for *lookup*, not for reading, and a
240px block of pinned prose is precisely what pushes the answer options off a 375×667
screen. So the stimulus is a native `<details>`: `open` on the group's first question,
and from the second question a single pinned summary row — `UKÁŽKA · ZIMNÉ
PARALYMPIJSKÉ HRY ⌄`, 44px tall, one tap to open. Native `<details>` and not a
scripted panel because the keyboard operation, the focus ring, and the screen-reader
announcement all come free and none of them can then be got wrong.

**Open, it is still capped** at `max-height: 36dvh` with its own internal scroll: an
uncapped multi-section passage (ZPH's three subsections plus a medal table ran past
900px in testing) would fill the viewport and push the question itself off-screen —
pinning something that tall isn't "keeping it reachable," it's replacing the question
with the reading. The capped box carries a one-line fade at its own bottom edge
(`shade`-only gradient into `--board`) as the cue that it scrolls, because
minimal-chrome mobile browsers hide the scrollbar itself.

**The measurement that governs it.** At 375×667, with the stimulus collapsed or absent,
the question and *every* option are visible without scrolling — measured, not assumed:
the fourth option row ends 39px above the thumb bar and the document is 670px against a
667px viewport. With the stimulus open the page scrolls, and that is allowed. Anything
that reintroduces height above the options — a taller pinned countdown, a second
heading, a bigger option cell — is re-checked against that number first.

**The Reflow-Not-Shrink Rule.** When horizontal space runs out, units move to a new row.
They do not scale down. The number is the product; it never gives up size to fit a layout.

## Elevation & Depth

Hybrid, and physical. There is no floating-card elevation anywhere: nothing hovers above
the wall. The board is *recessed into* the wall — a 1px `shade-4` outline plus deep inset
shadows at the top edge, with a single 1px `sheen-3` line below it reading as the lip of the
recess catching light. The only outward shadow in the build is the shallow
`0 3px 7px -2px shade-2` that seats the board against the paint.

Depth inside the board comes from stacking: gap black behind, leaf gradient in front, an
inset `sheen-2` on the upper leaf's top edge, an inset `shade-3` on the lower leaf's bottom
edge, and a 24%-tall `shade-3` gradient the upper half casts down onto the lower half.
The wall itself is depth too — six stacked gradients over an SVG turbulence grain,
soft-light blended, ending in a `shade-3` vignette.

### Shadow Vocabulary
- **Board recess** (`0 0 0 1px shade-4, inset 0 4px 14px shade-5, inset 0 14px 24px -14px shade-5, inset 0 -2px 0 sheen-1, 0 1px 0 sheen-3, 0 3px 7px -2px shade-2`): the one panel treatment.
- **Leaf bevel** (`inset 0 1px 0 sheen-2` upper / `inset 0 -1px 0 shade-3` lower): the machined edge of each half-cell.
- **Leaf cast shadow** (`linear-gradient(180deg, shade-3, transparent)` over the top 24%): the shadow the upper leaf drops on the lower one. Applied to the printed lower half too, so the flip looks lit rather than composited.
- **Hardware seat** (`0 1px 1px shade-4, 0 0 0 1px shade-3` on screws; `0 0 0 1px shade-4` on pins): what makes a 9px circle read as metal in a hole.
- **Falling leaf** (`0 1px 0 shade-5`): a hairline under the in-flight leaf only.

### Named Rules

**The Recess Rule.** Surfaces sit *in* the wall, not *on* it. New panels get an outline plus
inset shadow; a drop shadow is only ever the few pixels that seat an object against its
substrate. No lifted cards, no hover elevation.

## Shapes

Rectangles with barely-there corners. Flap cells and leaves are 3px, the board panel 4px,
and that is the entire radius vocabulary for surfaces; the focus ring uses 2px. Hardware is
the only circular geometry: 9px screws and axle pins at 8.5% of cell width (6.2% and 55%
opacity on the smaller destination flaps), all `50%`.

Every cell is a fixed 1 : 1.55 character box, split exactly in half by the axle line. The
destination rows are a fixed 13-cell grid, centre-padded with blanks, so a shorter word
leaves empty housings rather than a narrower row — the grid is the hardware and does not
resize to fit its content.

### Named Rules

**The Fixed-Cell Rule.** Character cells never resize to their content. Text is padded into
a fixed cell count; empty cells stay visible as blank housings. That is what a mechanical
board does and it is the strongest single signal of the world.

## Components

### Board Panel
The one container in the system. Near-black face with a short top-edge sheen gradient,
4px corners, the recess shadow stack, and a screw in each corner 7px in. Padding is
`clamp` on all three axes and tightens under 800px viewport height. There is no second
card style; new content goes inside this panel or on the bare wall.

### Flap Cell
The signature component. A `var(--c)`-wide, 1.55× tall box on gap-black with 3px corners
and `perspective: 420px`. Four stacked children: static upper and lower printed halves, and
two animated leaves. Two axle pins sit at the vertical midpoint, left and right.

- **Flip:** two WAAPI animations on the leaves — a 108ms `cubic-bezier(.5,0,.9,.4)` fall
  and a 230ms `cubic-bezier(.18,.72,.3,1)` land. CSS never animates the flip; JS owns it.
- **Spin:** a rolling cell does not animate leaves at all. Characters are swapped every
  45ms from a fixed glyph set and the cell gets a blur — `calc(var(--c) * .026)`, or
  `.05` for the fast column. Only the last character lands with a real flip.
- **Reduced motion:** blur off; the hundredths column freezes blank and its caption drops
  to 42% opacity. The countdown itself keeps running — it is content, not effect.

### Departure Rail
A baseline-aligned key/value row at the top of the panel: faded-ink key left, chalk-ink
tabular value right, both uppercase at 0.19em. The key text itself switches when the board
runs out of departures.

### Hairline Rule
A 1px divider that fades from transparent through `sheen-3` and back. It separates the
three bands of the panel. Nowhere in the build is there a solid-colour border line.

### Departed-Service Note
A 26×2px signal bar followed by uppercase signal text. This is the only place the accent
colour appears and the only element that reads as struck-through history.

### Preview Sentence
Uppercase, 0.17em, wall-ink on enamel with a `0 1px 0 shade-2` text shadow so it reads as
painted onto the wall rather than laid over it. `display: none` on the page; `display: block`
at 32px inside the preview frame.

### Named Rules

**The Two-Surface Rule.** The page and the 1200×630 link-preview frame are two different
compositions from one document, switched by a `body.og` class: fixed 56/92/34px cells, a
narrower board, a tighter column gap, and the sentence made visible. The preview frame is
never treated as a crop of the page. Anything that only makes sense once a viewer has
arrived belongs on the page; anything that has to work in a chat list, with the board tiny
and the digits blurred, belongs in the frame.

**The Blurred-Digits Rule.** The preview frame shows no readable time value. The time field
is filled with blurred non-numeric glyphs, because a static image would lie about the number
every day after it was generated. Remaining time appears in the preview only as whole days,
in `og:title`, rewritten by the daily cron.

**The Housing-Is-Fixed Rule.** Motion blur is applied to the inner character element, never
to the cell. The housing is bolted hardware and is always sharp; only the character moves.

## Game Components (v2)

v2 turns the countdown into a corner fixture and gives the rest of the screen to a
daily set of Testovanie 9 questions. Nothing below introduces a new material, colour,
or shadow — every component is the Board Panel, the Flap Cell, or the four content
roles above, recombined.

### Corner Countdown

The one element that changes rather than adds. Three decisions, each with a reason:

**Units: `dni : hod : min`, not five units.** Seconds and hundredths stay on the full
board (`#/tabula`) only. A permanently-blurred hundredths drum next to a sentence a
student is trying to read is a battery drain and an attention thief for a number
nobody needs mid-question; the panicking column is the countdown's signature move and
it stays a destination, not a permanent fixture. `--cell`/`--lead` get a lower `clamp()`
in this context — `--cell: clamp(16px,4vw,30px)`, `--lead: clamp(30px,9vw,54px)` — the
same Cell-Derived Type Rule, a smaller instance.

**Position: a pinned strip, never a floating badge.** A corner badge sitting *over* a
reading passage is the worst place to put it — it either overlaps content or steals a
fixed slice of an already-tight 375px column. The countdown is part of the document's
sticky chrome instead: full-width on the phone, inset top-right on desktop, Recess Rule
throughout, never a lifted card. On the phone the rail (target name + date) and the
clock stack vertically inside the strip rather than sharing one row — at 375px there is
only ~320px inside the strip once page and panel padding are subtracted, and a
three-unit clock beside a two-line rail label is tight enough to invite exactly the
shrink-to-fit the Reflow-Not-Shrink Rule forbids. From 900px up there is room for both
in one row, so it reunites.

**Form is per view, and the split is measured, not stylistic.** The flap strip costs
117px of a 667px phone — 18% of the viewport. On `#/dnes`, `#/vysledok` and
`#/vykaz` that is money well spent: the countdown is the emotional motor of the whole
product, nothing on those screens is competing for reading space, and the flaps are the
reason anyone opened the link in the first place. On `#/uloha` the same 117px is what
pushed the answer options off the screen, in exchange for a number that does not change
during a question. So on the task screen the countdown is not hardware, it is a
**sign**: one signage line, `label` role, ~30px tall, `TESTOVANIE 9 · 196 DNÍ`, sharing
the pinned band with the progress strip and linking to `#/tabula` like the tile does.
Day granularity, because nobody reads minutes on a screen they stand on for ninety
seconds. `#/tabula` keeps the full five-unit board, unchanged. The countdown is never
absent — it changes register with the screen's job.

**Interaction is scoped to the corner tile itself.** `main.js` today fires the cascade,
the bell, and the shouts on `pointerdown` anywhere in the document; in the game that
would mean tapping an answer rings the departure bell. The corner countdown becomes its
own tap target (an `<a>` wrapping the whole tile, linking to `#/tabula`) and the
cascade/bell/shout interaction narrows to that element alone. Elsewhere — `#/tabula`
itself — the whole document is still the target, unchanged.

### Task Panel

A Board Panel variant that carries one question. Three parts, top to bottom:

1. **Stimulus** (present only when the question shares a reading passage or table)
   — a native `<details>`: sticky, capped and internally scrolling when open, one 44px
   pinned summary row (`UKÁŽKA · ZIMNÉ PARALYMPIJSKÉ HRY ⌄`) when collapsed; open at
   the group's first question, collapsed from the second. See the Sticky-Stimulus Rule
   above. Tables
   arrive as real `<table>` markup and get their own `overflow-x:auto` wrapper inside
   the stimulus, so a five-column table (`mat-2024-a-s1`) scrolls sideways in its own
   lane without taking the page with it.
2. **Prompt** — the question itself, `body` role, `max-width: 66ch` so a paragraph
   never runs edge-to-edge even on a wide desktop panel.
3. **Source citation** — `caption` role, `--ink-3`, a real link to the original NUCEM
   PDF (`00-KONTEXT.md`'s attribution requirement, satisfied on every single question,
   not just as a footer).

### Option Row (mc)

The flap cell's third job. A tappable row, `min-height: 44px`, a real hairline between
rows (never two adjacent tap targets touching bare edge-to-edge). Left: a small Flap
Cell showing the option's letter, A–D — the cheapest, most on-system way to get a flip
into the game, because the housing and the flip animation already exist and need
nothing new. Right: the option's text in the `option` role.

States, per the rewritten One Signal Rule: **default** (letter on the normal two-tone
leaf, `--ink-2` text) → **selected, unconfirmed** (a `sheen-3` inset ring on the cell,
text promoted to `--ink` — a selection is not yet an answer) → on confirm, a real
leaf-fall/leaf-land flip lands on **correct** (cell inverts to a solid `--ink` fill,
`✓` in `--board`) or **wrong** (cell stays on its normal material, glyph turns `✕` in
`--signal`). When the pick was wrong, the option that *was* correct gets a quiet
`✓ SPRÁVNE` caption instead of a flip — the flip is reserved for the row the visitor
actually interacted with; the reveal is information, not a second animation.

### Answer Field (num / word)

A single inset control, not a form. Background is `--gap` — the same seam-black behind
every flap cell, so a text input reads as another instance of the board's own material
rather than a borrowed browser widget. Text is the `answer` role (bold, tabular).
`type="num"` sets `inputmode="decimal"` for the numeric keypad; `type="word"` is plain
text. No border, no visible focus chrome beyond the existing global `:focus-visible`
ring.

### Progress Strip

3–7 small Flap Cells, one per question in today's set — the exact count set by
`01-ARCHITEKTURA.md`'s `daily()` algorithm, never hard-coded to five. Each cell is
**empty** (a dash, `--ink-3`), **current** (a `sheen-3` ring, blank), **correct**
(inverted fill, `✓`) or **missed** (`✕` in `--signal`) — the same four states as the
Option Row's flap, because it is tracking the same event. A `.sr`-only sentence
("Úloha 4 z 5. Doteraz 2 správne, 1 zmeškaná.") carries the same information for a
screen reader, per the direction contract's accessibility requirement that the strip
never be seven silent cells. On `#/uloha` the strip lives *inside* the pinned band,
on its own row under the countdown signage line — the two are one piece of chrome
there, and the whole band measures 107px against the flap strip's 117px for the
countdown alone.

### Report (Výkaz)

Three stacked pieces, no new chart type:

- **Streak line** — one row of `label`/`label-strong` text: `SÉRIA 9 DNÍ · RÝCHLIK ·
  REKORD 14 · REZERVA 1`. The record and the reserve count sit in the same line as the
  live streak on purpose — `00-KONTEXT.md`'s R10 requires the record stay visible next
  to zero the instant a streak breaks, and putting them in one line rather than three
  separate stats means there's no state where the record can be shown without it. **The
  line carries its own word `SÉRIA`, so it never gets a section caption above it** —
  a `SÉRIA` heading over a line that starts `SÉRIA` is the same word twice.
  Each caption and its number is **one non-breaking span**, not loose text: as bare
  text nodes in a flex row they are separate items and `REZERVA` wraps away from its
  `1`, which reads as a missing value rather than a wrapped line.
- **14-day strip** — the exact same small-Flap-Cell component as the Progress Strip,
  just fourteen cells instead of up to seven. This is deliberate reuse, not a
  coincidence: `03-DIZAJN.md` bans a new chart type outright, and a row of punched/
  unpunched tickets already *is* the system's native way to show a sequence of
  pass/fail days.
- **Success stats** — two `stat`-role percentages (`72 %` / `81 %`) side by side, MAT
  and SJL, each with its fraction underneath in `label` size. This is the one place in
  the whole build a number is large and lives outside a flap-cell housing; it is sized
  well under the countdown's own lead digits so it never competes with the board's
  actual signature number.
- **Weak topics** — a plain list, worst-first, each row a topic name (`option` role)
  and a fraction (`answer` role), tappable to start a set from that topic. Only topics
  with 3+ attempts appear, per `01-ARCHITEKTURA.md` — two attempts at 50% is noise, not
  a weak spot.

### Nickname Panel

One `answer-field` input, one `.btn`, inside a small Board Panel. No form fields beyond
the nickname itself — `00-KONTEXT.md`'s R6 requires the UI ask for it explicitly as a
nickname, never a name, so the label says exactly that.

### View Switcher

Chrome, uppercase, `label` role, `location.hash`-driven. It carries three destinations
— **Dnes**, **Výkaz**, **Tabuľa** — not five. `#/uloha` and `#/vysledok` are reached
only through the day's own flow (the start/continue button, then the finish screen's
own continue button), never as tabs, because they are not places a visitor chooses to
revisit out of context — arriving at "Úloha" cold, with no question loaded, is a dead
end this switcher is designed not to offer.

## Do's and Don'ts

### Do:
- **Do** derive every flap dimension from `--c` with `calc()` — glyph size (`1.44`), cell
  height (`1.55`), pin diameter (`.085`), spin blur (`.026` / `.05`).
- **Do** pull every shadow, bevel, and hairline from the shade/sheen ramp; pick the nearest
  existing step.
- **Do** set `tabular-nums` on anything numeric.
- **Do** re-check 375×667 after any change to cell sizing, board padding, or column gaps.
- **Do** keep uppercase and 0.14–0.22em tracking on every *chrome* string outside a flap
  cell (rails, tabs, captions, headings) — content strings are the v2 exception below.
- **Do** treat the preview frame as its own surface with its own type sizes.
- **Do** keep the wall a single flat green with material supplied by grain, sheen, and vignette.
- **Do** write question, passage, option, and answer text in sentence case — the
  All-Caps Signage Rule governs chrome, not content, as of v2.
- **Do** pin the corner countdown and progress strip; let everything else scroll.
- **Do** cap a sticky stimulus's height and give it its own internal scroll — never let
  it grow to fill the viewport, and collapse it to its summary row from the group's
  second question on.
- **Do** check any element that stands on `--enamel` against `--ink-2` as its darkest
  ink; `--ink-3` is a board colour.
- **Do** re-measure 375×667 on `#/uloha` after any change to the pinned band — the
  question plus all options fitting one screen is a number, not a feeling.
- **Do** carry the streak's record and reserve count on the same line as the live
  streak, so the record is never one tap away from a broken streak.

### Don't:
- **Don't** introduce a new rgba value for a shadow. If no ramp step fits, the effect is wrong.
- **Don't** use the signal colour for anything but the departed service.
- **Don't** shrink units to keep them on one row; reflow instead.
- **Don't** blur, transform, or animate `.flap` itself — the housing never moves.
- **Don't** let a character cell size itself to its content; pad into the fixed cell count.
- **Don't** add lifted cards or hover elevation; surfaces are recessed into the wall.
- **Don't** put a readable time value in the preview frame at any granularity finer than days.
- **Don't** give screws or pins an ink colour; hardware is metal.
- **Don't** add a build step, a dependency, or a framework — three files, served as-is.
- **Don't** give a correct answer a green fill — the wall is green; correctness is
  material (an inverted flap) plus a glyph, never a second colour.
- **Don't** set question, passage, or option text in uppercase — that rule is retired
  for content as of v2, and applying it to a paragraph makes it unreadable.
- **Don't** let `pointerdown` anywhere in the document trigger the cascade/bell/shout
  once the game ships — that interaction narrows to the corner countdown tile alone.
- **Don't** invent a new chart type for the report; the 14-day strip is small Flap
  Cells, the same component the progress strip already uses.
- **Don't** put `--ink-3` on the wall. Tabs, section captions, stat captions and hints
  sit on `--enamel`, where that tint is 3,38:1 — use `--ink-2`, never a new tint.
- **Don't** put the flap countdown on `#/uloha`; there it is one signage line. And
  don't drop the countdown from a view to buy space — change its register instead.
- **Don't** repeat a label that a line already contains (`SÉRIA` over `SÉRIA 9 DNÍ`),
  and don't let a caption wrap away from its own number.
- **Don't** say a subject was *odbavený* — a passenger is checked in at an airport, a
  train is **vypravený**. The station vocabulary is the product; a wrong verb in it is
  a wrong colour.
