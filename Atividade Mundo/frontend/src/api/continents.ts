import api from "./api";

export interface Continente {
  id?: number;
  nome: string;
  descricao: string;
}

export const getContinentes = async (
  page = 1,
  limit = 10,
  search = ""
) => {
  const response = await api.get("/continentes", {
    params: {
      page,
      limit,
      search,
    },
  });

  return response.data;
};

export const getContinenteById = async (id: number) => {
  const response = await api.get(`/continentes/${id}`);
  return response.data;
};

export const createContinente = async (data: Continente) => {
  const response = await api.post("/continentes", data);
  return response.data;
};

export const updateContinente = async (
  id: number,
  data: Continente
) => {
  const response = await api.put(`/continentes/${id}`, data);
  return response.data;
};

export const deleteContinente = async (id: number) => {
  const response = await api.delete(`/continentes/${id}`);
  return response.data;
};