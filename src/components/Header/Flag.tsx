import { cn } from "@/lib/utils"

interface FlagProps {
  className?: string
  width?: number | string
  height?: number | string
}

export function Flag({ className, width, height }: FlagProps) {
  const defaultSize = (!width && !height) ? "h-[85%] w-[70px] md:w-[90px]" : ""

  return (
    <div 
      style={{ width, height, borderRadius: '8px 8px 0 0' }}
      className={cn(
        "flex overflow-hidden shadow-lg border-y border-l border-white/10 flex-shrink-0 mb-[-1px]",
        defaultSize,
        className
      )}
    >
      {/* Drapeau du Mali : Vert, Or/Jaune, Rouge */}
      <div className="flex-1 bg-[#009460]"></div>
      <div className="flex-1 bg-[#FCD116]"></div>
      <div className="flex-1 bg-[#CE1126]"></div>
    </div>
  )
}
