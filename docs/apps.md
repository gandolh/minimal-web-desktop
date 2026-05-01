# Apps Reference

Each app is a self-contained window on the desktop. Apps are registered in a central app registry — adding a new app automatically adds its icon to the desktop grid and to the quick-access list in the top bar.

---

## Sticky Notes

**Status:** Implemented.

**Purpose:** Quick text capture, reviewed later.

**Behavior:**
- Multi-instance — each Sticky Note opens its own Window at its saved position
- List view shows all notes; clicking a note opens it in a new Window at its saved `pos_x/pos_y`
- "New Note" creates a note via API then opens it immediately in the same window
- Editor: full-height textarea (Inter font), 800ms debounce autosave, "Saved" indicator fades after 1.5s
- Position persisted on window move via `PATCH /api/sticky-notes/:id`

**Frontend module:** `src/modules/sticky-notes/`
- `StickyNotes.tsx` — list + editor views, exports `openStickyNote(note)` helper
- `stickyNoteEditorStore.ts` — Zustand store mapping `windowId → noteId`
- `api/stickyNotesApi.ts` — axios CRUD functions
- `queries/stickyNotesQueries.ts` — TanStack Query hooks

**App component receives `windowId: string` prop** — all app components follow this contract.

**Data model (SQLite):**
```
sticky_notes
  id          INTEGER PRIMARY KEY AUTOINCREMENT
  content     TEXT NOT NULL DEFAULT ''
  pos_x       INTEGER NOT NULL DEFAULT 100
  pos_y       INTEGER NOT NULL DEFAULT 100
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
```

**API routes:**
```
GET    /api/sticky-notes         → StickyNote[]
POST   /api/sticky-notes         → StickyNote  (201)
PATCH  /api/sticky-notes/:id     → StickyNote
DELETE /api/sticky-notes/:id     → 204
```

---

## Todo

**Status:** Implemented.

**Purpose:** Minimalist personal task list.

**Behavior:**
- Single instance
- Tasks can be checked, unchecked, edited, deleted, reordered by drag
- Filter tabs: **All / Active / Completed**
- **Drag-to-reorder** via `@use-gesture/react` (persists `position` index)
- **Phantom inline editing**: Click task text to swap `<span>` for `<input>`; Enter/blur saves, Escape cancels
- **Add task bar**: Bottom input, Enter to submit
- **Optimistic updates** for checkbox toggles and deletions (instant UI feedback)

**Frontend module:** `src/modules/todo/`
- `Todo.tsx` — main component with row sub-component
- `queries/todosQueries.ts` — TanStack Query hooks with optimistic logic
- `api/todosApi.ts` — Axios CRUD functions
- `types.ts` — Type definitions

**Data model (SQLite):**
```
todos
  id          INTEGER PRIMARY KEY AUTOINCREMENT
  text        TEXT NOT NULL
  completed   INTEGER NOT NULL DEFAULT 0  (0/1)
  position    INTEGER NOT NULL DEFAULT 0
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
```

**API routes:**
```
GET    /api/todos?filter=active|completed  → Todo[]
POST   /api/todos                          → Todo (201)
PATCH  /api/todos/reorder                  → { ids: number[] }
PATCH  /api/todos/:id                      → Todo
DELETE /api/todos/:id                      → 204
```

---

## Markdown Notepad

**Status:** Implemented.

**Purpose:** Write and organize markdown notes, skills, docs.

**Behavior:**
- **Multi-instance**: Each open file gets its own window.
- **File browser**: Tree view of `data/notes/` for discovery.
- **Editor/Preview**: Toggle between raw markdown and rendered HTML (via `react-markdown`).
- **Auto-save**: Debounced saving to real filesystem on change.
- **Recent Files**: Persisted list in SQLite for quick access.

**Frontend module:** `src/modules/notepad/`
- `Notepad.tsx` — root wrapper for orchestration
- `components/FileBrowser.tsx` — the browsing experience
- `components/NoteEditor.tsx` — the editing/previewing experience
- `queries/notepadQueries.ts` — FS + SQLite TanStack Query hooks
- `api/notepadApi.ts` — Backend REST integration
- `store/notepadStore.ts` — windowId to filePath mapping

**Data model (SQLite):**
```
recent_files
  id           INTEGER PRIMARY KEY
  path         TEXT UNIQUE
  last_opened  DATETIME
```

**API:** REST — file read/write/list/create/delete via `/api/notes`

---

## Bookmarks

**Status:** Implemented.

**Purpose:** Grouped link launcher — opens links in browser tab.

**Behavior:**
- Single instance
- Links open in new browser tab (native anchor)
- Groups sections with names and foldering feel
- **Inline CRUD**: Add/edit/delete groups and links directly in the UI
- Icons: `Folder` for groups, `Link2` for individual links
- Fallback and hover actions (Edit, Delete, Open)

**Frontend module:** `src/modules/bookmarks/`
- `Bookmarks.tsx` — main component with group/link rows
- `queries/bookmarksQueries.ts` — TanStack Query hooks
- `api/bookmarksApi.ts` — Axios CRUD functions
- `types.ts` — Type definitions

**Data model (SQLite):**
```
bookmark_groups
  id    INTEGER PRIMARY KEY
  name  TEXT
  icon  TEXT (nullable)

bookmark_links
  id        INTEGER PRIMARY KEY
  group_id  INTEGER REFERENCES bookmark_groups(id)
  title     TEXT
  href      TEXT
  icon      TEXT (nullable)
```

**API:** REST — CRUD on `/api/bookmarks/groups` and `/api/bookmarks/links`

---

## Docker Desktop

**Status:** Implemented.

**Purpose:** Manage local Docker containers.

**Behavior:**
- **Live Management**: Connects directly to `/var/run/docker.sock` via `dockerode`.
- **Container List**: Displays all containers (running and stopped) with real-time status.
- **Status Badges**: Visual indicators (Running, Exited, etc.) for quick health checks.
- **Lifecycle Actions**: Start, stop, restart, and remove containers from the UI.
- **Log Viewer**: Integrated terminal-style panel for viewing container logs with auto-refresh.
- **Auto-refresh**: Container list and logs automatically poll the backend for updates.

**Frontend module:** `src/modules/docker-desktop/`
- `DockerDesktop.tsx` — dashboard with list and log viewer
- `queries/dockerQueries.ts` — polling hooks for status and logs
- `api/dockerApi.ts` — Dockerode REST integration
- `types.ts` — Type definitions

---

## Service Launcher

**Status:** Implemented.

**Purpose:** Start/stop predefined local dev services and Docker Compose stacks.

**Behavior:**
- Single instance
- Lists all configured services from `data/configs/`
- Clicking a service opens an integrated terminal viewer with live output
- Real-time terminal rendering via `xterm.js` with ANSI color support
- Buffered log capture (last 1000 lines)

**Frontend module:** `src/modules/service-launcher/`
- `ServiceLauncher.tsx` — main dashboard and list
- `components/TerminalViewer.tsx` — xterm.js terminal integration
- `queries/servicesQueries.ts` — polling hooks for status and logs
- `api/servicesApi.ts` — Backend REST integration

**Config file format (`data/configs/my-service.json`):**
```json
{
  "name": "My Service",
  "command": "npm run dev",
  "cwd": "/home/user/projects/my-service",
  "icon": "server"
}
```

**Process management:** `node-pty` for pseudo-terminal execution
**Terminal rendering:** `xterm.js` in frontend

**API routes:**
```
GET    /api/services            → Service[]
POST   /api/services/:id/start  → 200
POST   /api/services/:id/stop   → 200
GET    /api/services/:id/logs   → { logs: string }
```

---

## Extensibility

To add a new app:
1. Create a React component for the app UI
2. Register it in the central app registry (name, icon, component, single/multi instance flag)
3. The desktop auto-adds its icon to the grid and top-bar quick access

No other changes needed.
