import { Request, Response, NextFunction } from 'express';
import { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } from 'sequelize';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('[ErrorHandler]', err);

  if (err instanceof ValidationError) {
    res.status(400).json({
      message: 'Erro de validação.',
      errors: err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
    return;
  }

  if (err instanceof UniqueConstraintError) {
    res.status(409).json({
      message: 'Registro já existe com esses dados.',
      errors: err.errors.map((e) => ({
        field: e.path,
        message: `${e.path} já está em uso.`,
      })),
    });
    return;
  }

  if (err instanceof ForeignKeyConstraintError) {
    res.status(400).json({
      message: 'Referência inválida: o registro relacionado não existe ou está em uso.',
    });
    return;
  }

  res.status(500).json({
    message: 'Erro interno do servidor.',
    ...(process.env.NODE_ENV === 'development' && { detail: err.message }),
  });
};
