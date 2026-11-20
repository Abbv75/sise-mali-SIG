import shp from 'shpjs'

// Cache mémoire pour stocker les GeoJSON déjà extraits des archives ZIP
const shapefileCache = new Map<string, any>()

/**
 * Télécharge et décompresse un shapefile au format .zip (ou parse du GeoJSON texte)
 * et retourne un FeatureCollection GeoJSON standardisé.
 */
export async function loadShapefile(shapeFile: string): Promise<any | null> {
  if (!shapeFile || shapeFile === 'null' || !shapeFile.trim()) return null

  const trimmed = shapeFile.trim()

  // 1. Détection si c'est déjà une chaîne GeoJSON JSON
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      return JSON.parse(trimmed)
    } catch {
      // Pas du JSON valide, on continue
    }
  }

  // 2. Vérification du cache mémoire
  if (shapefileCache.has(trimmed)) {
    return shapefileCache.get(trimmed)
  }

  // 3. Résolution de l'URL du fichier .zip
  let url = trimmed
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    const baseUrl = import.meta.env.DEV
      ? '/api-sise-mali'
      : (import.meta.env.VITE_API_URL || 'https://api.sise-mali.net')
    url = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`
  } else if (import.meta.env.DEV && url.includes('api.sise-mali.net')) {
    // En développement, passer par le proxy Vite pour éviter les blocages CORS
    url = url.replace('https://api.sise-mali.net', '/api-sise-mali')
  }

  try {
    // 4. Téléchargement de l'archive ZIP en ArrayBuffer
    const response = await fetch(url, { credentials: 'include' })
    if (!response.ok) {
      console.warn(`[Shapefile] Impossible de télécharger ${url} (${response.status})`)
      return null
    }

    const buffer = await response.arrayBuffer()

    // 5. Extraction et conversion en GeoJSON via shpjs
    const parsed = await shp(buffer)

    // Si le zip contient plusieurs shapefiles, shpjs retourne un tableau de FeatureCollections
    const geojson = Array.isArray(parsed)
      ? {
          type: 'FeatureCollection',
          features: parsed.flatMap((fc) => fc.features || []),
        }
      : parsed

    // Mise en cache
    shapefileCache.set(trimmed, geojson)
    return geojson
  } catch (err) {
    console.error(`[Shapefile] Erreur lors du chargement ou parsing de ${url}:`, err)
    return null
  }
}
