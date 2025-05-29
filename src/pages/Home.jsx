import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [statusCounts, setStatusCounts] = useState({
    ativas: 0,
    inativas: 0,
    em_manutencao: 0,
  });

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const response = await fetch('http://localhost:8080/maquinas/status');
        if (!response.ok) {
          throw new Error('Erro ao buscar dados');
        }
        const data = await response.json();
        setStatusCounts(data);
      } catch (error) {
        console.error('Erro ao buscar status das máquinas:', error);
      }
    };

    fetchStatusCounts();
  }, []);

  return (
    <div className="container">
      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-800">Máquinas da Empresa</h1>
        <p className="text-gray-400 mt-2">01 - 25 March, 2025</p>

        {/* Graph Placeholder */}
        <div className="h-32 mt-8 bg-blue-100 rounded-lg flex items-end p-4 gap-2">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`w-3 ${i === 19 ? "bg-blue-500" : "bg-blue-300"} rounded-t`}
              style={{ height: `${Math.random() * 100}%` }}
            />
          ))}
        </div>

        {/* Status Totals */}
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

        {/* Button */}
        <div className="mt-10">
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full text-lg">
            <Link to="/cadastrar-maquina">Cadastrar Máquina</Link>
          </button>
        </div>
      </main>
    </div>
  );
}
