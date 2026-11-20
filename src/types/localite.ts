import type { NiveauLocalite } from "./niveauLocalite";

export interface Localite extends Record<string, unknown> {
  id_loca: number;
  code_loca: string;
  intitule_loca: string;
  code_national_loca: string;
  parent_loca: number | null;
  niveau_loca: NiveauLocalite | number;
  latitude_loca: number | null;
  longitude_loca: number | null;
}
