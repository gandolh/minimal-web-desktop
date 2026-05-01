import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

export type WindowInstance = {
  id: string
  appId: string
  title: string
  isVisible: boolean
  isMaximized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
}

type PreMaximizeState = {
  position: { x: number; y: number }
  size: { width: number; height: number }
}

type WindowStore = {
  windows: WindowInstance[]
  preMaximizeStates: Record<string, PreMaximizeState>
  nextZIndex: number

  openWindow: (
    appId: string,
    title: string,
    defaultSize: { width: number; height: number },
    minSize: { width: number; height: number },
    initialPosition?: { x: number; y: number },
  ) => string
  closeWindow: (id: string) => void
  hideWindow: (id: string) => void
  showWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  focusWindow: (id: string) => void
  updatePosition: (id: string, position: { x: number; y: number }) => void
  updateSize: (id: string, size: { width: number; height: number }) => void
  getOrderedWindows: () => WindowInstance[]
}

const TOPBAR_HEIGHT = 40

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  preMaximizeStates: {},
  nextZIndex: 1,

  openWindow: (appId, title, defaultSize, minSize, initialPosition) => {
    const id = uuidv4()
    const { nextZIndex } = get()

    let x: number
    let y: number

    if (initialPosition) {
      x = Math.max(0, Math.min(initialPosition.x, window.innerWidth - minSize.width))
      y = Math.max(TOPBAR_HEIGHT, Math.min(initialPosition.y, window.innerHeight - minSize.height))
    } else {
      const centerX = Math.floor((window.innerWidth - defaultSize.width) / 2)
      const centerY = Math.floor((window.innerHeight - defaultSize.height) / 2)

      const offsetX = Math.floor(Math.random() * 201) - 100
      const offsetY = Math.floor(Math.random() * 201) - 100

      x = Math.max(0, Math.min(centerX + offsetX, window.innerWidth - minSize.width))
      y = Math.max(
        TOPBAR_HEIGHT,
        Math.min(centerY + offsetY, window.innerHeight - minSize.height),
      )
    }

    const instance: WindowInstance = {
      id,
      appId,
      title,
      isVisible: true,
      isMaximized: false,
      position: { x, y },
      size: { width: defaultSize.width, height: defaultSize.height },
      zIndex: nextZIndex,
    }

    set((state) => ({
      windows: [...state.windows, instance],
      nextZIndex: state.nextZIndex + 1,
    }))

    return id
  },

  closeWindow: (id) => {
    set((state) => {
      const { [id]: _removed, ...remainingPreMax } = state.preMaximizeStates
      return {
        windows: state.windows.filter((w) => w.id !== id),
        preMaximizeStates: remainingPreMax,
      }
    })
  },

  hideWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, isVisible: false } : w)),
    }))
  },

  showWindow: (id) => {
    const { nextZIndex } = get()
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isVisible: true, zIndex: nextZIndex } : w,
      ),
      nextZIndex: state.nextZIndex + 1,
    }))
  },

  maximizeWindow: (id) => {
    set((state) => {
      const win = state.windows.find((w) => w.id === id)
      if (!win) return state

      const preMaximizeStates = {
        ...state.preMaximizeStates,
        [id]: { position: win.position, size: win.size },
      }

      return {
        windows: state.windows.map((w) =>
          w.id === id
            ? {
                ...w,
                isMaximized: true,
                position: { x: 0, y: TOPBAR_HEIGHT },
                size: {
                  width: window.innerWidth,
                  height: window.innerHeight - TOPBAR_HEIGHT,
                },
              }
            : w,
        ),
        preMaximizeStates,
      }
    })
  },

  restoreWindow: (id) => {
    set((state) => {
      const saved = state.preMaximizeStates[id]
      if (!saved) return state

      const { [id]: _removed, ...remainingPreMax } = state.preMaximizeStates

      return {
        windows: state.windows.map((w) =>
          w.id === id
            ? {
                ...w,
                isMaximized: false,
                position: saved.position,
                size: saved.size,
              }
            : w,
        ),
        preMaximizeStates: remainingPreMax,
      }
    })
  },

  focusWindow: (id) => {
    const { nextZIndex } = get()
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, zIndex: nextZIndex } : w)),
      nextZIndex: state.nextZIndex + 1,
    }))
  },

  updatePosition: (id, position) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, position } : w)),
    }))
  },

  updateSize: (id, size) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, size } : w)),
    }))
  },

  getOrderedWindows: () => {
    return [...get().windows].sort((a, b) => a.zIndex - b.zIndex)
  },
}))
