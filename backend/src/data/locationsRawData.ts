export interface MultiLangName {
  id: string;
  en: string;
  mr: string;
  hi: string;
}

export interface VillageModel extends MultiLangName {}

export interface TalukaModel extends MultiLangName {
  villages: VillageModel[];
}

export interface DistrictModel extends MultiLangName {
  talukas: TalukaModel[];
}

// Re-export or read direct raw structure
export const ALL_STATES: MultiLangName[] = [
  { id: 'MH', en: 'Maharashtra', mr: 'महाराष्ट्र', hi: 'महाराष्ट्र' },
  { id: 'GJ', en: 'Gujarat', mr: 'गुजरात', hi: 'गुजरात' },
  { id: 'KA', en: 'Karnataka', mr: 'कर्नाटक', hi: 'कर्नाटक' },
  { id: 'MP', en: 'Madhya Pradesh', mr: 'मध्य प्रदेश', hi: 'मध्य प्रदेश' },
  { id: 'RJ', en: 'Rajasthan', mr: 'राजस्थान', hi: 'राजस्थान' },
];
