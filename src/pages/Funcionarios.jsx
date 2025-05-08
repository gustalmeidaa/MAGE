import React, { useState } from "react";

export default function Funcionarios() {
  const dados = [
    { id: "001", nome: "Tito Fonfon", setor: "Recursos Humanos" },
    { id: "002", nome: "Néia Pamonha", setor: "Financeiro" },
    { id: "003", nome: "Zuleika Pipoca", setor: "Marketing" },
    { id: "004", nome: "Juca Beludo", setor: "Jurídico" },
    { id: "005", nome: "Mimosa Galvão", setor: "Logística" },
    { id: "006", nome: "Toinho das Couves", setor: "Atendimento" },
  ];

  const [filtro, setFiltro] = useState({ id: "", nome: "", setor: "" });

  const filtrados = dados.filter((f) =>
    f.id.toLowerCase().includes(filtro.id.toLowerCase()) &&
    f.nome.toLowerCase().includes(filtro.nome.toLowerCase()) &&
    f.setor.toLowerCase().includes(filtro.setor.toLowerCase())
  );

  return (
    <div className="flex-1 p-10 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Lista de Funcionários
      </h1>

      {/* Filtros */}
      <div className="flex gap-4 justify-center mb-6">
        <input
          type="text"
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
        <input
          type="text"
          placeholder="Filtrar por Setor"
          className="border rounded px-3 py-1 text-sm"
          value={filtro.setor}
          onChange={(e) => setFiltro({ ...filtro, setor: e.target.value })}
        />
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
                <td className="py-2 px-4">{func.setor}</td>
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
