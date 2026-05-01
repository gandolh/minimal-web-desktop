# Service Launcher App

Run and monitor predefined local dev services and Docker Compose stacks. Single instance.

## Tasks

### Backend
- Install `execa` and `node-pty`
- Config loader: reads all JSON files from `data/configs/` at startup
- Process manager: start/stop processes by service name, store stdout/stderr output buffer
- `GET /api/services` — list all configured services with current status (running/stopped)
- `POST /api/services/:name/start` — start service, begin capturing output
- `POST /api/services/:name/stop` — stop service process
- `GET /api/services/:name/logs` — return buffered output (REST polling)

### Frontend
- Install `xterm.js`, `@xterm/addon-fit`, `@xterm/addon-web-links`
- Service list window: name, status badge, start/stop button per service
- Clicking a running service opens a terminal window with `xterm.js` rendering its output
- Terminal output polled every 2 seconds and appended
- Register in app registry

## Config file format
See `docs/apps.md` for the JSON schema.

## Future (low priority)
- Stream logs via WebSocket instead of polling
