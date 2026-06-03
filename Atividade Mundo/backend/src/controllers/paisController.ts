import { Request, Response } from 'express';
import { prisma } from '../server';
import { buscarDadosPais } from '../services/restCountriesService';

export async function listarPaises(req: Request, res: Response) {
  try {
    const { id_continente } = req.query;

    const where = id_continente ? { id_continente: Number(id_continente) } : {};

    const paises = await prisma.pais.findMany({
      where,
      include: {
        continente: true,
        _count: { select: { cidades: true } },
      },
      orderBy: { nome: 'asc' },
    });

    res.json(paises);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar países' });
  }
}

export async function buscarPais(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const pais = await prisma.pais.findUnique({
      where: { id: Number(id) },
      include: {
        continente: true,
        cidades: true,
      },
    });

    if (!pais) {
      return res.status(404).json({ error: 'País não encontrado' });
    }

    res.json(pais);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar país' });
  }
}

export async function criarPais(req: Request, res: Response) {
  try {
    const { nome, populacao, idioma_oficial, moeda, id_continente } = req.body;

    if (!nome || !id_continente) {
      return res.status(400).json({ error: 'Nome e continente são obrigatórios' });
    }

    const continente = await prisma.continente.findUnique({ where: { id: id_continente } });

    if (!continente) {
      return res.status(400).json({ error: 'Continente não encontrado' });
    }

    const pais = await prisma.pais.create({
      data: {
        nome,
        populacao: populacao ? BigInt(populacao) : null,
        idioma_oficial,
        moeda,
        id_continente,
      },
      include: { continente: true },
    });

    res.status(201).json(pais);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'País com este nome já existe neste continente' });
    }
    res.status(500).json({ error: 'Erro ao criar país' });
  }
}

export async function atualizarPais(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { nome, populacao, idioma_oficial, moeda, id_continente } = req.body;

    if (!nome || !id_continente) {
      return res.status(400).json({ error: 'Nome e continente são obrigatórios' });
    }

    const pais = await prisma.pais.update({
      where: { id: Number(id) },
      data: {
        nome,
        populacao: populacao ? BigInt(populacao) : null,
        idioma_oficial,
        moeda,
        id_continente,
      },
      include: { continente: true },
    });

    res.json(pais);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'País não encontrado' });
    }
    res.status(500).json({ error: 'Erro ao atualizar país' });
  }
}

export async function excluirPais(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const cidadesCount = await prisma.cidade.count({ where: { id_pais: Number(id) } });

    if (cidadesCount > 0) {
      return res.status(400).json({ error: 'Não é possível excluir país com cidades associadas' });
    }

    await prisma.pais.delete({ where: { id: Number(id) } });
    res.json({ message: 'País excluído com sucesso' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'País não encontrado' });
    }
    res.status(500).json({ error: 'Erro ao excluir país' });
  }
}

export async function buscarDadosExternosPais(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const pais = await prisma.pais.findUnique({ where: { id: Number(id) } });

    if (!pais) {
      return res.status(404).json({ error: 'País não encontrado' });
    }

    const dados = await buscarDadosPais(pais.nome);

    if (!dados) {
      return res.status(404).json({ error: 'Dados externos não encontrados para este país' });
    }

    res.json(dados);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dados externos do país' });
  }
}
