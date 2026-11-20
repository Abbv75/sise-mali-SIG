import { DrawerHeader } from './components/DrawerHeader'
import { LivePreview } from './components/LivePreview'
import { DisplayModePicker } from './components/DisplayModePicker'
import { ShapeEditor } from './components/ShapeEditor'
import { PointEditor } from './components/PointEditor'
import { DrawerFooter } from './components/DrawerFooter'
import { useElementEditorDrawer } from './useElementEditorDrawer'
import { ICON_OPTIONS } from '@/components/CustomMapIcon'

export function ElementEditorDrawer() {
  const {
    editingId,
    style,
    hasShapefile,
    isShapeMode,
    applyToLayer,
    onClose,
    setElementStyle,
  } = useElementEditorDrawer()

  if (!editingId || !style) return null

  const PreviewIcon = ICON_OPTIONS[style.iconName as keyof typeof ICON_OPTIONS] || ICON_OPTIONS['map-pin']

  return (
    <div className="absolute top-0 right-0 h-full w-[350px] bg-[#008d5b] text-white shadow-2xl z-[100] flex flex-col border-l border-white/15 transition-transform duration-300 ease-in-out translate-x-0 animate-in slide-in-from-right-8 fade-in-0">
      <DrawerHeader onClose={onClose} />

      <div className="flex-1 overflow-y-auto carto-panel-scroll p-4 space-y-6">
        <LivePreview 
          isShapeMode={isShapeMode} 
          style={style} 
          PreviewIcon={PreviewIcon} 
        />

        {hasShapefile && (
          <DisplayModePicker
            isShapeMode={isShapeMode}
            hasShapefile={hasShapefile}
            editingId={editingId}
            setElementStyle={setElementStyle}
          />
        )}

        {isShapeMode ? (
          <ShapeEditor 
            editingId={editingId} 
            style={style} 
            setElementStyle={setElementStyle} 
          />
        ) : (
          <PointEditor 
            editingId={editingId} 
            style={style} 
            setElementStyle={setElementStyle} 
          />
        )}
      </div>

      <DrawerFooter applyToLayer={applyToLayer} />
    </div>
  )
}
