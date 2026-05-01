import { create } from 'zustand'

export type Wallpaper = 'dots' | 'grid' | 'linen'

type WallpaperStore = {
  wallpaper: Wallpaper
  setWallpaper: (w: Wallpaper) => void
}

export const useWallpaperStore = create<WallpaperStore>((set) => ({
  wallpaper: 'dots',
  setWallpaper: (w) => set({ wallpaper: w }),
}))
