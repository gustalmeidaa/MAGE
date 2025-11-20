import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// 1. A importação principal do jsPDF
import jsPDF from "jspdf";
// 2. O plugin da tabela (NECESSÁRIO)
import "jspdf-autotable";
// 💡 Importa a instância configurada do Axios (api) que anexa o token
import api from "../api"; 

export default function Funcionarios() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState({ id: "", nome: "" });

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 💡 SUBSTITUIÇÃO: Usando 'api.get' para incluir o token JWT
        const response = await api.get("/funcionarios");
        const data = response.data; // Com Axios, os dados estão em response.data

        const dataArray = data || [];
        const sortedData = dataArray.sort(
          (a, b) => a.idFuncionario - b.idFuncionario
        );

        const mappedData = sortedData.map((funcionario) => ({
          id: funcionario.idFuncionario.toString(),
          nome: funcionario.nomeFuncionario,
          setor: funcionario.setor?.nomeSetor || "N/A",
        }));

        setDados(mappedData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Função de exportar CSV
  const handleExportCSV = () => {
    if (filtrados.length === 0) {
      alert("Não há dados para exportar.");
      return;
    }

    const headers = ["ID", "Nome", "Setor"];
    const csvRows = [headers.join(",")];

    filtrados.forEach((func) => {
      const row = [func.id, func.nome || "-", func.setor || "N/A"];
      csvRows.push(row.map((val) => `"${val}"`).join(","));
    });

    const csvData = new Blob(["\uFEFF" + csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(csvData);
    const link = document.createElement("a");
    link.href = url;
    link.download = "funcionarios.csv";
    link.click();
  };

  // FUNÇÃO DE EXPORTAR PDF
  const handleExportPDF = () => {
    if (filtrados.length === 0) {
      alert("Nenhum dado para exportar.");
      return;
    }
    try {
      const doc = new jsPDF();
      const tableColumn = ["ID", "Nome", "Setor"];
      const tableRows = [];

      filtrados.forEach((func) => {
        const funcData = [
          func.id,
          func.nome || "-",
          func.setor || "N/A",
        ];
        tableRows.push(funcData);
      });

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        didDrawPage: (data) => {
          doc.setFontSize(18);
          doc.text("Relatório de Funcionários", data.settings.margin.left, 15);
        },
      });
      doc.save("relatorio_funcionarios.pdf");
    } catch (error) {
      console.error("Falha ao gerar o PDF:", error);
      alert("Ocorreu um erro ao tentar gerar o PDF.");
    }
  };

  const filtrados = dados.filter(
    (f) =>
      f.id.toLowerCase().includes(filtro.id.toLowerCase()) &&
      f.nome.toLowerCase().includes(filtro.nome.toLowerCase())
  );

  if (loading)
    return <p className="p-6 text-gray-600">Carregando funcionários...</p>;

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold text-gray-800">
          Lista de Funcionários
        </h2>

        {/* BOTÕES */}
        <div className="flex flex-wrap gap-3">
          <Link to="/cadastrar-funcionario">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition">
              + Cadastrar Funcionário
            </button>
          </Link>
          <button
            onClick={handleExportCSV}
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 px-5 rounded-full text-sm shadow-md transition-transform transform hover:scale-105"
          >
            Exportar para CSV 📊
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-md transition"
          >
            Exportar para PDF 📄
          </button>
        </div>
        {/* FIM DOS BOTÕES */}
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg shadow-sm border">
        <input
          type="number"
          placeholder="Filtrar por ID"
          className="border rounded px-3 py-2 text-sm w-full md:w-auto"
          value={filtro.id}
          onChange={(e) => setFiltro({ ...filtro, id: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filtrar por Nome"
          className="border rounded px-3 py-2 text-sm w-full md:w-auto"
          value={filtro.nome}
          onChange={(e) => setFiltro({ ...filtro, nome: e.target.value })}
        />
        <button
          onClick={() => setFiltro({ id: "", nome: "" })}
          className="border rounded px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 w-full md:w-auto"
        >
          Limpar Filtros
        </button>
      </div>

      {/* Estado Vazio */}
      {filtrados.length === 0 ? (
        <div className="text-center text-gray-500 py-8 border rounded-lg shadow-sm bg-gray-50">
          Nenhum funcionário encontrado 😅
        </div>
      ) : (
        // Wrapper da Lista
        <div className="overflow-x-auto">
          {/* Tabela Desktop */}
          <table className="hidden md:table min-w-full border border-gray-300 rounded-lg shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border text-left">ID</th>
                <th className="px-4 py-2 border text-left">Nome</th>
                <th className="px-4 py-2 border text-left">Setor</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((func) => (
                <tr key={func.id} className="hover:bg-gray-50 text-sm">
                  <td className="border px-4 py-2">{func.id}</td>
                  <td className="border px-4 py-2">{func.nome}</td>
                  <td className="border px-4 py-2">{func.setor}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Cards Mobile */}
          <div className="md:hidden space-y-4">
            {filtrados.map((func) => (
              <div
                key={func.id}
                className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-700">Nome:</span>
                  <span className="font-bold">{func.nome}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>ID:</span>
                  <span>{func.id}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Setor:</span>
                  <span>{func.setor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}