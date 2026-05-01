---
name: Minimal Desktop
colors:
  surface: "#faf9f8"
  surface-dim: "#dadad9"
  surface-bright: "#faf9f8"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f4f3f2"
  surface-container: "#eeeeed"
  surface-container-high: "#e9e8e7"
  surface-container-highest: "#e3e2e1"
  on-surface: "#1a1c1c"
  on-surface-variant: "#43474f"
  inverse-surface: "#2f3130"
  inverse-on-surface: "#f1f0f0"
  outline: "#747780"
  outline-variant: "#c3c6d0"
  surface-tint: "#405f8e"
  primary: "#405f8e"
  on-primary: "#ffffff"
  primary-container: "#7b9acc"
  on-primary-container: "#09315d"
  inverse-primary: "#a9c8fc"
  secondary: "#41664f"
  on-secondary: "#ffffff"
  secondary-container: "#c0eacc"
  on-secondary-container: "#456b53"
  tertiary: "#805253"
  on-tertiary: "#ffffff"
  tertiary-container: "#c08b8b"
  on-tertiary-container: "#4b2627"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#d5e3ff"
  primary-fixed-dim: "#a9c8fc"
  on-primary-fixed: "#001c3b"
  on-primary-fixed-variant: "#264774"
  secondary-fixed: "#c3eccf"
  secondary-fixed-dim: "#a7d0b4"
  on-secondary-fixed: "#002111"
  on-secondary-fixed-variant: "#294e39"
  tertiary-fixed: "#ffdad9"
  tertiary-fixed-dim: "#f2b8b8"
  on-tertiary-fixed: "#321113"
  on-tertiary-fixed-variant: "#653b3c"
  background: "#faf9f8"
  on-background: "#1a1c1c"
  surface-variant: "#e3e2e1"
typography:
  window-title:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: "600"
    lineHeight: 16px
    letterSpacing: 0.02em
  ui-label:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: "500"
    lineHeight: 12px
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: "400"
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: "400"
    lineHeight: 20px
  mono-data:
    fontFamily: Space Grotesk
    fontSize: 13px
    fontWeight: "400"
    lineHeight: 18px
spacing:
  base: 8px
  half: 4px
  double: 16px
  window-padding: 12px
  container-gap: 8px
---

## Brand & Style

This design system is built on the philosophy of "Warm Retro-Futurism." It reimagines the desktop computing experience not as a high-performance workstation, but as a personal, cozy study. It blends the structural rigidity of 90s operating systems with a modern, soft color palette and refined typography.

The visual style is a hybrid of **Minimalism** and **Tactile Retro**. It rejects the aggressive shadows of skeuomorphism and the sterile flatness of modern corporate design. Instead, it utilizes structural borders and 2D-depth effects (inset/outset) to create a sense of physical presence. The emotional response should be one of focused calm, nostalgia, and digital "comfort."

## Colors

The palette is anchored by warm, paper-like neutrals that reduce eye strain and feel more organic than pure white.

- **Surfaces:** Use `#FDFCFB` for the primary desktop and window backgrounds. Use `#F4F1EE` for secondary sidebars, status bars, or recessed areas.
- **Accents:** Muted, desaturated tones provide visual hierarchy without being loud. The primary blue is used for active window title bars, while green and clay are reserved for success states or specific app-level branding.
- **Borders:** A single, consistent color (`#D1CCC0`) handles all structural definition.
- **Heritage Tone:** The `#008080` (teal) from the reference material should be used sparingly as a "legacy" accent, perhaps for a single system-level icon or a "classic mode" toggle.

## Typography

This system uses a dual-font approach to distinguish between the "machine" and the "content."

- **UI Elements:** Use **Space Grotesk**. Its geometric and slightly technical nature mimics the feel of semi-monospaced fonts used in early terminals, providing a clear "OS" feel for buttons, title bars, and menus.
- **Content:** Use **Inter** for all user-generated content, long-form text, and data. Its high legibility balances the stylized nature of the UI fonts.
- **Hierarchy:** Maintain small font sizes to preserve the "compact" OS aesthetic, relying on weight and casing (e.g., all-caps for small labels) rather than large scale differences.

## Layout & Spacing

The layout operates on a strict 8px/4px grid system, ensuring that all elements align with mathematical precision to evoke an engineered, software-driven look.

- **Windowing:** The layout is contextual. Windows are floating containers that do not snap to a grid but maintain internal padding of 12px.
- **Density:** Elements should feel compact. Buttons have minimal vertical padding (4px to 8px) to maximize screen real estate, similar to classic desktop productivity software.
- **Rhythm:** Use 8px for standard spacing between related components and 16px to separate distinct functional groups.

## Elevation & Depth

Elevation is communicated through **structural borders** rather than shadows.

- **The "Outset" Effect:** Default buttons and window frames use a 2px border logic. A 1px light highlight (or the background color) on the top/left and a 1px darker border (`#D1CCC0`) on the bottom/right creates a subtle raised effect.
- **The "Inset" Effect:** Input fields, scrollbar tracks, and pressed buttons reverse this logic. The border appears on the top/left to suggest the element is recessed into the surface.
- **Z-Axis:** Windows stack purely based on order. The "active" window is distinguished by a primary color (`#7B9ACC`) title bar, while inactive windows have a neutral (`#D1CCC0`) title bar.

## Shapes

The shape language is strictly **Sharp (0px)**. All windows, buttons, and input fields must have square corners. This reinforces the "Retro-Modern" OS aesthetic and ensures that the 1px border effects remain crisp and pixel-perfect.

Avoid rounded corners even in "modern" contexts like tooltips or chips to maintain the architectural integrity of the system.

## Components

- **Windows:** Must feature a defined title bar. The title text sits on the left. Control buttons (Minimize, Maximize, Close) are grouped on the right. Controls should be simple 16x16px boxes with pixel-style icons (X, \_, □).
- **Buttons:** Rectangular with a 1px solid border. The "Outset" state is the default. On hover, the background shifts slightly to `#F4F1EE`. On click, the button switches to "Inset" and the text offsets by 1px down and right.
- **Inputs:** Use an inset border with a white background. Labels sit directly above the input in Space Grotesk Bold, 12px.
- **Chips/Tags:** Unlike modern rounded chips, these are small rectangular blocks with a solid 1px border and a background color from the accent palette.
- **Lists:** Items in a list should have a 4px vertical padding. The selected state uses the Primary Blue (`#7B9ACC`) with white text.
- **Taskbar:** A fixed bar at the bottom or top of the screen using the `#F4F1EE` surface. Minimized applications appear as small rectangular buttons that stay in the "Outset" state until focused.
