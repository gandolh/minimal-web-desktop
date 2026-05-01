# Todo App Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Todo app frontend — filter tabs, drag-to-reorder rows, inline edit, and add-task input — wired to the existing backend REST API.

**Architecture:** Three layers: types → API functions (already done) → TanStack Query hooks with optimistic updates → `Todo.tsx` component. The component owns a local `items` state for drag order and delegates all persistence to mutations. Registry swap at the end activates the app.

**Tech Stack:** React, TypeScript, TanStack Query v5, `@use-gesture/react`, lucide-react, Tailwind CSS v4, `cn()` from `src/lib/cn`, shared `ScrollArea` from `src/shared/components/ui/`.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/modules/todo/types.ts` | Already exists (correct) | Type definitions |
| `src/modules/todo/api/todosApi.ts` | Already exists (correct) | Axios API calls |
| `src/modules/todo/queries/todosQueries.ts` | **Create** | TanStack Query hooks with optimistic updates |
| `src/modules/todo/Todo.tsx` | **Implement** (currently empty stub) | Full UI component |
| `src/shared/registry/registry.tsx` | **Modify** | Swap placeholder → real `Todo` |

---

## Task 1: Create `todosQueries.ts` with optimistic updates

**Files:**
- Create: `src/modules/todo/queries/todosQueries.ts`

- [ ] **Step 1: Create the queries file**

```ts
import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '../../../lib/queryClient'
import {
  createTodo,
  deleteTodo,
  fetchTodos,
  reorderTodos,
  updateTodo,
} from '../api/todosApi'
import type { Filter, Todo } from '../types'

const todosKey = (filter: Filter) => ['todos', filter] as const

export function useTodosQuery(filter: Filter) {
  return useQuery({
    queryKey: todosKey(filter),
    queryFn: () => fetchTodos(filter === 'all' ? undefined : filter),
  })
}

export function useCreateTodoMutation() {
  return useMutation({
    mutationFn: (text: string) => createTodo(text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}

export function useUpdateTodoMutation() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { text?: string; completed?: boolean } }) =>
      updateTodo(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const snapshots = queryClient.getQueriesData<Todo[]>({ queryKey: ['todos'] })
      queryClient.setQueriesData<Todo[]>({ queryKey: ['todos'] }, (old) =>
        old?.map((t) =>
          t.id === id
            ? {
                ...t,
                ...(data.text !== undefined ? { text: data.text } : {}),
                ...(data.completed !== undefined ? { completed: data.completed ? 1 : 0 } : {}),
              }
            : t,
        ),
      )
      return { snapshots }
    },
    onError: (_err, _vars, ctx) => {
      ctx?.snapshots.forEach(([key, data]) => queryClient.setQueryData(key, data))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}

export function useDeleteTodoMutation() {
  return useMutation({
    mutationFn: (id: number) => deleteTodo(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const snapshots = queryClient.getQueriesData<Todo[]>({ queryKey: ['todos'] })
      queryClient.setQueriesData<Todo[]>({ queryKey: ['todos'] }, (old) =>
        old?.filter((t) => t.id !== id),
      )
      return { snapshots }
    },
    onError: (_err, _vars, ctx) => {
      ctx?.snapshots.forEach(([key, data]) => queryClient.setQueryData(key, data))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}

export function useReorderTodosMutation() {
  return useMutation({
    mutationFn: (ids: number[]) => reorderTodos(ids),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /home/gandolh/projects/minimal-web-desktop/apps/frontend && npx tsc --noEmit`
Expected: No errors related to `todosQueries.ts`.

- [ ] **Step 3: Commit**

```bash
git add apps/frontend/src/modules/todo/queries/todosQueries.ts
git commit -m "feat(todo): add TanStack Query hooks with optimistic updates"
```

---

## Task 2: Implement `Todo.tsx`

**Files:**
- Implement: `src/modules/todo/Todo.tsx` (currently a 1-line empty stub)

- [ ] **Step 1: Write the full component**

```tsx
import { useEffect, useRef, useState } from 'react'
import { GripVertical, X } from 'lucide-react'
import { useDrag } from '@use-gesture/react'
import { cn } from '../../lib/cn'
import { ScrollArea } from '../../shared/components/ui/ScrollArea'
import {
  useCreateTodoMutation,
  useDeleteTodoMutation,
  useReorderTodosMutation,
  useTodosQuery,
  useUpdateTodoMutation,
} from './queries/todosQueries'
import type { Filter, Todo } from './types'

const ROW_H = 36

// ---------------------------------------------------------------------------
// TodoRow
// ---------------------------------------------------------------------------
function TodoRow({
  todo,
  index,
  total,
  onUpdate,
  onDelete,
  onDragEnd,
}: {
  todo: Todo
  index: number
  total: number
  onUpdate: (id: number, data: { text?: string; completed?: boolean }) => void
  onDelete: (id: number) => void
  onDragEnd: (fromIndex: number, toIndex: number) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [dragging, setDragging] = useState(false)

  const completed = Boolean(todo.completed)

  const bind = useDrag(
    ({ movement: [, my], active, last }) => {
      setDragging(active)
      setDragOffset(active ? my : 0)
      if (last) {
        const toIndex = Math.max(0, Math.min(total - 1, index + Math.round(my / ROW_H)))
        if (toIndex !== index) onDragEnd(index, toIndex)
        setDragOffset(0)
      }
    },
    { filterTaps: true },
  )

  function commitEdit() {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== todo.text) onUpdate(todo.id, { text: trimmed })
    else setDraft(todo.text)
    setEditing(false)
  }

  function cancelEdit() {
    setDraft(todo.text)
    setEditing(false)
  }

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  return (
    <div
      className={cn(
        'group relative flex h-9 items-center gap-1.5 border-b border-outline-variant px-2',
        dragging && 'z-10 bg-surface-container-low opacity-90',
      )}
      style={{ transform: dragging ? `translateY(${dragOffset}px)` : undefined }}
    >
      {/* Drag handle */}
      <span
        {...bind()}
        className="flex cursor-grab items-center opacity-0 group-hover:opacity-100 active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      >
        <GripVertical size={14} className="text-on-surface-variant" />
      </span>

      {/* Checkbox */}
      <button
        type="button"
        onClick={() => onUpdate(todo.id, { completed: !completed })}
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center border',
          completed
            ? 'border-primary-container bg-primary-container'
            : 'border-outline-variant bg-transparent',
        )}
        aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {completed && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
          </svg>
        )}
      </button>

      {/* Text — inline edit */}
      {editing ? (
        <input
          ref={inputRef}
          className="font-content min-w-0 flex-1 bg-transparent text-[13px] text-on-surface outline-none"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitEdit()
            if (e.key === 'Escape') cancelEdit()
          }}
        />
      ) : (
        <span
          className={cn(
            'font-content min-w-0 flex-1 cursor-text truncate text-[13px] text-on-surface',
            completed && 'opacity-50 line-through',
          )}
          onClick={() => setEditing(true)}
        >
          {todo.text}
        </span>
      )}

      {/* Delete */}
      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        className="shrink-0 p-0.5 text-on-surface-variant opacity-0 group-hover:opacity-100 hover:text-error"
        aria-label="Delete task"
      >
        <X size={13} />
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Todo (root export)
// ---------------------------------------------------------------------------
export function Todo({ windowId: _windowId }: { windowId: string }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [addText, setAddText] = useState('')
  const { data: serverItems = [] } = useTodosQuery(filter)
  const [items, setItems] = useState<Todo[]>([])

  // Sync local items when server data changes (but not during drag)
  useEffect(() => {
    setItems(serverItems)
  }, [serverItems])

  const createMutation = useCreateTodoMutation()
  const updateMutation = useUpdateTodoMutation()
  const deleteMutation = useDeleteTodoMutation()
  const reorderMutation = useReorderTodosMutation()

  function handleDragEnd(fromIndex: number, toIndex: number) {
    const next = [...items]
    const [moved] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, moved)
    setItems(next)
    reorderMutation.mutate(next.map((t) => t.id))
  }

  function handleAdd() {
    const text = addText.trim()
    if (!text) return
    setAddText('')
    createMutation.mutate(text)
  }

  const emptyMessages: Record<Filter, string> = {
    all: 'No tasks',
    active: 'Nothing active',
    completed: 'Nothing completed',
  }

  const tabs: Filter[] = ['all', 'active', 'completed']

  return (
    <div className="flex h-full flex-col bg-surface-container-lowest">
      {/* Filter tabs */}
      <div className="flex h-8 items-center border-b border-outline-variant">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={cn(
              'font-ui flex h-full items-center px-3 text-[12px] text-on-surface-variant capitalize',
              filter === tab &&
                'border-b-2 border-primary font-semibold text-on-surface',
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Task list */}
      <ScrollArea className="flex-1">
        {items.length === 0 ? (
          <div className="flex h-20 items-center justify-center font-ui text-[12px] text-on-surface-variant">
            {emptyMessages[filter]}
          </div>
        ) : (
          items.map((todo, i) => (
            <TodoRow
              key={todo.id}
              todo={todo}
              index={i}
              total={items.length}
              onUpdate={(id, data) => updateMutation.mutate({ id, data })}
              onDelete={(id) => deleteMutation.mutate(id)}
              onDragEnd={handleDragEnd}
            />
          ))
        )}
      </ScrollArea>

      {/* Add task input */}
      <div className="flex h-9 items-center border-t border-outline-variant bg-surface-container-low px-2">
        <input
          className="font-content min-w-0 flex-1 bg-transparent text-[13px] text-on-surface outline-none placeholder:text-on-surface-variant"
          placeholder="Add a task…"
          value={addText}
          onChange={(e) => setAddText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAdd()
          }}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Check TypeScript**

Run: `cd /home/gandolh/projects/minimal-web-desktop/apps/frontend && npx tsc --noEmit`
Expected: No errors from `Todo.tsx`.

- [ ] **Step 3: Commit**

```bash
git add apps/frontend/src/modules/todo/Todo.tsx
git commit -m "feat(todo): implement Todo component with filter tabs, drag reorder, inline edit"
```

---

## Task 3: Wire Todo into registry

**Files:**
- Modify: `src/shared/registry/registry.tsx`

- [ ] **Step 1: Replace the TodoPlaceholder with the real component**

In [registry.tsx](src/shared/registry/registry.tsx), make these two changes:

1. Add import at the top (after the `StickyNotes` import):
```ts
import { Todo } from '../../modules/todo/Todo'
```

2. Remove the `TodoPlaceholder` function entirely:
```ts
// DELETE this block:
function TodoPlaceholder(_props: { windowId: string }) {
  return <div style={{ padding: 16, fontFamily: 'Space Grotesk, sans-serif' }}>Todo</div>
}
```

3. In the `APP_REGISTRY` array, change the todo entry's `component` field:
```ts
component: Todo,
```

- [ ] **Step 2: Verify TypeScript**

Run: `cd /home/gandolh/projects/minimal-web-desktop/apps/frontend && npx tsc --noEmit`
Expected: Clean output, no errors.

- [ ] **Step 3: Full build check**

Run: `cd /home/gandolh/projects/minimal-web-desktop/apps/frontend && npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/frontend/src/shared/registry/registry.tsx
git commit -m "feat(todo): wire Todo component into app registry"
```

---

## Task 4: Cleanup — delete todo file and update docs

**Files:**
- Delete: `docs/todo/5-todo-app.md`
- Modify: `docs/todo/README.md`
- Modify: `docs/apps.md`

- [ ] **Step 1: Delete the todo spec**

```bash
rm /home/gandolh/projects/minimal-web-desktop/docs/todo/5-todo-app.md
```

- [ ] **Step 2: Update `docs/todo/README.md`**

Read the file first, then remove the line referencing `5-todo-app.md`.

- [ ] **Step 3: Update `docs/apps.md`**

Read the current `docs/apps.md` and add/update the Todo section with:
- Frontend: implemented
- Filter tabs: All / Active / Completed
- Drag-to-reorder via `@use-gesture/react`, `position` column
- Inline phantom edit on task text (click to edit, Enter/blur saves, Escape cancels)
- Add task via bottom input bar (Enter to submit)
- Optimistic updates on toggle-complete and delete

- [ ] **Step 4: Commit**

```bash
git add docs/todo/README.md docs/apps.md
git commit -m "docs: mark todo app complete, update apps.md"
```
