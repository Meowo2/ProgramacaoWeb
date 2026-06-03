import axios from 'axios';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.OPENWEATHER_API_KEY || '';

export interface WeatherData {
  temperatura: number;
  sensacaoTermica: number;
  descricao: string;
  icone: string;
  iconeUrl: string;
  umidade: number;
  vento: number;
  pressao: number;
}

export async function buscarClima(lat: number, lon: number): Promise<WeatherData | null> {
  if (!API_KEY || API_KEY === 'your-openweathermap-api-key') {
    return null;
  }

  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
        lang: 'pt_br',
      },
    });

    const data = response.data;

    return {
      temperatura: Math.round(data.main.temp),
      sensacaoTermica: Math.round(data.main.feels_like),
      descricao: data.weather[0]?.description || 'N/A',
      icone: data.weather[0]?.icon || '',
      iconeUrl: data.weather[0]?.icon
        ? `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        : '',
      umidade: data.main.humidity,
      vento: Math.round(data.wind.speed * 3.6),
      pressao: data.main.pressure,
    };
  } catch (error) {
    console.error('Erro ao buscar clima:', error);
    return null;
  }
}
