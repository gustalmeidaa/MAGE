import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CadastroMaquina from "./pages/CadastroMaquina";
import Busca from "./pages/Busca";
import Funcionarios from "./pages/Funcionarios"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="cadastrar-maquina" element={<CadastroMaquina />} />
          <Route path="busca" element={<Busca />} />
          <Route path="funcionarios" element={<Funcionarios />} />
        </Route>
      </Routes>
    </Router>
  );
}
