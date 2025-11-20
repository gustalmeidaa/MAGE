import React, { useState } from "react";
import api from "../api"; 

export default function CadastrarAdministrador() {
  const [sucesso, setSucesso] = useState(null);
  const [erro, setErro] = useState(null);

  const [formData, setFormData] = useState({
    login: "",
    senha: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSucesso(null);
    setErro(null);

    // Validação básica de campos
    if (formData.login.length < 3 || formData.senha.length < 6) {
        setErro("Login deve ter no mínimo 3 caracteres e senha no mínimo 6.");
        return;
    }

    try {
      // 💡 Requisição POST protegida, o token do administrador logado será enviado
      const response = await api.post("/administradores", formData);
      
      if (response.status === 201) {
          setSucesso(`Administrador '${formData.login}' cadastrado com sucesso!`);
          // Limpa o formulário resetando o estado
          setFormData({ login: "", senha: "" });
      } else {
          // Trata outros status 2xx (improvável com 201, mas para segurança)
          setErro("Falha desconhecida no cadastro.");
      }

      setTimeout(() => setSucesso(null), 4000);
    } catch (error) {
      console.error("Erro ao cadastrar administrador:", error);
      
      let msgErro;
      if (error.response?.status === 409) {
          msgErro = "O login fornecido já existe no sistema.";
      } else if (error.response?.status === 403) {
          msgErro = "Acesso negado. Você não tem permissão para criar novos administradores.";
      } else {
          msgErro = error.response?.data?.message || "Ocorreu um erro ao tentar cadastrar o administrador.";
      }
      
      setErro(msgErro);
      setTimeout(() => setErro(null), 5000);
    }
  };

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-10">
        Cadastrar Novo Administrador
      </h1>

      {sucesso && (
        <div className="max-w-md mx-auto mb-8 p-4 bg-green-100 border border-green-400 rounded-lg text-green-700 shadow-md animate-fade-in">
          {sucesso}
        </div>
      )}

      {erro && (
        <div className="max-w-md mx-auto mb-8 p-4 bg-red-100 border border-red-400 rounded-lg text-red-700 shadow-md animate-fade-in">
          {erro}
        </div>
      )}

      <form
        className="max-w-2xl mx-auto space-y-6 text-base"
        onSubmit={handleSubmit}
      >
        {/* Campo Login */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="login">
            Login do Administrador:
          </label>
          <input
            id="login"
            name="login"
            type="text"
            className="bg-gray-200 rounded px-4 py-2 w-full md:w-72"
            value={formData.login}
            onChange={handleChange}
            required
            minLength="3"
          />
        </div>

        {/* Campo Senha */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="senha">
            Senha:
          </label>
          <input
            id="senha"
            name="senha"
            type="password"
            className="bg-gray-200 rounded px-4 py-2 w-full md:w-72"
            value={formData.senha}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="w-full max-w-xs md:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-150"
          >
            Cadastrar ADM
          </button>
        </div>
      </form>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease forwards;
        }
      `}</style>
    </>
  );
}