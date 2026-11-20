import { useRef, useState, useCallback, useEffect } from 'react'

/**
 * Gère le pan de la page blanche dans la zone grise de composition.
 * Scroll molette = zoom de la page, drag (outil pan) = déplacement.
 */
export function useExportCanvas(isPanTool: boolean, isMapLocked: boolean) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Décalage de la page blanche dans la zone grise
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  // Zoom de la page (0.25 – 3)
  const [zoom, setZoom] = useState(0.75)

  const isPanning = useRef(false)
  const lastMouse = useRef({ x: 0, y: 0 })

  // ── Pan (drag) ────────────────────────────────────────────────────────────
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isMapLocked) return // Priorité à la carte quand déverrouillée
      if (!isPanTool) return
      isPanning.current = true
      lastMouse.current = { x: e.clientX, y: e.clientY }
      e.preventDefault()
    },
    [isPanTool, isMapLocked]
  )

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return
    const dx = e.clientX - lastMouse.current.x
    const dy = e.clientY - lastMouse.current.y
    lastMouse.current = { x: e.clientX, y: e.clientY }
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
  }, [])

  const onMouseUp = useCallback(() => {
    isPanning.current = false
  }, [])

  // ── Zoom molette ──────────────────────────────────────────────────────────
  const onWheel = useCallback((e: WheelEvent) => {
    if (!isMapLocked) return // Laisse Leaflet gérer le zoom de sa propre carte

    e.preventDefault()
    setZoom((z) => {
      // Normalisation (Firefox utilise des lignes au lieu de pixels)
      const delta = e.deltaMode === 1 ? e.deltaY * 20 : e.deltaY
      
      // Facteur exponentiel pour un zoom beaucoup plus doux, 
      // et proportionnel à la vitesse de défilement (parfait pour trackpad)
      const sensitivity = 0.0015
      const factor = Math.exp(-delta * sensitivity)
      
      return Math.min(4, Math.max(0.15, z * factor))
    })
  }, [isMapLocked])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [onWheel])

  // ── Centrer la page ───────────────────────────────────────────────────────
  const resetView = useCallback(() => {
    setOffset({ x: 0, y: 0 })
    setZoom(0.75)
  }, [])

  // Écoute l'event depuis ExportLayout (bouton reset dans la topbar)
  useEffect(() => {
    const handler = () => resetView()
    window.addEventListener('export:resetView', handler)
    return () => window.removeEventListener('export:resetView', handler)
  }, [resetView])

  return {
    containerRef,
    offset,
    zoom,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    resetView,
  }
}
