import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { sugerirCidades, validarCidadeNoPais } from "../api/external";

type CitySuggestion = {
  name: string;
  displayName: string;
  countryCode: string;
  countryName?: string;
  latitude?: number;
  longitude?: number;
  population?: number;
};

interface Props {
  paises: any[];
  onSubmit: (data: any) => void;
  initialValues?: any;
}

export default function CityForm({
  paises,
  onSubmit,
  initialValues,
}: Props) {
  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: initialValues,
  });
  const [cidadeInvalida, setCidadeInvalida] = useState(false);
  const [mensagemCidade, setMensagemCidade] = useState("");
  const [sugestoesCidade, setSugestoesCidade] = useState<CitySuggestion[]>([]);
  const debounceRef = useRef<number | null>(null);
  const suggestionRef = useRef<number | null>(null);
  const nomeCidade = watch("nome");
  const idPais = watch("id_pais");

  useEffect(() => {
    reset(initialValues || {});
  }, [initialValues, reset]);

  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    if (suggestionRef.current) {
      window.clearTimeout(suggestionRef.current);
    }

    const nomeNormalizado = String(nomeCidade || "").trim();
    const paisIdNumerico = Number(idPais);

    if (!nomeNormalizado || !Number.isInteger(paisIdNumerico) || paisIdNumerico <= 0) {
      setCidadeInvalida(false);
      setMensagemCidade("");
      setSugestoesCidade([]);
      return;
    }

    if (nomeNormalizado.length >= 2) {
      suggestionRef.current = window.setTimeout(async () => {
        try {
          const response = await sugerirCidades(nomeNormalizado, paisIdNumerico);
          const data = response?.data || response;
          setSugestoesCidade(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error(error);
          setSugestoesCidade([]);
        }
      }, 350);
    } else {
      setSugestoesCidade([]);
    }

    debounceRef.current = window.setTimeout(async () => {
      try {
        const response = await validarCidadeNoPais(nomeNormalizado, paisIdNumerico);
        const data = response?.data || response;

        if (!data?.valid) {
          setCidadeInvalida(true);
          setMensagemCidade(
            data?.country
              ? `A cidade não foi validada para o país selecionado (${data.country}).`
              : "Cidade inválida para o país selecionado."
          );
          return;
        }

        setCidadeInvalida(false);
        setMensagemCidade("");

        if (data.population !== undefined && data.population !== null) {
          setValue("populacao", data.population, { shouldDirty: true, shouldValidate: true });
        }

        if (data.latitude !== undefined && data.latitude !== null) {
          setValue("latitude", data.latitude, { shouldDirty: true, shouldValidate: true });
        }

        if (data.longitude !== undefined && data.longitude !== null) {
          setValue("longitude", data.longitude, { shouldDirty: true, shouldValidate: true });
        }
      } catch (error) {
        console.error(error);
        setCidadeInvalida(true);
        setMensagemCidade("Não foi possível validar a cidade para o país selecionado.");
      }
    }, 600);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [idPais, nomeCidade, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3"
    >
      <input
        {...register("nome")}
        placeholder="Nome"
        className={`border p-2 w-full ${cidadeInvalida ? "border-red-500" : ""}`}
      />

      {sugestoesCidade.length > 0 && (
        <select
          className="border p-2 w-full bg-white"
          value={String(nomeCidade || "")}
          onChange={(event) => {
            const selected = sugestoesCidade.find((item) => item.name === event.target.value);

            if (!selected) {
              return;
            }

            setValue("nome", selected.name, { shouldDirty: true, shouldValidate: true });

            if (selected.population !== undefined && selected.population !== null) {
              setValue("populacao", selected.population, { shouldDirty: true, shouldValidate: true });
            }

            if (selected.latitude !== undefined && selected.latitude !== null) {
              setValue("latitude", selected.latitude, { shouldDirty: true, shouldValidate: true });
            }

            if (selected.longitude !== undefined && selected.longitude !== null) {
              setValue("longitude", selected.longitude, { shouldDirty: true, shouldValidate: true });
            }
          }}
        >
          <option value="">Sugestões parecidas</option>
          {sugestoesCidade.map((sugestao) => (
            <option key={`${sugestao.name}-${sugestao.latitude}-${sugestao.longitude}`} value={sugestao.name}>
              {sugestao.displayName}
            </option>
          ))}
        </select>
      )}

      {mensagemCidade && (
        <p className="text-sm text-red-600">
          {mensagemCidade}
        </p>
      )}

      <input
        {...register("populacao")}
        type="number"
        placeholder="População"
        className="border p-2 w-full"
      />

      <input
        {...register("latitude")}
        type="number"
        step="any"
        placeholder="Latitude"
        className="border p-2 w-full"
      />

      <input
        {...register("longitude")}
        type="number"
        step="any"
        placeholder="Longitude"
        className="border p-2 w-full"
      />

      <select
        {...register("id_pais")}
        className="border p-2 w-full"
      >
        <option value="">Selecione um país</option>
        {paises.map((pais) => (
          <option key={pais.id} value={pais.id}>
            {pais.nome}
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={cidadeInvalida}
        className="bg-blue-600 text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Salvar
      </button>
    </form>
  );
}