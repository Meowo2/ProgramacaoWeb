import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { Country, Continent, City } from '../models';

// GET /paises
export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 10, search, id_continente } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const where: Record<string, unknown> = {};
    if (search) where.nome = { [Op.iLike]: `%${search}%` };
    if (id_continente) where.id_continente = id_continente;

    const { count, rows } = await Country.findAndCountAll({
      where,
      include: [{ model: Continent, as: 'continente', attributes: ['id', 'nome'] }],
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

// GET /paises/:id
export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const country = await Country.findByPk(req.params.id, {
      include: [
        { model: Continent, as: 'continente' },
        { model: City, as: 'cidades', attributes: ['id', 'nome', 'populacao'] },
      ],
    });

    if (!country) {
      res.status(404).json({ message: 'País não encontrado.' });
      return;
    }

    res.json({ data: country });
  } catch (error) {
    next(error);
  }
};

// POST /paises
export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { nome, populacao, idioma_oficial, moeda, id_continente } = req.body;

    if (!nome || !populacao || !idioma_oficial || !moeda || !id_continente) {
      res.status(400).json({
        message: 'nome, populacao, idioma_oficial, moeda e id_continente são obrigatórios.',
      });
      return;
    }

    const continent = await Continent.findByPk(id_continente);
    if (!continent) {
      res.status(404).json({ message: 'Continente não encontrado.' });
      return;
    }

    const country = await Country.create({ nome, populacao, idioma_oficial, moeda, id_continente });

    const created = await Country.findByPk(country.id, {
      include: [{ model: Continent, as: 'continente' }],
    });

    res.status(201).json({ message: 'País criado com sucesso.', data: created });
  } catch (error) {
    next(error);
  }
};

// PUT /paises/:id
export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const country = await Country.findByPk(req.params.id);

    if (!country) {
      res.status(404).json({ message: 'País não encontrado.' });
      return;
    }

    const { nome, populacao, idioma_oficial, moeda, id_continente } = req.body;

    if (id_continente) {
      const continent = await Continent.findByPk(id_continente);
      if (!continent) {
        res.status(404).json({ message: 'Continente não encontrado.' });
        return;
      }
    }

    await country.update({ nome, populacao, idioma_oficial, moeda, id_continente });

    const updated = await Country.findByPk(country.id, {
      include: [{ model: Continent, as: 'continente' }],
    });

    res.json({ message: 'País atualizado com sucesso.', data: updated });
  } catch (error) {
    next(error);
  }
};

// DELETE /paises/:id
export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const country = await Country.findByPk(req.params.id);

    if (!country) {
      res.status(404).json({ message: 'País não encontrado.' });
      return;
    }

    const cityCount = await City.count({ where: { id_pais: country.id } });
    if (cityCount > 0) {
      res.status(400).json({
        message: `Não é possível excluir: existem ${cityCount} cidade(s) vinculada(s) a este país.`,
      });
      return;
    }

    await country.destroy();
    res.json({ message: 'País excluído com sucesso.' });
  } catch (error) {
    next(error);
  }
};
