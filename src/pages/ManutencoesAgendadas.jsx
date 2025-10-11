import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Componente para listar as manutenções agendadas.
export default function ManutencoesAgendadas() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [filtro, setFiltro] = useState({
    id: "",
    data: "",
    tipo: "",
    idMaquina: "",
  });

  // Busca os dados da API quando o componente é montado.
  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        // ATENÇÃO: Substitua a URL pela sua API de agendamentos.
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/manutencoes-agendadas`);
        const data = await response.json();
        setAgendamentos(data);
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
      }
    };

    fetchAgendamentos();
  }, []);
  
  // Lógica de filtro adaptada para a estrutura de 'ManutencaoAgendada'.
  const filtrados = agendamentos.filter((man) => {
    // Formata a data para permitir a busca por dia, mês e ano.
    const dataFormatada = new Date(man.dataAgendada).toLocaleDateString("pt-BR");
    // Adiciona um dia à data do filtro para corrigir problemas de fuso horário na comparação.
    const dataFiltro = man.dataAgendada && new Date(filtro.data);
    if(dataFiltro) dataFiltro.setDate(dataFiltro.getDate() + 1);

    return (
      (filtro.id ? man.idManutencaoAgendada.toString().includes(filtro.id) : true) &&
      (filtro.data ? dataFormatada.includes(dataFiltro.toLocaleDateString("pt-BR")) : true) &&
      (filtro.tipo ? man.tipoManutencao.toLowerCase().includes(filtro.tipo.toLowerCase()) : true) &&
      (filtro.idMaquina ? man.maquina.idMaquina.toString().includes(filtro.idMaquina) : true)
    );
  });
  
  return (
    <div className="flex-1 p-4 sm:p-6 md:p-10 bg-white min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
        Manutenções Agendadas 🗓️
      </h1>

      {/* Botões de Navegação */}
      <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
        <Link to="/agendar-manutencao" className="w-full max-w-xs sm:w-auto">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full text-lg">
            Agendar Nova Manutenção
          </button>
        </Link>
        <Link to="/manutencoes" className="w-full max-w-xs sm:w-auto">
          <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full text-lg">
            Ver Histórico de Manutenções
          </button>
        </Link>
      </div>
      <br />
      
      {/* Filtros */}
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
        <button
          onClick={() => setFiltro({ id: "", data: "", tipo: "", idMaquina: "" })}
          className="border rounded px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 w-full max-w-xs md:w-auto"
        >
          Limpar Filtros
        </button>
      </div>

      {/* Visualização em Cards para TELAS PEQUENAS (visível até 'md') */}
      <div className="space-y-4 md:hidden">
        {filtrados.length > 0 ? (
          filtrados.map((man, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg shadow space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-800">{man.tipoManutencao}</p>
                  {/* Formata a data para incluir o horário */}
                  <p className="text-sm text-gray-500">{new Date(man.dataAgendada).toLocaleString('pt-BR')}</p>
                </div>
                <span className="text-sm text-gray-500 font-medium">ID: {man.idManutencaoAgendada}</span>
              </div>
              <p className="text-sm border-t pt-2"><span className="font-semibold">Procedimentos:</span> {man.procedimentos}</p>
              <p className="text-sm"><span className="font-semibold">Máquina:</span> {man.maquina.idMaquina}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">Nenhum agendamento encontrado.</div>
        )}
      </div>

      {/* Tabela Tradicional para TELAS MÉDIAS E GRANDES (escondida até 'md') */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border-t border-gray-300">
          <thead>
            <tr className="text-left text-sm text-gray-700 bg-gray-50">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Data Agendada</th>
              <th className="py-3 px-4">Tipo</th>
              <th className="py-3 px-4">Procedimentos</th>
              <th className="py-3 px-4">ID Máquina</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((man, index) => (
              <tr key={index} className="border-t text-sm hover:bg-gray-50">
                <td className="py-3 px-4">{man.idManutencaoAgendada}</td>
                {/* Formata a data para incluir o horário */}
                <td className="py-3 px-4">{new Date(man.dataAgendada).toLocaleString('pt-BR')}</td>
                <td className="py-3 px-4">{man.tipoManutencao}</td>
                <td className="py-3 px-4">{man.procedimentos}</td>
                <td className="py-3 px-4">{man.maquina.idMaquina}</td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr>
                {/* O colspan foi ajustado para 5 colunas */}
                <td colSpan="5" className="text-center py-4 text-gray-500">Nenhum agendamento encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}