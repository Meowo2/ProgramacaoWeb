import { Router } from 'express';
import {
  listarContinentes,
  buscarContinente,
  criarContinente,
  atualizarContinente,
  excluirContinente,
} from '../controllers/continenteController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', listarContinentes);
router.get('/:id', buscarContinente);
router.post('/', authMiddleware, criarContinente);
router.put('/:id', authMiddleware, atualizarContinente);
router.delete('/:id', authMiddleware, excluirContinente);

export default router;
