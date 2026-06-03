import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';
import { formatPopulacao } from '../utils/format';
import type { Continente, Pais, Cidade } from '../types/models';

export default function Cidades() {
  const navigate = useNavigate();
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [paises, setPaises] = useState<Pais[]>([]);
  const [continentes, setContinentes] = useState<Continente[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroPais, setFiltroPais] = useState('');
  const [filtroContinente, setFiltroContinente] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    nome: '',
    populacao: '',
    latitude: '',
    longitude: '',
    id_pais: '',
  });

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (!loading) carregarCidades();
  }, [filtroPais, filtroContinente]);

  async function carregarDados() {
    try {
      const [cidadesRes, paisesRes, continentesRes] = await Promise.all([
        api.get('/cidades'),
        api.get('/paises'),
        api.get('/continentes'),
      ]);
      setCidades(cidadesRes.data);
      setPaises(paisesRes.data);
      setContinentes(continentesRes.data);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }

  async function carregarCidades() {
    try {
      const params = new URLSearchParams();
      if (filtroPais) params.append('id_pais', filtroPais);
      if (filtroContinente) params.append('id_continente', filtroContinente);
      const query = params.toString() ? `?${params.toString()}` : '';
      const response = await api.get(`/cidades${query}`);
      setCidades(response.data);
    } catch (error) {
      toast.error('Erro ao carregar cidades');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome.trim() || !form.id_pais) {
      toast.error('Nome e país são obrigatórios');
      return;
    }

    try {
      const data = {
        nome: form.nome,
        populacao: form.populacao ? Number(form.populacao) : null,
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
        id_pais: Number(form.id_pais),
      };

      if (editingId) {
        await api.put(`/cidades/${editingId}`, data);
        toast.success('Cidade atualizada!');
      } else {
        await api.post('/cidades', data);
        toast.success('Cidade criada!');
      }
      resetForm();
      carregarCidades();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao salvar cidade');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir esta cidade?')) return;

    try {
      await api.delete(`/cidades/${id}`);
      toast.success('Cidade excluída!');
      carregarCidades();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao excluir cidade');
    }
  }

  function handleEdit(cidade: Cidade) {
    setEditingId(cidade.id);
    setForm({
      nome: cidade.nome,
      populacao: cidade.populacao?.toString() || '',
      latitude: cidade.latitude?.toString() || '',
      longitude: cidade.longitude?.toString() || '',
      id_pais: cidade.id_pais.toString(),
    });
    setShowForm(true);
  }

  function resetForm() {
    setEditingId(null);
    setForm({ nome: '', populacao: '', latitude: '', longitude: '', id_pais: '' });
    setShowForm(false);
  }

  if (loading) return <Loading />;

  return (
    <div className="page container">
      <div className="page-header">
        <h1>Cidades</h1>
        <button
          className="btn btn-primary"
          onClick={() => { resetForm(); setShowForm(!showForm); }}
        >
          {showForm ? 'Cancelar' : '+ Nova Cidade'}
        </button>
      </div>

      <div className="filters">
        <select value={filtroContinente} onChange={(e) => { setFiltroContinente(e.target.value); setFiltroPais(''); }}>
          <option value="">Todos os continentes</option>
          {continentes.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
        <select value={filtroPais} onChange={(e) => setFiltroPais(e.target.value)}>
          <option value="">Todos os países</option>
          {paises
            .filter((p) => !filtroContinente || p.id_continente === Number(filtroContinente))
            .map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
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
                  placeholder="Ex: São Paulo"
                />
              </div>
              <div className="form-group">
                <label>País</label>
                <select
                  value={form.id_pais}
                  onChange={(e) => setForm({ ...form, id_pais: e.target.value })}
                >
                  <option value="">Selecione...</option>
                  {paises.map((p) => (
                    <option key={p.id} value={p.id}>{p.nome} ({p.continente.nome})</option>
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
                  placeholder="Ex: 12300000"
                />
              </div>
              <div className="form-group">
                <label>Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                  placeholder="Ex: -23.5505"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Longitude</label>
              <input
                type="number"
                step="any"
                value={form.longitude}
                onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                placeholder="Ex: -46.6333"
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
                <th>País</th>
                <th>Continente</th>
                <th>População</th>
                <th>Coordenadas</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {cidades.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#888' }}>
                    Nenhuma cidade cadastrada
                  </td>
                </tr>
              ) : (
                cidades.map((c) => (
                  <tr key={c.id}>
                    <td><strong>{c.nome}</strong></td>
                    <td>{c.pais.nome}</td>
                    <td>{c.pais.continente.nome}</td>
                    <td>{formatPopulacao(c.populacao)}</td>
                    <td>
                      {c.latitude && c.longitude
                        ? `${c.latitude.toFixed(4)}, ${c.longitude.toFixed(4)}`
                        : '-'}
                    </td>
                    <td className="actions">
                      <button className="btn btn-primary btn-sm" onClick={() => navigate(`/detalhes/cidade/${c.id}`)}>
                        Detalhes
                      </button>
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
