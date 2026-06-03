import { Router } from 'express';
import {
  listarCidades,
  buscarCidade,
  criarCidade,
  atualizarCidade,
  excluirCidade,
  buscarClimaCidade,
} from '../controllers/cidadeController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', listarCidades);
router.get('/:id', buscarCidade);
router.get('/:id/clima', buscarClimaCidade);
router.post('/', authMiddleware, criarCidade);
router.put('/:id', authMiddleware, atualizarCidade);
router.delete('/:id', authMiddleware, excluirCidade);

export default router;
