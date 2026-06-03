import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';
import { formatPopulacao } from '../utils/format';
import type { Continente, Pais } from '../types/models';

export default function Paises() {
  const navigate = useNavigate();
  const [paises, setPaises] = useState<Pais[]>([]);
  const [continentes, setContinentes] = useState<Continente[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroContinente, setFiltroContinente] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    nome: '',
    populacao: '',
    idioma_oficial: '',
    moeda: '',
    id_continente: '',
  });

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (!loading) carregarPaises();
  }, [filtroContinente]);

  async function carregarDados() {
    try {
      const [paisesRes, continentesRes] = await Promise.all([
        api.get('/paises'),
        api.get('/continentes'),
      ]);
      setPaises(paisesRes.data);
      setContinentes(continentesRes.data);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }

  async function carregarPaises() {
    try {
      const params = filtroContinente ? `?id_continente=${filtroContinente}` : '';
      const response = await api.get(`/paises${params}`);
      setPaises(response.data);
    } catch (error) {
      toast.error('Erro ao carregar países');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome.trim() || !form.id_continente) {
      toast.error('Nome e continente são obrigatórios');
      return;
    }

    try {
      const data = {
        ...form,
        populacao: form.populacao ? Number(form.populacao) : null,
        id_continente: Number(form.id_continente),
      };

      if (editingId) {
        await api.put(`/paises/${editingId}`, data);
        toast.success('País atualizado!');
      } else {
        await api.post('/paises', data);
        toast.success('País criado!');
      }
      resetForm();
      carregarPaises();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao salvar país');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir este país?')) return;

    try {
      await api.delete(`/paises/${id}`);
      toast.success('País excluído!');
      carregarPaises();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao excluir país');
    }
  }

  function handleEdit(pais: Pais) {
    setEditingId(pais.id);
    setForm({
      nome: pais.nome,
      populacao: pais.populacao?.toString() || '',
      idioma_oficial: pais.idioma_oficial || '',
      moeda: pais.moeda || '',
      id_continente: pais.id_continente.toString(),
    });
    setShowForm(true);
  }

  function resetForm() {
    setEditingId(null);
    setForm({ nome: '', populacao: '', idioma_oficial: '', moeda: '', id_continente: '' });
    setShowForm(false);
  }

  if (loading) return <Loading />;

  return (
    <div className="page container">
      <div className="page-header">
        <h1>Países</h1>
        <button
          className="btn btn-primary"
          onClick={() => { resetForm(); setShowForm(!showForm); }}
        >
          {showForm ? 'Cancelar' : '+ Novo País'}
        </button>
      </div>

      <div className="filters">
        <select value={filtroContinente} onChange={(e) => setFiltroContinente(e.target.value)}>
          <option value="">Todos os continentes</option>
          {continentes.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nome</label>
                <input
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Ex: Brasil"
                />
              </div>
              <div className="form-group">
                <label>Continente</label>
                <select
                  value={form.id_continente}
                  onChange={(e) => setForm({ ...form, id_continente: e.target.value })}
                >
                  <option value="">Selecione...</option>
                  {continentes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>População</label>
                <input
                  type="number"
                  value={form.populacao}
                  onChange={(e) => setForm({ ...form, populacao: e.target.value })}
                  placeholder="Ex: 214000000"
                />
              </div>
              <div className="form-group">
                <label>Idioma Oficial</label>
                <input
                  value={form.idioma_oficial}
                  onChange={(e) => setForm({ ...form, idioma_oficial: e.target.value })}
                  placeholder="Ex: Português"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Moeda</label>
              <input
                value={form.moeda}
                onChange={(e) => setForm({ ...form, moeda: e.target.value })}
                placeholder="Ex: Real (BRL)"
              />
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
                <th>Continente</th>
                <th>População</th>
                <th>Idioma</th>
                <th>Moeda</th>
                <th>Cidades</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {paises.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#888' }}>
                    Nenhum país cadastrado
                  </td>
                </tr>
              ) : (
                paises.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.nome}</strong></td>
                    <td>{p.continente.nome}</td>
                    <td>{formatPopulacao(p.populacao)}</td>
                    <td>{p.idioma_oficial || '-'}</td>
                    <td>{p.moeda || '-'}</td>
                    <td>{p._count?.cidades || 0}</td>
                    <td className="actions">
                      <button className="btn btn-primary btn-sm" onClick={() => navigate(`/detalhes/pais/${p.id}`)}>
                        Detalhes
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(p)}>
                        Editar
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>
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
