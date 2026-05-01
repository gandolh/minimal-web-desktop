import { DesktopIcon } from './DesktopIcon'
import { APP_REGISTRY } from '../../registry/registry'
import { useWindowStore } from '../../store/windowStore'
import type { Wallpaper } from '../../store/wallpaperStore'

// TODO: Import WindowContainer once the window module is built
// import { WindowContainer } from '../../components/window/WindowContainer'

type DesktopProps = {
  wallpaper: Wallpaper
}

const WALLPAPER_STYLES: Record<Wallpaper, React.CSSProperties> = {
  dots: {
    backgroundImage: 'radial-gradient(#c3c6d0 1px, transparent 1px)',
    backgroundSize: '20px 20px',
    backgroundColor: '#faf9f8',
  },
  grid: {
    backgroundImage:
      'linear-gradient(#c3c6d0 1px, transparent 1px), linear-gradient(90deg, #c3c6d0 1px, transparent 1px)',
    backgroundSize: '32px 32px',
    backgroundColor: '#faf9f8',
  },
  linen: {
    backgroundColor: '#faf9f8',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='%23faf9f8'/%3E%3Crect width='1' height='1' x='0' y='0' fill='%23c3c6d0' opacity='0.25'/%3E%3Crect width='1' height='1' x='2' y='2' fill='%23c3c6d0' opacity='0.2'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat',
  },
}

export function Desktop({ wallpaper }: DesktopProps) {
  const openWindow = useWindowStore((s) => s.openWindow)

  function handleOpen(appId: string) {
    const app = APP_REGISTRY.find((a) => a.id === appId)
    if (!app) return
    openWindow(app.id, app.name, app.defaultSize, app.minSize)
  }

  return (
    <div
      className="h-[calc(100vh-40px)] w-full relative overflow-hidden"
      style={WALLPAPER_STYLES[wallpaper]}
    >
      {/* Desktop icon grid — top-left, flows left-to-right wrapping */}
      <div className="flex flex-wrap gap-4 p-4 content-start items-start">
        {APP_REGISTRY.map((app) => (
          <DesktopIcon
            key={app.id}
            app={app}
            onOpen={() => handleOpen(app.id)}
          />
        ))}
      </div>

      {/* TODO: Render WindowContainer once window module is built */}
      {/* <WindowContainer /> */}
    </div>
  )
}
