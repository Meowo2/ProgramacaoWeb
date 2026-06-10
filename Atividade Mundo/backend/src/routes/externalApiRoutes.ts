import { Router } from 'express';
import * as controller from '../controllers/externalApiController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

/**
 * @route  GET /api-externas/pais/:nome
 * @desc   Dados do país via REST Countries (bandeira, mapa, fusos, etc.)
 */
router.get('/pais/:nome', controller.countryInfo);

/**
 * @route  GET /api-externas/validar-cidade?cidade=X&pais=Y
 * @desc   Valida se a cidade informada pertence ao país informado
 */
router.get('/validar-cidade', controller.validateCityCountry);

/**
 * @route  GET /api-externas/sugerir-cidades?cidade=X&id_pais=Y
 * @desc   Lista cidades parecidas para o país informado
 */
router.get('/sugerir-cidades', controller.suggestCities);

/**
 * @route  GET /api-externas/regiao/:regiao
 * @desc   Lista países de uma região (Africa, Americas, Asia, Europe, Oceania)
 */
router.get('/regiao/:regiao', controller.countriesByRegion);

/**
 * @route  GET /api-externas/clima/cidade/:id
 * @desc   Clima atual de uma cidade cadastrada (usa lat/lon do banco)
 */
router.get('/clima/cidade/:id', controller.weatherByCity);

/**
 * @route  GET /api-externas/clima?lat=X&lon=Y
 * @desc   Clima por coordenadas livres
 */
router.get('/clima', controller.weatherByCoords);

/**
 * @route  GET /api-externas/pais-enriquecido/:id
 * @desc   Combina dados do banco + REST Countries + clima em uma só resposta
 */
router.get('/pais-enriquecido/:id', controller.enrichedCountry);

export default router;
