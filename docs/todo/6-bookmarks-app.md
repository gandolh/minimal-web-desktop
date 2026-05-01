# Bookmarks App

Grouped link launcher. Opens links in new browser tab.

## Tasks

### Backend
- `GET /api/bookmarks/groups` — list groups with their links
- `POST /api/bookmarks/groups` — create group
- `PATCH /api/bookmarks/groups/:id` — edit group
- `DELETE /api/bookmarks/groups/:id` — delete group (cascade links)
- `POST /api/bookmarks/links` — create link
- `PATCH /api/bookmarks/links/:id` — edit link
- `DELETE /api/bookmarks/links/:id` — delete link

### Frontend
- Groups displayed as sections
- Links rendered as icon + title, clicking opens `href` in new tab
- Add/edit/delete groups and links inline
- Default icon fallback when icon is null
- Single instance — register in app registry
