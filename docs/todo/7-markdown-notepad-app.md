# Markdown Notepad App

Real-filesystem markdown editor with directory support. Multi-instance (one window per file).

## Tasks

### Backend
- `GET /api/notes` — list files and directories at a given path
- `GET /api/notes/file?path=...` — read file content
- `POST /api/notes/file` — create file
- `PUT /api/notes/file` — write/update file content
- `DELETE /api/notes/file?path=...` — delete file
- `POST /api/notes/directory` — create directory
- `DELETE /api/notes/directory?path=...` — delete directory
- `GET /api/notes/recent` — list recent files from SQLite
- `POST /api/notes/recent` — upsert recent file record

### Frontend
- File browser window: tree view of `data/notes/` directories and files
- Clicking a file opens a new notepad window instance for that file
- Notepad window: markdown editor (raw text) + rendered preview toggle
- Auto-save on change (debounced)
- Register in app registry
