import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';

interface JwtPayload {
  id: number;
  email: string;
}

export interface AuthRequest extends Request {
  user?: { id: number; email: string };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Token de autenticação não fornecido.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'fallback_secret';

    const decoded = jwt.verify(token, secret) as JwtPayload;

    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'email'],
    });

    if (!user) {
      res.status(401).json({ message: 'Usuário não encontrado.' });
      return;
    }

    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expirado.' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Token inválido.' });
    } else {
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
};
