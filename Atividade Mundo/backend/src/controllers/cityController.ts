import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { City, Country, Continent } from '../models';

const cityWithRelations = {
  include: [
    {
      model: Country,
      as: 'pais',
      attributes: ['id', 'nome', 'moeda', 'idioma_oficial'],
      include: [
        { model: Continent, as: 'continente', attributes: ['id', 'nome'] },
      ],
    },
  ],
};

// GET /cidades
export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 10, search, id_pais, id_continente } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const cityWhere: Record<string, unknown> = {};
    if (search) cityWhere.nome = { [Op.iLike]: `%${search}%` };
    if (id_pais) cityWhere.id_pais = id_pais;

    const countryWhere: Record<string, unknown> = {};
    if (id_continente) countryWhere.id_continente = id_continente;

    const { count, rows } = await City.findAndCountAll({
      where: cityWhere,
      include: [
        {
          model: Country,
          as: 'pais',
          attributes: ['id', 'nome', 'moeda', 'idioma_oficial'],
          where: Object.keys(countryWhere).length > 0 ? countryWhere : undefined,
          required: Object.keys(countryWhere).length > 0,
          include: [
            { model: Continent, as: 'continente', attributes: ['id', 'nome'] },
          ],
        },
      ],
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

// GET /cidades/:id
export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const city = await City.findByPk(req.params.id, cityWithRelations as object);

    if (!city) {
      res.status(404).json({ message: 'Cidade não encontrada.' });
      return;
    }

    res.json({ data: city });
  } catch (error) {
    next(error);
  }
};

// POST /cidades
export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { nome, populacao, latitude, longitude, id_pais } = req.body;

    if (!nome || populacao === undefined || latitude === undefined || longitude === undefined || !id_pais) {
      res.status(400).json({
        message: 'nome, populacao, latitude, longitude e id_pais são obrigatórios.',
      });
      return;
    }

    const country = await Country.findByPk(id_pais);
    if (!country) {
      res.status(404).json({ message: 'País não encontrado.' });
      return;
    }

    const city = await City.create({ nome, populacao, latitude, longitude, id_pais });

    const created = await City.findByPk(city.id, cityWithRelations as object);
    res.status(201).json({ message: 'Cidade criada com sucesso.', data: created });
  } catch (error) {
    next(error);
  }
};

// PUT /cidades/:id
export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const city = await City.findByPk(req.params.id);

    if (!city) {
      res.status(404).json({ message: 'Cidade não encontrada.' });
      return;
    }

    const { nome, populacao, latitude, longitude, id_pais } = req.body;

    if (id_pais) {
      const country = await Country.findByPk(id_pais);
      if (!country) {
        res.status(404).json({ message: 'País não encontrado.' });
        return;
      }
    }

    await city.update({ nome, populacao, latitude, longitude, id_pais });

    const updated = await City.findByPk(city.id, cityWithRelations as object);
    res.json({ message: 'Cidade atualizada com sucesso.', data: updated });
  } catch (error) {
    next(error);
  }
};

// DELETE /cidades/:id
export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const city = await City.findByPk(req.params.id);

    if (!city) {
      res.status(404).json({ message: 'Cidade não encontrada.' });
      return;
    }

    await city.destroy();
    res.json({ message: 'Cidade excluída com sucesso.' });
  } catch (error) {
    next(error);
  }
};
