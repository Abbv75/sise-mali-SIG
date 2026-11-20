import React from 'react'

interface LivePreviewProps {
  isShapeMode: boolean
  style: any
  PreviewIcon: React.ElementType
}

export function LivePreview({ isShapeMode, style, PreviewIcon }: LivePreviewProps) {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-white/10">
      <div className="text-xs text-white/70 font-semibold uppercase tracking-wider">
        Aperçu en direct
      </div>
      <div className="flex items-center justify-center p-3 rounded-lg bg-black/20" style={{ minWidth: 70, minHeight: 70 }}>
        {isShapeMode ? (
          <div 
            className="w-10 h-10 rounded-sm"
            style={{ 
              backgroundColor: style.fillColor || '#009460', 
              opacity: style.fillOpacity ?? 0.2,
              border: `${style.borderWeight ?? 2}px solid ${style.borderColor || '#009460'}`
            }}
          />
        ) : (
          <div 
            className="flex items-center justify-center rounded-full shadow-lg transition-all"
            style={{ 
              backgroundColor: style.bgColor, 
              width: style.size, 
              height: style.size 
            }}
          >
            <PreviewIcon 
              className="transition-all"
              style={{ color: style.color, width: style.size * 0.6, height: style.size * 0.6 }} 
            />
          </div>
        )}
      </div>
    </div>
  )
}
