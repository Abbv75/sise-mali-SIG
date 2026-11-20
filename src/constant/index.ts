// ─── Configuration de la carte Leaflet pour SISE-MALI ────────────────────────
// Centre du Mali (coordonnées géographiques)
export const MALI_CENTER: [number, number] = [17.57, -3.99]
export const MALI_DEFAULT_ZOOM = 6
export const MALI_MIN_ZOOM = 5
export const MALI_MAX_ZOOM = 18
export const MALI_BOUNDS: [[number, number], [number, number]] = [
  [10.14, -12.25], // South-West
  [25.01, 4.27],   // North-East
]

// Alias par défaut
export const DEFAULT_MAP_CENTER = MALI_CENTER
export const DEFAULT_MAP_ZOOM = MALI_DEFAULT_ZOOM
export const DEFAULT_MAP_MIN_ZOOM = MALI_MIN_ZOOM
export const DEFAULT_MAP_MAX_ZOOM = MALI_MAX_ZOOM
export const DEFAULT_MAP_BOUNDS = MALI_BOUNDS

// Rétrocompatibilité
export const GUINEA_CENTER = MALI_CENTER
export const GUINEA_DEFAULT_ZOOM = MALI_DEFAULT_ZOOM
export const GUINEA_MIN_ZOOM = MALI_MIN_ZOOM
export const GUINEA_MAX_ZOOM = MALI_MAX_ZOOM
export const GUINEA_BOUNDS = MALI_BOUNDS

// ─── Providers de tuiles ─────────────────────────────────────────────────────
export const TILE_LAYERS = {
  osm: {
    label: 'Carte standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  satellite: {
    label: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18,
  },
  dark: {
    label: 'Carte sombre',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
    subdomains: 'abcd',
  },
  topo: {
    label: 'Topographique',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    maxZoom: 17,
  },
} as const

export type TileLayerKey = keyof typeof TILE_LAYERS

// ─── Couleurs des couches de données ─────────────────────────────────────────
export const LAYER_COLORS = {
  zones: {
    fillColor: '#009460',
    color: '#006B46',
    fillOpacity: 0.25,
    weight: 2,
  },
  localites: {
    color: '#CE1126',
    fillColor: '#CE1126',
  },
} as const

// ─── Configuration des icônes de marqueurs ───────────────────────────────────
export const MARKER_ICONS = {
  localite: {
    color: '#CE1126',
    label: 'Localité',
  },
  zone: {
    color: '#009460',
    label: 'Zone de collecte',
  },
} as const
