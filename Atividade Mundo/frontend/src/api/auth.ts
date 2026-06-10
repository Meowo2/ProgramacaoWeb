import api from "./api";

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
}

export interface LoginData {
  email: string;
  senha: string;
}

export const registerUser = async (data: RegisterData) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};