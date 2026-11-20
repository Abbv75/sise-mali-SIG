import { Canvas, Textbox, PencilBrush, Image } from 'fabric'
import { useEffect, useRef } from 'react'
import type { ExportTool } from '@/stores/export/useExportStore'
import { useExportStore } from '@/stores/export/useExportStore'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyCanvas = any

// ── Fabric v7 : événement mouse:down ─────────────────────────────────────────
interface FabricMouseEvent {
  e: MouseEvent
  scenePoint: { x: number; y: number }
  viewportPoint: { x: number; y: number }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  target?: any
}

// ── Style par défaut des contrôles de redimensionnement ────────────────────
const controlStyles = {
  transparentCorners: false,
  cornerColor: '#ffffff',
  cornerStrokeColor: '#3b82f6',
  borderColor: '#3b82f6',
  cornerSize: 12, // Plus gros pour être bien visible
  padding: 8,     // Espace entre l'objet et la bordure
  cornerStyle: 'circle' as const,
  hasControls: true,
  hasBorders: true,
  selectable: true,
}

// ── Applique l'outil actif sur le canvas ─────────────────────────────────────
function applyTool(
  canvas: AnyCanvas,
  tool: ExportTool,
  activeHandlerRef: React.MutableRefObject<((opt: FabricMouseEvent) => void) | null>
) {
  // Retirer le handler précédent
  if (activeHandlerRef.current) {
    canvas.off('mouse:down', activeHandlerRef.current)
    activeHandlerRef.current = null
  }

  canvas.isDrawingMode = false
  canvas.selection = true
  canvas.defaultCursor = 'default'

  switch (tool) {
    case 'pencil': {
      canvas.isDrawingMode = true
      canvas.defaultCursor = 'crosshair'
      break
    }

    case 'text': {
      // Désactive la sélection multiple au lasso, mais permet de sélectionner un objet
      canvas.selection = false
      canvas.defaultCursor = 'text'

      const textHandler = (opt: FabricMouseEvent) => {
        // Clic sur un objet existant avec l'outil texte : 
        // On bascule sur l'outil de sélection par défaut.
        if (opt.target) {
          useExportStore.getState().setActiveTool('select')
          return
        }

        // Clic dans le vide : on crée un nouveau texte
        const { x, y } = opt.scenePoint

        const textObj = new Textbox('Double-clic pour éditer', {
          left: x,
          top: y,
          width: 250,
          fontSize: useExportStore.getState().defaultFontSize,
          fill: useExportStore.getState().defaultColor,
          backgroundColor: useExportStore.getState().defaultBackgroundColor,
          fontFamily: 'Arial, sans-serif',
          editable: true,
          splitByGrapheme: false,
          ...controlStyles
        })

        canvas.add(textObj)
        canvas.setActiveObject(textObj)
        canvas.renderAll()

        // Repasser en mode sélection par défaut automatiquement
        // Cela empêche de créer d'autres boîtes de texte par erreur en cliquant à côté
        useExportStore.getState().setActiveTool('select')
      }

      activeHandlerRef.current = textHandler
      canvas.on('mouse:down', textHandler as (opt: FabricMouseEvent) => void)
      break
    }

    case 'eraser': {
      canvas.selection = false
      canvas.defaultCursor = 'not-allowed'

      const eraserHandler = (opt: FabricMouseEvent) => {
        if (opt.target) {
          canvas.remove(opt.target)
          canvas.discardActiveObject()
          canvas.renderAll()
        }
      }

      activeHandlerRef.current = eraserHandler
      canvas.on('mouse:down', eraserHandler)
      break
    }

    case 'select': {
      // En mode sélection, on s'assure que le canvas est totalement interactif
      canvas.selection = true
      canvas.defaultCursor = 'default'
      break
    }

    case 'pan':
    default:
      break
  }
}

// ── Hook principal ────────────────────────────────────────────────────────────
export function useFabricCanvas(
  canvasElRef: React.RefObject<HTMLCanvasElement | null>,
  activeTool: ExportTool,
  width: number,
  height: number
) {
  const canvasRef = useRef<AnyCanvas>(null)
  const activeHandlerRef = useRef<((opt: FabricMouseEvent) => void) | null>(null)
  const activeToolRef = useRef<ExportTool>(activeTool)

  useEffect(() => {
    activeToolRef.current = activeTool
  }, [activeTool])

  // ── Resize ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.setDimensions({ width, height })
      canvasRef.current.calcOffset()
      canvasRef.current.renderAll()
    }
  }, [width, height])

  // ── Initialisation ──────────────────────────────────────────────────────
  useEffect(() => {
    const el = canvasElRef.current
    if (!el) return

    const fabricCanvas = new Canvas(el, {
      width: width || 800,
      height: height || 600,
      selection: true,
      preserveObjectStacking: true,
    })

    fabricCanvas.freeDrawingBrush = new PencilBrush(fabricCanvas)
    fabricCanvas.freeDrawingBrush.width = 3
    fabricCanvas.freeDrawingBrush.color = useExportStore.getState().defaultColor

    // Appliquer les styles de contrôles sur les traits dessinés au crayon
    fabricCanvas.on('path:created', (e: any) => {
      if (e.path) {
        e.path.set(controlStyles)
        fabricCanvas.renderAll()
      }
    })

    canvasRef.current = fabricCanvas
    applyTool(fabricCanvas, activeToolRef.current, activeHandlerRef)

    return () => {
      if (activeHandlerRef.current) {
        fabricCanvas.off('mouse:down', activeHandlerRef.current as (opt: FabricMouseEvent) => void)
      }
      activeHandlerRef.current = null
      fabricCanvas.dispose()
      canvasRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasElRef])

  // ── Changement d'outil ──────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    applyTool(canvas, activeTool, activeHandlerRef)
  }, [activeTool])

  // ── Raccourcis clavier (Suppression) ────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Ne pas intercepter si on est dans un input/textarea natif
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

        const activeObjects = canvas.getActiveObjects()
        if (!activeObjects || activeObjects.length === 0) return

        // Ne pas supprimer si on est en train d'éditer le texte !
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isEditing = activeObjects.some((obj: any) => obj.isEditing)
        if (isEditing) return

        if (e.key === 'Backspace') e.preventDefault()

        activeObjects.forEach((obj: any) => canvas.remove(obj))
        canvas.discardActiveObject()
        canvas.renderAll()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // ── Synchronisation des propriétés de l'objet actif ─────────────────────

  // 1. Appliquer defaultColor au crayon libre
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !canvas.freeDrawingBrush) return
    canvas.freeDrawingBrush.color = useExportStore.getState().defaultColor
  }, [activeTool]) // on pourrait écouter defaultColor, mais pour simplifier on le fait à l'init/changement d'outil

  // 2. Mettre à jour le store quand un objet est sélectionné/désélectionné/modifié
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const updateStore = () => {
      const activeObject = canvas.getActiveObject()
      if (!activeObject) {
        useExportStore.getState().setActiveObjectProps(null)
        return
      }

      const type = activeObject.type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const color = type === 'path' ? (activeObject as any).stroke : (activeObject as any).fill
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fontSize = (activeObject as any).fontSize
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backgroundColor = (activeObject as any).backgroundColor || 'transparent'

      useExportStore.getState().setActiveObjectProps({
        type,
        color: typeof color === 'string' ? color : '#000000',
        fontSize,
        backgroundColor,
      })
    }

    canvas.on('selection:created', updateStore)
    canvas.on('selection:updated', updateStore)
    canvas.on('selection:cleared', updateStore)
    canvas.on('object:modified', updateStore)

    // Synchronisation de la liste des objets (pour le LayerOrderWidget)
    const syncObjects = () => {
      const objects = canvas.getObjects().map((obj: any) => {
        if (!obj.id) obj.id = Math.random().toString(36).substring(2, 9)
        let label = obj.customName
        if (!label) {
          if (obj.type === 'textbox') label = `Texte: "${(obj.text || '').substring(0, 15)}"`
          else if (obj.type === 'image') label = 'Image'
          else if (obj.type === 'path') label = 'Dessin'
          else label = 'Objet'
        }
        return { id: obj.id, type: obj.type, text: label }
      })
      useExportStore.getState().setExportObjects(objects)
    }

    canvas.on('object:added', syncObjects)
    canvas.on('object:removed', syncObjects)
    canvas.on('text:changed', syncObjects)

    // Synchronisation initiale
    syncObjects()

    return () => {
      canvas.off('selection:created', updateStore)
      canvas.off('selection:updated', updateStore)
      canvas.off('selection:cleared', updateStore)
      canvas.off('object:modified', updateStore)
      canvas.off('object:added', syncObjects)
      canvas.off('object:removed', syncObjects)
      canvas.off('text:changed', syncObjects)
    }
  }, [canvasElRef])

  // 3. Écouter les mises à jour venant de l'interface React (ContextualToolbar)
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUpdate = (e: any) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const activeObject = canvas.getActiveObject()
      if (!activeObject) return

      const updates = e.detail
      
      if (updates.color) {
        if (activeObject.type === 'path') {
          activeObject.set({ stroke: updates.color })
        } else {
          activeObject.set({ fill: updates.color })
        }
      }
      
      if (updates.fontSize !== undefined && activeObject.type === 'textbox') {
        activeObject.set({ fontSize: updates.fontSize })
      }

      if (updates.backgroundColor !== undefined && activeObject.type === 'textbox') {
        activeObject.set({ backgroundColor: updates.backgroundColor })
      }

      canvas.renderAll()
      
      // On met à jour le store immédiatement pour rester synchrone
      useExportStore.getState().setActiveObjectProps({
        ...useExportStore.getState().activeObjectProps,
        ...updates
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleReorder = (e: any) => {
      const canvas = canvasRef.current
      if (!canvas) return
      
      const { id, newIndex } = e.detail
      const obj = canvas.getObjects().find((o: any) => o.id === id)
      if (obj) {
        canvas.moveObjectTo(obj, newIndex)
        canvas.renderAll()
        // The array order changed, but object:added/removed won't fire.
        // We need to re-sync manually.
        const objects = canvas.getObjects().map((o: any) => {
          let label = o.customName
          if (!label) {
            label = o.type === 'textbox' ? `Texte: "${(o.text || '').substring(0, 15)}"` : o.type === 'image' ? 'Image' : 'Dessin'
          }
          return { id: o.id, type: o.type, text: label }
        })
        useExportStore.getState().setExportObjects(objects)
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleRename = (e: any) => {
      const canvas = canvasRef.current
      if (!canvas) return
      
      const { id, name } = e.detail
      const obj = canvas.getObjects().find((o: any) => o.id === id)
      if (obj) {
        obj.customName = name
        
        const objects = canvas.getObjects().map((o: any) => {
          let label = o.customName
          if (!label) {
            label = o.type === 'textbox' ? `Texte: "${(o.text || '').substring(0, 15)}"` : o.type === 'image' ? 'Image' : 'Dessin'
          }
          return { id: o.id, type: o.type, text: label }
        })
        useExportStore.getState().setExportObjects(objects)
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAddImage = (e: any) => {
      const canvas = canvasRef.current
      if (!canvas) return
      
      const dataUrl = e.detail
      Image.fromURL(dataUrl).then((img: any) => {
        // Redimensionner l'image si elle est trop grande
        const maxWidth = 300
        if (img.width && img.width > maxWidth) {
          const scale = maxWidth / img.width
          img.scale(scale)
        }
        
        img.set({
          left: 100,
          top: 100,
          ...controlStyles
        })
        
        // Assigner un ID
        img.id = Math.random().toString(36).substring(2, 9)
        img.customName = 'Image importée'

        canvas.add(img)
        canvas.setActiveObject(img)
        canvas.renderAll()
        useExportStore.getState().setActiveTool('select')
      }).catch(err => console.error("Erreur d'import d'image:", err))
    }

    window.addEventListener('export:updateActiveObject', handleUpdate)
    window.addEventListener('export:reorderObject', handleReorder)
    window.addEventListener('export:renameObject', handleRename)
    window.addEventListener('export:addImage', handleAddImage)
    return () => {
      window.removeEventListener('export:updateActiveObject', handleUpdate)
      window.removeEventListener('export:reorderObject', handleReorder)
      window.removeEventListener('export:renameObject', handleRename)
      window.removeEventListener('export:addImage', handleAddImage)
    }
  }, [])

  const clearAll = () => {
    canvasRef.current?.clear()
    canvasRef.current?.renderAll()
  }

  return { canvasRef, clearAll }
}
