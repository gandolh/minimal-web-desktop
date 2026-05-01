import { type ComponentType } from 'react'
import {
  StickyNote,
  ListTodo,
  Bookmark,
  FileText,
  Container,
  Terminal,
} from 'lucide-react'
import { StickyNotes } from '../../modules/sticky-notes/StickyNotes'
import { Todo } from '../../modules/todo/Todo'

export type AppConfig = {
  id: string
  name: string
  description: string
  meta: string[]
  icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  component: ComponentType<{ windowId: string }>
  multiInstance: boolean
  defaultSize: { width: number; height: number }
  minSize: { width: number; height: number }
}

// TODO: Replace placeholder components with real app imports once modules are built

function BookmarksPlaceholder(_props: { windowId: string }) {
  return <div style={{ padding: 16, fontFamily: 'Space Grotesk, sans-serif' }}>Bookmarks</div>
}

function NotepadPlaceholder(_props: { windowId: string }) {
  return <div style={{ padding: 16, fontFamily: 'Space Grotesk, sans-serif' }}>Notepad</div>
}

function DockerDesktopPlaceholder(_props: { windowId: string }) {
  return <div style={{ padding: 16, fontFamily: 'Space Grotesk, sans-serif' }}>Docker Desktop</div>
}

function ServiceLauncherPlaceholder(_props: { windowId: string }) {
  return <div style={{ padding: 16, fontFamily: 'Space Grotesk, sans-serif' }}>Service Launcher</div>
}

export const APP_REGISTRY: AppConfig[] = [
  {
    id: 'sticky-notes',
    name: 'Sticky Notes',
    description: 'Quick floating sticky notes',
    meta: ['post-it', 'memo', 'note'],
    icon: StickyNote,
    component: StickyNotes,
    multiInstance: true,
    defaultSize: { width: 320, height: 280 },
    minSize: { width: 240, height: 200 },
  },
  {
    id: 'todo',
    name: 'Todo',
    description: 'Task list and to-dos',
    meta: ['tasks', 'checklist', 'reminders'],
    icon: ListTodo,
    component: Todo,
    multiInstance: false,
    defaultSize: { width: 360, height: 480 },
    minSize: { width: 280, height: 300 },
  },
  {
    id: 'bookmarks',
    name: 'Bookmarks',
    description: 'Save and organize links',
    meta: ['links', 'favorites', 'urls'],
    icon: Bookmark,
    component: BookmarksPlaceholder,
    multiInstance: false,
    defaultSize: { width: 480, height: 520 },
    minSize: { width: 320, height: 400 },
  },
  {
    id: 'notepad',
    name: 'Notepad',
    description: 'Markdown text editor',
    meta: ['editor', 'markdown', 'text', 'write'],
    icon: FileText,
    component: NotepadPlaceholder,
    multiInstance: true,
    defaultSize: { width: 600, height: 500 },
    minSize: { width: 400, height: 300 },
  },
  {
    id: 'docker-desktop',
    name: 'Docker Desktop',
    description: 'Manage Docker containers',
    meta: ['containers', 'docker', 'images', 'compose'],
    icon: Container,
    component: DockerDesktopPlaceholder,
    multiInstance: false,
    defaultSize: { width: 800, height: 560 },
    minSize: { width: 600, height: 400 },
  },
  {
    id: 'service-launcher',
    name: 'Service Launcher',
    description: 'Launch and manage local services',
    meta: ['terminal', 'services', 'processes', 'run'],
    icon: Terminal,
    component: ServiceLauncherPlaceholder,
    multiInstance: false,
    defaultSize: { width: 720, height: 520 },
    minSize: { width: 500, height: 380 },
  },
]
