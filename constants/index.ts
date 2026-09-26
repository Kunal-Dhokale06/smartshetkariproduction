import { UserProfile, WeatherInfo, OverviewStats } from '../types';

export const APP_CONFIG = {
  appName: 'SmartShetkari',
  version: '1.0.0',
  currencySymbol: '₹',
};

export const INITIAL_USER: UserProfile = {
  name: 'Kunal Dhokale',
  role: 'Owner',
  village: 'Khadakwadi',
  notificationCount: 3,
};

export const INITIAL_WEATHER: WeatherInfo = {
  location: 'Pune, Maharashtra',
  temperature: 28,
  condition: 'Partly Cloudy',
  humidity: 65,
  rainChance: 10,
};

export const INITIAL_OVERVIEW: OverviewStats = {
  totalExpenses: 12450,
  expensesChangePercentage: -8,
  totalSales: 28300,
  salesChangePercentage: 12,
  activeCropsCount: 5,
  estimatedProfit: 15850,
  profitChangePercentage: 15,
};
