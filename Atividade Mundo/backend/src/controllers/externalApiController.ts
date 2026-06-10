import { Request, Response, NextFunction } from 'express';
import { City, Country } from '../models';
import {
  getCountryInfo,
  getAllCountriesByRegion,
  getWeatherByCity,
  getWeatherByCoords,
} from '../services/externalApiService';

// GET /api-externas/pais/:nome
// Retorna dados complementares do REST Countries
export const countryInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { nome } = req.params;
    const data = await getCountryInfo(nome);

    if (!data) {
      res.status(404).json({ message: `País "${nome}" não encontrado na API externa.` });
      return;
    }

    res.json({ data });
  } catch (error) {
    next(error);
  }
};

// GET /api-externas/regiao/:regiao
// Lista países de uma região pelo REST Countries
export const countriesByRegion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { regiao } = req.params;
    const data = await getAllCountriesByRegion(regiao);

    if (!data.length) {
      res.status(404).json({ message: `Nenhum país encontrado para a região "${regiao}".` });
      return;
    }

    // Retorna apenas os campos mais relevantes
    const simplified = data.map((c) => ({
      nome: c.name.common,
      nomeOficial: c.name.official,
      capital: c.capital?.[0],
      populacao: c.population,
      bandeira: c.flags.png,
      area: c.area,
    }));

    res.json({ data: simplified, total: simplified.length });
  } catch (error) {
    next(error);
  }
};

// GET /api-externas/clima/cidade/:id
// Retorna o clima atual de uma cidade cadastrada (por coordenadas)
export const weatherByCity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const city = await City.findByPk(req.params.id, {
      include: [{ model: Country, as: 'pais', attributes: ['nome'] }],
    });

    if (!city) {
      res.status(404).json({ message: 'Cidade não encontrada.' });
      return;
    }

    const weather = await getWeatherByCoords(city.latitude, city.longitude);

    if (!weather) {
      res.status(503).json({
        message: 'Serviço de clima indisponível. Verifique a chave OPENWEATHER_API_KEY.',
      });
      return;
    }

    res.json({
      cidade: { id: city.id, nome: city.nome, lat: city.latitude, lon: city.longitude },
      clima: weather,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api-externas/clima?lat=X&lon=Y
// Retorna clima por coordenadas livres
export const weatherByCoords = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      res.status(400).json({ message: 'Parâmetros lat e lon são obrigatórios.' });
      return;
    }

    const weather = await getWeatherByCoords(Number(lat), Number(lon));

    if (!weather) {
      res.status(503).json({ message: 'Serviço de clima indisponível.' });
      return;
    }

    res.json({ data: weather });
  } catch (error) {
    next(error);
  }
};

// GET /api-externas/pais-enriquecido/:id
// Combina dados do banco com REST Countries e clima da capital
export const enrichedCountry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const country = await Country.findByPk(req.params.id);

    if (!country) {
      res.status(404).json({ message: 'País não encontrado.' });
      return;
    }

    // Busca em paralelo: info do país + clima da capital
    const [countryInfo, capitalWeather] = await Promise.allSettled([
      getCountryInfo(country.nome),
      getWeatherByCity(country.nome),
    ]);

    const externalInfo = countryInfo.status === 'fulfilled' ? countryInfo.value : null;
    const weatherInfo = capitalWeather.status === 'fulfilled' ? capitalWeather.value : null;

    res.json({
      data: {
        ...country.toJSON(),
        dadosExternos: externalInfo
          ? {
              nomeOficial: externalInfo.name.official,
              capital: externalInfo.capital?.[0],
              bandeira: externalInfo.flags,
              escudoDeArmas: externalInfo.coatOfArms,
              mapas: externalInfo.maps,
              fusoHorario: externalInfo.timezones,
              area: externalInfo.area,
              subRegiao: externalInfo.subregion,
            }
          : null,
        clima: weatherInfo,
      },
    });
  } catch (error) {
    next(error);
  }
};
