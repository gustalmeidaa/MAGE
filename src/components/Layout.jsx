import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";

// Um ícone simples de "Hambúrguer" para o botão
const HamburgerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

export default function Layout() {
  // Estado para controlar se a sidebar está aberta ou fechada em telas pequenas
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Função para fechar a sidebar (útil para os links de navegação)
  const handleLinkClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Overlay para escurecer o conteúdo quando a sidebar estiver aberta no mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-64 bg-black text-white p-6 flex flex-col items-center 
          fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0
        `}
      >
        <div className="text-center mb-10">
          <Link to="/login" className="text-white font-bold" onClick={handleLinkClick}>
            Login
          </Link>
        </div>
        <nav className="flex flex-col space-y-4 w-full">
          {/* ALTERAÇÃO: Trocamos <a> por <Link> e adicionamos o onClick para fechar o menu */}
          <Link to="/" className="text-white hover:text-gray-300" onClick={handleLinkClick}>
            Máquinas
          </Link>
          <Link to="/funcionarios" className="text-white hover:text-gray-300" onClick={handleLinkClick}>
            Funcionários
          </Link>
          <Link to="/manutencoes" className="text-white hover:text-gray-300" onClick={handleLinkClick}>
            Manutenções
          </Link>
          <Link to="/movimentacoes" className="text-white hover:text-gray-300" onClick={handleLinkClick}>
            Movimentações
          </Link>
          <Link to="/setores" className="text-white hover:text-gray-300" onClick={handleLinkClick}>
            Setores
          </Link>
        </nav>
      </aside>

      {/* Área de conteúdo (páginas) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white shadow-md md:hidden">
          {/* Botão Hambúrguer - visível apenas em telas pequenas (md:hidden) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-800 focus:outline-none md:hidden"
          >
            <HamburgerIcon />
          </button>
        </header>

        <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto bg-white md:rounded-tl-[2rem]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}