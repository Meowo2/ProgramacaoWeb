import axios from 'axios';

const REST_COUNTRIES_BASE = 'https://restcountries.com/v3.1';
const OPENWEATHER_BASE = 'https://api.openweathermap.org/data/2.5';

// ──────────────────────────────────────────────
// REST Countries API (sem chave - gratuita)
// ──────────────────────────────────────────────

export interface CountryInfo {
  name: { common: string; official: string };
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  languages?: Record<string, string>;
  currencies?: Record<string, { name: string; symbol: string }>;
  flags: { png: string; svg: string; alt?: string };
  coatOfArms?: { png?: string; svg?: string };
  maps?: { googleMaps: string; openStreetMaps: string };
  timezones: string[];
  area: number;
  latlng: [number, number];
}

export const getCountryInfo = async (countryName: string): Promise<CountryInfo | null> => {
  try {
    const response = await axios.get<CountryInfo[]>(
      `${REST_COUNTRIES_BASE}/name/${encodeURIComponent(countryName)}`,
      { params: { fullText: false }, timeout: 8000 }
    );
    return response.data[0] || null;
  } catch {
    return null;
  }
};

export const getAllCountriesByRegion = async (region: string): Promise<CountryInfo[]> => {
  try {
    const response = await axios.get<CountryInfo[]>(
      `${REST_COUNTRIES_BASE}/region/${encodeURIComponent(region)}`,
      { timeout: 8000 }
    );
    return response.data;
  } catch {
    return [];
  }
};

export const getCountryByCode = async (code: string): Promise<CountryInfo | null> => {
  try {
    const response = await axios.get<CountryInfo[]>(
      `${REST_COUNTRIES_BASE}/alpha/${encodeURIComponent(code)}`,
      { timeout: 8000 }
    );
    return response.data[0] || null;
  } catch {
    return null;
  }
};

// ──────────────────────────────────────────────
// OpenWeatherMap API
// ──────────────────────────────────────────────

export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  iconUrl: string;
  windSpeed: number;
  pressure: number;
  visibility: number;
  sunrise: number;
  sunset: number;
  timezone: number;
  coords: { lat: number; lon: number };
}

const formatWeather = (data: Record<string, unknown>): WeatherData => {
  const main = data.main as Record<string, number>;
  const weather = (data.weather as Array<Record<string, string>>)[0];
  const wind = data.wind as Record<string, number>;
  const sys = data.sys as Record<string, unknown>;
  const coord = data.coord as Record<string, number>;

  return {
    city: data.name as string,
    country: sys.country as string,
    temperature: Math.round(main.temp),
    feelsLike: Math.round(main.feels_like),
    humidity: main.humidity,
    description: weather.description,
    icon: weather.icon,
    iconUrl: `https://openweathermap.org/img/wn/${weather.icon}@2x.png`,
    windSpeed: wind.speed,
    pressure: main.pressure,
    visibility: (data.visibility as number) / 1000,
    sunrise: sys.sunrise as number,
    sunset: sys.sunset as number,
    timezone: data.timezone as number,
    coords: { lat: coord.lat, lon: coord.lon },
  };
};

export const getWeatherByCity = async (city: string, country?: string): Promise<WeatherData | null> => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    console.warn('OPENWEATHER_API_KEY não configurada.');
    return null;
  }

  try {
    const q = country ? `${city},${country}` : city;
    const response = await axios.get(`${OPENWEATHER_BASE}/weather`, {
      params: { q, appid: apiKey, units: 'metric', lang: 'pt_br' },
      timeout: 8000,
    });
    return formatWeather(response.data);
  } catch {
    return null;
  }
};

export const getWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData | null> => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    console.warn('OPENWEATHER_API_KEY não configurada.');
    return null;
  }

  try {
    const response = await axios.get(`${OPENWEATHER_BASE}/weather`, {
      params: { lat, lon, appid: apiKey, units: 'metric', lang: 'pt_br' },
      timeout: 8000,
    });
    return formatWeather(response.data);
  } catch {
    return null;
  }
};
