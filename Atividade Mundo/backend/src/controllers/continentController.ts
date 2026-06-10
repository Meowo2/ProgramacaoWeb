import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { Continent, Country } from '../models';

// GET /continentes
export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const where: Record<string, unknown> = {};
    if (search) {
      where.nome = { [Op.iLike]: `%${search}%` };
    }

    const { count, rows } = await Continent.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [['nome', 'ASC']],
    });

    res.json({
      data: rows,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /continentes/:id
export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const continent = await Continent.findByPk(req.params.id, {
      include: [{ model: Country, as: 'paises', attributes: ['id', 'nome', 'populacao'] }],
    });

    if (!continent) {
      res.status(404).json({ message: 'Continente não encontrado.' });
      return;
    }

    res.json({ data: continent });
  } catch (error) {
    next(error);
  }
};

// POST /continentes
export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { nome, descricao } = req.body;

    if (!nome || !descricao) {
      res.status(400).json({ message: 'Nome e descrição são obrigatórios.' });
      return;
    }

    const continent = await Continent.create({ nome, descricao });
    res.status(201).json({ message: 'Continente criado com sucesso.', data: continent });
  } catch (error) {
    next(error);
  }
};

// PUT /continentes/:id
export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const continent = await Continent.findByPk(req.params.id);

    if (!continent) {
      res.status(404).json({ message: 'Continente não encontrado.' });
      return;
    }

    const { nome, descricao } = req.body;
    await continent.update({ nome, descricao });

    res.json({ message: 'Continente atualizado com sucesso.', data: continent });
  } catch (error) {
    next(error);
  }
};

// DELETE /continentes/:id
export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const continent = await Continent.findByPk(req.params.id);

    if (!continent) {
      res.status(404).json({ message: 'Continente não encontrado.' });
      return;
    }

    // Verifica se há países vinculados
    const countryCount = await Country.count({ where: { id_continente: continent.id } });
    if (countryCount > 0) {
      res.status(400).json({
        message: `Não é possível excluir: existem ${countryCount} país(es) vinculado(s) a este continente.`,
      });
      return;
    }

    await continent.destroy();
    res.json({ message: 'Continente excluído com sucesso.' });
  } catch (error) {
    next(error);
  }
};
