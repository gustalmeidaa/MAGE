import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Funcionarios() {
  const [dados, setDados] = useState([]);
  const [filtro, setFiltro] = useState({ id: "", nome: "" });

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/funcionarios`);
        const data = await response.json();
        // Map the data to match the previous structure
        const mappedData = data.map((funcionario) => ({
          id: funcionario.idFuncionario.toString(), // Convert to string for consistency
          nome: funcionario.nomeFuncionario,
          setor: funcionario.setor.nomeSetor
        }));
        setDados(mappedData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  const filtrados = dados.filter((f) =>
    f.id.toLowerCase().includes(filtro.id.toLowerCase()) &&
    f.nome.toLowerCase().includes(filtro.nome.toLowerCase())
  );

  return (
    // ALTERAÇÃO: Padding responsivo para diferentes tamanhos de tela
    <div className="flex-1 p-4 sm:p-6 md:p-10 bg-white min-h-screen">
      {/* ALTERAÇÃO: Fonte responsiva */}
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
        Lista de Funcionários
      </h1>

      <div className="mt-8 flex justify-center">
        {/* ALTERAÇÃO: Botão com largura total em telas pequenas para facilitar o toque */}
        <Link to="/cadastrar-funcionario" className="w-full max-w-xs md:w-auto">
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full text-lg">
            Cadastrar Funcionário
          </button>
        </Link>
      </div>
      <br />

      {/* Filtros */}
      {/* ALTERAÇÃO: Filtros empilhados (flex-col) no mobile e em linha (md:flex-row) no desktop */}
      <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center mb-6">
        <input
          type="number"
          placeholder="Filtrar por ID"
          // ALTERAÇÃO: Largura total no mobile e automática no desktop
          className="border rounded px-3 py-2 text-sm w-full max-w-xs md:w-auto"
          value={filtro.id}
          onChange={(e) => setFiltro({ ...filtro, id: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filtrar por Nome"
          className="border rounded px-3 py-2 text-sm w-full max-w-xs md:w-auto"
          value={filtro.nome}
          onChange={(e) => setFiltro({ ...filtro, nome: e.target.value })}
        />
        <button
          onClick={() => setFiltro({ id: "", nome: "" })}
          className="border rounded px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 w-full max-w-xs md:w-auto"
        >
          Limpar Filtros
        </button>
      </div>

      {/* A MÁGICA ACONTECE AQUI */}

      {/* 1. Visualização em Cards para TELAS PEQUENAS (visível até o breakpoint 'md') */}
      <div className="space-y-4 md:hidden">
        {filtrados.length > 0 ? (
          filtrados.map((func, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg text-gray-800">{func.nome}</span>
                <span className="text-sm text-gray-500">ID: {func.id}</span>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-600">Setor: </span>
                <span>{func.setor || "N/A"}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            Nenhum funcionário encontrado.
          </div>
        )}
      </div>

      {/* 2. Tabela Tradicional para TELAS MÉDIAS E GRANDES (escondida até o breakpoint 'md') */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border-t border-gray-300">
          <thead>
            <tr className="text-left text-sm text-gray-700">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Nome</th>
              <th className="py-3 px-4">Setor</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((func, i) => (
              <tr key={i} className="border-t text-sm hover:bg-gray-50">
                <td className="py-3 px-4">{func.id}</td>
                <td className="py-3 px-4">{func.nome}</td>
                <td className="py-3 px-4">{func.setor || "N/A"}</td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  Nenhum funcionário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}