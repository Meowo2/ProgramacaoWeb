export interface Continente {
  id: number;
  nome: string;
  descricao?: string | null;
  _count?: { paises: number };
}

export interface Pais {
  id: number;
  nome: string;
  populacao: string | null;
  idioma_oficial: string | null;
  moeda: string | null;
  id_continente: number;
  continente: Continente;
  _count?: { cidades: number };
}

export interface Cidade {
  id: number;
  nome: string;
  populacao: string | null;
  latitude: number | null;
  longitude: number | null;
  id_pais: number;
  pais: Pais;
}

export interface DadosExternos {
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

export interface Clima {
  temperatura: number;
  sensacaoTermica: number;
  descricao: string;
  icone: string;
  iconeUrl: string;
  umidade: number;
  vento: number;
  pressao: number;
}
