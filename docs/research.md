# Research & References

## The Web OS Pattern

The idea of making a website or web app look and behave like a desktop OS is a niche but growing trend, especially among developer-focused products.

### PostHog

PostHog redesigned their marketing site as a full desktop OS:
- Blog post: https://posthog.com/blog/why-os
- Technical architecture: https://posthog.com/handbook/engineering/posthog-com/technical-architecture
- Key insight: solved the "multiple tabs are indistinguishable" problem with windowed multitasking
- Built with: Gatsby + React, Framer Motion for drag/animations, custom window management
- No external window library — windows built entirely with Framer Motion

### Awesome Web Desktops

Curated list of websites/portfolios that look like desktop OSes:
- https://github.com/syxanash/awesome-web-desktops
- Notable examples: Kisimoff OS, Wes95, Windows11-3.0, AvdanOS, 98.js.org

### 98.js.org

Full Windows 98 recreation in the browser. Good reference for retro chrome aesthetics.

---

## Window Management Libraries Considered

| Library | Verdict |
|---|---|
| `@use-gesture/react` + `framer-motion` | **Chosen** — full control, PostHog's approach, already in stack |
| `react-rnd` | Good drop-in, but fights custom styling |
| `react-moveable` | Overkill — rotation/scaling not needed |
| `react-draggable` | Drag only, no resize |
| `react-grid-layout` | Grid-constrained, dashboard-style, not OS-style |

---

## Terminal Libraries

| Library | Purpose |
|---|---|
| `xterm.js` | **Chosen** — de-facto standard, used by VS Code, renders ANSI colors |
| `@xterm/addon-fit` | Auto-fits terminal to container size |
| `@xterm/addon-web-links` | Makes URLs in terminal clickable |
| `node-pty` (backend) | Pseudo-terminal emulation — real ANSI output, colors, interactive |
| `execa` (backend) | Process lifecycle management, streaming stdout/stderr |

---

## Process Management (Backend)

| Library | Verdict |
|---|---|
| `execa` | **Chosen** — ergonomic, promise-based, great TypeScript support |
| `node-pty` | **Chosen** — real PTY emulation for terminal UI |
| `child_process` (built-in) | Works, more verbose |
| `pm2` (programmatic) | Overkill for this use case |

---

## WebSocket Candidates (Future / Low Priority)

Currently everything is REST + polling. The following would benefit from WebSocket upgrades:

- **Service launcher logs** — live streaming terminal output (currently polled)
- **Docker container logs** — live log streaming (currently polled)

Reason deferred: adds complexity (WS connection management, reconnection logic) that isn't needed for single-user local use.

---

## UI Design References

- PostHog OS: https://posthog.com — best production reference
- Windows 95/98 aesthetic: https://os-gui.js.org — reference for retro chrome patterns
- DEV.to window manager tutorial: https://dev.to/dustinbrett/how-i-made-a-desktop-environment-in-the-browser-part-1-window-manager-197k
- Aura OS template: https://trickle.so/templates/apps/auraos-web-experience
