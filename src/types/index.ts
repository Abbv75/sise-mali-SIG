// ─── Types centralisés — SISE-Mali-SIG ────────────────────────────────────────
// Re-exporte les types existants + types partagés pour l'architecture carte
export interface ZUSTAND_T<T> {
  (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: false): void;
  (state: T | ((state: T) => T), replace: true): void;
}

// ─── Localite ────────────────────────────────────────────────────────────────
export type { NiveauLocalite } from './niveauLocalite'
export type { Localite } from './localite'

// ─── Zone de collecte ─────────────────────────────────────────────────────────
export type { ZoneCollecteTable, ZoneCollecte } from './zoneCollecte'

// ─── UGL ──────────────────────────────────────────────────────────────────────
export type { Ugl } from './ugl'

// ─── Style d'icône ────────────────────────────────────────────────────────────
export interface MapElementStyle {
  // Styles pour les points (icônes)
  iconName: string   // nom de l'icône lucide-react (ex: 'map-pin')
  color: string      // couleur du motif intérieur (ex: '#ffffff')
  bgColor: string    // couleur de fond du pin (ex: '#CE1126')
  size: number       // taille en px (ex: 28)

  // Mode d'affichage (surtout pour les zones)
  displayMode?: 'point' | 'shape'

  // Styles pour les shapefiles
  fillColor?: string
  fillOpacity?: number
  borderColor?: string
  borderWeight?: number
}

// ─── Worker — mapping champ API → label popup ─────────────────────────────────
export interface FieldKey {
  originaleName: string
  renamed?: string
}

// ─── Worker — point traité renvoyé en sortie ──────────────────────────────────
export interface PopUpDataItem {
  label: string
  value: any
}

export interface ProcessedPoint {
  id: string | number
  coor: [number, number]
  data: Record<string, any>
  style: MapElementStyle
  popUpData: PopUpDataItem[]
}

// ─── Constante fieldKeyListe pour Localités ───────────────────────────────────
export const LOCALITE_FIELD_KEYS: FieldKey[] = [
  { originaleName: 'intitule_loca', renamed: 'Localité' },
  { originaleName: 'niveau_loca', renamed: 'Niveau territorial' },
  { originaleName: 'parent_loca', renamed: 'Rattaché à' },
  { originaleName: 'code_loca', renamed: 'Code' },
  { originaleName: 'code_national_loca', renamed: 'Code national' },
]

// ─── Constante fieldKeyListe pour Zones ───────────────────────────────────────
export const ZONE_FIELD_KEYS: FieldKey[] = [
  { originaleName: 'nom_zone', renamed: 'Zone' },
  { originaleName: 'code_zone', renamed: 'Code' },
  { originaleName: 'type_zone', renamed: 'Type' },
]

// ─── Loading state ────────────────────────────────────────────────────────────
export type LoadingState = null | 'loading' | 'success' | 'error'
