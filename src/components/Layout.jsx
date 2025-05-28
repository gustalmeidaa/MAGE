import React from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-6 flex flex-col items-center">
        <div className="text-center mb-10">
            <a href="/login" className="text-white font-bold">Login</a>
        </div>
        <nav className="flex flex-col space-y-4 w-full">
          <a href="/" className="text-white">Máquinas</a>
          <a href="/funcionarios" className="text-white">Funcionários</a>
          <a href="/busca" className="text-white">Busca</a>
          <a href="/manutencoes" className="text-white">Manutenções</a>
          <a href="/movimentacoes" className="text-white">Movimentações</a>
        </nav>
      </aside>

      {/* Área de conteúdo (páginas) */}
      <main className="flex-1 p-16 bg-white rounded-tl-[2rem] overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
