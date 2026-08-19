---
name: Odchodová tabuľa
description: A Pragotron split-flap departure board recessed into an institutional enamel wall.
colors:
  enamel: "#2A5346"
  enamel-dk: "#173229"
  enamel-lt: "#3F705D"
  board: "#0F1215"
  gap: "#050708"
  flap-top: "#3C434A"
  flap-bottom: "#262C32"
  ink: "#F0EBDD"
  ink-2: "#C3CFC7"
  ink-3: "#94A69B"
  wall-ink: "#DEE9E2"
  hardware: "#79838C"
  hardware-screw: "#6E7A72"
  hardware-dk: "#272D33"
  knob: "#2F5A4A"
  knob-dk: "#22453A"
  signal: "#E8543B"
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
  caption:
    fontFamily: "Archivo Narrow, system-ui, sans-serif"
    fontSize: "clamp(10px, 1.35vw, 13px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.22em"
rounded:
  focus: "2px"
  cell: "3px"
  panel: "4px"
  pin: "50%"
spacing:
  hairline: "2px"
  cell-gap: "3px"
  stack: "7px"
  knob-y: "9px"
  foot: "14px"
  knob-x: "16px"
  unit-gap: "clamp(10px, 1.8vw, 22px)"
  page: "clamp(14px, 4vw, 48px)"
  board-x: "clamp(14px, 3vw, 34px)"
  wall-gap: "clamp(18px, 3.4vw, 34px)"
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
  button-knob:
    backgroundColor: "{colors.enamel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.cell}"
    padding: "9px 16px"
  button-knob-hover:
    backgroundColor: "{colors.enamel-lt}"
    textColor: "{colors.ink}"
  rail-label:
    textColor: "{colors.ink-3}"
    typography: "{typography.label}"
  rail-value:
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
  departed-note:
    textColor: "{colors.signal}"
    typography: "{typography.label}"
---

# Design System: Odchodová tabuľa

## Overview

**Creative North Star: "The Station Wall"**

One piece of public hardware, photographed head-on. An institutional enamel wall
fills the viewport and a dark split-flap board is recessed into it — not floating
above it, set into it, with four screws at the corners and a lit top edge where
the panel meets the paint. Every character on the board lives in a fixed cell with
a visible housing and two axle pins; nothing on this surface is typeset, everything
is mounted.

The system is committed to its palette rather than accented by it: the enamel green
carries roughly half the visible surface, the board face carries the rest, bone is
the only ink on the board, and a single signal red is reserved for one sentence.
There is no third accent, no gradient brand mark, no soft neutral card. Density is
tight and mechanical — 2–3px between cells, hairline rules of light rather than
borders — while the countdown itself is deliberately enormous, past any usual
display cap, because the number is the entire product.

The refusal is explicit and visible in the build: no centred neon digit block on a
black field. Where a clock-face treatment would centre glowing numerals in void,
this centres a *timetable* in a room.

**Key Characteristics:**
- Two surfaces only: enamel wall, recessed board face.
- Fixed character cells; text is padded with blank cells, never reflowed.
- One typeface, all caps, all tracked, weights 400 and 700 only.
- Depth is entirely inset — recess, bevel, hardware — with no floating elevation.
- Every dimension of the mechanism derives from one custom property, `--c`.

## Colors

A committed institutional palette: enamel green owns the room, the board face is
near-black, bone is the only ink, and one red is spent on one message.

### Primary
- **Institutional Enamel** (`{colors.enamel}`): the wall. It is the page background
  and covers roughly half the visible surface at every breakpoint.
- **Knob Enamel** (`{colors.knob}` / `{colors.knob-dk}`): the PREHODIŤ button, so the
  only interactive control reads as painted metal screwed to the same wall. It is a
  *darker* step than the wall, not the wall colour: bone on wall green measures 3.5:1,
  which fails AA at the button's 10–12px, while bone on knob green reaches 6.6:1.
  Do not "correct" this back to `{colors.enamel}`; the darkening is the contrast fix.
- **Enamel Shadow** (`{colors.enamel-dk}`): the physical bottom edge of the knob and
  its pressed state. Wall-coloured, never a neutral grey.
- **Enamel Light** (`{colors.enamel-lt}`): the hover lift on the knob and the light
  end of any enamel gradient.

### Secondary
- **Signal Red** (`{colors.signal}`): the departed-service line and its 26×2px dash,
  plus text selection. One role, one place. It never appears on the countdown, the
  rail, the destination, or the button.

### Neutral
- **Board Face** (`{colors.board}`): the recessed panel behind everything mounted.
- **Cell Void** (`{colors.gap}`): the near-black gap visible behind and between flap
  leaves; darker than the board so a cell reads as a hole in it.
- **Flap Top / Flap Bottom** (`{colors.flap-top}` / `{colors.flap-bottom}`): the two
  leaf faces. The upper leaf is lighter than the lower; that difference *is* the
  split line, not a border.
- **Bone** (`{colors.ink}`): every character printed on a flap, and the knob label.
- **Weathered Bone** (`{colors.ink-2}`): the rail value and the lead unit's caption —
  secondary board text, cooled and greened.
- **Faded Bone** (`{colors.ink-3}`): rail keys and unit captions; the quietest legible
  step on the board.
- **Painted Wall Text** (`{colors.wall-ink}`): the one sentence painted on the wall
  below the board. Distinct from board bone because it sits on green, not black.
- **Hardware Steel** (`{colors.hardware}` pins, `{colors.hardware-screw}` screws,
  `{colors.hardware-dk}` both dark stops): flap axle pins and corner screws, always as
  the light stop of a small gradient into near-black. Pins sit one step brighter than
  screws because they catch the board's top light on a moving edge.

### Light & Shade Ramp
Not palette hues — a single ramp of black and white alphas that every shadow, bevel,
hairline and material layer draws from, so depth is one vocabulary rather than a
per-element guess. `{colors.shade-0}` through `{colors.shade-5}` darken; `{colors.sheen-0}`
through `{colors.sheen-3}` lighten. The wall texture uses the two faintest steps of each,
the recess stack the heaviest.

**The One-Ramp Rule.** A new shadow, edge or texture picks the nearest existing step. It
never introduces a fresh alpha. Nine ad-hoc black alphas is how this file looked before
the ramp existed, and the difference between .55 and .6 was never a design decision.

### Named Rules

**The Signal-For-Departed Rule.** Signal red states one thing only: a service that
has already left. It is never a highlight, never a hover, never an error tint, never
applied to a digit. If a new surface wants red for emphasis, it does not get red.

**The Two-Surface Rule.** There are exactly two backgrounds in this world: the enamel
wall and the board face. New content either mounts onto the board or is painted on the
wall. Inventing a third surface — a card, a panel, a tinted well — breaks the room.

## Typography

**Display / Body / Label Font:** Archivo Narrow, self-hosted woff2 in `fonts/`
(latin and latin-ext subsets, variable weight axis 400–700), falling back to
`system-ui, sans-serif`.

**Character:** One condensed grotesque doing every job. Narrow enough that a 13-cell
destination line fits a phone, sturdy enough at 700 to survive being printed 178px
tall on a plastic leaf. Everything is uppercase; everything except the flap glyphs is
tracked wide, so small text reads as engraved signage rather than as UI copy.

### Hierarchy
- **Display** (700, `calc(var(--c) * 1.44)`, line-height `calc(var(--c) * 1.55)`):
  the glyph inside a flap cell. Size is not a fixed step — it is a ratio of the cell,
  so the lead unit renders far past a conventional display cap (up to ~178px at the
  desktop `--lead` ceiling) while the small units share the identical rule at a smaller
  `--c`. Always `tabular-nums`.
- **Headline** (700, `clamp(17px, 4.6vw, 26px)`, tracking `0.17em`, uppercase): the
  single sentence painted on the wall, balanced and centred, with a 1px dark drop to
  suggest paint on paint.
- **Title** (400, `clamp(12px, 1.7vw, 16px)`, tracking `0.22em`, uppercase): the lead
  unit's caption only — one step up from the other captions because its unit is the one
  the visitor came for.
- **Label** (400/700, `clamp(11px, 1.5vw, 14px)`, tracking `0.19em`, uppercase): the
  rail across the top of the board (key at 400, value at 700 with `tabular-nums`) and
  the departed-service line at `0.14em`.
- **Caption** (400, `clamp(10px, 1.35vw, 13px)`, tracking `0.22em`, uppercase): unit
  captions under the cell groups, and the knob label at 700 / `0.2em`.

There is no body-copy role. This world has no paragraphs; if one is ever needed it is
new work, not a token that already exists.

### Named Rules

**The Fixed Cell Rule.** Board text occupies a fixed number of character cells
(destination lines are exactly 13). Shorter strings are centred by padding with blank
cells; they never shrink the type, never recentre the row, never wrap.

**The All-Caps Signage Rule.** Every visible string is uppercase and tracked. Weight
is 400 or 700 — nothing between, no italics, no third face.

## Layout

A single centred column. The body is a grid with `place-items: center`, padded
`clamp(14px, 4vw, 48px)` and respecting `env(safe-area-inset-bottom)`; the wall column
stacks the board and the painted sentence with a `clamp(18px, 3.4vw, 34px)` gap. The
board caps at 1180px wide and is padded asymmetrically — more at the top than the
bottom — so the rail sits inside a visible margin of board face.

Inside the board the rhythm is mechanical rather than modular: 2px between destination
cells, 3px between digit cells, 7px between a cell group and its caption, hairline
gradient rules (1px, light fading to transparent at both ends) separating rail /
destination / clock / foot instead of solid dividers.

**The `--c` Rule.** All cell geometry descends from a single per-unit custom property.
`--cell` (`clamp(34px, 8.2vw, 72px)`) and `--lead` (`clamp(70px, 24vw, 124px)`) are the
two source values; each unit assigns one of them to `--c`, and cell width, cell height
(`--ch`, 1.55), glyph size (×1.44), axle-pin diameter (×0.085) and spin blur radius
(×0.026 / ×0.05) are all `calc()`ed from it. Changing a countdown's scale means changing
one number, never a set of paired values.

**Responsive behaviour.** Three states, all driven by re-assigning those two properties:
- **Below 560px** the four small units go two-per-row (`flex-basis: calc(50% - 5px)`)
  and `--cell` is raised to `clamp(48px, 18.5vw, 74px)`. This is deliberate: the phone in
  an in-app browser is the reference device, and one long row of tiny digits would be the
  wrong trade. Destination-line axle pins are hidden at this size — at ~16–20px cells they
  are noise, not hardware.
- **560–899px** `--cell` narrows to `clamp(44px, 7.4vw, 60px)`; the lead unit still holds
  its own row.
- **900px and up** the lead unit joins the row (`flex-basis: auto`) with a right margin,
  producing the wide single-line board.

A fourth framing exists for the 1200×630 link preview (`body.og`): the same board with
fixed `--cell: 56px` / `--lead: 92px` and a 1080px cap, so the composition is identical
and only the scale is pinned.

## Elevation & Depth

Nothing floats. Depth in this system is *recess* — the board is set into the wall, and
the flaps are set into the board. The board's stack does the whole job: a 1px black
containment ring, a heavy inset shadow from the top edge, a second inset falloff, a
faint inset light at the bottom lip, a 1px light line along the outside top edge where
the wall catches the panel, and a very short outer drop. Read together they say the
panel is behind the wall plane, not above it.

Cells repeat the same logic one level down: the flap sits on the near-black cell void,
the upper leaf carries `inset 0 1px 0 rgba(255,255,255,.09)` and the lower carries
`inset 0 -1px 0 rgba(0,0,0,.55)`, and the descending leaf casts a real gradient shadow
onto the half beneath it. Screws and axle pins are two-stop radial/linear gradients with
a 1px dark ring — the only "objects" allowed to sit proud.

The wall itself is not a flat fill. It is a fractal-noise SVG blended in `soft-light` for
lacquer grain, a raking highlight at 101°, a broad top-light radial, a soft floor shadow,
two very low-opacity repeating stripe layers for brush drag, and a 50%-black vignette.

### Named Rules

**The Recess Rule.** New elements are inset or mounted. Outer `box-shadow` is limited to
the board's containment ring and its short contact drop; no ambient card shadow, no glow,
no lifted hover.

**The Fixed Housing Rule.** Motion blur is applied to the inner glyph element only, never
to the flap itself. The housing is hardware: it does not blur, scale, or move. Only the
character moves.

## Shapes

Rectangles with just enough radius to read as moulded plastic and enamelled steel, never
as software. The board is 4px, flap cells and leaves are 3px (leaves round only their
outer corners, so the split line stays dead straight), the knob is 3px, screws and axle
pins are full circles, and the focus ring rounds at 2px. Nothing is a pill; nothing is
a circle except actual hardware.

Borders are almost absent. Separation is done with light: 1px gradient rules that fade
out at both ends, and 1px inset highlight/shadow lines at material edges. The one solid
mark in the system is the departed-service dash — a 26×2px signal-red bar, a plain
rectangle, no cap and no icon.

Silhouette to preserve: a wide dark rectangle with four visible screws, a row of narrow
vertical cells inside it, each cell split horizontally at its midline with two pins on
its flanks.

## Components

### Buttons
- **Shape:** slightly moulded corners (3px), no border.
- **Primary (the enamel knob):** enamel gradient face (`#2F5A4A` → `#22453A`), bone
  label at 700 / `0.2em` tracking / uppercase, padding `9px 16px`, sized from the small
  caption step (`clamp(10px, 1.3vw, 12px)`) so it reads as a fitting, not a CTA.
- **Hover:** the face lightens toward Enamel Light over 90ms `ease-out`.
- **Active:** the button physically travels — `translateY(2px)` while its bottom edge
  collapses to zero. Press feedback is displacement, not colour.
- **Focus:** the global ring — 2px solid bone, 4px offset, 2px radius — is the only focus
  treatment in the system and applies unchanged to every focusable element.
- There is no secondary or ghost variant. One control exists on this surface.

### Cards / Containers
The board is the only container.
- **Corner Style:** 4px.
- **Background:** board face with a short top-down light wash fading out by 90px.
- **Shadow Strategy:** the recess stack described in Elevation & Depth. Not reusable as
  a generic card shadow.
- **Border:** none; a 1px black ring in the shadow stack does the containment.
- **Internal Padding:** `clamp(18px,3vw,30px)` top, `clamp(14px,3vw,34px)` sides,
  `clamp(14px,2.4vw,24px)` bottom.
- **Fixtures:** four 9px screw heads inset 7px from each corner, each with a rotated
  slot; they are part of the container, not decoration to be dropped at small sizes.

### Navigation
None. This is a single surface with no navigation, and adding one would need new work.

### Signature Component: the split-flap cell

The whole system is this cell repeated.

- **Structure:** a fixed housing (`width: var(--c)`, `height: calc(var(--c) * 1.55)`,
  `perspective: 420px`) over the near-black cell void, containing two static halves and
  two animated leaves, plus two axle pins pinned at the vertical midline.
- **Flip:** Web Animations API on the two leaves, not CSS keyframes — the descending leaf
  rotates `0 → -90deg` over 108ms on `cubic-bezier(.5,0,.9,.4)` and the ascending leaf
  `90deg → 0` over 230ms on `cubic-bezier(.18,.72,.3,1)`, with existing animations
  cancelled first so a re-set restarts cleanly instead of queueing.
- **Cascade:** on load and on every poke, cells roll left-to-right — destination cells
  staggered 18ms apart, then the clock cells 26ms apart after the destination finishes.
  A rolling cell swaps 4–8 random glyphs at 45ms under blur and only the final value
  lands with a real flip.
- **Blur:** `blur(calc(var(--c) * .026))` while spinning, `blur(calc(var(--c) * .05))`
  for the fast column — applied to the inner glyph, never the housing.
- **Hundredths:** the last unit never flips. Both cells carry permanent spin (the second
  at fast blur) and swap instantly, because at 100Hz a leaf cannot fall. This is the
  panic column; it is the reason the composition works in two seconds.
- **Reduced motion:** all blur filters are removed, the knob transition is dropped, flips
  and rolls are replaced by instant character swaps, and the hundredths cells freeze blank
  with their caption at 42% opacity. A 10Hz column is still flicker; the honest answer is
  to stop it, and the dimmed caption says so without adding a message.

### Rail and captions
- **Rail:** a baseline-aligned key/value pair across the full board width — faded bone key
  at 400, weathered bone value at 700 with `tabular-nums` and `white-space: nowrap`.
- **Unit caption:** faded bone, tracked `0.22em`, uppercase, 7px under its cell group; the
  lead unit's caption steps up in size and to weathered bone.
- **Departed line:** signal red, uppercase, preceded by a 26×2px signal-red bar, sitting in
  a `space-between` foot row opposite the knob.

## Do's and Don'ts

### Do:
- **Do** derive every new mechanism dimension from `--c` with `calc()`, and set `--c` from
  `--cell` or `--lead` — never hard-code a cell width, glyph size, pin size or blur radius.
- **Do** keep board text in fixed character cells, padded with blanks to the row width.
- **Do** convey depth by insetting: recess, bevel, 1px light edge, contact drop.
- **Do** apply motion blur to the inner glyph only; the housing is fixed hardware.
- **Do** use Web Animations API for the flip so re-triggering cancels and restarts cleanly.
- **Do** honour `prefers-reduced-motion` by removing blur and stopping the hundredths
  entirely rather than slowing them down.
- **Do** ship type as self-hosted woff2 in `fonts/`, preloaded, `font-display: swap`.
- **Do** treat the phone under 560px as the reference device: reflow to two units per row
  and raise `--cell` so digits stay large.
- **Do** keep every string uppercase and tracked, at weight 400 or 700.

### Don't:
- **Don't** introduce a build step, a package manager, or any dependency. `index.html`,
  `style.css`, `main.js` and `fonts/` are the whole system; anything needing `package.json`
  is out of this world by construction.
- **Don't** cap the countdown at a conventional display size. The lead digits are meant to
  exceed 6rem; the number is the product.
- **Don't** spend signal red on anything but a departed service.
- **Don't** add a third surface colour, a second accent, or a second typeface.
- **Don't** float anything: no ambient card shadows, no glow, no hover lift.
- **Don't** let a countdown digit reflow the layout — `tabular-nums` is mandatory here.
- **Don't** flip the hundredths. They swap under permanent blur; a leaf cannot fall at 100Hz
  and faking it reads as a stutter.
- **Don't** replace the flip with CSS keyframes; a restarted keyframe animation mid-flight
  leaves a leaf stranded.
