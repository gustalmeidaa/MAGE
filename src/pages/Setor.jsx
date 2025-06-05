import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Setor() {
  const [setor, setSetor] = useState([]);
  const [filtro, setFiltro] = useState({
    id_setor: "",
    nome_setor: "",
  });

  // Fetch data from the API
  useEffect(() => {
    const fetchSetor = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/setores`);
        const data = await response.json();
        setSetor(data);
      } catch (error) {
        console.error("Erro ao buscar setores:", error);
      }
    };

    fetchSetor();
  }, []);

  const filtrados = setor.filter((set) => {
    return (
      (filtro.idSetor ? set.id_setor.toString().includes(filtro.idSetor) : true) &&
      (filtro.nomeSetor ? set.nome_setor.toLowerCase().includes(filtro.nomeSetor.toLowerCase()) : true)
    );
  });

  return (
    <div className="flex-1 p-10 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Lista de Setores
      </h1>

      <div className="mt-10 flex justify-center">
        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full text-lg">
          <Link to="/cadastrar-setor">Cadastrar Setor</Link>
        </button>
      </div>
      <br />
      {/* Filtros */}
      <div className="flex gap-4 justify-center mb-6">
        <input
          type="number"
          placeholder="Filtrar por ID"
          className="border rounded px-3 py-1 text-sm"
          value={filtro.idSetor}
          onChange={(e) => setFiltro({ ...filtro, idSetor: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filtrar por Nome do Setor"
          className="border rounded px-3 py-1 text-sm"
          value={filtro.nomeSetor}
          onChange={(e) => setFiltro({ ...filtro, nomeSetor: e.target.value })}
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
              <th className="py-2 px-4">Nome do Setor</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length > 0 ? (
              filtrados.map((set, index) => (
                <tr key={index} className="border-t text-sm">
                  <td className="py-2 px-4">{set.idSetor}</td>
                  <td className="py-2 px-4">{set.nomeSetor}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Nenhum setor encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
