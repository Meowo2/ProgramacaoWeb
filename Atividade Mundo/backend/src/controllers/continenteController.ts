import { Request, Response } from 'express';
import { prisma } from '../server';

export async function listarContinentes(_req: Request, res: Response) {
  try {
    const continentes = await prisma.continente.findMany({
      include: { _count: { select: { paises: true } } },
      orderBy: { nome: 'asc' },
    });
    res.json(continentes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar continentes' });
  }
}

export async function buscarContinente(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const continente = await prisma.continente.findUnique({
      where: { id: Number(id) },
      include: { paises: true },
    });

    if (!continente) {
      return res.status(404).json({ error: 'Continente não encontrado' });
    }

    res.json(continente);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar continente' });
  }
}

export async function criarContinente(req: Request, res: Response) {
  try {
    const { nome, descricao } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    const continente = await prisma.continente.create({
      data: { nome, descricao },
    });

    res.status(201).json(continente);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Continente com este nome já existe' });
    }
    res.status(500).json({ error: 'Erro ao criar continente' });
  }
}

export async function atualizarContinente(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { nome, descricao } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    const continente = await prisma.continente.update({
      where: { id: Number(id) },
      data: { nome, descricao },
    });

    res.json(continente);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Continente não encontrado' });
    }
    res.status(500).json({ error: 'Erro ao atualizar continente' });
  }
}

export async function excluirContinente(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const paisesCount = await prisma.pais.count({ where: { id_continente: Number(id) } });

    if (paisesCount > 0) {
      return res.status(400).json({ error: 'Não é possível excluir continente com países associados' });
    }

    await prisma.continente.delete({ where: { id: Number(id) } });
    res.json({ message: 'Continente excluído com sucesso' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Continente não encontrado' });
    }
    res.status(500).json({ error: 'Erro ao excluir continente' });
  }
}
