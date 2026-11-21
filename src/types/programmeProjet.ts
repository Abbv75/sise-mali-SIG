export interface Programme {
  id_programme: number
  code_programme: string
  sigle_programme: string
  nom_programme: string
  vision_programme?: string | null
  objectif_programme?: string | null
  annee_debut_programme?: string | null
  annee_fin_programme?: string | null
  actif_programme: boolean
  id_nbc_programme?: number | null
}

export interface ProjetZoneLoca {
  id_loca: number
  code_loca?: string
  intitule_loca: string
  code_national_loca?: string
  shape_file?: string | null
  longitude_loca?: number | null
  latitude_loca?: number | null
  parent_loca?: {
    id_loca: number
    code_loca?: string
    intitule_loca: string
    code_national_loca?: string
    shape_file?: string | null
    longitude_loca?: number | null
    latitude_loca?: number | null
    niveau_loca?: number
  } | null
  niveau_loca?: {
    id_nlc: number
    nombre_nlc?: number
    libelle_nlc: string
    Code_number_nlc?: string
  } | null
}

export interface ProjetType {
  id_type_projet: number
  code_type_projet: string
  nom_type_projet: string
}

export interface Projet {
  id_projet: number
  code_projet: string
  sigle_projet: string
  intitule_projet: string
  date_cloture_projet?: string | null
  is_cloture?: boolean
  duree_projet?: number | null
  date_signature_projet?: string | null
  date_demarrage_projet?: string | null
  avance_demarrage?: number | null
  date_estimation?: string | null
  recuperation_geolocation?: boolean
  longitude?: number | null
  latitude?: number | null
  logo_projet?: string | null
  is_active?: boolean
  structure_projet?: string | null
  niveau_avancement?: number | null
  etat_financement?: string | null
  secteur_projet?: string | null
  envergure_projet?: string | null
  type_projet?: ProjetType | null
  programme_projet?: Programme | number | null
  zone_projet?: ProjetZoneLoca[]
  budget_projet?: number
  montant_total_decaisse?: number
  nombre_ptbas?: number
  taux_execution_ptba?: number
  [key: string]: any
}
