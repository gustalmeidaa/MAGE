import React, { useState, useEffect } from "react";
import axios from "axios";

export default function RegistrarMovimentacao() {
  const [maquinas, setMaquinas] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [sucesso, setSucesso] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resMaquinas, resFuncionarios] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/maquinas`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/funcionarios`),
        ]);

        setMaquinas(resMaquinas.data);
        setFuncionarios(resFuncionarios.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;

    const formData = {
      data: form[0].value,
      idMaquinaMovimentada: form[1].value,
      idResponsavel: form[2].value || null,
      tipo: form[3].value,
      origem: form[4].value || null,
      destino: form[5].value || null,
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/movimentacoes`, formData);
      setSucesso("Movimentação registrada com sucesso!");
      form.reset();

      setTimeout(() => setSucesso(null), 4000);
    } catch (error) {
      console.error("Erro ao registrar movimentação:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
        Registrar Movimentação
      </h1>

      {/* Notificação de sucesso */}
      {sucesso && (
        <div className="max-w-md mx-auto mb-8 p-4 bg-green-100 border border-green-400 rounded-lg text-green-700 shadow-md animate-fade-in">
          {sucesso}
        </div>
      )}

      <form
        className="max-w-2xl mx-auto space-y-8 text-lg"
        onSubmit={handleSubmit}
      >
        {/* Data da movimentação */}
        <div className="flex justify-between items-center">
          <label className="font-semibold">Data da movimentação:</label>
          <input
            className="bg-gray-300 rounded px-4 py-2 w-72"
            type="datetime-local"
            required
          />
        </div>

        {/* Máquina movimentada */}
        <div className="flex justify-between items-center">
          <label className="font-semibold">Máquina movimentada:</label>
          <select
  name="maquina"
  className="bg-gray-300 rounded px-4 py-2 w-72 font-bold"
  required
>
  <option value="">Selecione uma máquina</option>
  {maquinas.map((maq) => (
    <option key={maq.idMaquina} value={maq.idMaquina}>
      {maq.codPatrimonial || maq.numSerie || `Máquina ${maq.idMaquina}`}
    </option>
  ))}
</select>
        </div>

        {/* Responsável */}
        <div className="flex justify-between items-center">
          <label className="font-semibold">Responsável:</label>
          <select
  name="responsavel"
  className="bg-gray-300 rounded px-4 py-2 w-72 font-bold"
>
  <option value="">Nenhum responsável</option>
  {funcionarios.map((funcionario) => (
    <option key={funcionario.idFuncionario} value={funcionario.idFuncionario}>
      {funcionario.nomeFuncionario} - ID: {funcionario.idFuncionario}
    </option>
  ))}
</select>
        </div>

        {/* Tipo de movimentação */}
        <div className="flex justify-between items-center">
          <label className="font-semibold">Tipo de movimentação:</label>
          <select
            name="tipo"
            className="bg-gray-300 rounded px-4 py-2 w-72 font-bold"
            required
          >
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
            <option value="transferencia">Transferência</option>
          </select>
        </div>

        {/* Origem */}
        <div className="flex justify-between items-center">
          <label className="font-semibold">Origem:</label>
          <select
  name="origem"
  className="bg-gray-300 rounded px-4 py-2 w-72 font-bold"
>
  <option value="">Nenhuma origem</option>
  {maquinas.map((maq) => (
    <option key={maq.idMaquina} value={maq.localizacao}>
      {maq.localizacao}
    </option>
  ))}
</select>
        </div>

        {/* Destino */}
        <div className="flex justify-between items-center">
          <label className="font-semibold">Destino:</label>
          <select
  name="destino"
  className="bg-gray-300 rounded px-4 py-2 w-72 font-bold"
>
  <option value="">Nenhum destino</option>
  {maquinas.map((maq) => (
    <option key={maq.idMaquina} value={maq.localizacao}>
      {maq.localizacao}
    </option>
  ))}
</select>
        </div>

        {/* Botão */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full"
          >
            Registrar
          </button>
        </div>
      </form>

      {/* Animação CSS para fade in */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease forwards;
        }
      `}</style>
    </div>
  );
}
