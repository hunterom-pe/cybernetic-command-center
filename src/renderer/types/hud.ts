export type ColorTheme = 'neon' | 'ember' | 'matrix' | 'amber' | 'chiba' | 'voight-kampff';
export type BannerImage = 'rainy-alley' | 'neo-tokyo' | 'flight-deck';
export type WeatherCity = 'phoenix' | 'nyc' | 'madrid' | 'tokyo' | 'london';

export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

export interface DirectiveItem {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface QuickLink {
  id: string;
  label: string;
  url: string;
  iconName?: string;
  category?: string;
}

export interface HabitItem {
  id: string;
  name: string;
  history: boolean[]; // 7 days: Mon-Sun
}

export interface MilestoneData {
  title: string;
  targetDate: string; // ISO string
}

export interface StockTickerData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sparkline: number[];
}

export interface CryptoTickerData {
  id: string;
  symbol: string;
  name: string;
  priceUsd: number;
  change24hPercent: number;
  high24h: number;
  low24h: number;
  sparkline: number[];
}

export interface WeatherData {
  cityName: string;
  temperatureF: number;
  condition: string;
  highF: number;
  lowF: number;
  humidityPercent: number;
  windSpeedMph: number;
  fiveDayForecast: { day: string; high: number; low: number }[];
}

export interface AppSettings {
  colorTheme: ColorTheme;
  bannerImage: BannerImage;
  isAlwaysOnTop: boolean;
  isFullScreen: boolean;
  use24HourClock: boolean;
  isGridLocked: boolean;
  sfxEnabled: boolean;
  matrixRainEnabled: boolean;
  weatherCity: WeatherCity;
  hiddenWidgets: string[];
}
