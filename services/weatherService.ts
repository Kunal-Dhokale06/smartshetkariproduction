import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { WeatherInfo } from '../types';

const WEATHER_CACHE_KEY = '@smartshetkari_live_weather_v1';
const OPENWEATHER_API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY || '';

export interface LiveWeatherData extends WeatherInfo {
  isLoading: boolean;
  isLiveGps: boolean;
  windSpeed?: number;
  feelsLike?: number;
  lastUpdated?: string;
  conditionKey?: string;
  error?: string | null;
}

// District coordinates map for high-accuracy localized weather
const MAHARASHTRA_DISTRICT_COORDS: Record<string, { lat: number; lon: number }> = {
  pune: { lat: 18.5204, lon: 73.8567 },
  mumbai: { lat: 19.076, lon: 72.8777 },
  nashik: { lat: 19.9975, lon: 73.7898 },
  ahmednagar: { lat: 19.0948, lon: 74.748 },
  ahilyanagar: { lat: 19.0948, lon: 74.748 },
  kolhapur: { lat: 16.705, lon: 74.2433 },
  solapur: { lat: 17.6599, lon: 75.9064 },
  satara: { lat: 17.6805, lon: 74.0183 },
  sangli: { lat: 16.8524, lon: 74.5815 },
  aurangabad: { lat: 19.8762, lon: 75.3433 },
  sambhajinagar: { lat: 19.8762, lon: 75.3433 },
  jalgaon: { lat: 21.0077, lon: 75.5626 },
  dhule: { lat: 20.9042, lon: 74.7749 },
  nandurbar: { lat: 21.3739, lon: 74.2403 },
  jalna: { lat: 19.8347, lon: 75.8816 },
  beed: { lat: 18.9891, lon: 75.7601 },
  latur: { lat: 18.4088, lon: 76.5604 },
  osmanabad: { lat: 18.1856, lon: 76.0419 },
  dharashiv: { lat: 18.1856, lon: 76.0419 },
  nanded: { lat: 19.1383, lon: 77.321 },
  parbhani: { lat: 19.2611, lon: 76.7767 },
  hingoli: { lat: 19.7196, lon: 77.1477 },
  nagpur: { lat: 21.1458, lon: 79.0882 },
  amravati: { lat: 20.9374, lon: 77.7796 },
  akola: { lat: 20.7002, lon: 77.0082 },
  buldhana: { lat: 20.5312, lon: 76.1847 },
  yavatmal: { lat: 20.3888, lon: 78.1204 },
  wardha: { lat: 20.7453, lon: 78.6022 },
  chandrapur: { lat: 19.9615, lon: 79.2961 },
  gadchiroli: { lat: 20.1849, lon: 80.003 },
  bhandara: { lat: 21.1687, lon: 79.6548 },
  gondia: { lat: 21.4554, lon: 80.1961 },
  thane: { lat: 19.2183, lon: 72.9781 },
  palghar: { lat: 19.6936, lon: 72.7655 },
  raigad: { lat: 18.6414, lon: 72.8722 },
  alibag: { lat: 18.6414, lon: 72.8722 },
  ratnagiri: { lat: 16.9902, lon: 73.312 },
  sindhudurg: { lat: 16.1154, lon: 73.698 },
  baramati: { lat: 18.1517, lon: 74.5771 },
};

function getCoordsFromLocationString(locStr?: string): { lat: number; lon: number; name: string } {
  if (!locStr) return { lat: 18.5204, lon: 73.8567, name: 'Pune, Maharashtra' };
  const lower = locStr.toLowerCase();
  for (const [key, coords] of Object.entries(MAHARASHTRA_DISTRICT_COORDS)) {
    if (lower.includes(key)) {
      const capitalized = key.charAt(0).toUpperCase() + key.slice(1);
      return { lat: coords.lat, lon: coords.lon, name: `${capitalized}, Maharashtra` };
    }
  }
  return { lat: 18.5204, lon: 73.8567, name: locStr };
}

const DEFAULT_WEATHER: LiveWeatherData = {
  location: 'Maharashtra, India',
  temperature: 28,
  condition: 'Sunny',
  conditionKey: 'sunny',
  humidity: 62,
  rainChance: 15,
  isLoading: false,
  isLiveGps: false,
  windSpeed: 12,
  feelsLike: 29,
  error: null,
};

let globalWeatherData: LiveWeatherData = { ...DEFAULT_WEATHER };
const weatherListeners = new Set<() => void>();

function notifyWeatherListeners() {
  weatherListeners.forEach((fn) => fn());
}

// Immediately attempt to hydrate weather from local AsyncStorage
AsyncStorage.getItem(WEATHER_CACHE_KEY).then((cached) => {
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      globalWeatherData = { ...parsed, isLoading: false };
      notifyWeatherListeners();
    } catch {
      /* ignore */
    }
  }
}).catch(() => {});

/**
 * Fetch weather from OpenWeatherMap API using coordinates
 */
async function fetchFromOpenWeather(lat: number, lon: number): Promise<Partial<LiveWeatherData> | null> {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    const res = await fetch(url);
    const data: any = await res.json();

    if (res.ok && data?.main) {
      const rawCondition = data.weather?.[0]?.main || 'Clear';
      let condition = 'Sunny';
      let conditionKey = 'sunny';

      if (rawCondition === 'Clear') {
        condition = 'Clear Sky';
        conditionKey = 'clearSky';
      } else if (rawCondition === 'Clouds') {
        const desc = (data.weather?.[0]?.description || '').toLowerCase();
        if (desc.includes('scattered') || desc.includes('few') || desc.includes('partly')) {
          condition = 'Partly Cloudy';
          conditionKey = 'partlyCloudy';
        } else {
          condition = 'Cloudy';
          conditionKey = 'cloudy';
        }
      } else if (rawCondition === 'Rain') {
        condition = 'Rainy';
        conditionKey = 'rainy';
      } else if (rawCondition === 'Drizzle') {
        condition = 'Light Rain';
        conditionKey = 'lightRain';
      } else if (rawCondition === 'Thunderstorm') {
        condition = 'Thunderstorm';
        conditionKey = 'thunderstorm';
      } else if (rawCondition === 'Fog' || rawCondition === 'Mist') {
        condition = 'Foggy';
        conditionKey = 'foggy';
      } else if (rawCondition === 'Haze') {
        condition = 'Hazy';
        conditionKey = 'hazy';
      }

      const rainChance = data.rain
        ? 85
        : data.clouds?.all
        ? Math.min(90, Math.round(data.clouds.all * 0.7))
        : 10;

      return {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: Math.round(data.main.humidity),
        condition,
        conditionKey,
        rainChance,
        windSpeed: Math.round((data.wind?.speed || 0) * 3.6), // m/s to km/h
        location: data.name ? `${data.name}, Maharashtra` : undefined,
      };
    }
  } catch (err) {
    console.warn('[WeatherService] OpenWeatherMap direct fetch error:', err);
  }
  return null;
}

/**
 * High-accuracy live weather fallback using Open-Meteo
 */
async function fetchFromOpenMeteo(lat: number, lon: number): Promise<Partial<LiveWeatherData> | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=precipitation_probability&forecast_days=1`;
    const res = await fetch(url);
    const data: any = await res.json();

    if (res.ok && data?.current) {
      const code = data.current.weather_code;
      let condition = 'Sunny';
      let conditionKey = 'sunny';

      if (code === 0) {
        condition = 'Clear Sky';
        conditionKey = 'clearSky';
      } else if (code === 1 || code === 2) {
        condition = 'Partly Cloudy';
        conditionKey = 'partlyCloudy';
      } else if (code === 3) {
        condition = 'Cloudy';
        conditionKey = 'cloudy';
      } else if (code >= 45 && code <= 48) {
        condition = 'Foggy';
        conditionKey = 'foggy';
      } else if (code >= 51 && code <= 57) {
        condition = 'Light Rain';
        conditionKey = 'lightRain';
      } else if (code >= 61 && code <= 67) {
        condition = 'Rainy';
        conditionKey = 'rainy';
      } else if (code >= 80 && code <= 82) {
        condition = 'Heavy Rain';
        conditionKey = 'heavyRain';
      } else if (code >= 95) {
        condition = 'Thunderstorm';
        conditionKey = 'thunderstorm';
      }

      const hourlyProb = data.hourly?.precipitation_probability;
      const rainChance =
        Array.isArray(hourlyProb) && hourlyProb.length > 0
          ? Math.max(...hourlyProb.slice(0, 12))
          : data.current.precipitation > 0
          ? 80
          : 15;

      return {
        temperature: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        humidity: Math.round(data.current.relative_humidity_2m),
        condition,
        conditionKey,
        rainChance: Math.round(rainChance),
        windSpeed: Math.round(data.current.wind_speed_10m),
      };
    }
  } catch (err) {
    console.warn('[WeatherService] Open-Meteo fallback fetch error:', err);
  }
  return null;
}

let lastWeatherFetchTime = 0;
const WEATHER_THROTTLE_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Fetch and update live weather by detecting device location or user profile location
 */
export async function refreshLiveWeather(fallbackLocation?: string, force = false): Promise<LiveWeatherData> {
  const now = Date.now();
  if (!force && lastWeatherFetchTime > 0 && now - lastWeatherFetchTime < WEATHER_THROTTLE_MS && !globalWeatherData.error && globalWeatherData.lastUpdated) {
    return globalWeatherData;
  }

  try {
    lastWeatherFetchTime = now;
    globalWeatherData = { ...globalWeatherData, isLoading: true, error: null };
    notifyWeatherListeners();

    const fallback = getCoordsFromLocationString(fallbackLocation);
    let lat = fallback.lat;
    let lon = fallback.lon;
    let detectedLocationName = fallback.name;
    let isLiveGps = false;

    // 1. Request live location permission and get current GPS location
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (position && position.coords) {
          lat = position.coords.latitude;
          lon = position.coords.longitude;
          isLiveGps = true;

          // 2. Reverse geocode to get actual city / village name
          try {
            const geocoded = await Location.reverseGeocodeAsync({
              latitude: lat,
              longitude: lon,
            });

            if (geocoded && geocoded.length > 0) {
              const place = geocoded[0];
              const cityPart = place.city || place.subregion || place.district || place.name;
              const statePart = place.region || 'Maharashtra';
              if (cityPart) {
                detectedLocationName = `${cityPart}, ${statePart}`;
              }
            }
          } catch (geoErr) {
            console.warn('[WeatherService] Reverse geocode warning:', geoErr);
          }
        }
      }
    } catch (locErr) {
      console.warn('[WeatherService] Location permission or GPS warning:', locErr);
    }

    // 3. Try fetching from OpenWeatherMap API
    let weatherResult = await fetchFromOpenWeather(lat, lon);

    // 4. Fallback to Open-Meteo
    if (!weatherResult) {
      weatherResult = await fetchFromOpenMeteo(lat, lon);
    }

    if (weatherResult) {
      globalWeatherData = {
        location: weatherResult.location || detectedLocationName,
        temperature: weatherResult.temperature ?? 28,
        feelsLike: weatherResult.feelsLike ?? weatherResult.temperature ?? 28,
        condition: weatherResult.condition || 'Sunny',
        conditionKey: weatherResult.conditionKey || 'sunny',
        humidity: weatherResult.humidity ?? 60,
        rainChance: weatherResult.rainChance ?? 15,
        windSpeed: weatherResult.windSpeed ?? 10,
        isLoading: false,
        isLiveGps,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        error: null,
      };

      // Cache weather for instant display on next app open
      AsyncStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(globalWeatherData)).catch(() => {});
    } else {
      globalWeatherData = {
        ...globalWeatherData,
        location: detectedLocationName,
        isLoading: false,
        isLiveGps,
      };
    }
  } catch (error: any) {
    console.error('[WeatherService] Failed to update live weather:', error);
    globalWeatherData = {
      ...globalWeatherData,
      isLoading: false,
      error: error?.message || 'Could not fetch weather',
    };
  } finally {
    notifyWeatherListeners();
  }

  return globalWeatherData;
}

/**
 * Initialize weather from cache and trigger live background refresh
 */
export function initLiveWeather() {
  AsyncStorage.getItem(WEATHER_CACHE_KEY)
    .then((cached) => {
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          globalWeatherData = { ...parsed, isLoading: true };
          notifyWeatherListeners();
        } catch {
          /* ignore */
        }
      }
      refreshLiveWeather();
    })
    .catch(() => {
      refreshLiveWeather();
    });
}

/**
 * React Hook for consuming live GPS weather in components
 */
export function useLiveWeather(fallbackLocation?: string) {
  const [weather, setWeather] = useState<LiveWeatherData>(globalWeatherData);

  useEffect(() => {
    const listener = () => setWeather({ ...globalWeatherData });
    weatherListeners.add(listener);

    // Initial non-blocking load in background
    if (!globalWeatherData.lastUpdated) {
      refreshLiveWeather(fallbackLocation).catch(() => {});
    }

    return () => {
      weatherListeners.delete(listener);
    };
  }, [fallbackLocation]);

  return {
    weather,
    refresh: (force = true) => refreshLiveWeather(fallbackLocation, force),
  };
}
