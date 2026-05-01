# Minimal Desktop

Your browser is your desktop.

Minimal Desktop is a personal productivity environment that runs entirely in the browser — built for one person, self-hosted locally, no cloud, no accounts. It looks and behaves like an operating system: a desktop with icons, draggable windows, and self-contained apps. You open apps by clicking icons, windows stack and overlap, you can drag and resize them. It's a web page that feels like a computer.

The design is light, warm, and slightly retro — sharp corners, structural borders, Space Grotesk for chrome, Inter for content. Not minimalist in a sterile way. Minimalist in a *yours* way.

---

## Apps

| App | Description |
|---|---|
| **Sticky Notes** | Quick floating notes. Each note is its own window, opens at its last position. |
| **Todo** | Minimalist task list with drag-to-reorder, inline editing, and filter tabs. |
| **Bookmarks** | Grouped link launcher. Click a link, it opens in a new browser tab. |
| **Notepad** | Markdown editor backed by real files on disk. Supports directories. |
| **Docker Desktop** | Manage local Docker containers — start, stop, restart, view logs. |
| **Service Launcher** | Run predefined local dev servers and Docker Compose stacks with live terminal output. |

---

## Running locally

```bash
# Frontend — http://localhost:5173
cd apps/frontend && npm run dev

# Backend — http://localhost:3001
cd apps/backend && npm run dev
```

Or with Docker Compose:

```bash
cd infrastructure && docker-compose up
```

Copy `apps/backend/.env.example` to `apps/backend/.env` before starting the backend.

---

## Stack

| | |
|---|---|
| Frontend | React + Vite + TypeScript |
| Backend | NestJS + Node.js + TypeScript |
| Database | SQLite |
| Styling | Tailwind CSS v4 |
| Windows | Framer Motion + `@use-gesture/react` |
| UI components | `@base-ui/react` |

---

## Docs

Everything is documented in `docs/`:

- [`docs/architecture.md`](docs/architecture.md) — stack, structure, communication
- [`docs/decisions.md`](docs/decisions.md) — every technical decision and why
- [`docs/apps.md`](docs/apps.md) — per-app specs and API routes
- [`docs/ui-design.md`](docs/ui-design.md) — design system, components, tokens
- [`docs/design.md`](docs/design.md) — raw design tokens (source of truth)
- [`docs/todo/README.md`](docs/todo/README.md) — what's not built yet
