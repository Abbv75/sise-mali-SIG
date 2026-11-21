import { LogoGroup } from '@/components/Header/LogoGroup'
import { Flag } from './Flag'
import { ProgrammeProjetSelector } from './ProgrammeProjetSelector'
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

      {/* 1. Zone Gauche Blanche (Biseau) alignée avec la sidebar (320px) - z-40 pour passer au premier plan sur le trait vert */}
      <div className="absolute top-0 left-0 h-[90px] w-[360px] md:w-[380px] drop-shadow-[10px_-20px_10px_rgba(0,0,0,0.9)] z-40 pointer-events-auto">
        <div
          className="absolute inset-0 bg-white"
          style={{ clipPath: 'polygon(0 0, 100% 0, 320px 100%, 0 100%)' }}
        />
        <div className="relative h-[90px] flex items-center justify-center">
          {/* Logos Carte et Armoiries du Mali */}
          <LogoGroup logoHeight={70} className="gap-3 md:gap-4 pb-1" />
        </div>
      </div>

      {/* 2. Zone Droite (Sélecteur Projets + Textes & Drapeau) - Effet Or avec motif de grain */}
      <div className="bg-gold-grain flex-1 h-[70px] flex items-center justify-end pr-3 z-10 relative shadow-inner">

        <div className="flex items-center gap-3 md:gap-4 mr-3 relative z-10">
          {/* Sélecteur affiché juste à côté du titre */}
          <ProgrammeProjetSelector />

          {/* Bloc Titre et sous-titre */}
          <div className="flex flex-col items-end justify-center text-right pr-1">
            <h1 className="text-slate-950 text-[18px] md:text-[22px] lg:text-[25px] font-black tracking-wide leading-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
              Module SIG du projet SISE-Mali
            </h1>
            <p className="text-slate-900 text-[10px] md:text-[12px] lg:text-[13px] font-extrabold tracking-wide mt-0.5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
              Projection des données provenant du module de suivi-évaluation
            </p>
          </div>
        </div>

        {/* Drapeau Malien */}
        <div className="relative h-full flex items-end shrink-0">
          <Flag />
        </div>
      </div>

      {/* 3. Barre verte en bas faisant toute la longueur et collée directement au bas */}
      <div
        className="absolute bottom-0 left-0 right-3 h-[4px] z-30"
        style={{
          background: '#009460',
          boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
        }}
      />
    </header>
  )
}
