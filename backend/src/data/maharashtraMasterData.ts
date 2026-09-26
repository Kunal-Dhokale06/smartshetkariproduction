import { DistrictModel, MAHARASHTRA_DISTRICTS as DATA } from './locationsData';

export interface VillageSeed {
  nameEn: string;
  nameMr: string;
  nameHi?: string;
}

export interface TalukaSeed {
  nameEn: string;
  nameMr: string;
  nameHi?: string;
  villages?: VillageSeed[];
}

export interface DistrictSeed {
  nameEn: string;
  nameMr: string;
  nameHi?: string;
  talukas: TalukaSeed[];
}

export const MAHARASHTRA_DISTRICTS: DistrictSeed[] = DATA.map((d: DistrictModel) => ({
  nameEn: d.en,
  nameMr: d.mr,
  nameHi: d.hi,
  talukas: d.talukas.map((t) => ({
    nameEn: t.en,
    nameMr: t.mr,
    nameHi: t.hi,
    villages: (t.villages || []).map((v) => ({
      nameEn: v.en,
      nameMr: v.mr,
      nameHi: v.hi,
    })),
  })),
}));
