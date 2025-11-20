import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// 💡 Importa a instância do Axios configurada para enviar o token JWT
import api from "../api"; 

export default function Home() {
  const [statusCounts, setStatusCounts] = useState({
    ativas: 0,
    inativas: 0,
    emManutencao: 0,
  });

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        // 💡 SUBSTITUIÇÃO: Usando 'api.get' em vez de 'fetch'
        // 'api' anexa automaticamente o cabeçalho 'Authorization: Bearer <token>'
        const response = await api.get("/maquinas/status"); 
        
        // Com Axios, a resposta de erro é tratada no bloco catch, e os dados estão em response.data
        const data = response.data; 
        
        setStatusCounts({
          ativas: data.ativas ?? 0,
          inativas: data.inativas ?? 0,
          emManutencao: data.emManutencao ?? 0,
        });
      } catch (error) {
        // Axios errors têm a propriedade response
        if (error.response && error.response.status === 403) {
            console.error("Acesso Negado: O token é inválido ou ausente.");
            // O interceptador já deve ter chamado o logout, se for o caso.
        } else {
            console.error("Erro ao buscar status das máquinas:", error);
        }
      }
    };

    fetchStatusCounts();
  }, []);

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
      <main className="flex-1 p-4 md:p-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Máquinas da Empresa
        </h1>
        <p className="text-gray-400 mt-2">Status geral das máquinas</p>

        {/* Gráfico */}
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
        <div className="mt-10 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6">
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