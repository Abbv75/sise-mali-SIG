export interface ZoneCollecte {
  id_zone_collecte: number
  code_zone: string
  nom_zone: string
  shape_file?: string | File | null
  latitude_zone?: number | string | null
  longitude_zone?: number | string | null
  type_zone: string | number
}

export interface ZoneCollecteTable {
  id_zone_collecte: number
  code_zone: string
  nom_zone: string
  shape_file?: string | null
  latitude_zone?: number | string | null
  longitude_zone?: number | string | null
  type_zone: string | number
}

export type ZoneAgroEcologique = ZoneCollecte
export type ZoneAgroEcologiqueTable = ZoneCollecteTable

export interface ZoneCollecteFormProps {
  zoneCollecte: ZoneCollecte
  setZoneCollecte: (value: ZoneCollecte) => void
  isEdit: boolean
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}
