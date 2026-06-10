import api from "./api";

export interface Cidade {
  id?: number;
  nome: string;
  populacao: number;
  latitude: number;
  longitude: number;
  id_pais: number;
}

export const getCidades = async (
  page = 1,
  limit = 10,
  search = ""
) => {
  const response = await api.get("/cidades", {
    params: {
      page,
      limit,
      search,
    },
  });

  return response.data;
};

export const getCidadeById = async (id: number) => {
  const response = await api.get(`/cidades/${id}`);
  return response.data;
};

export const createCidade = async (data: Cidade) => {
  const response = await api.post("/cidades", data);
  return response.data;
};

export const updateCidade = async (
  id: number,
  data: Cidade
) => {
  const response = await api.put(`/cidades/${id}`, data);
  return response.data;
};

export const deleteCidade = async (id: number) => {
  const response = await api.delete(`/cidades/${id}`);
  return response.data;
};