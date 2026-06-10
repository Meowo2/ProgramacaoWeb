import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { buscarPaisPorNome, buscarPaisesPorRegiao } from "../api/external";

const CONTINENTE_PARA_REGIAO: Record<string, string> = {
  Africa: "Africa",
  Americas: "Americas",
  Asia: "Asia",
  Europe: "Europe",
  Oceania: "Oceania",
};

type PaisExterno = {
  nome: string;
  nomeOficial?: string;
  capital?: string;
  populacao?: number;
  bandeira?: string;
  area?: number;
};

interface Props {
  continentes: any[];
  onSubmit: (data: any) => void;
  initialValues?: any;
}

export default function CountryForm({
  continentes,
  onSubmit,
  initialValues,
}: Props) {
  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: initialValues,
  });
  const [paisesDaRegiao, setPaisesDaRegiao] = useState<PaisExterno[]>([]);
  const continenteSelecionado = watch("id_continente");
  const paisSelecionado = watch("nome");

  useEffect(() => {
    reset(initialValues || {});
  }, [initialValues, reset]);

  useEffect(() => {
    const nomeContinente = continentes.find(
      (continente) => String(continente.id) === String(continenteSelecionado)
    )?.nome;

    const regiao = nomeContinente ? CONTINENTE_PARA_REGIAO[nomeContinente] : null;

    if (!regiao) {
      setPaisesDaRegiao([]);
      setValue("nome", initialValues?.nome || "");
      return;
    }

    let ativo = true;

    async function carregarPaises() {
      try {
        const response = await buscarPaisesPorRegiao(regiao);
        const lista = response?.data || response || [];

        if (ativo) {
          setPaisesDaRegiao(lista);
        }
      } catch (error) {
        console.error(error);
        if (ativo) {
          setPaisesDaRegiao([]);
        }
      }
    }

    carregarPaises();

    return () => {
      ativo = false;
    };
  }, [continenteSelecionado, continentes, initialValues?.nome, setValue]);

  useEffect(() => {
    const nomePais = String(paisSelecionado || "").trim();

    if (!nomePais) {
      return;
    }

    let ativo = true;

    async function preencherDadosDoPais() {
      try {
        const response = await buscarPaisPorNome(nomePais);
        const dados = response?.data || response;
        const idioma = dados?.languages
          ? Object.values(dados.languages)[0]
          : "";
        const moeda = dados?.currencies
          ? Object.values(dados.currencies)[0] as { name?: string; symbol?: string }
          : null;

        if (!ativo) {
          return;
        }

        if (dados?.population) {
          setValue("populacao", dados.population, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }

        if (idioma) {
          setValue("idioma_oficial", String(idioma), {
            shouldDirty: true,
            shouldValidate: true,
          });
        }

        if (moeda) {
          setValue("moeda", moeda.symbol ? `${moeda.name} (${moeda.symbol})` : String(moeda.name || ""), {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    preencherDadosDoPais();

    return () => {
      ativo = false;
    };
  }, [paisSelecionado, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3"
    >
      <select
        {...register("id_continente")}
        className="border p-2 w-full"
      >
        <option value="">Selecione um continente</option>
        {continentes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nome}
          </option>
        ))}
      </select>

      <select
        {...register("nome")}
        className="border p-2 w-full"
        disabled={!continenteSelecionado || paisesDaRegiao.length === 0}
      >
        <option value="">
          {continenteSelecionado
            ? "Selecione um país"
            : "Escolha primeiro um continente"}
        </option>
        {paisesDaRegiao.map((pais) => (
          <option key={pais.nome} value={pais.nome}>
            {pais.nome}
          </option>
        ))}
      </select>

      <input
        {...register("populacao")}
        type="number"
        placeholder="População"
        className="border p-2 w-full"
        disabled={!continenteSelecionado}
      />

      <input
        {...register("idioma_oficial")}
        placeholder="Idioma oficial"
        className="border p-2 w-full"
        disabled={!continenteSelecionado}
      />

      <input
        {...register("moeda")}
        placeholder="Moeda"
        className="border p-2 w-full"
        disabled={!continenteSelecionado}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2"
      >
        Salvar
      </button>
    </form>
  );
}