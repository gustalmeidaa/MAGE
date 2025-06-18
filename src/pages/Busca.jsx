import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Maquinas() {
  const [dados, setDados] = useState([]);
  const [filtro, setFiltro] = useState({
    codPatrimonial: "",
    numSerie: "",
    localizacao: "",
    status: "",
  });

  // Fetch dos dados da API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/maquinas`
        );
        const data = await response.json();

        const mappedData = data.map((maquina) => ({
          codPatrimonial: maquina.codPatrimonial,
          numSerie: maquina.numSerie,
          valor: maquina.valor,
          idResponsavel: maquina.idResponsavel,
          localizacao: maquina.localizacao,
          status: maquina.status,
        }));

        setDados(mappedData);
      } catch (error) {
        console.error("Erro ao buscar dados das máquinas:", error);
      }
    };

    fetchData();
  }, []);

  // Filtro dos dados
  const filtrados = dados.filter(
    (m) =>
      m.codPatrimonial.toLowerCase().includes(
        filtro.codPatrimonial.toLowerCase()
      ) &&
      m.numSerie.toLowerCase().includes(filtro.numSerie.toLowerCase()) &&
      m.localizacao.toLowerCase().includes(filtro.localizacao.toLowerCase()) &&
      m.status.toLowerCase().includes(filtro.status.toLowerCase())
  );

  return (
    <div className="flex-1 p-10 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Lista de Máquinas
      </h1>

      <div className="mt-10 flex justify-center">
        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full text-lg">
          <Link to="/cadastrar-maquina">Cadastrar Máquina</Link>
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 justify-center my-6">
        <input
          type="text"
          placeholder="Filtrar por Código Patrimonial"
          className="border rounded px-3 py-1 text-sm"
          value={filtro.codPatrimonial}
          onChange={(e) =>
            setFiltro({ ...filtro, codPatrimonial: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Filtrar por Nº de Série"
          className="border rounded px-3 py-1 text-sm"
          value={filtro.numSerie}
          onChange={(e) => setFiltro({ ...filtro, numSerie: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filtrar por Localização"
          className="border rounded px-3 py-1 text-sm"
          value={filtro.localizacao}
          onChange={(e) =>
            setFiltro({ ...filtro, localizacao: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Filtrar por Status"
          className="border rounded px-3 py-1 text-sm"
          value={filtro.status}
          onChange={(e) =>
            setFiltro({ ...filtro, status: e.target.value })
          }
        />
        <button
          onClick={() =>
            setFiltro({ codPatrimonial: "", numSerie: "", localizacao: "", status: "" })
          }
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
              <th className="py-2 px-4">Código Patrimonial</th>
              <th className="py-2 px-4">Nº de Série</th>
              <th className="py-2 px-4">Localização</th>
              <th className="py-2 px-4">Valor (R$)</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">ID Responsável</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((m, i) => (
              <tr key={i} className="border-t text-sm">
                <td className="py-2 px-4">{m.codPatrimonial}</td>
                <td className="py-2 px-4">{m.numSerie}</td>
                <td className="py-2 px-4">{m.localizacao}</td>
                <td className="py-2 px-4">{m.status}</td>
                <td className="py-2 px-4">
                  {m.valor?.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
                <td className="py-2 px-4">{m.idResponsavel}</td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Nenhuma máquina encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
