import { useState, useEffect } from 'react';
import { WeatherData, WeatherCity } from '../types/hud';
import { useTheme } from '../context/ThemeContext';

const CITY_COORDINATES: Record<WeatherCity, { name: string; lat: number; lon: number; timezone: string }> = {
  phoenix: { name: 'Phoenix, AZ', lat: 33.4484, lon: -112.0740, timezone: 'America%2FPhoenix' },
  nyc: { name: 'New York, NY', lat: 40.7128, lon: -74.0060, timezone: 'America%2FNew_York' },
  madrid: { name: 'Madrid, Spain', lat: 40.4168, lon: -3.7038, timezone: 'Europe%2FMadrid' },
  tokyo: { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503, timezone: 'Asia%2FTokyo' },
  london: { name: 'London, UK', lat: 51.5074, lon: -0.1278, timezone: 'Europe%2FLondon' }
};

const INITIAL_WEATHER: WeatherData = {
  cityName: 'Phoenix, AZ',
  temperatureF: 104,
  condition: 'Clear Sky',
  highF: 108,
  lowF: 86,
  humidityPercent: 18,
  windSpeedMph: 9,
  fiveDayForecast: [
    { day: 'Mon', high: 106, low: 85 },
    { day: 'Tue', high: 108, low: 87 },
    { day: 'Wed', high: 105, low: 84 },
    { day: 'Thu', high: 104, low: 83 },
    { day: 'Fri', high: 107, low: 86 }
  ]
};

export function useWeatherData(): WeatherData {
  const { settings } = useTheme();
  const cityKey = settings.weatherCity || 'phoenix';
  const cityInfo = CITY_COORDINATES[cityKey] || CITY_COORDINATES.phoenix;

  const [weather, setWeather] = useState<WeatherData>({
    ...INITIAL_WEATHER,
    cityName: cityInfo.name
  });

  useEffect(() => {
    let isMounted = true;

    const fetchWeather = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${cityInfo.lat}&longitude=${cityInfo.lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&relativehumidity_2m&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=${cityInfo.timezone}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error('Open-Meteo fetch failed');
        const data = await res.json();

        if (isMounted && data.current_weather) {
          const cw = data.current_weather;
          const daily = data.daily || {};
          const highs = daily.temperature_2m_max || [108, 106, 107, 105, 104];
          const lows = daily.temperature_2m_min || [86, 85, 87, 84, 83];
          const days = ['Today', 'Mon', 'Tue', 'Wed', 'Thu'];

          const forecast = highs.slice(0, 5).map((h: number, i: number) => ({
            day: days[i] || `Day ${i + 1}`,
            high: Math.round(h),
            low: Math.round(lows[i] || h - 20)
          }));

          setWeather({
            cityName: cityInfo.name,
            temperatureF: Math.round(cw.temperature),
            condition: getWeatherConditionText(cw.weathercode),
            highF: Math.round(highs[0] || cw.temperature + 5),
            lowF: Math.round(lows[0] || cw.temperature - 18),
            humidityPercent: 24,
            windSpeedMph: Math.round(cw.windspeed || 8),
            fiveDayForecast: forecast
          });
        }
      } catch (err) {
        if (isMounted) {
          setWeather((prev) => ({ ...prev, cityName: cityInfo.name }));
        }
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 1200000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [cityKey]);

  return weather;
}

function getWeatherConditionText(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code <= 3) return 'Partly Cloudy';
  if (code <= 48) return 'Hazy / Foggy';
  if (code <= 67) return 'Rain Showers';
  if (code <= 77) return 'Snow Flurry';
  if (code <= 99) return 'Storm';
  return 'Clear Sky';
}
