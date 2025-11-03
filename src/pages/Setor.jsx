import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// Importações para PDF
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function Setor() {
  const [setores, setSetores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState({
    idSetor: "",
    nomeSetor: "",
  });

  useEffect(() => {
    const fetchSetores = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/setores`
        );
        const data = await response.json();

        const dataArray = data || [];
        const sortedData = dataArray.sort((a, b) => a.idSetor - b.idSetor);

        setSetores(sortedData);
      } catch (error) {
        console.error("Erro ao buscar setores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSetores();
  }, []);

  const filtrados = setores.filter((set) => {
    return (
      (filtro.idSetor
        ? set.idSetor.toString().includes(filtro.idSetor)
        : true) &&
      (filtro.nomeSetor
        ? set.nomeSetor.toLowerCase().includes(filtro.nomeSetor.toLowerCase())
        : true)
    );
  });

  const handleExportCSV = () => {
    if (filtrados.length === 0) {
      alert("Não há dados para exportar.");
      return;
    }

    const headers = ["ID", "Nome do Setor"];
    const csvRows = [headers.join(",")];

    filtrados.forEach((set) => {
      const row = [set.idSetor, set.nomeSetor];
      csvRows.push(row.map((val) => `"${val}"`).join(","));
    });

    const csvData = new Blob(["\uFEFF" + csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(csvData);
    const link = document.createElement("a");
    link.href = url;
    link.download = "setores.csv";
    link.click();
  };

  // --- FUNÇÃO DE EXPORTAR PDF ADICIONADA ---
  const handleExportPDF = () => {
    if (filtrados.length === 0) {
      alert("Nenhum dado para exportar.");
      return;
    }
    try {
      const doc = new jsPDF();
      const tableColumn = ["ID", "Nome do Setor"];
      const tableRows = [];

      filtrados.forEach((set) => {
        const setorData = [set.idSetor, set.nomeSetor || "-"];
        tableRows.push(setorData);
      });

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        didDrawPage: (data) => {
          doc.setFontSize(18);
          doc.text("Relatório de Setores", data.settings.margin.left, 15);
        },
      });
      doc.save("relatorio_setores.pdf");
    } catch (error) {
      console.error("Falha ao gerar o PDF:", error);
      alert("Ocorreu um erro ao tentar gerar o PDF.");
    }
  };
  // --- FIM DA FUNÇÃO ---

  if (loading)
    return <p className="p-6 text-gray-600">Carregando setores...</p>;

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold text-gray-800">Lista de Setores</h2>

        {/* --- BOTÕES ATUALIZADOS --- */}
        <div className="flex flex-wrap gap-3">
          <Link to="/cadastrar-setor">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition">
              + Cadastrar Setor
            </button>
          </Link>

          <button
            onClick={handleExportCSV}
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 px-5 rounded-full text-sm shadow-md transition-transform transform hover:scale-105"
          >
            Exportar para CSV 📊
          </button>

          {/* Botão de PDF adicionado */}
          <button
            onClick={handleExportPDF}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-md transition"
          >
            Exportar para PDF 📄
          </button>
        </div>
        {/* --- FIM DA ATUALIZAÇÃO --- */}
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg shadow-sm border">
        <input
          type="number"
          placeholder="Filtrar por ID"
          className="border rounded px-3 py-2 text-sm w-full md:w-auto"
          value={filtro.idSetor}
          onChange={(e) => setFiltro({ ...filtro, idSetor: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filtrar por Nome do Setor"
          className="border rounded px-3 py-2 text-sm w-full md:w-auto"
          value={filtro.nomeSetor}
          onChange={(e) => setFiltro({ ...filtro, nomeSetor: e.target.value })}
        />
        <button
          onClick={() => setFiltro({ idSetor: "", nomeSetor: "" })}
          className="border rounded px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 w-full md:w-auto"
        >
          Limpar Filtros
        </button>
      </div>

      {/* Estado Vazio */}
      {filtrados.length === 0 ? (
        <div className="text-center text-gray-500 py-8 border rounded-lg shadow-sm bg-gray-50">
          Nenhum setor encontrado 😅
        </div>
      ) : (
        // Wrapper da Lista
        <div className="overflow-x-auto">
          {/* Tabela Desktop */}
          <table className="hidden md:table min-w-full border border-gray-300 rounded-lg shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border text-left">ID</th>
                <th className="px-4 py-2 border text-left">Nome do Setor</th>
              </tr>
            </thead>

            <tbody>
              {filtrados.map((set) => (
                <tr key={set.idSetor} className="hover:bg-gray-50 text-sm">
                  <td className="border px-4 py-2">{set.idSetor}</td>
                  <td className="border px-4 py-2">{set.nomeSetor}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Cards Mobile */}
          <div className="md:hidden space-y-4">
            {filtrados.map((set) => (
              <div
                key={set.idSetor}
                className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-700">Setor:</span>
                  <span className="font-bold">{set.nomeSetor}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>ID:</span>
                  <span>{set.idSetor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}