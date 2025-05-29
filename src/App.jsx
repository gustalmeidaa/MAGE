import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CadastroMaquina from "./pages/CadastroMaquina";
import Busca from "./pages/Busca";
import Funcionarios from "./pages/Funcionarios";
import RegistrarMovimentacao from "./pages/RegistarMovimentacao";
import RegistrarManutencao from "./pages/RegistrarManutencao";
import CadastroFuncionario from "./pages/CadastroFuncionario"
import Movimentacoes from "./pages/Movimentacoes"
import Manutencoes from "./pages/Manutencoes"
import Login from "./pages/Login"
import Setor from "./pages/Setor"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />  
          <Route path="cadastrar-maquina" element={<CadastroMaquina />} />
          <Route path="busca" element={<Busca />} />
          <Route path="funcionarios" element={<Funcionarios />} />
          <Route path="registrar-movimentacao" element={<RegistrarMovimentacao />} />
          <Route path="registrar-manutencao" element={<RegistrarManutencao />} />          
          <Route path="cadastrar-funcionario" element={<CadastroFuncionario />} />       
          <Route path="movimentacoes" element={<Movimentacoes />} />       
          <Route path="manutencoes" element={<Manutencoes />} />       
          <Route path="setores" element={<Setor />} />     
        </Route>
        <Route path="login" element={<Login />} /> 
      </Routes>
    </Router>
  );
}
