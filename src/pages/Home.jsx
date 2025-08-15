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

  // Função para calcular altura da barra (sem alterações)
  const getBarHeight = (count) => {
    const maxCount = Math.max(
      statusCounts.ativas,
      statusCounts.inativas,
      statusCounts.emManutencao,
      1
    );
    const maxHeight = 256;
    const altura = (count / maxCount) * maxHeight;
    return `${Math.max(altura, 10)}px`;
  };

  return (
    <div className="container mx-auto">
      {/* ALTERAÇÃO: Padding menor em telas pequenas (p-4) e maior a partir de telas médias (md:p-10) */}
      <main className="flex-1 p-4 md:p-10">
        {/* ALTERAÇÃO: Tamanho da fonte menor em telas pequenas */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Máquinas da Empresa
        </h1>
        <p className="text-gray-400 mt-2">Status geral das máquinas</p>

        {/* Gráfico */}
        {/* ALTERAÇÃO:
            - flex-col: Empilha as barras verticalmente em telas pequenas (mobile-first).
            - md:flex-row: Alinha as barras horizontalmente em telas médias e maiores.
            - gap-8 / md:gap-16: Ajusta o espaçamento para cada layout.
        */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 mt-10 bg-blue-50 rounded-xl p-6 shadow-md">
          {[
            { label: "Ativas", color: "bg-green-500", count: statusCounts.ativas },
            { label: "Inativas", color: "bg-red-500", count: statusCounts.inativas },
            { label: "Manutenção", color: "bg-yellow-500", count: statusCounts.emManutencao },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <div className="flex items-end h-64">
                <div
                  className={`${item.color} w-16 rounded-t`}
                  style={{ height: getBarHeight(item.count) }}
                  title={`${item.count} máquinas ${item.label.toLowerCase()}`}
                ></div>
              </div>
              <span className="mt-3 text-gray-700 font-semibold">{item.label}</span>
              <span className="text-sm text-gray-500">{item.count}</span>
            </div>
          ))}
        </div>

        {/* Totais */}
        {/* ALTERAÇÃO: Adicionado max-w-md para melhorar a legibilidade em telas muito largas */}
        <div className="mt-10 max-w-md mx-auto">
          <h2 className="font-bold text-lg mb-4 text-center md:text-left">Totais</h2>
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

        {/* Botões */}
        {/* ALTERAÇÃO: 
            - flex-col: Empilha os botões em telas pequenas.
            - md:flex-row: Alinha horizontalmente a partir de telas médias.
            - gap-4: Espaçamento menor para o layout de coluna.
        */}
        <div className="mt-10 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6">
          {/* ALTERAÇÃO: w-full e md:w-auto para os botões ocuparem toda a largura no mobile */}
          <Link to="/cadastrar-maquina" className="w-full md:w-auto">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full text-lg">
              Cadastrar Máquina
            </button>
          </Link>
          <Link to="/busca" className="w-full md:w-auto">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full text-lg">
              Buscar Máquina
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}