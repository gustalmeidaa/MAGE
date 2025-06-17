import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CadastroSetor() {
  const [setores, setSetor] = useState([]);
  const [sucesso, setSucesso] = useState(null); // Estado para mensagem de sucesso

  useEffect(() => {
    const fetchSetores = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/setores`
        );
        setSetor(response.data);
      } catch (error) {
        console.error("Erro ao buscar setores:", error);
      }
    };

    fetchSetores();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      nomeSetor: event.target[0].value,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/setores`,
        formData
      );
      setSucesso("Setor cadastrado com sucesso!");
      event.target[0].value = "";

      // Oculta a mensagem após 4 segundos
      setTimeout(() => setSucesso(null), 4000);
    } catch (error) {
      console.error("Erro ao cadastrar setor:", error);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
        Cadastrar Setor
      </h1>

      {/* Cartão de sucesso */}
      {sucesso && (
        <div className="max-w-md mx-auto mb-8 p-4 bg-green-100 border border-green-400 rounded-lg text-green-700 shadow-md animate-fade-in">
          {sucesso}
        </div>
      )}

      <form
        className="max-w-2xl mx-auto space-y-8 text-lg"
        onSubmit={handleSubmit}
      >
        <div className="flex justify-between items-center">
          <label className="font-semibold">Digite o nome do setor:</label>
          <input
            type="text"
            className="bg-gray-300 rounded px-4 py-2 w-72"
            required
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full"
          >
            Cadastrar
          </button>
        </div>
      </form>

      {/* Animação CSS simples para fade in */}
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
