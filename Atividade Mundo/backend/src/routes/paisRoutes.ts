import { Router } from 'express';
import {
  listarPaises,
  buscarPais,
  criarPais,
  atualizarPais,
  excluirPais,
  buscarDadosExternosPais,
} from '../controllers/paisController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', listarPaises);
router.get('/:id', buscarPais);
router.get('/:id/dados-externos', buscarDadosExternosPais);
router.post('/', authMiddleware, criarPais);
router.put('/:id', authMiddleware, atualizarPais);
router.delete('/:id', authMiddleware, excluirPais);

export default router;
