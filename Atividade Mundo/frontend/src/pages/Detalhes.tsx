import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';
import { formatPopulacao } from '../utils/format';
import type { DadosExternos, Clima } from '../types/models';

interface PaisDetalhes {
  id: number;
  nome: string;
  populacao: string | null;
  idioma_oficial: string | null;
  moeda: string | null;
  continente: { id: number; nome: string };
  cidades: { id: number; nome: string; populacao: string | null; latitude: number | null; longitude: number | null }[];
}

interface CidadeDetalhes {
  id: number;
  nome: string;
  populacao: string | null;
  latitude: number | null;
  longitude: number | null;
  pais: {
    id: number;
    nome: string;
    continente: { id: number; nome: string };
  };
}

type Props = { tipo: 'pais' | 'cidade' };

export default function Detalhes({ tipo }: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pais, setPais] = useState<PaisDetalhes | null>(null);
  const [cidade, setCidade] = useState<CidadeDetalhes | null>(null);
  const [dadosExternos, setDadosExternos] = useState<DadosExternos | null>(null);
  const [clima, setClima] = useState<Clima | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) carregarDados();
  }, [id]);

  async function carregarDados() {
    try {
      if (tipo === 'pais') {
        const [res, extRes] = await Promise.allSettled([
          api.get(`/paises/${id}`),
          api.get(`/paises/${id}/dados-externos`),
        ]);

        if (res.status === 'fulfilled') {
          setPais(res.value.data);
        } else {
          toast.error('Erro ao carregar dados');
          navigate('/paises');
          return;
        }

        if (extRes.status === 'fulfilled') {
          setDadosExternos(extRes.value.data);
        }
      } else {
        const [res, climaRes] = await Promise.allSettled([
          api.get(`/cidades/${id}`),
          api.get(`/cidades/${id}/clima`),
        ]);

        if (res.status === 'fulfilled') {
          setCidade(res.value.data);
        } else {
          toast.error('Erro ao carregar dados');
          navigate('/cidades');
          return;
        }

        if (climaRes.status === 'fulfilled') {
          setClima(climaRes.value.data);
        }
      }
    } catch (error) {
      toast.error('Erro ao carregar dados');
      navigate(tipo === 'pais' ? '/paises' : '/cidades');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;

  if (tipo === 'pais' && pais) {
    return (
      <div className="page container">
        <div className="page-header">
          <h1>{pais.nome}</h1>
          <button className="btn btn-secondary" onClick={() => navigate('/paises')}>
            Voltar
          </button>
        </div>

        <div className="detail-panel">
          <div className="detail-card">
            <h3>Informações do País</h3>
            <div className="detail-row">
              <span className="detail-label">Continente</span>
              <span className="detail-value">{pais.continente.nome}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">População</span>
              <span className="detail-value">{formatPopulacao(pais.populacao)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Idioma Oficial</span>
              <span className="detail-value">{pais.idioma_oficial || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Moeda</span>
              <span className="detail-value">{pais.moeda || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Cidades Cadastradas</span>
              <span className="detail-value">{pais.cidades.length}</span>
            </div>
          </div>

          <div className="detail-card">
            <h3>Dados Externos (REST Countries)</h3>
            {dadosExternos ? (
              <>
                {dadosExternos.flagUrl && (
                  <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <img src={dadosExternos.flagUrl} alt={`Bandeira de ${pais.nome}`} className="flag-img" />
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Capital</span>
                  <span className="detail-value">{dadosExternos.capital}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Região</span>
                  <span className="detail-value">{dadosExternos.region} - {dadosExternos.subregion}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Idiomas</span>
                  <span className="detail-value">{dadosExternos.languages.join(', ')}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Moedas</span>
                  <span className="detail-value">
                    {dadosExternos.currencies.map((c) => `${c.name} (${c.symbol})`).join(', ')}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Fuso Horário</span>
                  <span className="detail-value">{dadosExternos.timezones[0] || '-'}</span>
                </div>
              </>
            ) : (
              <p style={{ color: '#888', textAlign: 'center', padding: '1rem' }}>
                Dados externos não disponíveis
              </p>
            )}
          </div>
        </div>

        {pais.cidades.length > 0 && (
          <div className="card" style={{ marginTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#1e3a5f' }}>Cidades</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>População</th>
                    <th>Coordenadas</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pais.cidades.map((c) => (
                    <tr key={c.id}>
                      <td>{c.nome}</td>
                      <td>{formatPopulacao(c.populacao)}</td>
                      <td>
                        {c.latitude && c.longitude
                          ? `${c.latitude.toFixed(4)}, ${c.longitude.toFixed(4)}`
                          : '-'}
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => navigate(`/detalhes/cidade/${c.id}`)}
                        >
                          Ver Detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (tipo === 'cidade' && cidade) {
    return (
      <div className="page container">
        <div className="page-header">
          <h1>{cidade.nome}</h1>
          <button className="btn btn-secondary" onClick={() => navigate('/cidades')}>
            Voltar
          </button>
        </div>

        <div className="detail-panel">
          <div className="detail-card">
            <h3>Informações da Cidade</h3>
            <div className="detail-row">
              <span className="detail-label">País</span>
              <span className="detail-value">{cidade.pais.nome}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Continente</span>
              <span className="detail-value">{cidade.pais.continente.nome}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">População</span>
              <span className="detail-value">{formatPopulacao(cidade.populacao)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Latitude</span>
              <span className="detail-value">{cidade.latitude?.toFixed(4) || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Longitude</span>
              <span className="detail-value">{cidade.longitude?.toFixed(4) || '-'}</span>
            </div>
          </div>

          <div className="detail-card">
            <h3>Clima Atual (OpenWeatherMap)</h3>
            {clima ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  {clima.iconeUrl && (
                    <img src={clima.iconeUrl} alt={clima.descricao} className="weather-icon" />
                  )}
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e3a5f' }}>
                    {clima.temperatura}°C
                  </div>
                  <div style={{ color: '#888', textTransform: 'capitalize' }}>
                    {clima.descricao}
                  </div>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Sensação Térmica</span>
                  <span className="detail-value">{clima.sensacaoTermica}°C</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Umidade</span>
                  <span className="detail-value">{clima.umidade}%</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Vento</span>
                  <span className="detail-value">{clima.vento} km/h</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Pressão</span>
                  <span className="detail-value">{clima.pressao} hPa</span>
                </div>
              </>
            ) : (
              <p style={{ color: '#888', textAlign: 'center', padding: '1rem' }}>
                Dados de clima não disponíveis. Configure a chave da API OpenWeatherMap no .env do backend.
              </p>
            )}
          </div>
        </div>

        {cidade.latitude && cidade.longitude && (
          <div className="card" style={{ marginTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#1e3a5f' }}>Localização</h3>
            <div style={{ textAlign: 'center' }}>
              <iframe
                title="Mapa"
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: '8px' }}
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${cidade.longitude - 0.1},${cidade.latitude - 0.1},${cidade.longitude + 0.1},${cidade.latitude + 0.1}&layer=mapnik&marker=${cidade.latitude},${cidade.longitude}`}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return <div className="loading">Dados não encontrados</div>;
}
