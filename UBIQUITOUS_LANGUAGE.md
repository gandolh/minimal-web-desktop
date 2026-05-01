# Ubiquitous Language

## The OS Shell

| Term | Definition | Aliases to avoid |
|---|---|---|
| **Desktop** | The full-viewport canvas that hosts icons and floating windows | Screen, workspace, background |
| **Window** | A floating, draggable, resizable container that renders one App Instance | Panel, modal, popup, card |
| **Title Bar** | The top strip of a Window containing the app icon, name, and window controls | Header, toolbar |
| **Window Controls** | The Close, Minimize, and Maximize buttons grouped in the Title Bar | Buttons, actions |
| **Desktop Icon** | A grid-snapped clickable element on the Desktop that launches an App | Shortcut, tile, launcher |
| **Icon Grid** | The invisible auto-snapping grid that positions Desktop Icons | Layout, snap grid |
| **Top Bar** | The fixed horizontal bar at the top of the Desktop containing system-level controls | Taskbar, menu bar, navbar |
| **Wallpaper** | One of three built-in repeating patterns rendered as the Desktop background | Background, theme |
| **Active Window** | The Window currently in focus, rendered with a primary-colored Title Bar and highest z-index | Focused window, foreground window |

## Apps & Instances

| Term | Definition | Aliases to avoid |
|---|---|---|
| **App** | A self-contained productivity tool registered in the App Registry | Feature, page, tool, plugin |
| **App Instance** | A single open occurrence of an App rendered inside a Window | Session, tab, view |
| **App Registry** | The central manifest that maps each App to its icon, component, and behavior flags | App list, app config, routes |
| **Multi-Instance App** | An App that allows more than one App Instance open simultaneously | Multi-window app |
| **Single-Instance App** | An App that allows only one App Instance open at a time | Singleton app |
| **Module** | The frontend source directory containing all code for one App | Feature folder, app folder |

## Core Apps

| Term | Definition | Aliases to avoid |
|---|---|---|
| **Sticky Note** | A persistent text note with a saved Desktop position | Post-it, memo, note widget |
| **Todo** | A single task item in the Todo App that can be checked, edited, or deleted | Task, item, checkbox |
| **Bookmark Group** | A named collection of Bookmark Links | Folder, category, tag |
| **Bookmark Link** | A named URL entry within a Bookmark Group that opens in a new browser tab | Link, shortcut, favourite |
| **Note File** | A real markdown file stored on disk under `data/notes/` | Document, page, note |
| **Note Directory** | A real filesystem directory under `data/notes/` used to organise Note Files | Folder, collection |
| **Container** | A Docker container managed via the Docker Desktop App | Service (when referring to Docker), instance |
| **Service** | A predefined local dev server or Docker Compose stack configured in the Service Launcher | App (when referring to Services), process |
| **Service Config** | A JSON file in `data/configs/` that defines a Service's name, command, and working directory | Config file, launch config |

## Data & Persistence

| Term | Definition | Aliases to avoid |
|---|---|---|
| **DB** | The SQLite database used for structured persistence | Database, store, repo |
| **Recent Files** | SQLite-tracked metadata about recently opened Note Files | History, file log |
| **Position** | The saved `(x, y)` coordinates of a Sticky Note Window on the Desktop | Location, coordinates, offset |

## Infrastructure

| Term | Definition | Aliases to avoid |
|---|---|---|
| **Backend** | The Fastify + Node.js server that exposes the REST API and manages data | Server, API server, service layer |
| **Frontend** | The Vite + React app that renders the Desktop shell and all App Modules | Client, web app, UI |
| **REST API** | The HTTP interface between Frontend and Backend | Endpoints, API, web service |
| **Polling** | The Frontend technique of repeatedly calling a REST API endpoint on a timer | Refresh, sync, live update |

## Relationships

- A **Desktop** hosts zero or more **Windows** and an **Icon Grid** of **Desktop Icons**
- Each **Desktop Icon** corresponds to exactly one **App** in the **App Registry**
- Clicking a **Desktop Icon** opens a new **App Instance** inside a **Window**
- A **Multi-Instance App** may have many **Windows** open simultaneously; a **Single-Instance App** may have only one
- The **Top Bar** displays all currently open **App Instances** and allows the user to focus or close them
- A **Sticky Note** has exactly one **Position** persisted in the **DB**
- A **Bookmark Group** contains zero or more **Bookmark Links**
- A **Note File** lives on disk; its path is optionally tracked as a **Recent File** in the **DB**
- A **Service** is defined by exactly one **Service Config** file on disk
- A **Container** is managed live via the Docker API — it has no **DB** representation

## Example dialogue

> **Dev:** "When the user clicks a **Desktop Icon**, do we always open a new **Window**?"
>
> **Domain expert:** "Depends on the **App**. A **Multi-Instance App** like Sticky Notes opens a fresh **App Instance** each time. A **Single-Instance App** like the Todo App focuses the existing **Window** if one is already open."
>
> **Dev:** "Where does the **Window** position come from on first open?"
>
> **Domain expert:** "For Sticky Notes, it restores the saved **Position** from the **DB**. For everything else, the **Desktop** picks a default offset."
>
> **Dev:** "And the **Top Bar** — does it show Apps or Instances?"
>
> **Domain expert:** "**App Instances**. If you have three Sticky Note **Windows** open, you see three entries. Clicking one brings that **Window** to the **Active Window** state."
>
> **Dev:** "What's the difference between a **Service** and a **Container**?"
>
> **Domain expert:** "A **Service** is a local dev server or Compose stack you start via the Service Launcher — it's defined by a **Service Config** on disk. A **Container** is a Docker container managed directly via the Docker API. They're separate Apps with no shared data."

## Flagged ambiguities

- **"App" vs "Module"** — in conversation, "app" was used to mean both the user-facing product (a Sticky Notes App) and the source code unit. Canonical split: **App** = the domain concept (what the user opens), **Module** = the frontend source directory. Never call a Module an App in code comments or docs.
- **"Service" vs "Container"** — "service" was used loosely to refer to both Docker containers and local dev servers. Canonical split: **Service** = local dev process managed by the Service Launcher; **Container** = Docker container managed by the Docker Desktop App. Do not use "service" when referring to Docker Containers.
- **"Note" vs "Sticky Note" vs "Note File"** — three distinct concepts. **Sticky Note** = the DB-backed widget with a Desktop Position. **Note File** = a real markdown file on disk. Never use the bare word "note" in code or docs without a qualifier.
