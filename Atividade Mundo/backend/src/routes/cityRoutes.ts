import { Router } from 'express';
import * as controller from '../controllers/cityController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

/**
 * @route  GET /cidades
 * @desc   Lista todas as cidades (paginado)
 * @query  page, limit, search, id_pais, id_continente
 */
router.get('/', controller.getAll);

/**
 * @route  GET /cidades/:id
 * @desc   Busca cidade por ID (inclui país e continente)
 */
router.get('/:id', controller.getById);

/**
 * @route  POST /cidades
 * @desc   Cria uma nova cidade
 * @body   { nome, populacao, latitude, longitude, id_pais }
 */
router.post('/', controller.create);

/**
 * @route  PUT /cidades/:id
 * @desc   Atualiza uma cidade
 */
router.put('/:id', controller.update);

/**
 * @route  DELETE /cidades/:id
 * @desc   Remove uma cidade
 */
router.delete('/:id', controller.remove);

export default router;
