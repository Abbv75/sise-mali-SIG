import type { Localite } from './localite'

export interface Ugl {
  id_ugl: number
  code_ugl: string
  nom_ugl: string
  abrege_ugl: string
  couleur_ugl: string
  chef_lieu_ugl: Localite | null
  region_concerne_ugl: Localite[]
}
