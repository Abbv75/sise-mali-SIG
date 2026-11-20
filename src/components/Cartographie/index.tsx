import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { createInvertedGeoJSON } from '@/lib/geo-utils'
import maliContourUrl from '@/assets/geojson/mali-contour.geojson?url'
import { MapContainer, TileLayer, LayersControl, GeoJSON, useMap, ZoomControl } from 'react-leaflet'
import {
  MALI_CENTER,
  MALI_DEFAULT_ZOOM,
  MALI_MIN_ZOOM,
  MALI_MAX_ZOOM,
  MALI_BOUNDS,
  TILE_LAYERS,
} from '@/constant'
import { LocaliteElement } from '@/features/LocaliteElement'
import { ZoneElement } from '@/features/ZoneElement'
import { UglElement } from '@/features/UglElement'
import { MinimapControl } from './MinimapControl'
import 'leaflet/dist/leaflet.css'

// ─── Fix critique : icônes Leaflet + Vite ────────────────────────────────────
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// ─── Sous-composant : Resizer ─────────────────────────────────────────────────
function Resizer({ panelOpen }: { panelOpen: boolean }) {
  const map = useMap()
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 350)
    return () => clearTimeout(timer)
  }, [panelOpen, map])
  return null
}

// ─── Sous-composant : Masque Mali ─────────────────────────────────────────────
function MaliMask() {
  const [maliGeoJSON, setMaliGeoJSON] = useState<any>(null)

  useEffect(() => {
    fetch(maliContourUrl)
      .then((res) => res.json())
      .then((data) => setMaliGeoJSON(createInvertedGeoJSON(data)))
      .catch((err) => console.error('Erreur chargement shapefile Mali', err))
  }, [])

  if (!maliGeoJSON) return null

  return (
    <GeoJSON
      data={maliGeoJSON}
      style={{
        color: '#1e293b',
        weight: 2,
        opacity: 0.8,
        fillColor: '#000000',
        fillOpacity: 0.5,
      }}
    />
  )
}

// ─── MapPanel ─────────────────────────────────────────────────────────────────
interface MapPanelProps {
  panelOpen: boolean
}

export function MapPanel({ panelOpen }: MapPanelProps) {
  const mapRef = useRef<L.Map | null>(null)

  return (
    <div className="w-full h-full bg-slate-100 relative z-0">
      <MapContainer
        center={MALI_CENTER}
        zoom={MALI_DEFAULT_ZOOM}
        minZoom={MALI_MIN_ZOOM}
        maxZoom={MALI_MAX_ZOOM}
        bounds={MALI_BOUNDS}
        maxBounds={MALI_BOUNDS}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        ref={mapRef}
      >
        <Resizer panelOpen={panelOpen} />

        {/* Fond de carte */}
        <LayersControl position="bottomright">
          {Object.values(TILE_LAYERS).map((layer, idx) => (
            <LayersControl.BaseLayer key={layer.label} checked={idx === 0} name={layer.label}>
              <TileLayer url={layer.url} attribution={layer.attribution} maxZoom={layer.maxZoom} />
            </LayersControl.BaseLayer>
          ))}
        </LayersControl>

        {/* Masque pays Mali */}
        <MaliMask />

        <ZoomControl position="topright" />
        <MinimapControl position="bottomleft" zoom={3} />

        {/* Couches de données (ordre dynamique géré individuellement dans les composants) */}
        <UglElement />
        <ZoneElement />
        <LocaliteElement />
      </MapContainer>
    </div>
  )
}
