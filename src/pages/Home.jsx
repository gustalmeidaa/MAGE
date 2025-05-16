import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
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
              className={`w-3 ${
                i === 19 ? "bg-blue-500" : "bg-blue-300"
              } rounded-t`}
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
              <span className="text-gray-500">QTD</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-red-500 mr-4"></div>
              <span className="text-gray-700 flex-1">Inativas</span>
              <span className="text-gray-500">QTD</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-orange-400 mr-4"></div>
              <span className="text-gray-700 flex-1">Em manutenção</span>
              <span className="text-gray-500">QTD</span>
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