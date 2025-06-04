import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Movimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [filtro, setFiltro] = useState({
    id: "",
    data: "",
    maquinaMovimentada: "",
    tipo: "",
    origem: "",
    destino: "",
  });

  // Fetch data from the API
  useEffect(() => {
    const fetchMovimentacoes = async () => {
      try {
        const response = await fetch("http://localhost:8081/movimentacoes");
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
      (filtro.id ? mov.idMovimentacoes.toString().includes(filtro.id) : true) &&
      (filtro.data ? new Date(mov.data).toLocaleDateString().includes(filtro.data) : true) &&
      (filtro.maquinaMovimentada ? mov.maquinaMovimentada.toString().includes(filtro.maquinaMovimentada) : true) &&
      (filtro.tipo ? mov.tipo.toLowerCase().includes(filtro.tipo.toLowerCase()) : true) &&
      (filtro.origem ? mov.origem.toLowerCase().includes(filtro.origem.toLowerCase()) : true) &&
      (filtro.destino ? mov.destino.toLowerCase().includes(filtro.destino.toLowerCase()) : true)
    );
  });

  return (
    <div className="flex-1 p-10 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Lista de Movimentações
      </h1>

      <div className="mt-10 flex justify-center">
        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full text-lg">
          <Link to="/registrar-movimentacao">Registrar Movimentação</Link>
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
          placeholder="Filtrar por Máquina movimentada"
          className="border rounded px-3 py-1 text-sm"
          value={filtro.maquinaMovimentada}
          onChange={(e) => setFiltro({ ...filtro, maquinaMovimentada: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filtrar por Tipo de Movimentação"
          className="border rounded px-3 py-1 text-sm"
          value={filtro.tipo}
          onChange={(e) => setFiltro({ ...filtro, tipo: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filtrar por Origem"
          className="border rounded px-3 py-1 text-sm"
          value={filtro.origem}
          onChange={(e) => setFiltro({ ...filtro, origem: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filtrar por Destino"
          className="border rounded px-3 py-1 text-sm"
          value={filtro.destino}
          onChange={(e) => setFiltro({ ...filtro, destino: e.target.value })}
        />

        <button
          onClick={() => setFiltro({ id: "", data: "", responsavel: "", tipo: "", origem: "", destino: "" })}
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
              <th className="py-2 px-4">Máquina movimentada</th>
              <th className="py-2 px-4">Tipo de Movimentação</th>
              <th className="py-2 px-4">Origem</th>
              <th className="py-2 px-4">Destino</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length > 0 ? (
              filtrados.map((mov, index) => (
                <tr key={index} className="border-t text-sm">
                  <td className="py-2 px-4">{mov.idMovimentacoes}</td>
                  <td className="py-2 px-4">{new Date(mov.data).toLocaleDateString()}</td>
                  <td className="py-2 px-4">{mov.maquinaMovimentada.idMaquina}</td>
                  <td className="py-2 px-4">{mov.tipo}</td>
                  <td className="py-2 px-4">{mov.origem}</td>
                  <td className="py-2 px-4">{mov.destino}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Nenhuma movimentação encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
