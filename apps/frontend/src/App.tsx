import { TopBar } from './shared/components/topbar'
import { Desktop } from './shared/components/desktop'
import { useWallpaperStore } from './shared/store/wallpaperStore'

export default function App() {
  const wallpaper = useWallpaperStore((s) => s.wallpaper)

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <TopBar />
      <Desktop wallpaper={wallpaper} />
    </div>
  )
}
