import { useState } from "react";
import {
  buscarPaisPorNome,
  buscarClimaPorCidade,
  buscarPaisEnriquecido,
} from "../../api/external";

export default function ExternalDataPage() {
  const [resultado, setResultado] =
    useState<any>();

  const [nomePais, setNomePais] =
    useState("");

  const [cidadeId, setCidadeId] =
    useState("");

  const [paisId, setPaisId] =
    useState("");

  const pesquisarPais =
    async () => {
      const data =
        await buscarPaisPorNome(
          nomePais
        );

      setResultado(data);
    };

  const buscarClima =
    async () => {
      const data =
        await buscarClimaPorCidade(
          Number(cidadeId)
        );

      setResultado(data);
    };

  const buscarEnriquecido =
    async () => {
      const data =
        await buscarPaisEnriquecido(
          Number(paisId)
        );

      setResultado(data);
    };

  return (
    <div>
      <h1 className="text-3xl mb-5">
        APIs Externas
      </h1>

      <div className="space-y-4">

        <div>
          <input
            value={nomePais}
            onChange={(e) =>
              setNomePais(
                e.target.value
              )
            }
            placeholder="Nome do país"
            className="border p-2"
          />

          <button
            onClick={pesquisarPais}
          >
            Buscar País
          </button>
        </div>

        <div>
          <input
            value={cidadeId}
            onChange={(e) =>
              setCidadeId(
                e.target.value
              )
            }
            placeholder="ID Cidade"
            className="border p-2"
          />

          <button
            onClick={buscarClima}
          >
            Buscar Clima
          </button>
        </div>

        <div>
          <input
            value={paisId}
            onChange={(e) =>
              setPaisId(
                e.target.value
              )
            }
            placeholder="ID País"
            className="border p-2"
          />

          <button
            onClick={buscarEnriquecido}
          >
            País Enriquecido
          </button>
        </div>
      </div>

      {resultado && (
        <pre className="mt-5">
          {JSON.stringify(
            resultado,
            null,
            2
          )}
        </pre>
      )}
    </div>
  );
}