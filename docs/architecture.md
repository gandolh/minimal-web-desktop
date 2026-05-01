# Architecture

## Overview

Minimal Desktop is a personal productivity web OS — a browser-based desktop environment with draggable windows, desktop icons, and self-contained apps. It runs locally, accessed only from the local network, with no authentication.

## Monorepo Structure

```
minimal-desktop/
  apps/
    frontend/         # Vite + React + TypeScript
    backend/          # NestJS + Node.js + TypeScript
  data/
    notes/            # Markdown files (real filesystem, not DB)
    configs/          # Service launcher config files (one JSON per service, git-ignored)
  infrastructure/
    docker-compose.yml
  docs/
```

## Frontend

- **Framework:** React + Vite + TypeScript
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- **Animations / Window drag:** Framer Motion + `@use-gesture/react`
- **UI Components:** `@base-ui/react` (headless, fully restyled) — see `docs/base-ui.md`
- **Terminal rendering:** `xterm.js` with `@xterm/addon-fit` and `@xterm/addon-web-links`
- **Data fetching:** `@tanstack/react-query` + `axios`
- **Routing:** `@tanstack/react-router`
- **State management:** `zustand`
- **Forms + validation:** `react-hook-form` + `zod`
- **Date utilities:** `dayjs`
- **No shared packages with backend** — frontend and backend are isolated services communicating via REST

## Backend

- **Runtime:** Node.js + TypeScript
- **Framework:** NestJS
- **Database:** SQLite via `better-sqlite3` — global `DbService` runs migrations on startup
- **Config:** `@nestjs/config` + Zod schema (`src/config/env.schema.ts`) — fails fast on invalid env
- **Process management:** `execa` for running Service Launcher commands
- **Terminal emulation:** `node-pty` for streaming real terminal output

## Communication

- **REST** for all current app interactions (CRUD, status polling)
- **Polling intervals:** Docker container status every 5s, system stats every 60s
- **WebSockets (future / low priority):** Service Launcher logs, Docker logs — currently served via REST polling

## Desktop Shell

- **App.tsx** — root component, renders `<TopBar>` + `<Desktop>`
- **Window system** — Zustand `windowStore` manages all open App Instances. Windows drag via `@use-gesture/react`, animate via `framer-motion`. 8 resize handles. Hide/maximize/close controls.
- **App Registry** — `src/shared/registry/registry.tsx` — central manifest. Adding an entry auto-places a Desktop Icon and makes the app searchable in the Top Bar.
- **Desktop** — wallpaper background (dots/grid/linen, stored in `wallpaperStore`), auto-grid of Desktop Icons, renders `WindowContainer`
- **Top Bar** — 40px fixed, contains: logo, active windows dropdown, app search, system stats, calendar popover, live clock, wallpaper switcher, settings cog

## App Component Contract

All app components receive a `windowId: string` prop. This allows each App Instance to identify itself within the window store and any per-window state (e.g. `stickyNoteEditorStore` maps `windowId → noteId`).

```ts
// All app root components must match this signature
ComponentType<{ windowId: string }>
```

## Implemented Apps

| App | Status | Module path |
|---|---|---|
| Sticky Notes | ✅ Complete | `src/modules/sticky-notes/` |
| Todo | ⚙️ Backend done, frontend pending | `src/modules/todo/` |
| Bookmarks | 🔲 Placeholder | `src/modules/bookmarks/` |
| Notepad | 🔲 Placeholder | `src/modules/notepad/` |
| Docker Desktop | 🔲 Placeholder | `src/modules/docker-desktop/` |
| Service Launcher | 🔲 Placeholder | `src/modules/service-launcher/` |

## Data Persistence

| App | Storage |
|---|---|
| Sticky Notes | SQLite |
| Todo | SQLite |
| Bookmarks | SQLite |
| Markdown Notepad (recent files) | SQLite (metadata only) |
| Markdown Notepad (content) | Real files in `data/notes/` |
| Service Launcher configs | JSON files in `data/configs/` (git-ignored) |
| Docker Desktop | No persistence — live Docker API |

## Deployment

- **Dev:** `npm run dev` on host — frontend on `localhost:5173`, backend on `localhost:3001`
- **Docker Compose:** `cd infrastructure && docker-compose up` — builds both containers, mounts `data/` volume into backend
- Local only, no authentication
