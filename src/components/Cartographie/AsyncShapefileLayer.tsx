import { useEffect, useState } from 'react'
import { GeoJSON } from 'react-leaflet'
import { loadShapefile } from '@/lib/shapefile-loader'
import type { PathOptions } from 'leaflet'

interface AsyncShapefileLayerProps {
  shapeFile: string
  style?: PathOptions | ((feature: any) => PathOptions)
  children?: React.ReactNode
  onLoaded?: (data: any) => void
}

export function AsyncShapefileLayer({
  shapeFile,
  style,
  children,
  onLoaded,
}: AsyncShapefileLayerProps) {
  const [geoData, setGeoData] = useState<any | null>(null)

  useEffect(() => {
    let active = true

    if (!shapeFile || shapeFile === 'null' || !shapeFile.trim()) {
      setGeoData(null)
      return
    }

    loadShapefile(shapeFile)
      .then((data) => {
        if (active && data) {
          setGeoData(data)
          onLoaded?.(data)
        }
      })
      .catch((err) => {
        console.error('Erreur chargement shapefile zip:', err)
      })

    return () => {
      active = false
    }
  }, [shapeFile, onLoaded])

  if (!geoData) return null

  return (
    <GeoJSON data={geoData} style={style}>
      {children}
    </GeoJSON>
  )
}
