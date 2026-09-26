export type CropStatus = 'Growing' | 'Harvested';

export interface Crop {
  id: string;
  name: string;
  sowingDate: string;
  area: string;
  status: CropStatus;
  iconName: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: 'Fertilizer' | 'Seeds' | 'Pesticide' | 'Labor' | 'Irrigation' | 'Other';
  date: string;
  crop?: string;
  cropId?: string;
}

export interface Sale {
  id: string;
  cropName: string;
  cropId?: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  marketName: string;
  totalAmount: number;
  date: string;
}

export interface DiaryNote {
  id: string;
  content: string;
  crop: 'Wheat' | 'Cotton' | 'Sugarcane' | 'Tomato' | 'Onion' | 'General' | string;
  date: string;
  source: 'voice' | 'text';
  createdAt: number;
}

export interface WeatherInfo {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  rainChance: number;
}

export interface OverviewStats {
  totalExpenses: number;
  expensesChangePercentage: number;
  totalSales: number;
  salesChangePercentage: number;
  activeCropsCount: number;
  estimatedProfit: number;
  profitChangePercentage: number;
}

export interface UserProfile {
  name: string;
  role: string;
  village: string;
  notificationCount: number;
  avatarUrl?: string;
}

export interface AIPromptSuggestion {
  id: string;
  text: string;
}
