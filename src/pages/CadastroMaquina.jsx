import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CadastroMaquina() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [sucesso, setSucesso] = useState(null); // Mensagem de sucesso

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/funcionarios`
        );
        setFuncionarios(response.data);
      } catch (error) {
        console.error("Erro ao buscar funcionários:", error);
      }
    };

    fetchFuncionarios();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      codPatrimonial: event.target[0].value,
      numSerie: event.target[1].value,
      valor: event.target[2].value,
      idResponsavel: event.target[3].value || null,
      localizacao: event.target[4].value,
      status: event.target[5].value,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/maquinas`,
        formData
      );
      setSucesso("Máquina cadastrada com sucesso!");
      event.target.reset();

      // Oculta o cartão após 4 segundos
      setTimeout(() => setSucesso(null), 4000);
    } catch (error) {
      console.error("Erro ao cadastrar máquina:", error);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
        Cadastrar Máquina
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
          <label className="font-semibold">
            Digite o código de patrimônio da máquina:
          </label>
          <input
            type="text"
            className="bg-gray-300 rounded px-4 py-2 w-72"
            required
          />
        </div>

        <div className="flex justify-between items-center">
          <label className="font-semibold">
            Digite o número de série da máquina:
          </label>
          <input
            type="text"
            className="bg-gray-300 rounded px-4 py-2 w-72"
            required
          />
        </div>

        <div className="flex justify-between items-center">
          <label className="font-semibold">Digite o valor da máquina:</label>
          <input
            type="number"
            className="bg-gray-300 rounded px-4 py-2 w-72"
            required
          />
        </div>

        <div className="flex justify-between items-center">
          <label className="font-semibold">
            Selecione o responsável pela máquina:
          </label>
          <select className="bg-gray-300 rounded px-4 py-2 w-72 font-bold">
            <option value="">Nenhum responsável</option>
            {funcionarios.map((funcionario) => (
              <option key={funcionario.idFuncionario} value={funcionario.idFuncionario}>
                {funcionario.nomeFuncionario} - ID: {funcionario.idFuncionario}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between items-center">
          <label className="font-semibold">Digite a localização da máquina:</label>
          <input
            type="text"
            className="bg-gray-300 rounded px-4 py-2 w-72"
            required
          />
        </div>

        <div className="flex justify-between items-center">
          <label className="font-semibold">Selecione o status da máquina:</label>
          <select
            className="bg-gray-300 rounded px-4 py-2 w-72 font-bold"
            required
          >
            <option>Ativa</option>
            <option>Inativa</option>
            <option>Em manutenção</option>
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
