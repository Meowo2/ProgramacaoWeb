import api from "./api";

export interface Pais {
  id?: number;
  nome: string;
  populacao: number;
  idioma_oficial: string;
  moeda: string;
  id_continente: number;
}

export const getPaises = async (
  page = 1,
  limit = 10,
  search = ""
) => {
  const response = await api.get("/paises", {
    params: {
      page,
      limit,
      search,
    },
  });

  return response.data;
};

export const getPaisById = async (id: number) => {
  const response = await api.get(`/paises/${id}`);
  return response.data;
};

export const createPais = async (data: Pais) => {
  const response = await api.post("/paises", data);
  return response.data;
};

export const updatePais = async (
  id: number,
  data: Pais
) => {
  const response = await api.put(`/paises/${id}`, data);
  return response.data;
};

export const deletePais = async (id: number) => {
  const response = await api.delete(`/paises/${id}`);
  return response.data;
};