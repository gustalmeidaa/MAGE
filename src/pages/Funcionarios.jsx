import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Funcionarios() {
  const [dados, setDados] = useState([]);
  const [filtro, setFiltro] = useState({ id: "", nome: "" });

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8081/funcionarios");
        const data = await response.json();
        // Map the data to match the previous structure
        const mappedData = data.map((funcionario) => ({
          id: funcionario.idFuncionario.toString(), // Convert to string for consistency
          nome: funcionario.nomeFuncionario,
          setor: "", // Assuming setor is not provided in the new format
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
    <div className="flex-1 p-10 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Lista de Funcionários
      </h1>

        <div className="mt-10 flex justify-center">
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full text-lg">
            <Link to="/cadastrar-funcionario">Cadastrar Funcionário</Link>
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
          type="text"
          placeholder="Filtrar por Nome"
          className="border rounded px-3 py-1 text-sm"
          value={filtro.nome}
          onChange={(e) => setFiltro({ ...filtro, nome: e.target.value })}
        />
        <button
          onClick={() => setFiltro({ id: "", nome: "" })}
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
              <th className="py-2 px-4">Nome</th>
              <th className="py-2 px-4">Setor</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((func, i) => (
              <tr key={i} className="border-t text-sm">
                <td className="py-2 px-4">{func.id}</td>
                <td className="py-2 px-4">{func.nome}</td>
                <td className="py-2 px-4">{func.setor || "N/A"}</td>
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
