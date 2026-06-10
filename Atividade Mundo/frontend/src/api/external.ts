import api from "./api";

export const buscarPaisPorNome = async (nome: string) => {
  const response = await api.get(
    `/api-externas/pais/${nome}`
  );

  return response.data;
};

export const buscarPaisesPorRegiao = async (
  regiao: string
) => {
  const response = await api.get(
    `/api-externas/regiao/${regiao}`
  );

  return response.data;
};

export const buscarClimaPorCidade = async (
  cidadeId: number
) => {
  const response = await api.get(
    `/api-externas/clima/cidade/${cidadeId}`
  );

  return response.data;
};

export const buscarClima = async (
  latitude: number,
  longitude: number
) => {
  const response = await api.get(
    "/api-externas/clima",
    {
      params: {
        lat: latitude,
        lon: longitude,
      },
    }
  );

  return response.data;
};

export const buscarPaisEnriquecido = async (
  paisId: number
) => {
  const response = await api.get(
    `/api-externas/pais-enriquecido/${paisId}`
  );

  return response.data;
};

export const validarCidadeNoPais = async (
  cidade: string,
  id_pais: number
) => {
  const response = await api.get(
    "/api-externas/validar-cidade",
    {
      params: {
        cidade,
        id_pais,
      },
    }
  );

  return response.data;
};

export const sugerirCidades = async (
  cidade: string,
  id_pais: number
) => {
  const response = await api.get(
    "/api-externas/sugerir-cidades",
    {
      params: {
        cidade,
        id_pais,
      },
    }
  );

  return response.data;
};