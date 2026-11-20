import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap } from 'react-leaflet'
import { createInvertedGeoJSON } from '@/lib/geo-utils'
import maliContourUrl from '@/assets/geojson/mali-contour.geojson?url'
import {
  MALI_CENTER,
  MALI_DEFAULT_ZOOM,
  MALI_MIN_ZOOM,
  MALI_MAX_ZOOM,
  MALI_BOUNDS,
  TILE_LAYERS,
} from '@/constant'
import { useMapStore } from '@/stores/map/useMapStore'
import { useExportStore } from '@/stores/export/useExportStore'
import { LocaliteElement } from '@/features/LocaliteElement'
import { ZoneElement } from '@/features/ZoneElement'
import { UglElement } from '@/features/UglElement'
import 'leaflet/dist/leaflet.css'

// Fix icônes Leaflet + Vite
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function MaliMask() {
  const [maliGeoJSON, setMaliGeoJSON] = useState<unknown>(null)
  useEffect(() => {
    fetch(maliContourUrl)
      .then((r) => r.json())
      .then((data) => setMaliGeoJSON(createInvertedGeoJSON(data)))
      .catch(console.error)
  }, [])
  if (!maliGeoJSON) return null
  return (
    <GeoJSON
      data={maliGeoJSON as GeoJSON.GeoJsonObject}
      style={{ color: '#1e293b', weight: 2, opacity: 0.8, fillColor: '#000000', fillOpacity: 0.5 }}
    />
  )
}

/**
 * Active/désactive les interactions Leaflet selon mapLocked.
 * Monté à l'intérieur du MapContainer pour accéder à useMap().
 */
function MapInteractionController({ mapLocked }: { mapLocked: boolean }) {
  const map = useMap()
  useEffect(() => {
    if (mapLocked) {
      map.dragging.disable()
      map.scrollWheelZoom.disable()
      map.doubleClickZoom.disable()
      map.touchZoom.disable()
      map.keyboard.disable()
    } else {
      map.dragging.enable()
      map.scrollWheelZoom.enable()
      map.doubleClickZoom.enable()
      map.touchZoom.enable()
      map.keyboard.enable()
    }
  }, [map, mapLocked])
  return null
}

function MapResizer({ width, height }: { width: number; height: number }) {
  const map = useMap()
  useEffect(() => {
    map.invalidateSize()
  }, [map, width, height])
  return null
}

/**
 * Deuxième instance Leaflet, synchronisée sur le même centre/zoom
 * que la carte principale via useMapStore.
 * Quand mapLocked=false, toutes les interactions sont actives.
 */
export function MapSnapshot({ width, height }: { width: number; height: number }) {
  const currentTileLayer = useMapStore((s) => s.currentTileLayer)
  const zoomLevel = useMapStore((s) => s.zoomLevel)
  const mapLocked = useExportStore((s) => s.mapLocked)
  const layer = TILE_LAYERS[currentTileLayer] ?? TILE_LAYERS.osm

  const mapRef = useRef<L.Map | null>(null)

  // Synchroniser le zoom depuis le store (quand la carte principale change)
  useEffect(() => {
    const map = mapRef.current
    if (map && mapLocked) map.setZoom(zoomLevel)
  }, [zoomLevel, mapLocked])

  return (
    <div style={{ width, height, pointerEvents: mapLocked ? 'none' : 'auto' }}>
      <MapContainer
        center={MALI_CENTER}
        zoom={zoomLevel ?? MALI_DEFAULT_ZOOM}
        minZoom={MALI_MIN_ZOOM}
        maxZoom={MALI_MAX_ZOOM}
        bounds={MALI_BOUNDS}
        maxBounds={MALI_BOUNDS}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        ref={mapRef}
      >
        <MapResizer width={width} height={height} />
        <MapInteractionController mapLocked={mapLocked} />
        <TileLayer url={layer.url} attribution={layer.attribution} maxZoom={layer.maxZoom} crossOrigin="anonymous" />
        <MaliMask />
        {!mapLocked && <ZoomControl position="topright" />}
        <UglElement />
        <ZoneElement />
        <LocaliteElement />
      </MapContainer>
    </div>
  )
}
