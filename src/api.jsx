import axios from "axios";
// 💡 Importa as funções do arquivo de serviço de autenticação
import { getToken, logout } from "./auth"; 
import { redirect } from "react-router-dom"; 

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL, 
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      // 💡 Coloca o token no cabeçalho Authorization
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🛡️ INTERCEPTOR DE RESPOSTA: Trata o token expirado/inválido (Status 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Verifica se o erro é uma resposta HTTP e se o status é 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      console.warn("Sessão expirada ou token inválido. Fazendo logout...");
      // 💡 Chama a função de logout (limpa o token e redireciona)
      logout(); 
      return Promise.reject(error); 
    }
    return Promise.reject(error);
  }
);

export default api;