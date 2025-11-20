import React, { useState } from "react";
// 💡 Importa a instância configurada do Axios (api) que anexa o token
import api from "../api"; 

export default function CadastroSetor() {
  const [sucesso, setSucesso] = useState(null);
  const [erro, setErro] = useState(null);

  const [formData, setFormData] = useState({
    nomeSetor: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSucesso(null);
    setErro(null);

    try {
      // 💡 SUBSTITUIÇÃO: Usando 'api.post' para incluir o token JWT
      await api.post("/setores", formData);
      
      setSucesso("Setor cadastrado com sucesso!");
      
      // Limpa o formulário resetando o estado
      setFormData({ nomeSetor: "" });

      setTimeout(() => setSucesso(null), 4000);
    } catch (error) {
      console.error("Erro ao cadastrar setor:", error);
      const msgErro = error.response?.data?.message || "Ocorreu um erro ao tentar cadastrar o setor.";
      setErro(msgErro);
      setTimeout(() => setErro(null), 5000);
    }
  };

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-10">
        Cadastrar Setor
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
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="nomeSetor">
            Nome do setor:
          </label>
          <input
            id="nomeSetor"
            name="nomeSetor"
            type="text"
            className="bg-gray-200 rounded px-4 py-2 w-full md:w-72"
            value={formData.nomeSetor}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="w-full max-w-xs md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg"
          >
            Cadastrar
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