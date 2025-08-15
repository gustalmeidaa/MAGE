import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Setor() {
  const [setores, setSetores] = useState([]);
  // ALTERAÇÃO: Estado do filtro padronizado para camelCase
  const [filtro, setFiltro] = useState({
    idSetor: "",
    nomeSetor: "",
  });

  // Fetch data from the API
  useEffect(() => {
    const fetchSetores = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/setores`);
        const data = await response.json();
        setSetores(data);
      } catch (error) {
        console.error("Erro ao buscar setores:", error);
      }
    };

    fetchSetores();
  }, []);

  // ALTERAÇÃO: Lógica de filtro corrigida para usar as chaves corretas
  const filtrados = setores.filter((set) => {
    return (
      (filtro.idSetor ? set.idSetor.toString().includes(filtro.idSetor) : true) &&
      (filtro.nomeSetor ? set.nomeSetor.toLowerCase().includes(filtro.nomeSetor.toLowerCase()) : true)
    );
  });

  return (
    // ALTERAÇÃO: Padding responsivo
    <div className="flex-1 p-4 sm:p-6 md:p-10 bg-white min-h-screen">
      {/* ALTERAÇÃO: Fonte responsiva */}
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
        Lista de Setores
      </h1>

      <div className="mt-8 flex justify-center">
        {/* ALTERAÇÃO: Botão com largura total em telas pequenas */}
        <Link to="/cadastrar-setor" className="w-full max-w-xs md:w-auto">
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full text-lg">
            Cadastrar Setor
          </button>
        </Link>
      </div>
      <br />
      
      {/* Filtros */}
      {/* ALTERAÇÃO: Filtros empilhados no mobile e em linha no desktop */}
      <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center mb-6">
        <input
          type="number"
          placeholder="Filtrar por ID"
          className="border rounded px-3 py-2 text-sm w-full max-w-xs md:w-auto"
          value={filtro.idSetor}
          onChange={(e) => setFiltro({ ...filtro, idSetor: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filtrar por Nome do Setor"
          className="border rounded px-3 py-2 text-sm w-full max-w-xs md:w-auto"
          value={filtro.nomeSetor}
          onChange={(e) => setFiltro({ ...filtro, nomeSetor: e.target.value })}
        />

        <button
          // ALTERAÇÃO: Lógica de limpeza corrigida para o estado atual
          onClick={() => setFiltro({ idSetor: "", nomeSetor: "" })}
          className="border rounded px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 w-full max-w-xs md:w-auto"
        >
          Limpar Filtros
        </button>
      </div>

      {/* Visualização em Cards para TELAS PEQUENAS (visível até 'md') */}
      <div className="space-y-3 md:hidden">
        {filtrados.length > 0 ? (
          filtrados.map((set, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg shadow flex justify-between items-center">
              <span className="font-bold text-gray-800">{set.nomeSetor}</span>
              <span className="text-sm text-gray-500 font-mono">ID: {set.idSetor}</span>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">Nenhum setor encontrado.</div>
        )}
      </div>

      {/* Tabela Tradicional para TELAS MÉDIAS E GRANDES (escondida até 'md') */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border-t border-gray-300">
          <thead>
            <tr className="text-left text-sm text-gray-700 bg-gray-50">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Nome do Setor</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((set, i) => (
              <tr key={i} className="border-t text-sm hover:bg-gray-50">
                <td className="py-3 px-4">{set.idSetor}</td>
                <td className="py-3 px-4">{set.nomeSetor}</td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr>
                {/* ALTERAÇÃO: colSpan corrigido para 2 colunas */}
                <td colSpan="2" className="text-center py-4 text-gray-500">
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