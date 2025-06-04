import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Movimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [filtro, setFiltro] = useState({
    id: "",
    data: "",
    tipo: "",
    idMaquina: "",
    idResponsavel: "",
  });

  // Fetch data from the API
  useEffect(() => {
    const fetchMovimentacoes = async () => {
      try {
        const response = await fetch("http://localhost:8081/manutencoes");
        const data = await response.json();
        setMovimentacoes(data);
      } catch (error) {
        console.error("Erro ao buscar movimentações:", error);
      }
    };

    fetchMovimentacoes();
  }, []);

  const filtrados = movimentacoes.filter((mov) => {
    return (
      (filtro.id ? mov.idHistoricoManutencoes.toString().includes(filtro.id) : true) &&
      (filtro.data ? new Date(mov.data).toLocaleDateString().includes(filtro.data) : true) &&
      (filtro.tipo ? mov.tipoManutencao.toLowerCase().includes(filtro.tipo.toLowerCase()) : true) &&
      (filtro.idMaquina ? mov.idMaquina.id.toString().includes(filtro.idMaquina) : true) &&
      (filtro.idResponsavel ? mov.idFuncionario.id.toString().includes(filtro.idResponsavel) : true)
    );
  });

  return (
    <div className="flex-1 p-10 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Lista de Manutenções
      </h1>

      <div className="mt-10 flex justify-center">
        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full text-lg">
          <Link to="/registrar-manutencao">Registrar Manutenção</Link>
        </button>
      </div>
      <br />
      {/* Filtros */}
      <div className="flex gap-4 justify-center mb-6">
        <input
          type="number"
          placeholder="Filtrar por ID"
          className="border rounded px-3 py-1 text-sm"
          value={filtro.id}
          onChange={(e) => setFiltro({ ...filtro, id: e.target.value })}
        />
        <input
          type="date"
          placeholder="Filtrar por Data"
          className="border rounded px-3 py-1 text-sm"
          value={filtro.data}
          onChange={(e) => setFiltro({ ...filtro, data: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filtrar por Tipo de Manutenção"
          className="border rounded px-3 py-1 text-sm"
          value={filtro.tipo}
          onChange={(e) => setFiltro({ ...filtro, tipo: e.target.value })}
        />
        <input
          type="number"
          placeholder="Filtrar por ID da Máquina"
          className="border rounded px-3 py-1 text-sm"
          value={filtro.idMaquina}
          onChange={(e) => setFiltro({ ...filtro, idMaquina: e.target.value })}
        />
        <input
          type="number"
          placeholder="Filtrar por ID do Responsável"
          className="border rounded px-3 py-1 text-sm"
          value={filtro.idResponsavel}
          onChange={(e) => setFiltro({ ...filtro, idResponsavel: e.target.value })}
        />

        <button
          onClick={() => setFiltro({ id: "", data: "", tipo: "", idMaquina: "", idResponsavel: "" })}
          className="border rounded px-3 py-1 text-sm"
        >
          Limpar Filtros
        </button>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-t border-gray-300">
          <thead>
            <tr className="text-left text-sm text-gray-700">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Data</th>
              <th className="py-2 px-4">Tipo de Manutenção</th>
              <th className="py-2 px-4">O que foi feito</th>
              <th className="py-2 px-4">ID da Máquina</th>
              <th className="py-2 px-4">ID do Responsável</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length > 0 ? (
              filtrados.map((mov, index) => (
                <tr key={index} className="border-t text-sm">
                  <td className="py-2 px-4">{mov.idHistoricoManutencoes}</td>
                  <td className="py-2 px-4">{new Date(mov.data).toLocaleDateString()}</td>
                  <td className="py-2 px-4">{mov.tipoManutencao}</td>
                  <td className="py-2 px-4">{mov.procedimentos}</td>
                  <td className="py-2 px-4">{mov.idMaquina.idMaquina}</td>
                  <td className="py-2 px-4">{mov.idFuncionario.idFuncionario}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Nenhuma manutenção encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
