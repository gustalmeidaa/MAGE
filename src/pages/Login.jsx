import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Envia para o endpoint /auth/login do backend
      const response = await axios.post("http://localhost:8080/auth/login", {
        login,
        senha,
      });

      const token = response.data?.token;
      if (token) {
        // Armazena o token no localStorage
        localStorage.setItem("token", token);

        // Redireciona para a página principal
        navigate("/");
      } else {
        setError("Erro: token não retornado pelo servidor");
      }
    } catch (err) {
      console.error(err);
      setError("Usuário ou senha incorretos");
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
