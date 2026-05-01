# Todo App

Minimalist task list. Single instance.

## Status

**Backend: COMPLETE.** All routes implemented, tested, building clean.
**Frontend: NOT STARTED.** `Todo.tsx` and `types.ts` are still empty stubs.

---

## What's Done

### Backend (fully implemented)

- `GET /api/todos?filter=active|completed` — list all, optional filter
- `POST /api/todos` → 201 — create task, auto-assigns position = MAX+1
- `PATCH /api/todos/reorder` — reorder by ids array (registered before `:id` route)
- `PATCH /api/todos/:id` — update text and/or completed
- `DELETE /api/todos/:id` → 204

DTOs: `create-todo.dto.ts`, `update-todo.dto.ts`, `reorder-todos.dto.ts`

DB: `position` column added via safe `ALTER TABLE ... ADD COLUMN` with try/catch in `DbService.migrate()`.

All in `apps/backend/src/modules/todos/`.

---

## What's Left

### Frontend

Create these files:

#### `src/modules/todo/types.ts`
```ts
export type Todo = {
  id: number
  text: string
  completed: number  // SQLite returns 0/1 integer
  position: number
  created_at: string
  updated_at: string
}

export type Filter = 'all' | 'active' | 'completed'
```

#### `src/modules/todo/api/todosApi.ts`
Axios functions via `src/lib/axios.ts`:
- `fetchTodos(filter?: Filter): Promise<Todo[]>` — GET /todos?filter=...  (skip param when 'all')
- `createTodo(text: string): Promise<Todo>` — POST /todos `{ text }`
- `updateTodo(id, data: { text?: string; completed?: boolean }): Promise<Todo>` — PATCH /todos/:id
- `reorderTodos(ids: number[]): Promise<void>` — PATCH /todos/reorder `{ ids }`
- `deleteTodo(id: number): Promise<void>` — DELETE /todos/:id

#### `src/modules/todo/queries/todosQueries.ts`
TanStack Query hooks with **optimistic updates** — key pattern from PoC:
```ts
// On mutate: cancel queries, snapshot, apply optimistic update
// On error: rollback to snapshot
// On settled: invalidate ['todos']
```
Hooks needed:
- `useTodosQuery(filter: Filter)` — queryKey `['todos', filter]`
- `useCreateTodoMutation()`
- `useUpdateTodoMutation()`
- `useDeleteTodoMutation()`
- `useReorderTodosMutation()`

#### `src/modules/todo/Todo.tsx`

Props: `{ windowId: string }` (required by all app components).

**Layout:**
```
┌──────────────────────────────────┐
│ [All] [Active] [Completed]       │  32px, border-b
├──────────────────────────────────┤
│ ⠿ ○ Task text              [×]  │  36px rows, scrollable
│ ⠿ ● Done task              [×]  │
├──────────────────────────────────┤
│   Add a task…                    │  36px, border-t, always visible
└──────────────────────────────────┘
```

**Filter tabs:**
- Space Grotesk 12px, `text-on-surface-variant`
- Active: `border-b-2 border-primary text-on-surface font-semibold`
- Tab bar: `border-b border-outline-variant`, height 32px

**Todo rows (36px, `border-b border-outline-variant`):**
- Drag handle left: `GripVertical` from lucide-react, 14px, `opacity-0 group-hover:opacity-100`
- Checkbox: 16×16 square, `border border-outline-variant`, checked = `bg-primary-container border-primary-container`, sharp checkmark SVG
- Task text: **phantom inline edit** — `<span>` by default, click → `<input>` (transparent bg, no border, same font). Enter/blur saves, Escape cancels.
- Completed: `opacity-50 line-through` on text, normalize with `Boolean(todo.completed)`
- Delete `×` right: `opacity-0 group-hover:opacity-100`
- Font: `font-content` (Inter) 13px

**Drag-to-reorder (`@use-gesture/react`):**
- Local `items` state mirrors query data
- `useDrag` on handle, track `movement[1]`, row height = 36px
- New index = clamp(originalIndex + Math.round(movement[1] / 36), 0, items.length-1)
- On drag end: update local state order + call `useReorderTodosMutation(ids)`

**Add task (bottom, `border-t border-outline-variant`):**
- Placeholder "Add a task…", Inter 13px, `bg-surface-container-low`, height 36px
- Enter to submit, trim + ignore empty, clear on submit

**Empty state:** centered Space Grotesk 12px `text-on-surface-variant` — "No tasks" / "Nothing active" / "Nothing completed"

**Wrap task list in `ScrollArea`** from `src/shared/components/ui/`

**Design rules:**
- 0px border radius everywhere
- Import `cn` from `../../lib/cn`
- No `rounded-*` classes

#### Update registry
In `src/shared/registry/registry.tsx`:
- Replace `TodoPlaceholder` with `import { Todo } from '../../modules/todo/Todo'`
- Change `component: TodoPlaceholder` → `component: Todo`

---

## Implementation Plan

Full step-by-step plan (with code): [`docs/superpowers/plans/2026-05-01-todo-app-frontend.md`](../superpowers/plans/2026-05-01-todo-app-frontend.md)

Follow that plan using **superpowers:executing-plans** (inline) or **superpowers:subagent-driven-development** (parallel agents).

**Note:** `types.ts` and `api/todosApi.ts` are already implemented — plan starts at the queries layer.
