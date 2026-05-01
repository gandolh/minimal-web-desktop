# Project Structure

```
minimal-desktop/
│
├── apps/
│   ├── frontend/                   # Vite + React + TypeScript
│   │   ├── src/
│   │   │   ├── modules/            # One directory per desktop app
│   │   │   │   ├── sticky-notes/
│   │   │   │   │   ├── api/        # axios call functions
│   │   │   │   │   ├── components/ # UI components for this module
│   │   │   │   │   ├── hooks/      # custom hooks
│   │   │   │   │   ├── queries/    # tanstack query definitions
│   │   │   │   │   ├── store/      # zustand slice (if needed)
│   │   │   │   │   ├── types.ts
│   │   │   │   │   └── StickyNotes.tsx   # app root component
│   │   │   │   ├── todo/
│   │   │   │   ├── bookmarks/
│   │   │   │   ├── notepad/
│   │   │   │   ├── docker-desktop/
│   │   │   │   └── service-launcher/
│   │   │   ├── shared/
│   │   │   │   ├── components/
│   │   │   │   │   ├── window/     # Window chrome, drag/resize
│   │   │   │   │   ├── topbar/     # Top menu bar
│   │   │   │   │   ├── desktop/    # Desktop canvas, icon grid, wallpapers
│   │   │   │   │   └── ui/         # Generic primitives (Button, Input…)
│   │   │   │   ├── hooks/          # App-wide hooks (useWindowManager…)
│   │   │   │   ├── store/          # Global zustand store (window state)
│   │   │   │   └── registry/       # Central app registry
│   │   │   ├── lib/
│   │   │   │   ├── axios.ts        # axios instance (baseURL = VITE_API_URL)
│   │   │   │   ├── cn.ts           # clsx + tailwind-merge utility
│   │   │   │   ├── queryClient.ts  # TanStack Query client
│   │   │   │   └── dayjs.ts        # dayjs config + plugins
│   │   │   └── main.tsx
│   │   ├── .env.development        # local dev env vars (VITE_API_URL etc.)
│   │   ├── .prettierrc
│   │   ├── Dockerfile              # multi-stage: build → nginx on port 5173
│   │   ├── nginx.conf              # serves SPA, proxies /api to backend
│   │   ├── eslint.config.js
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── backend/                    # NestJS + Node.js + TypeScript
│       ├── src/
│       │   ├── config/
│       │   │   ├── config.module.ts  # NestJS ConfigModule with Zod validation
│       │   │   └── env.schema.ts     # Zod schema for all env vars
│       │   ├── modules/            # One directory per feature
│       │   │   ├── sticky-notes/
│       │   │   ├── todos/
│       │   │   ├── notes/
│       │   │   ├── bookmarks/
│       │   │   ├── docker/
│       │   │   └── services/
│       │   ├── db/                 # Global DbModule + migrations
│       │   │   ├── db.module.ts
│       │   │   └── db.service.ts
│       │   ├── app.module.ts       # Root module — imports all feature modules
│       │   └── main.ts
│       ├── .env.example            # All required env vars with descriptions
│       ├── Dockerfile              # multi-stage: build → node on port 3001
│       └── package.json
│
├── data/                           # Runtime data (git-ignored except notes)
│   ├── notes/                      # Real markdown files
│   └── configs/                    # Service launcher JSON configs (git-ignored)
│
├── infrastructure/
│   └── docker-compose.yml          # frontend + backend containers, mounts data/
│
├── .gitignore                      # ignores data/configs/, *.sqlite, .env, dist, node_modules
│
└── docs/
    ├── architecture.md
    ├── decisions.md
    ├── apps.md
    ├── ui-design.md
    ├── research.md
    └── project-structure.md        # This file
```

---

## Key Conventions

- Frontend and backend are **completely isolated** — no shared code, no shared types
- All API communication is via **REST over HTTP**
- Backend base URL configured via env var in frontend (e.g. `VITE_API_URL=http://localhost:3001`)
- `data/configs/` is **git-ignored** — service configs are personal and machine-specific
- `data/notes/` is **not git-ignored** — markdown notes can optionally be version-controlled

---

## Running Locally

```bash
# Start everything with Docker Compose
cd infrastructure
docker-compose up

# Or run individually for development
cd apps/frontend && npm run dev    # http://localhost:5173
cd apps/backend && npm run dev     # http://localhost:3001
```
