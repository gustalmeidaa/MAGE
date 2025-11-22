import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CadastroMaquina from "./pages/CadastroMaquina";
import Busca from "./pages/Busca";
import Funcionarios from "./pages/Funcionarios";
import RegistrarMovimentacao from "./pages/RegistrarMovimentacao";
import RegistrarManutencao from "./pages/RegistrarManutencao";
import ManutencoesAgendadas from "./pages/ManutencoesAgendadas";
import AgendarManutencao from "./pages/AgendarManutencao";
import CadastroFuncionario from "./pages/CadastroFuncionario";
import Movimentacoes from "./pages/Movimentacoes";
import Manutencoes from "./pages/Manutencoes";
import Login from "./pages/Login";
import Setor from "./pages/Setor";
import CadastroSetor from "./pages/CadastroSetor";
import ProtectedRoute from "./ProtectedRoute";
import CadastrarAdministrador from "./pages/CadastrarAdministrador";
import Logs from "./pages/Logs"

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="cadastrar-maquina" element={<CadastroMaquina />} />
          <Route path="busca" element={<Busca />} />
          <Route path="funcionarios" element={<Funcionarios />} />
          <Route path="registrar-movimentacao" element={<RegistrarMovimentacao />} />
          <Route path="registrar-manutencao" element={<RegistrarManutencao />} />
          <Route path="manutencoes-agendadas" element={<ManutencoesAgendadas />} />
          <Route path="agendar-manutencao" element={<AgendarManutencao />} />
          <Route path="cadastrar-funcionario" element={<CadastroFuncionario />} />
          <Route path="movimentacoes" element={<Movimentacoes />} />
          <Route path="manutencoes" element={<Manutencoes />} />
          <Route path="setores" element={<Setor />} />
          <Route path="cadastrar-setor" element={<CadastroSetor />} />
          <Route path="cadastrar-administrador" element={<CadastrarAdministrador />} />
          <Route path="logs" element={<Logs />} />
        </Route>

        {/* Rota pública (login) */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
