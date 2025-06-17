import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [statusCounts, setStatusCounts] = useState({
    ativas: 0,
    inativas: 0,
    emManutencao: 0,
  });

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/maquinas/status`
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar dados");
        }
        const data = await response.json();
        setStatusCounts({
          ativas: data.ativas ?? 0,
          inativas: data.inativas ?? 0,
          emManutencao: data.emManutencao ?? 0,
        });
      } catch (error) {
        console.error("Erro ao buscar status das máquinas:", error);
      }
    };

    fetchStatusCounts();
  }, []);

  const total =
    statusCounts.ativas + statusCounts.inativas + statusCounts.emManutencao;

  // Função que retorna altura da barra, no mínimo 10px pra ficar visível
  const getBarHeight = (count) => {
    if (total === 0) return "10px"; // Sem dados, mostra barra mínima
    const alturaPercent = (count / total) * 100;
    // Converte percent para px baseado na altura do container (256px = h-64)
    // Vamos limitar mínimo 10px
    const alturaPx = Math.max((alturaPercent / 100) * 256, 10);
    return `${alturaPx}px`;
  };

  return (
    <div className="container mx-auto">
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-800">Máquinas da Empresa</h1>
        <p className="text-gray-400 mt-2">Status geral das máquinas</p>

        {/* Gráfico */}
        <div className="flex items-end justify-center gap-16 mt-10 h-64 bg-blue-50 rounded-xl p-6 shadow-md">
          {/* Ativas */}
          <div className="flex flex-col items-center">
            <div
              className="bg-green-500 w-16 rounded-t"
              style={{ height: getBarHeight(statusCounts.ativas) }}
              title={`${statusCounts.ativas} máquinas ativas`}
            />
            <span className="mt-3 text-gray-700 font-semibold">Ativas</span>
            <span className="text-sm text-gray-500">{statusCounts.ativas}</span>
          </div>

          {/* Inativas */}
          <div className="flex flex-col items-center">
            <div
              className="bg-red-500 w-16 rounded-t"
              style={{ height: getBarHeight(statusCounts.inativas) }}
              title={`${statusCounts.inativas} máquinas inativas`}
            />
            <span className="mt-3 text-gray-700 font-semibold">Inativas</span>
            <span className="text-sm text-gray-500">{statusCounts.inativas}</span>
          </div>

          {/* Em manutenção */}
          <div className="flex flex-col items-center">
            <div
              className="bg-yellow-500 w-16 rounded-t"
              style={{ height: getBarHeight(statusCounts.emManutencao) }}
              title={`${statusCounts.emManutencao} máquinas em manutenção`}
            />
            <span className="mt-3 text-gray-700 font-semibold">Manutenção</span>
            <span className="text-sm text-gray-500">
              {statusCounts.emManutencao}
            </span>
          </div>
        </div>

        {/* Totais */}
        <div className="mt-10">
          <h2 className="font-bold text-lg mb-4">Totais</h2>
          <div className="flex flex-col gap-6">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-green-500 mr-4"></div>
              <span className="text-gray-700 flex-1">Ativas</span>
              <span className="text-gray-500">{statusCounts.ativas}</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-red-500 mr-4"></div>
              <span className="text-gray-700 flex-1">Inativas</span>
              <span className="text-gray-500">{statusCounts.inativas}</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-yellow-500 mr-4"></div>
              <span className="text-gray-700 flex-1">Em manutenção</span>
              <span className="text-gray-500">{statusCounts.emManutencao}</span>
            </div>
          </div>
        </div>

        {/* Botão */}
        <div className="mt-10">
          <Link to="/cadastrar-maquina">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full text-lg">
              Cadastrar Máquina
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
