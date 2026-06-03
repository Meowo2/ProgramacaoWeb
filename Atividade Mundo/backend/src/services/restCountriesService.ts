import axios from 'axios';

const BASE_URL = 'https://restcountries.com/v3.1';

export interface CountryData {
  name: string;
  flag: string;
  flagUrl: string;
  capital: string;
  region: string;
  subregion: string;
  population: number;
  languages: string[];
  currencies: { name: string; symbol: string }[];
  timezones: string[];
  coatOfArms: string;
}

export async function buscarDadosPais(nomePais: string): Promise<CountryData | null> {
  try {
    const response = await axios.get(`${BASE_URL}/name/${encodeURIComponent(nomePais)}?fullText=false`);
    const data = response.data[0];

    if (!data) return null;

    return {
      name: data.name?.common || nomePais,
      flag: data.flag || '',
      flagUrl: data.flags?.png || data.flags?.svg || '',
      capital: data.capital?.[0] || 'N/A',
      region: data.region || 'N/A',
      subregion: data.subregion || 'N/A',
      population: data.population || 0,
      languages: data.languages ? Object.values(data.languages) as string[] : [],
      currencies: data.currencies
        ? Object.values(data.currencies).map((c: any) => ({
            name: c.name || 'N/A',
            symbol: c.symbol || '',
          }))
        : [],
      timezones: data.timezones || [],
      coatOfArms: data.coatOfArms?.png || '',
    };
  } catch (error) {
    console.error(`Erro ao buscar dados do país ${nomePais}:`, error);
    return null;
  }
}
