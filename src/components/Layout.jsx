import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { getUsernameFromToken, logout } from "../auth"; // ✅ importe isso

const HamburgerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export default function Layout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const name = getUsernameFromToken();
    setUsername(name);
  }, []);

  const handleLinkClick = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Overlay para mobile */}
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
          {username ? (
            <div className="flex flex-col items-center space-y-1">
              <span className="font-bold text-lg">{username}</span>
              <button
                onClick={logout}
                className="text-sm text-red-400 hover:text-red-600"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-white font-bold"
              onClick={handleLinkClick}
            >
              Login
            </Link>
          )}
        </div>

        <nav className="flex flex-col space-y-4 w-full">
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
          <Link to="/cadastrar-administrador" className="text-white hover:text-gray-300" onClick={handleLinkClick}>
            Cadastrar Administrador
          </Link>
          <Link to="/logs" className="text-white hover:text-gray-300" onClick={handleLinkClick}>
            Logs
          </Link>
        </nav>
      </aside>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white shadow-md md:hidden">
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
