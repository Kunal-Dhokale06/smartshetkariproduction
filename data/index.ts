import { Crop, Expense, AIPromptSuggestion } from '../types';

export const MOCK_CROPS: Crop[] = [
  {
    id: 'c1',
    name: 'Wheat',
    sowingDate: '10 Jan 2024',
    area: '2 Acre',
    status: 'Growing',
    iconName: 'wheat',
  },
  {
    id: 'c2',
    name: 'Cotton',
    sowingDate: '05 Dec 2023',
    area: '1.5 Acre',
    status: 'Growing',
    iconName: 'flower-2',
  },
  {
    id: 'c3',
    name: 'Sugarcane',
    sowingDate: '15 Nov 2023',
    area: '3 Acre',
    status: 'Growing',
    iconName: 'tree-deciduous',
  },
  {
    id: 'c4',
    name: 'Tomato',
    sowingDate: '01 Feb 2024',
    area: '0.5 Acre',
    status: 'Harvested',
    iconName: 'apple',
  },
];

export const MOCK_EXPENSES: Expense[] = [
  {
    id: 'e1',
    title: 'Fertilizer (DAP)',
    amount: 1450,
    category: 'Fertilizer',
    date: '14 May 2024',
    crop: 'Wheat',
  },
  {
    id: 'e2',
    title: 'Seeds (Cotton)',
    amount: 850,
    category: 'Seeds',
    date: '12 May 2024',
    crop: 'Cotton',
  },
  {
    id: 'e3',
    title: 'Pesticide',
    amount: 250,
    category: 'Pesticide',
    date: '10 May 2024',
    crop: 'Cotton',
  },
  {
    id: 'e4',
    title: 'Labor Charges',
    amount: 2000,
    category: 'Labor',
    date: '08 May 2024',
    crop: 'Sugarcane',
  },
  {
    id: 'e5',
    title: 'Irrigation',
    amount: 600,
    category: 'Irrigation',
    date: '05 May 2024',
    crop: 'Wheat',
  },
];

export const MOCK_AI_PROMPTS: AIPromptSuggestion[] = [
  { id: 'p1', text: 'Which crop is best for this season?' },
  { id: 'p2', text: 'How to control aphids in cotton?' },
  { id: 'p3', text: 'Show me government schemes' },
  { id: 'p4', text: 'Fertilizer recommendation' },
  { id: 'p5', text: 'Soil health improvement tips' },
];

export * from './maharashtraLocations';

