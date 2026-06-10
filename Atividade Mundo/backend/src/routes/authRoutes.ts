import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { authenticate } from '../middlewares/auth';

const router = Router();

/**
 * @route  POST /auth/register
 * @desc   Cadastrar novo usuário
 * @access Público
 */
router.post('/register', register);

/**
 * @route  POST /auth/login
 * @desc   Login e geração de token JWT
 * @access Público
 */
router.post('/login', login);

/**
 * @route  GET /auth/me
 * @desc   Retorna dados do usuário autenticado
 * @access Privado
 */
router.get('/me', authenticate, getMe);

export default router;
