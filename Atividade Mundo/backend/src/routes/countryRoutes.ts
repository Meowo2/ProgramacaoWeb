import { Router } from 'express';
import * as controller from '../controllers/countryController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

/**
 * @route  GET /paises
 * @desc   Lista todos os países (paginado)
 * @query  page, limit, search, id_continente
 */
router.get('/', controller.getAll);

/**
 * @route  GET /paises/:id
 * @desc   Busca país por ID (inclui continente e cidades)
 */
router.get('/:id', controller.getById);

/**
 * @route  POST /paises
 * @desc   Cria um novo país
 * @body   { nome, populacao, idioma_oficial, moeda, id_continente }
 */
router.post('/', controller.create);

/**
 * @route  PUT /paises/:id
 * @desc   Atualiza um país
 */
router.put('/:id', controller.update);

/**
 * @route  DELETE /paises/:id
 * @desc   Remove um país (só se não houver cidades vinculadas)
 */
router.delete('/:id', controller.remove);

export default router;
