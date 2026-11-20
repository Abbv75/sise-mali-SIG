import type { NiveauLocalite } from "./niveauLocalite";

export interface LocaliteParent {
  id_loca: number;
  code_loca: string;
  intitule_loca: string;
  code_national_loca?: string;
  shape_file?: string | null;
  longitude_loca?: number | null;
  latitude_loca?: number | null;
  parent_loca?: LocaliteParent | number | null;
  niveau_loca?: NiveauLocalite | number;
}

export interface Localite extends Record<string, unknown> {
  id_loca: number;
  code_loca: string;
  intitule_loca: string;
  code_national_loca: string;
  shape_file?: string | null;
  longitude_loca: number | null;
  latitude_loca: number | null;
  parent_loca: LocaliteParent | number | null;
  niveau_loca: NiveauLocalite | number;
  niveau_label?: string;
  parent_label?: string;
}
