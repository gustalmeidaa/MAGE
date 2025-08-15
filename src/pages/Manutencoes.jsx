import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// O nome do componente é Movimentacoes, mas a lógica e o título são de Manutenções.
// Mantivemos o nome do componente, mas a lógica segue o que foi fornecido.
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
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/manutencoes`);
        const data = await response.json();
        setMovimentacoes(data);
      } catch (error) {
        console.error("Erro ao buscar movimentações:", error);
      }
    };

    fetchMovimentacoes();
  }, []);
  
  // A lógica de filtro foi ajustada para ser mais robusta, especialmente para objetos aninhados
  const filtrados = movimentacoes.filter((mov) => {
    const dataFormatada = new Date(mov.data).toLocaleDateString("pt-BR");
    return (
      (filtro.id ? mov.idHistoricoManutencoes.toString().includes(filtro.id) : true) &&
      (filtro.data ? dataFormatada.includes(new Date(filtro.data).toLocaleDateString("pt-BR")) : true) &&
      (filtro.tipo ? mov.tipoManutencao.toLowerCase().includes(filtro.tipo.toLowerCase()) : true) &&
      (filtro.idMaquina ? mov.idMaquina.idMaquina.toString().includes(filtro.idMaquina) : true) &&
      (filtro.idResponsavel ? mov.idFuncionario.idFuncionario.toString().includes(filtro.idResponsavel) : true)
    );
  });
  
  return (
    // ALTERAÇÃO: Padding responsivo
    <div className="flex-1 p-4 sm:p-6 md:p-10 bg-white min-h-screen">
      {/* ALTERAÇÃO: Fonte responsiva */}
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
        Lista de Manutenções
      </h1>

      <div className="mt-8 flex justify-center">
        {/* ALTERAÇÃO: Botão com largura total em telas pequenas */}
        <Link to="/registrar-manutencao" className="w-full max-w-xs md:w-auto">
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full text-lg">
            Registrar Manutenção
          </button>
        </Link>
      </div>
      <br />
      
      {/* Filtros */}
      {/* ALTERAÇÃO: Filtros empilhados (flex-col) e com wrap em telas maiores para melhor ajuste */}
      <div className="flex flex-col items-center gap-4 md:flex-row md:flex-wrap md:justify-center mb-6">
        <input
          type="number"
          placeholder="Filtrar por ID"
          className="border rounded px-3 py-2 text-sm w-full max-w-xs md:w-auto"
          value={filtro.id}
          onChange={(e) => setFiltro({ ...filtro, id: e.target.value })}
        />
        <input
          type="text" // Usar texto para data permite filtrar por "dd/mm/aaaa"
          onFocus={(e) => (e.target.type = "date")}
          onBlur={(e) => (e.target.type = "text")}
          placeholder="Filtrar por Data"
          className="border rounded px-3 py-2 text-sm w-full max-w-xs md:w-auto"
          value={filtro.data}
          onChange={(e) => setFiltro({ ...filtro, data: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filtrar por Tipo"
          className="border rounded px-3 py-2 text-sm w-full max-w-xs md:w-auto"
          value={filtro.tipo}
          onChange={(e) => setFiltro({ ...filtro, tipo: e.target.value })}
        />
        <input
          type="number"
          placeholder="ID da Máquina"
          className="border rounded px-3 py-2 text-sm w-full max-w-xs md:w-auto"
          value={filtro.idMaquina}
          onChange={(e) => setFiltro({ ...filtro, idMaquina: e.target.value })}
        />
        <input
          type="number"
          placeholder="ID do Responsável"
          className="border rounded px-3 py-2 text-sm w-full max-w-xs md:w-auto"
          value={filtro.idResponsavel}
          onChange={(e) => setFiltro({ ...filtro, idResponsavel: e.target.value })}
        />
        <button
          onClick={() => setFiltro({ id: "", data: "", tipo: "", idMaquina: "", idResponsavel: "" })}
          className="border rounded px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 w-full max-w-xs md:w-auto"
        >
          Limpar Filtros
        </button>
      </div>

      {/* Visualização em Cards para TELAS PEQUENAS (visível até 'md') */}
      <div className="space-y-4 md:hidden">
        {filtrados.length > 0 ? (
          filtrados.map((mov, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg shadow space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-800">{mov.tipoManutencao}</p>
                  <p className="text-sm text-gray-500">{new Date(mov.data).toLocaleDateString()}</p>
                </div>
                <span className="text-sm text-gray-500 font-medium">ID: {mov.idHistoricoManutencoes}</span>
              </div>
              <p className="text-sm border-t pt-2"><span className="font-semibold">Procedimento:</span> {mov.procedimentos}</p>
              <p className="text-sm"><span className="font-semibold">Máquina:</span> {mov.idMaquina.idMaquina}</p>
              <p className="text-sm"><span className="font-semibold">Responsável:</span> {mov.idFuncionario.nomeFuncionario}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">Nenhuma manutenção encontrada.</div>
        )}
      </div>

      {/* Tabela Tradicional para TELAS MÉDIAS E GRANDES (escondida até 'md') */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border-t border-gray-300">
          <thead>
            <tr className="text-left text-sm text-gray-700 bg-gray-50">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Data</th>
              <th className="py-3 px-4">Tipo</th>
              <th className="py-3 px-4">Procedimento</th>
              <th className="py-3 px-4">ID Máquina</th>
              <th className="py-3 px-4">Responsável</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((mov, index) => (
              <tr key={index} className="border-t text-sm hover:bg-gray-50">
                <td className="py-3 px-4">{mov.idHistoricoManutencoes}</td>
                <td className="py-3 px-4">{new Date(mov.data).toLocaleDateString()}</td>
                <td className="py-3 px-4">{mov.tipoManutencao}</td>
                <td className="py-3 px-4">{mov.procedimentos}</td>
                <td className="py-3 px-4">{mov.idMaquina.idMaquina}</td>
                <td className="py-3 px-4">{mov.idFuncionario.nomeFuncionario}</td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">Nenhuma manutenção encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}