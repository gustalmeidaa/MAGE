import React from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-6 flex flex-col items-center">
        <div className="text-center mb-10">
          <div className="relative inline-block">
            <img
              src="https://via.placeholder.com/60"
              alt="Usuário"
              className="rounded-full w-16 h-16"
            />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              4
            </span>
          </div>
          <h3 className="mt-4 font-semibold text-lg">Usuário</h3>
          <p className="text-sm text-gray-400">exemplo@teste.com</p>
        </div>
        <nav className="flex flex-col space-y-4 w-full">
          <a href="/" className="text-white font-bold">Painel</a>
          <a href="/funcionarios" className="text-white font-bold">Funcionários</a>
          <a href="/busca" className="text-white font-bold">Busca</a>
          <a href="#" className="text-gray-400 hover:text-white">Manutenções</a>
          <a href="#" className="text-gray-400 hover:text-white">Movimentações</a>
        </nav>
      </aside>

      {/* Área de conteúdo (páginas) */}
      <main className="flex-1 p-16 bg-white rounded-tl-[2rem] overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
