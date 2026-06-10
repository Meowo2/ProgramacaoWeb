import { Router } from 'express';
import * as controller from '../controllers/continentController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Todas as rotas exigem autenticação
router.use(authenticate);

/**
 * @route  GET /continentes
 * @desc   Lista todos os continentes (paginado, filtro por nome)
 * @query  page, limit, search
 */
router.get('/', controller.getAll);

/**
 * @route  GET /continentes/:id
 * @desc   Busca continente por ID (inclui lista de países)
 */
router.get('/:id', controller.getById);

/**
 * @route  POST /continentes
 * @desc   Cria um novo continente
 * @body   { nome, descricao }
 */
router.post('/', controller.create);

/**
 * @route  PUT /continentes/:id
 * @desc   Atualiza um continente
 * @body   { nome?, descricao? }
 */
router.put('/:id', controller.update);

/**
 * @route  DELETE /continentes/:id
 * @desc   Remove um continente (só se não houver países vinculados)
 */
router.delete('/:id', controller.remove);

export default router;
