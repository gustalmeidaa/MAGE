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

  useEffect(() => {
    const fetchMovimentacoes = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/movimentacoes`);
        const data = await response.json();
        setMovimentacoes(data);
      } catch (error) {
        console.error("Erro ao buscar movimentações:", error);
      }
    };

    fetchMovimentacoes();
  }, []);

  const filtrados = movimentacoes.filter((mov) => {
    const dataFormatada = new Date(mov.data).toLocaleDateString("pt-BR");
    return (
      (filtro.id ? mov.idMovimentacoes.toString().includes(filtro.id) : true) &&
      (filtro.data ? dataFormatada.includes(new Date(filtro.data).toLocaleDateString("pt-BR")) : true) &&
      (filtro.maquinaMovimentada ? mov.maquinaMovimentada.idMaquina.toString().includes(filtro.maquinaMovimentada) : true) &&
      (filtro.tipo ? mov.tipo.toLowerCase().includes(filtro.tipo.toLowerCase()) : true) &&
      (filtro.origem ? mov.origem.toLowerCase().includes(filtro.origem.toLowerCase()) : true) &&
      (filtro.destino ? mov.destino.toLowerCase().includes(filtro.destino.toLowerCase()) : true)
    );
  });

  return (
    // ALTERAÇÃO: Padding responsivo
    <div className="flex-1 p-4 sm:p-6 md:p-10 bg-white min-h-screen">
      {/* ALTERAÇÃO: Fonte responsiva */}
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
        Lista de Movimentações
      </h1>

      <div className="mt-8 flex justify-center">
        {/* ALTERAÇÃO: Botão com largura total em telas pequenas */}
        <Link to="/registrar-movimentacao" className="w-full max-w-xs md:w-auto">
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full text-lg">
            Registrar Movimentação
          </button>
        </Link>
      </div>
      <br />
      
      {/* Filtros */}
      {/* ALTERAÇÃO: Filtros empilhados e com wrap para se ajustar a qualquer tela */}
      <div className="flex flex-col items-center gap-4 md:flex-row md:flex-wrap md:justify-center mb-6">
        <input
          type="number"
          placeholder="Filtrar por ID"
          className="border rounded px-3 py-2 text-sm w-full max-w-xs md:w-auto"
          value={filtro.id}
          onChange={(e) => setFiltro({ ...filtro, id: e.target.value })}
        />
        <input
          type="text"
          onFocus={(e) => (e.target.type = "date")}
          onBlur={(e) => (e.target.type = "text")}
          placeholder="Filtrar por Data"
          className="border rounded px-3 py-2 text-sm w-full max-w-xs md:w-auto"
          value={filtro.data}
          onChange={(e) => setFiltro({ ...filtro, data: e.target.value })}
        />
        <input
          type="text"
          placeholder="ID da Máquina"
          className="border rounded px-3 py-2 text-sm w-full max-w-xs md:w-auto"
          value={filtro.maquinaMovimentada}
          onChange={(e) => setFiltro({ ...filtro, maquinaMovimentada: e.target.value })}
        />
        <input
          type="text"
          placeholder="Tipo de Movimentação"
          className="border rounded px-3 py-2 text-sm w-full max-w-xs md:w-auto"
          value={filtro.tipo}
          onChange={(e) => setFiltro({ ...filtro, tipo: e.target.value })}
        />
        <input
          type="text"
          placeholder="Origem"
          className="border rounded px-3 py-2 text-sm w-full max-w-xs md:w-auto"
          value={filtro.origem}
          onChange={(e) => setFiltro({ ...filtro, origem: e.target.value })}
        />
        <input
          type="text"
          placeholder="Destino"
          className="border rounded px-3 py-2 text-sm w-full max-w-xs md:w-auto"
          value={filtro.destino}
          onChange={(e) => setFiltro({ ...filtro, destino: e.target.value })}
        />

        <button
          onClick={() => setFiltro({ id: "", data: "", maquinaMovimentada: "", tipo: "", origem: "", destino: "" })}
          className="border rounded px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 w-full max-w-xs md:w-auto"
        >
          Limpar Filtros
        </button>
      </div>

      {/* Visualização em Cards para TELAS PEQUENAS (visível até 'md') */}
      <div className="space-y-4 md:hidden">
        {filtrados.length > 0 ? (
          filtrados.map((mov, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg shadow space-y-3">
              <div className="flex justify-between items-start border-b pb-2">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Máquina ID: {mov.maquinaMovimentada.idMaquina}</p>
                  <p className="font-bold text-gray-800">{mov.tipo}</p>
                </div>
                <span className="text-sm text-gray-500">ID: {mov.idMovimentacoes}</span>
              </div>
              <div className="flex items-center justify-between text-center">
                <div>
                  <p className="text-xs font-semibold text-gray-500">ORIGEM</p>
                  <p>{mov.origem}</p>
                </div>
                <div className="text-blue-500 font-bold text-xl mx-2">→</div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">DESTINO</p>
                  <p>{mov.destino}</p>
                </div>
              </div>
              <div className="text-right text-xs text-gray-400 border-t pt-2">
                {new Date(mov.data).toLocaleDateString()}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">Nenhuma movimentação encontrada.</div>
        )}
      </div>

      {/* Tabela Tradicional para TELAS MÉDIAS E GRANDES (escondida até 'md') */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border-t border-gray-300">
          <thead>
            <tr className="text-left text-sm text-gray-700 bg-gray-50">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Data</th>
              <th className="py-3 px-4">Máquina</th>
              <th className="py-3 px-4">Tipo</th>
              <th className="py-3 px-4">Origem</th>
              <th className="py-3 px-4">Destino</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((mov, index) => (
              <tr key={index} className="border-t text-sm hover:bg-gray-50">
                <td className="py-3 px-4">{mov.idMovimentacoes}</td>
                <td className="py-3 px-4">{new Date(mov.data).toLocaleDateString()}</td>
                <td className="py-3 px-4">{mov.maquinaMovimentada.idMaquina}</td>
                <td className="py-3 px-4">{mov.tipo}</td>
                <td className="py-3 px-4">{mov.origem}</td>
                <td className="py-3 px-4">{mov.destino}</td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">Nenhuma movimentação encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}