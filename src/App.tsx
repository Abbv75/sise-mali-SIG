import { useState } from 'react'
import { MapPanel } from '@/components/Cartographie'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SidePanel } from '@/components/SideBar'
import { ElementEditorDrawer } from '@/components/Cartographie/ElementEditorDrawer'
import { ExportLayout } from '@/components/ExportLayout'
import { useAutoLogin } from '@/hooks/useAutoLogin'

export default function App() {
  const [panelOpen, setPanelOpen] = useState(true)
  const { isAuth } = useAutoLogin()

  if (!isAuth) {
    return (
      <div
        style={{
          border: '3px solid white',
          borderRadius: '15px',
          overflow: 'hidden'
        }}
        className="h-screen w-full flex flex-col bg-background text-foreground overflow-hidden">
        <Header />

        <div className="flex-1 flex w-full min-w-0 z-10 relative">
          {/* Skeleton Sidebar */}
          <div
            className="relative h-full shrink-0 z-20 flex shadow-xl bg-[#008d5b]"
            style={{ width: panelOpen ? 320 : 0, transition: 'width 0.3s cubic-bezier(.16,1,.3,1)' }}
          >
            {panelOpen && (
              <div className="w-full pt-12 px-4 flex flex-col gap-6">
                <div className="h-10 bg-white/10 animate-pulse rounded-md w-3/4 mx-auto"></div>
                <div className="h-12 bg-white/5 animate-pulse rounded-md w-full"></div>
                <div className="h-12 bg-white/5 animate-pulse rounded-md w-full"></div>
                <div className="h-12 bg-white/5 animate-pulse rounded-md w-full"></div>
              </div>
            )}
          </div>

          {/* Skeleton Map */}
          <div className="flex-1 h-full z-31 min-w-0 relative bg-[#E2DFD8] overflow-hidden">
            {/* Background Map Pulse */}
            <div className="absolute inset-0 bg-black/5 animate-pulse" />

            {/* Fake Map Controls (Top Right) */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <div className="w-8 h-8 bg-white/80 shadow-md rounded-md animate-pulse" />
              <div className="w-8 h-20 bg-white/80 shadow-md rounded-md animate-pulse mt-2" />
            </div>

            {/* Fake Map Elements (Bottom Right - Scale etc) */}
            <div className="absolute bottom-6 right-4">
              <div className="w-32 h-5 bg-white/70 shadow-sm rounded-sm animate-pulse" />
            </div>

            {/* Fake Floating Panel (Top Left) */}
            <div className="absolute top-4 left-4 flex flex-col gap-3">
              <div className="w-56 h-12 bg-white/80 shadow-md rounded-lg animate-pulse" />
              <div className="w-32 h-10 bg-white/80 shadow-md rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  return (
    <div
      style={{
        border: '3px solid white',
        borderRadius: '15px',
        overflow: 'hidden'
      }}
      className="h-screen w-full flex flex-col bg-background text-foreground overflow-hidden">
      <Header />

      {/* 2. BODY : Sidebar + Map */}
      <div className="flex-1 flex w-full min-w-0 z-10 relative">

        {/* Sidebar — aucun prop de données, lit les stores directement */}
        <div
          className="relative h-full shrink-0 z-20 flex shadow-xl"
          style={{ width: panelOpen ? 320 : 0, transition: 'width 0.3s cubic-bezier(.16,1,.3,1)' }}
        >
          <SidePanel
            isOpen={panelOpen}
            onTogglePanel={() => setPanelOpen(!panelOpen)}
          />
        </div>

        {/* Map — aucun prop de données, features lisent les stores */}
        <div className="flex-1 h-full z-31 min-w-0 relative overflow-hidden">
          <MapPanel panelOpen={panelOpen} />
          <ElementEditorDrawer />
        </div>

      </div>

      <Footer />
      <ExportLayout />
    </div>
  )
}
