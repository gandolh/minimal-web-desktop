# Docker Desktop App

Live Docker container management. No DB — all data from Docker API. Single instance.

## Tasks

### Backend
- Install Docker client library (e.g. `dockerode`)
- `GET /api/docker/containers` — list all containers with status
- `POST /api/docker/containers/:id/start` — start container
- `POST /api/docker/containers/:id/stop` — stop container
- `POST /api/docker/containers/:id/restart` — restart container
- `DELETE /api/docker/containers/:id` — remove container
- `GET /api/docker/containers/:id/logs` — fetch last N lines of logs (REST polling)

### Frontend
- Container list: name, image, status, uptime
- Status badge per container (running / stopped / exited)
- Action buttons: start / stop / restart / delete
- Log viewer panel: shows last N lines, refreshed on demand or on interval
- Status list auto-refreshes every 5 seconds
- Register in app registry

## Future (low priority)
- Stream logs via WebSocket instead of polling
