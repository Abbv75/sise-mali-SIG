import { useCallback, useMemo, useState, useEffect } from 'react'
import { MapContainer, Rectangle, TileLayer, useMap, useMapEvent } from 'react-leaflet'
import L from 'leaflet'
import { TILE_LAYERS } from '@/constant'

const POSITION_CLASSES = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
}

interface MinimapBoundsProps {
  parentMap: L.Map
  zoom: number
}

function MinimapBounds({ parentMap, zoom }: MinimapBoundsProps) {
  const minimap = useMap()

  const onClick = useCallback(
    (e: L.LeafletMouseEvent) => {
      parentMap.setView(e.latlng, parentMap.getZoom())
    },
    [parentMap],
  )
  useMapEvent('click', onClick)

  const [bounds, setBounds] = useState<L.LatLngBounds>(parentMap.getBounds())
  
  const onChange = useCallback(() => {
    setBounds(parentMap.getBounds())
    minimap.setView(parentMap.getCenter(), zoom)
  }, [minimap, parentMap, zoom])

  const handlers = useMemo(() => ({ move: onChange, zoom: onChange }), [onChange])
  
  useEffect(() => {
    parentMap.on(handlers)
    return () => {
      parentMap.off(handlers)
    }
  }, [parentMap, handlers])

  return <Rectangle bounds={bounds} weight={1} color="#CE1126" fillColor="transparent" />
}

interface MinimapControlProps {
  position?: keyof typeof POSITION_CLASSES
  zoom?: number
}

export function MinimapControl({ position = 'bottomleft', zoom = 4 }: MinimapControlProps) {
  const parentMap = useMap()
  
  const minimap = useMemo(
    () => (
      <div className="shadow-xl rounded-md overflow-hidden border-2 border-white/80 transition-all hover:scale-105 duration-300">
        <MapContainer
          style={{ height: 120, width: 120 }}
          center={parentMap.getCenter()}
          zoom={zoom}
          dragging={false}
          doubleClickZoom={false}
          scrollWheelZoom={false}
          attributionControl={false}
          zoomControl={false}
        >
          <TileLayer url={TILE_LAYERS.osm.url} />
          <MinimapBounds parentMap={parentMap} zoom={zoom} />
        </MapContainer>
      </div>
    ),
    [parentMap, zoom],
  )

  return (
    <div className={POSITION_CLASSES[position]}>
      <div className="leaflet-control mb-4 ml-4">
        {minimap}
      </div>
    </div>
  )
}
