import { Request, Response } from 'express';
import { prisma } from '../server';
import { buscarClima } from '../services/openWeatherService';

export async function listarCidades(req: Request, res: Response) {
  try {
    const { id_pais, id_continente } = req.query;

    let where: any = {};

    if (id_pais) {
      where.id_pais = Number(id_pais);
    }

    if (id_continente) {
      where.pais = { id_continente: Number(id_continente) };
    }

    const cidades = await prisma.cidade.findMany({
      where,
      include: {
        pais: {
          include: { continente: true },
        },
      },
      orderBy: { nome: 'asc' },
    });

    res.json(cidades);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar cidades' });
  }
}

export async function buscarCidade(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const cidade = await prisma.cidade.findUnique({
      where: { id: Number(id) },
      include: {
        pais: {
          include: { continente: true },
        },
      },
    });

    if (!cidade) {
      return res.status(404).json({ error: 'Cidade não encontrada' });
    }

    res.json(cidade);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar cidade' });
  }
}

export async function criarCidade(req: Request, res: Response) {
  try {
    const { nome, populacao, latitude, longitude, id_pais } = req.body;

    if (!nome || !id_pais) {
      return res.status(400).json({ error: 'Nome e país são obrigatórios' });
    }

    const pais = await prisma.pais.findUnique({ where: { id: id_pais } });

    if (!pais) {
      return res.status(400).json({ error: 'País não encontrado' });
    }

    const cidade = await prisma.cidade.create({
      data: {
        nome,
        populacao: populacao ? BigInt(populacao) : null,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        id_pais,
      },
      include: {
        pais: { include: { continente: true } },
      },
    });

    res.status(201).json(cidade);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Cidade com este nome já existe neste país' });
    }
    res.status(500).json({ error: 'Erro ao criar cidade' });
  }
}

export async function atualizarCidade(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { nome, populacao, latitude, longitude, id_pais } = req.body;

    if (!nome || !id_pais) {
      return res.status(400).json({ error: 'Nome e país são obrigatórios' });
    }

    const cidade = await prisma.cidade.update({
      where: { id: Number(id) },
      data: {
        nome,
        populacao: populacao ? BigInt(populacao) : null,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        id_pais,
      },
      include: {
        pais: { include: { continente: true } },
      },
    });

    res.json(cidade);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Cidade não encontrada' });
    }
    res.status(500).json({ error: 'Erro ao atualizar cidade' });
  }
}

export async function excluirCidade(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await prisma.cidade.delete({ where: { id: Number(id) } });
    res.json({ message: 'Cidade excluída com sucesso' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Cidade não encontrada' });
    }
    res.status(500).json({ error: 'Erro ao excluir cidade' });
  }
}

export async function buscarClimaCidade(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const cidade = await prisma.cidade.findUnique({ where: { id: Number(id) } });

    if (!cidade) {
      return res.status(404).json({ error: 'Cidade não encontrada' });
    }

    if (!cidade.latitude || !cidade.longitude) {
      return res.status(400).json({ error: 'Cidade não possui coordenadas cadastradas' });
    }

    const clima = await buscarClima(cidade.latitude, cidade.longitude);

    if (!clima) {
      return res.status(404).json({ error: 'Dados de clima não disponíveis. Verifique a chave da API OpenWeatherMap.' });
    }

    res.json(clima);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar clima da cidade' });
  }
}
