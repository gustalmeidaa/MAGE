import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CadastroSetor() {
  const [setores, setSetor] = useState([]);

  useEffect(() => {
    const fetchSetores= async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/setores`);
        setSetor(response.data);
      } catch (error) {
        console.error("Erro ao buscar setores:", error);
      }
    };

    fetchSetores();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Impede o comportamento padrão de recarregar a página

    const formData = {
      nomeSetor: event.target[0].value,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/setores`, formData);
      console.log("Setor cadastrado com sucesso:", response.data);
      // *limpar o formulário ou mostrar uma mensagem de sucesso*
    } catch (error) {
      console.log(formData);
      console.error("Erro ao cadastrar setor:", error);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
        Cadastrar Setor
      </h1>
      <form className="max-w-2xl mx-auto space-y-8 text-lg" onSubmit={handleSubmit}>
        <div className="flex justify-between items-center">
          <label className="font-semibold">
            Digite o nome do setor:
          </label>
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
    </>
  );
}

