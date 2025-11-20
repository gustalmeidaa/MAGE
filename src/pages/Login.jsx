import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// 💡 Importa a instância do Axios configurada
import api from "../api"; 

export default function Login() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 💡 Usa a instância 'api'
      const response = await api.post("/auth/login", {
        login,
        senha,
      });

      const token = response.data?.token;
      const loginUsuario = response.data?.loginUsuario; 

      if (token) {
        localStorage.setItem("userToken", token);
        
        if (loginUsuario) {
            localStorage.setItem("loginUsuario", loginUsuario);
        } else {
            localStorage.setItem("loginUsuario", login); 
        }

        // Redireciona para a página principal
        navigate("/");
      } else {
        setError("Erro: O servidor não retornou o token de acesso.");
      }
    } catch (err) {
      console.error("Erro na requisição de login:", err);
      // Trata erros 401/403 de forma específica se necessário
      setError("Usuário ou senha incorretos. Verifique suas credenciais.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Entrar na conta
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="login"
              className="block text-sm font-medium text-gray-700"
            >
              Login
            </label>
            <input
              type="text"
              id="login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="senha"
              className="block text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}