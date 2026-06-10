import { useEffect, useState } from "react";

import ContinentForm from "../../components/ContinentForm";
import CountryForm from "../../components/CountryForm";
import CityForm from "../../components/CityForm";

import {
  getContinentes,
  createContinente,
  updateContinente,
  deleteContinente,
} from "../../api/continents";

import {
  getPaises,
  createPais,
  updatePais,
  deletePais,
} from "../../api/countries";

import {
  getCidades,
  createCidade,
  updateCidade,
  deleteCidade,
} from "../../api/cities";

export default function GeographyPage() {
  const [tab, setTab] = useState("continentes");

  const [continentes, setContinentes] = useState<any[]>([]);
  const [paises, setPaises] = useState<any[]>([]);
  const [cidades, setCidades] = useState<any[]>([]);

  const [editingContinente, setEditingContinente] =
    useState<any | null>(null);

  const [editingPais, setEditingPais] =
    useState<any | null>(null);

  const [selectedPais, setSelectedPais] = useState<any | null>(null);

  const [selectedCidade, setSelectedCidade] = useState<any | null>(null);

  const [editingCidade, setEditingCidade] =
    useState<any | null>(null);

  useEffect(() => {
    carregarTudo();
  }, []);

  async function carregarTudo() {
    await Promise.all([
      carregarContinentes(),
      carregarPaises(),
      carregarCidades(),
    ]);
  }

  async function carregarContinentes() {
    try {
      const response = await getContinentes();

      setContinentes(
        response.data || response
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function carregarPaises() {
    try {
      const response = await getPaises();

      setPaises(
        response.data || response
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function carregarCidades() {
    try {
      const response = await getCidades();

      setCidades(
        response.data || response
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function salvarContinente(data: any) {
    try {
      if (editingContinente) {
        await updateContinente(
          editingContinente.id,
          data
        );

        setEditingContinente(null);
      } else {
        await createContinente(data);
      }

      carregarContinentes();
    } catch (error) {
      console.error(error);
    }
  }

  async function removerContinente(id: number) {
    if (!window.confirm("Excluir continente?")) {
      return;
    }

    await deleteContinente(id);

    carregarContinentes();
  }

  async function salvarPais(data: any) {
    try {
      const payload = {
        ...data,
        populacao: Number(data.populacao),
        id_continente: Number(data.id_continente || data.continente_id || 0),
      };

      if (editingPais) {
        await updatePais(editingPais.id, payload);
        setEditingPais(null);
      } else {
        await createPais(payload);
      }

      carregarPaises();
    } catch (error) {
      console.error(error);
    }
  }

  async function removerPais(id: number) {
    if (!window.confirm("Excluir país?")) {
      return;
    }

    await deletePais(id);

    carregarPaises();
  }

  async function salvarCidade(data: any) {
    try {
      const payload = {
        ...data,
        populacao: Number(data.populacao),
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        id_pais: Number(data.id_pais || data.pais_id || 0),
      };

      if (editingCidade) {
        await updateCidade(editingCidade.id, payload);
        setEditingCidade(null);
      } else {
        await createCidade(payload);
      }

      carregarCidades();
    } catch (error) {
      console.error(error);
    }
  }

  async function removerCidade(id: number) {
    if (!window.confirm("Excluir cidade?")) {
      return;
    }

    await deleteCidade(id);

    carregarCidades();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Gestão Geográfica
      </h1>

      <div className="flex gap-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() =>
            setTab("continentes")
          }
        >
          Continentes
        </button>

        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => setTab("paises")}
        >
          Países
        </button>

        <button
          className="bg-purple-600 text-white px-4 py-2 rounded"
          onClick={() => setTab("cidades")}
        >
          Cidades
        </button>
      </div>

      {tab === "continentes" && (
        <div>
          <h2 className="text-2xl mb-4">
            Continentes
          </h2>

          <ContinentForm
            onSubmit={salvarContinente}
            initialValues={
              editingContinente
            }
          />

          <table className="w-full mt-6 border">
            <thead>
              <tr className="bg-gray-200">
                <th>ID</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {continentes.map(
                (continente) => (
                  <tr
                    key={continente.id}
                    className="border"
                  >
                    <td>{continente.id}</td>
                    <td>{continente.nome}</td>
                    <td className="max-w-xl truncate">
                      {continente.descricao}
                    </td>

                    <td className="space-x-2">
                      <button
                        className="bg-yellow-500 text-white px-2 py-1"
                        onClick={() =>
                          setEditingContinente(
                            continente
                          )
                        }
                      >
                        Editar
                      </button>

                      <button
                        className="bg-red-600 text-white px-2 py-1"
                        onClick={() =>
                          removerContinente(
                            continente.id
                          )
                        }
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === "paises" && (
        <div>
          <h2 className="text-2xl mb-4">
            Países
          </h2>

          <CountryForm
            continentes={continentes}
            onSubmit={salvarPais}
            initialValues={editingPais}
          />

          <table className="w-full mt-6 border">
            <thead>
              <tr className="bg-gray-200">
                <th>ID</th>
                <th>Nome</th>
                <th>População</th>
                <th>Idioma</th>
                <th>Moeda</th>
                <th>Continente</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {paises.map((pais) => (
                <tr
                  key={pais.id}
                  className="border"
                >
                  <td>{pais.id}</td>
                  <td className="text-blue-600 cursor-pointer" onClick={() => setSelectedPais(pais)}>{pais.nome}</td>
                  <td>{pais.populacao?.toLocaleString?.() ?? pais.populacao}</td>
                  <td>{pais.idioma_oficial}</td>
                  <td>{pais.moeda}</td>
                  <td>{pais.continente?.nome}</td>

                  <td className="space-x-2">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1"
                      onClick={() =>
                        setEditingPais(pais)
                      }
                    >
                      Editar
                    </button>

                    <button
                      className="bg-red-600 text-white px-2 py-1"
                      onClick={() =>
                        removerPais(pais.id)
                      }
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedPais && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded max-w-lg w-full">
                <h3 className="text-xl font-bold mb-4">Detalhes do País</h3>
                <p><strong>Nome:</strong> {selectedPais.nome}</p>
                <p><strong>População:</strong> {selectedPais.populacao?.toLocaleString?.() ?? selectedPais.populacao}</p>
                <p><strong>Idioma Oficial:</strong> {selectedPais.idioma_oficial}</p>
                <p><strong>Moeda:</strong> {selectedPais.moeda}</p>
                <p><strong>Continente:</strong> {selectedPais.continente?.nome}</p>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    className="px-3 py-1 bg-gray-200 rounded"
                    onClick={() => setSelectedPais(null)}
                  >
                    Fechar
                  </button>

                  <button
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                    onClick={() => {
                      setEditingPais(selectedPais);
                      setSelectedPais(null);
                    }}
                  >
                    Editar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "cidades" && (
        <div>
          <h2 className="text-2xl mb-4">
            Cidades
          </h2>

          <CityForm
            paises={paises}
            onSubmit={salvarCidade}
            initialValues={editingCidade}
          />

          <table className="w-full mt-6 border">
            <thead>
              <tr className="bg-gray-200">
                <th>ID</th>
                <th>Nome</th>
                <th>População</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>País</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {cidades.map((cidade) => (
                <tr
                  key={cidade.id}
                  className="border"
                >
                  <td>{cidade.id}</td>
                  <td className="text-blue-600 cursor-pointer" onClick={() => setSelectedCidade(cidade)}>{cidade.nome}</td>
                  <td>{cidade.populacao?.toLocaleString?.() ?? cidade.populacao}</td>
                  <td>{cidade.latitude}</td>
                  <td>{cidade.longitude}</td>
                  <td>{cidade.pais?.nome}</td>

                  <td className="space-x-2">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1"
                      onClick={() =>
                        setEditingCidade(
                          cidade
                        )
                      }
                    >
                      Editar
                    </button>

                    <button
                      className="bg-red-600 text-white px-2 py-1"
                      onClick={() =>
                        removerCidade(
                          cidade.id
                        )
                      }
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedCidade && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded max-w-lg w-full">
                <h3 className="text-xl font-bold mb-4">Detalhes da Cidade</h3>
                <p><strong>Nome:</strong> {selectedCidade.nome}</p>
                <p><strong>População:</strong> {selectedCidade.populacao?.toLocaleString?.() ?? selectedCidade.populacao}</p>
                <p><strong>Latitude:</strong> {selectedCidade.latitude}</p>
                <p><strong>Longitude:</strong> {selectedCidade.longitude}</p>
                <p><strong>País:</strong> {selectedCidade.pais?.nome}</p>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    className="px-3 py-1 bg-gray-200 rounded"
                    onClick={() => setSelectedCidade(null)}
                  >
                    Fechar
                  </button>

                  <button
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                    onClick={() => {
                      setEditingCidade(selectedCidade);
                      setSelectedCidade(null);
                    }}
                  >
                    Editar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
