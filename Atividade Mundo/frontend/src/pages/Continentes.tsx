import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';
import type { Continente } from '../types/models';

export default function Continentes() {
  const [continentes, setContinentes] = useState<Continente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    carregarContinentes();
  }, []);

  async function carregarContinentes() {
    try {
      const response = await api.get('/continentes');
      setContinentes(response.data);
    } catch (error) {
      toast.error('Erro ao carregar continentes');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    try {
      if (editingId) {
        await api.put(`/continentes/${editingId}`, { nome, descricao });
        toast.success('Continente atualizado!');
      } else {
        await api.post('/continentes', { nome, descricao });
        toast.success('Continente criado!');
      }
      resetForm();
      carregarContinentes();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao salvar continente');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir este continente?')) return;

    try {
      await api.delete(`/continentes/${id}`);
      toast.success('Continente excluído!');
      carregarContinentes();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao excluir continente');
    }
  }

  function handleEdit(continente: Continente) {
    setEditingId(continente.id);
    setNome(continente.nome);
    setDescricao(continente.descricao || '');
    setShowForm(true);
  }

  function resetForm() {
    setEditingId(null);
    setNome('');
    setDescricao('');
    setShowForm(false);
  }

  if (loading) return <Loading />;

  return (
    <div className="page container">
      <div className="page-header">
        <h1>Continentes</h1>
        <button
          className="btn btn-primary"
          onClick={() => { resetForm(); setShowForm(!showForm); }}
        >
          {showForm ? 'Cancelar' : '+ Novo Continente'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nome</label>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: América do Sul"
                />
              </div>
              <div className="form-group">
                <label>Descrição</label>
                <input
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descrição do continente"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                {editingId ? 'Atualizar' : 'Criar'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Países</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {continentes.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: '#888' }}>
                    Nenhum continente cadastrado
                  </td>
                </tr>
              ) : (
                continentes.map((c) => (
                  <tr key={c.id}>
                    <td><strong>{c.nome}</strong></td>
                    <td>{c.descricao || '-'}</td>
                    <td>{c._count?.paises || 0}</td>
                    <td className="actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(c)}>
                        Editar
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
