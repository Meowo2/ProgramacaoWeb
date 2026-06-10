import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';

const generateToken = (id: number, email: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback_secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id, email }, secret, { expiresIn } as jwt.SignOptions);
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
      return;
    }

    if (senha.length < 6) {
      res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres.' });
      return;
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      res.status(409).json({ message: 'E-mail já cadastrado.' });
      return;
    }

    const user = await User.create({ nome, email, senha });
    const token = generateToken(user.id, user.email);

    res.status(201).json({
      message: 'Usuário cadastrado com sucesso.',
      token,
      user: { id: user.id, nome: user.nome, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
      return;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ message: 'Credenciais inválidas.' });
      return;
    }

    const isValid = await user.comparePassword(senha);
    if (!isValid) {
      res.status(401).json({ message: 'Credenciais inválidas.' });
      return;
    }

    const token = generateToken(user.id, user.email);

    res.json({
      message: 'Login realizado com sucesso.',
      token,
      user: { id: user.id, nome: user.nome, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request & { user?: { id: number; email: string } },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findByPk(req.user!.id, {
      attributes: ['id', 'nome', 'email', 'createdAt'],
    });

    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado.' });
      return;
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};
