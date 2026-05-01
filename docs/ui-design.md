# UI Design

## Visual Direction

**Warm Retro-Futurism.**

A personal, cozy study reimagined as a desktop OS. Blends the structural rigidity of 90s operating systems with a soft, warm color palette and refined typography. Rejects aggressive skeuomorphic shadows and sterile flat design — uses structural borders and 2D-depth effects (inset/outset) to create physical presence. The emotional response should be focused calm, nostalgia, and digital comfort.

References:
- PostHog OS mode (https://posthog.com) — best production example of this pattern
- Windows 95/98 chrome aesthetic
- awesome-web-desktops (https://github.com/syxanash/awesome-web-desktops) — gallery of similar projects

---

## Theme

- **Base:** Light only. Dark mode not planned.
- **Shape language:** Strictly sharp — 0px border radius everywhere. No rounded corners, including tooltips and chips. Keeps borders crisp and pixel-perfect.
- **Elevation:** Communicated through structural borders, not shadows. Outset/inset 2px border logic (see below).

---

## Colors

All colors are defined in `docs/design.md`. Key references for implementation:

| Role | Token | Hex |
|---|---|---|
| Desktop background | `background` | `#faf9f8` |
| Window background | `surface-container-lowest` | `#ffffff` |
| Secondary surfaces (sidebars, status bars) | `surface-container-low` | `#f4f3f2` |
| Recessed areas / inputs | `surface-container` | `#eeeeed` |
| All structural borders | `outline-variant` | `#c3c6d0` |
| Primary text | `on-surface` | `#1a1c1c` |
| Secondary/muted text | `on-surface-variant` | `#43474f` |
| Active window title bar | `primary-container` | `#7b9acc` |
| Inactive window title bar | `surface-container-high` | `#e9e8e7` |
| Active window title text | `on-primary-container` | `#09315d` |
| Primary accent | `primary` | `#405f8e` |
| Error / destructive | `error` | `#ba1a1a` |

**Heritage accent:** `#008080` (classic teal) used sparingly — one system-level icon or a classic mode toggle only.

---

## Typography

Defined in `docs/design.md`. Two fonts:

| Font | Use |
|---|---|
| **Space Grotesk** | All UI elements — title bars, buttons, labels, menus, chips. Geometric, semi-technical, gives the OS feel. |
| **Inter** | All user content — notes, task text, long-form reading. High legibility balances the stylized UI. |

Key rules:
- Keep font sizes small to preserve compact OS density. Rely on weight and all-caps casing for hierarchy, not scale.
- Window titles: Space Grotesk 14px / 600 weight
- UI labels: Space Grotesk 12px / 500 weight
- Body content: Inter 15px / 400 weight
- Monospace data display: Space Grotesk 13px / 400 weight

---

## Wallpapers (3 options)

All light, subtle, non-distracting. Switchable from top menu bar.

1. **Dot matrix** — small repeating dots on `#faf9f8`, like old printer paper
2. **Retro grid** — subtle perspective grid, light gray lines on warm white
3. **Linen texture** — soft fabric-like noise pattern, warm off-white

---

## Desktop Layout

- **Desktop area:** Full viewport, wallpaper background, icon auto-grid
- **Icons:** Snap to invisible grid, 32x32px, pixel-art-influenced or flat SVG with retro edge
- **Windows:** Float above desktop, draggable, resizable, sharp corners, outset border chrome
- **Top menu bar:** Fixed at top, rendered on `surface-container-low` (`#f4f3f2`)

---

## Elevation & Depth

No box shadows. Depth is structural.

**Outset effect** (raised — default for windows, buttons):
- 1px light highlight (`#ffffff` or background color) on top + left edges
- 1px darker border (`#c3c6d0`) on bottom + right edges

**Inset effect** (recessed — inputs, scrollbar tracks, pressed buttons):
- 1px darker border (`#c3c6d0`) on top + left edges
- 1px light highlight on bottom + right edges

**Z-axis (windows):**
- Active window: `primary-container` (`#7b9acc`) title bar, title text in `on-primary-container` (`#09315d`)
- Inactive window: `surface-container-high` (`#e9e8e7`) title bar, muted text

---

## Top Menu Bar

Rendered on `#f4f3f2`. Left to right:

- **App logo / home**
- **Active windows list** — dropdown showing open windows, click to focus, click × to close
- **App search** — spotlight-style search through all apps
- *(spacer)*
- **System stats** — CPU / RAM usage (Space Grotesk mono-data style)
- **Calendar** — click to open mini calendar popup
- **Date / Time** — live display (Space Grotesk mono-data style)
- **Wallpaper switcher**
- **Settings cog** (future use)

---

## Window System

Built with `@use-gesture/react` + `framer-motion`. No external window management library.

**Window chrome:**
- Title bar: app icon (16px) + app name (Space Grotesk 14px/600) on the left
- Control buttons grouped on the right: Minimize (`_`), Maximize (`□`), Close (`×`) — 16×16px boxes with pixel-style icons
- Active title bar: `#7b9acc` background, `#09315d` text
- Inactive title bar: `#e9e8e7` background, `#43474f` text
- Window border: outset 2px effect using `#c3c6d0`
- 0px border radius everywhere

**Window behaviors:**
- Drag by title bar only
- Resize from edges and corners
- Open animation: spring scale-in from 0.95 opacity+scale
- Close animation: fade out
- Active window: higher z-index, active title bar color
- Click anywhere on window to bring to front

**Multi-instance:** Allowed for all apps. User manages duplicates via active windows list in top bar.

---

## Component Patterns

**Buttons:**
- Rectangular, 1px solid border, 0px radius
- Default state: outset border effect, `surface-container-low` background
- Hover: background shifts to `#f4f1ee`
- Active/pressed: inset border effect, text offset 1px down-right
- Padding: 4px–8px vertical (compact density)

**Inputs:**
- Inset border effect, white background
- Label above in Space Grotesk Bold 12px all-caps
- 0px radius

**Chips / Tags:**
- Rectangular blocks, 1px solid border, 0px radius
- Background from accent palette

**Lists:**
- 4px vertical padding per item
- Selected state: `primary-container` (`#7b9acc`) background, white text

---

## Libraries

| Purpose | Library |
|---|---|
| Window drag + resize | `@use-gesture/react` + `framer-motion` |
| UI components (headless) | `@base-ui/react` |
| Styling | Tailwind CSS |
| Animations | `framer-motion` |
| Terminal rendering | `xterm.js` + `@xterm/addon-fit` + `@xterm/addon-web-links` |

---

## Shared UI Components

All base components live in `apps/frontend/src/shared/components/ui/`. Import from the barrel:

```ts
import { Button, Input, Checkbox, Select, Dialog, Tooltip, Separator, ScrollArea, cn } from '@/shared/components/ui'
```

Use `cn()` (clsx + tailwind-merge) for all conditional class merging. Every component accepts a `className` prop for override.

| Component | Base UI source | Notes |
|---|---|---|
| `Button` | `@base-ui/react/button` | Variants: `default`, `primary`, `ghost`, `destructive`. Sizes: `sm`, `md`. Outset border effect on default. |
| `Input` | `@base-ui/react/input` | Optional `label` prop renders Space Grotesk all-caps label above. Inset border effect. |
| `Checkbox` | `@base-ui/react/checkbox` | Optional `label` prop. Sharp checkmark SVG. Fills with `primary` when checked. |
| `Select` | `@base-ui/react/select` | Takes `options: {value, label}[]`. Outset trigger, flat popup with `primary-container` highlight. |
| `Dialog` | `@base-ui/react/dialog` | Retro title bar with close button. Drop shadow via `shadow-[4px_4px_0_#c3c6d0]`. |
| `Tooltip` | `@base-ui/react/tooltip` | Dark inverse-surface background. Configurable `side` prop. |
| `Separator` | `@base-ui/react/separator` | Horizontal or vertical, `outline-variant` color. |
| `ScrollArea` | `@base-ui/react/scroll-area` | Inset scrollbar track, `outline-variant` thumb. Supports `vertical`, `horizontal`, `both`. |

## App Registry & Extensibility

A central app registry object defines all available apps. Adding a new entry automatically:
- Places a new icon on the desktop grid
- Adds the app to the top-bar quick-access search

Each entry defines: `name`, `icon`, `component`, `multiInstance` flag.
