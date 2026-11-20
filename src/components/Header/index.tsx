import { LogoGroup } from '@/components/Header/LogoGroup'
import { Flag } from './Flag'
import { useIframeStore } from '@/stores/iframe/useIframeStore'

interface HeaderProps {
  forceShow?: boolean
}

export function Header({ forceShow }: HeaderProps = {}) {
  const showHeader = useIframeStore((state) => state.showHeader)

  if (!showHeader && !forceShow) {
    return null
  }

  return (
    <header className="h-[70px] flex justify-between z-30 relative">

      {/* 1. Zone Gauche Blanche (Biseau) alignée avec la sidebar (320px) */}
      <div className="absolute top-0 left-0 h-[90px] w-[360px] md:w-[380px] drop-shadow-[10px_-20px_10px_rgba(0,0,0,0.9)] z-20 pointer-events-auto">
        <div
          className="absolute inset-0 bg-white"
          style={{ clipPath: 'polygon(0 0, 100% 0, 320px 100%, 0 100%)' }}
        />
        <div className="relative h-[90px] flex items-center justify-center">
          {/* Logos Carte et Armoiries du Mali */}
          <LogoGroup logoHeight={70} className="gap-3 md:gap-4 pb-1" />
        </div>
      </div>

      {/* 2. Zone Droite (Textes & Drapeau) - Thème Jaune du drapeau */}
      <div className="bg-[#FCD116] flex-1 h-[70px] flex items-end justify-end pr-3 z-10 relative">

        <div className="flex w-full flex-col items-end justify-center text-right mr-[-3px]">
          <div className="pr-3 pb-1">
            <h1 className="text-slate-900 text-[22px] md:text-[26px] font-black tracking-wide leading-tight drop-shadow-sm">
              Module SIG du projet SISE-Mali
            </h1>
            <p className="text-slate-800/90 text-[11px] md:text-[13px] font-bold tracking-wide mt-0.5">
              Projection des données provenant du module de suivi-évaluation
            </p>
          </div>
          <div style={{
            width: '100%',
            height: '4px',
            background: '#009460'
          }} />
        </div>

        {/* Drapeau Malien (Hauteur partielle avec bords arrondis à gauche) */}
        <Flag />
      </div>
    </header>
  )
}
