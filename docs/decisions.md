# Decision Log

## Stack

**Frontend: React + Vite + TypeScript**
Chosen for familiarity and fast dev experience. Vite's HMR makes UI iteration quick.

**Backend: NestJS + Node.js + TypeScript**
Switched from Fastify to NestJS for better structure as the API grows — module/controller/service pattern maps cleanly to the feature modules. Zod validates all env vars via `@nestjs/config` on startup.

**Database: SQLite**
Personal local app with single user. No need for a server DB. Simple, zero-config, file-based.

**No shared packages between frontend and backend**
Treated as isolated services. Any type duplication between them is acceptable. Simplifies the monorepo significantly.

**Infrastructure directory**
`docker-compose.yml` lives in `infrastructure/` rather than root, to accommodate future additions (reverse proxy, monitoring, etc.). Docker Compose is for local production-like runs — dev uses `npm run dev` on the host. Frontend container: multi-stage build → nginx on port 5173. Backend container: multi-stage build → node on port 3001. `data/` directory mounted as a volume into the backend container.

---

## Desktop UI

**Window system: custom with `@use-gesture/react` + `framer-motion`**
Follows PostHog's approach (they use Framer Motion exclusively). Gives full control over the retro-modern window chrome. No react-rnd dependency.
Alternatives considered: `react-rnd` (convenient but fights custom styling), `react-moveable` (overkill).

**Icon layout: auto-grid snap**
Icons snap to an invisible grid. Keeps desktop tidy without manual arrangement. Retro OS behavior.

**Active windows: top menu bar dropdown**
macOS-style top bar showing active windows list. User is responsible for managing duplicate instances — multiple instances of same app are allowed.

**Theme: Warm Retro-Futurism (light only)**
Defined in `docs/design.md`. Warm paper-like neutrals, structural borders for depth (outset/inset effect), strictly 0px border radius everywhere. Two fonts: Space Grotesk for all UI chrome, Inter for user content. No dark mode planned. See `docs/ui-design.md` for full implementation details.

**Wallpapers: 3 built-in options**
Retro/repeating patterns (dot matrix, retro grid, linen texture) on warm off-white backgrounds. Switchable from top bar. Keeps atmosphere comfy without distraction.

---

## Top Menu Bar Contents

- Active windows list (click to focus, close duplicates)
- App search
- Calendar
- Date/time display
- Wallpaper switcher
- Settings cog (future use)
- System stats widget (CPU/RAM) — useful when running local services and Docker

---

## Communication: REST + Polling

All apps use REST. Docker container status polled every 5 seconds.

**WebSocket candidates (low priority, not implemented yet):**
- Service launcher: live streaming terminal output
- Docker Desktop: live container log streaming

---

## Service Launcher

- Configs stored as individual JSON files in `data/configs/` (one per service)
- Directory is git-ignored
- Backend reads configs at startup / on demand
- `execa` manages process lifecycle
- `node-pty` emulates a real terminal for output
- Frontend renders output with `xterm.js`

---

## Markdown Notepad

- Real files written to `data/notes/` on disk (portable, git-trackable, editable from any editor)
- Supports directories for organizing skills/docs
- SQLite stores recent files metadata only
- Each file opens a new app window instance (no tabs)

---

## Sticky Notes

- DB-backed (SQLite)
- Text only, with basic bold formatting
- Single color
- Position persisted — reopens at last known position

---

## Bookmarks

- Groups: name, icon (nullable/default)
- Links: title, href, icon (nullable/default), group_id
- Clicking a link opens it in a new browser tab (standard anchor behavior)

---

## Docker Desktop

- No DB — all data live from Docker API
- Full control: view containers, start/stop/restart/delete, view logs, pull images
- Status polled every 5 seconds via REST

---

## Todo App

- Minimalist REST API
- Tasks: text, completed boolean, timestamps
- Features: check/uncheck, filter (active/completed), edit, delete
