# Minimal Desktop

A personal productivity web OS — a browser-based desktop environment with draggable windows, desktop icons, and self-contained apps. Built for one user, self-hosted locally, no authentication.

## Docs

All decisions, architecture, research, and app specs live in `docs/`. Read these before making changes.

- [docs/architecture.md](docs/architecture.md) — stack, monorepo layout, data persistence, communication
- [docs/decisions.md](docs/decisions.md) — every design and technical decision and why
- [docs/apps.md](docs/apps.md) — per-app specs, DB schemas, API routes
- [docs/ui-design.md](docs/ui-design.md) — visual system, window chrome, components, design tokens
- [docs/design.md](docs/design.md) — raw design tokens (colors, typography, spacing) — source of truth
- [docs/research.md](docs/research.md) — library comparisons, references, WebSocket future notes
- [docs/project-structure.md](docs/project-structure.md) — full directory tree, conventions
- [docs/base-ui.md](docs/base-ui.md) — `@base-ui/react` component library reference and usage docs
- [docs/todo/README.md](docs/todo/README.md) — prioritized list of work not yet done

## Project Structure

```
minimal-desktop/
  apps/
    frontend/       # Vite + React + TypeScript — http://localhost:5173
    backend/        # Fastify + Node.js + TypeScript — http://localhost:3001
  data/
    notes/          # Real markdown files (not git-ignored)
    configs/        # Service launcher JSON configs (git-ignored)
  infrastructure/
    docker-compose.yml
  docs/
```

## Running Locally

```bash
# Dev (run separately)
cd apps/frontend && npm run dev
cd apps/backend && npm run dev

# Or via Docker Compose
cd infrastructure && docker-compose up
```

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + TypeScript |
| Backend | Fastify + Node.js + TypeScript |
| Database | SQLite |
| Styling | Tailwind CSS v4 |
| Animations + windows | Framer Motion + `@use-gesture/react` |
| UI components | `@base-ui/react` (headless, fully restyled) |
| Terminal rendering | `xterm.js` + `@xterm/addon-fit` + `@xterm/addon-web-links` |
| Process management | `execa` + `node-pty` |
| Data fetching | `@tanstack/react-query` + `axios` |
| Routing | `@tanstack/react-router` |
| State management | `zustand` |
| Forms + validation | `react-hook-form` + `zod` |
| Date utils | `dayjs` |

## Ubiquitous Language

Domain terminology is defined in [UBIQUITOUS_LANGUAGE.md](UBIQUITOUS_LANGUAGE.md). During grill sessions, use canonical terms from that document.

## Key Rules

- **Frontend and backend are fully isolated** — no shared code, no shared types. They communicate via REST only.
- **All API calls use REST + polling.** No WebSockets yet (see `docs/decisions.md` for future candidates).
- **0px border radius everywhere.** No rounded corners — ever. Sharp edges are core to the design.
- **Two fonts only:** Space Grotesk for all UI chrome, Inter for user-generated content.
- **Depth via borders, not shadows.** Use outset/inset 2px border logic. See `docs/ui-design.md`.
- **`data/configs/` is git-ignored.** Service launcher configs are personal and machine-specific.
- **Design tokens** are in `docs/design.md`. Apply them as Tailwind theme values — never hardcode hex values in components.
- **Adding a new app** only requires registering it in the central app registry (`apps/frontend/src/registry/`). The desktop icon and top-bar search entry are automatic.
- **`@base-ui/react` is the UI component library.** Headless, fully restyled. Docs in `docs/base-ui.md`. Tailwind examples in that doc are v4 — use v4 syntax. Never use pre-styled component libraries.
- **Always use shared UI components** from `src/shared/components/ui/` (Button, Input, Checkbox, Select, Dialog, Tooltip, Separator, ScrollArea). Use `cn()` from the same directory for all className merging. See `docs/ui-design.md` for the full component table.

## Communication Style

- **Responses:** Always use caveman mode (compressed, token-efficient communication).
- **Docs and `.md` files:** Never use caveman mode — write in full, clear prose.

## Todo

Work is tracked in `docs/todo/`. Files are numbered by priority (`1-...`, `2-...`, etc.). When a task is complete: delete its file, update `docs/todo/README.md`, and integrate any relevant info into the main docs.
