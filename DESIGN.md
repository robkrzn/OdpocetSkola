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
- **Faded Ink** (`{colors.ink-3}`): rail keys and small unit captions; the quietest legible step.
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

**The One Signal Rule.** The signal colour marks the departed service and nothing else.
It is never used for emphasis, never for a heading, never for a second element on the
same screen. Its rarity is what makes it read as an alarm.

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

### Named Rules

**The Tabular Rule.** Every numeral in the build sets `font-variant-numeric: tabular-nums`.
At 100 updates per second, proportional figures make the layout twitch. This is
correctness, not polish.

**The All-Caps Signage Rule.** Every string outside a flap cell is uppercase with tracking
between 0.14em and 0.22em. Sentence case appears nowhere on the board; this is signage, and
signage shouts quietly.

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

**The No-Scroll Rule.** The board must fit one viewport on the reference device without
scrolling. Cell size is bounded by `min(vw, vh)`, not by width alone. 375×667 overflowed by
111px before that bound existed; any change to cell sizing is re-checked at 375×667 first.

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

## Do's and Don'ts

### Do:
- **Do** derive every flap dimension from `--c` with `calc()` — glyph size (`1.44`), cell
  height (`1.55`), pin diameter (`.085`), spin blur (`.026` / `.05`).
- **Do** pull every shadow, bevel, and hairline from the shade/sheen ramp; pick the nearest
  existing step.
- **Do** set `tabular-nums` on anything numeric.
- **Do** re-check 375×667 after any change to cell sizing, board padding, or column gaps.
- **Do** keep uppercase and 0.14–0.22em tracking on every string outside a flap cell.
- **Do** treat the preview frame as its own surface with its own type sizes.
- **Do** keep the wall a single flat green with material supplied by grain, sheen, and vignette.

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
