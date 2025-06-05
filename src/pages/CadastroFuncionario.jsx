import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CadastroFuncionario() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [setores, setSetores] = useState([]);

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/funcionarios`);
        setFuncionarios(response.data);
      } catch (error) {
        console.error("Erro ao buscar funcionários:", error);
      }
    };

    const fetchSetores = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/setores`);
        setSetores(response.data);
      } catch (error) {
        console.error("Erro ao buscar setores:", error);
      }
    };

    fetchFuncionarios();
    fetchSetores();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      nomeFuncionario: event.target[0].value,
      nomeSetor: event.target[1].value || null,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/funcionarios`,
        formData
      );
      console.log("Funcionário cadastrado com sucesso:", response.data);
      alert("Funcionário cadastrado com sucesso!")
      event.target.reset();
    } catch (error) {
      console.error("Erro ao cadastrar funcionário:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
        Cadastrar Funcionário
      </h1>

      <form className="max-w-2xl mx-auto space-y-8 text-lg" onSubmit={handleSubmit}>
        <div className="flex justify-between items-center">
          <label className="font-semibold">Digite o nome do funcionário:</label>
          <input
            type="text"
            className="bg-gray-300 rounded px-4 py-2 w-72"
            required
          />
        </div>

        <div className="flex justify-between items-center">
          <label className="font-semibold">Selecione o setor do funcionário:</label>
          <select className="bg-gray-300 rounded px-4 py-2 w-72 font-bold" required>
            <option value="">Nenhum setor selecionado</option>
            {setores.map((setor) => (
              <option key={setor.nomeSetor} value={setor.nomeSetor}>
                {setor.nomeSetor}
              </option>
            ))}
          </select>
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
    </div>
  );
}
