import armoirieMali from '@/assets/images/armoirie-mali.png'
import carteMali from '@/assets/images/carte-mali.png'
import { cn } from '@/lib/utils'

interface LogoGroupProps {
  className?: string
  logoHeight?: number | string
}

export function LogoGroup({ className, logoHeight = 65 }: LogoGroupProps) {
  const logos = [
    { src: carteMali, alt: 'Carte du Mali' },
    { src: armoirieMali, alt: 'Armoiries de la République du Mali' },
  ]

  return (
    <div className={cn('flex flex-1 items-center justify-center gap-6 md:gap-8 mr-10 px-4', className)}>
      {logos.map((logo, index) => (
        <div
          key={index}
          className="relative transition-transform duration-300 hover:scale-105 flex items-center justify-center"
        >
          <img
            src={logo.src}
            alt={logo.alt}
            style={{ height: logoHeight, width: 'auto' }}
            className="object-contain max-h-[75px] drop-shadow-sm"
          />
        </div>
      ))}
    </div>
  )
}
