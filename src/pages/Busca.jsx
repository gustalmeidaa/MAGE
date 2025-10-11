import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// 1. A importação principal do jsPDF
import jsPDF from "jspdf";
// 2. O plugin da tabela, que adiciona a função .autoTable()
import "jspdf-autotable";

export default function Busca() {
  const [dados, setDados] = useState([]);
  const [filtro, setFiltro] = useState({
    codPatrimonial: "",
    numSerie: "",
    localizacao: "",
    status: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/maquinas`);
        const data = await response.json();
        setDados(data);
      } catch (error) {
        console.error("Erro ao buscar dados das máquinas:", error);
      }
    };
    fetchData();
  }, []);

  const filtrados = dados.filter(
    (m) =>
      (m.codPatrimonial || "").toLowerCase().includes(filtro.codPatrimonial.toLowerCase()) &&
      (m.numSerie || "").toLowerCase().includes(filtro.numSerie.toLowerCase()) &&
      (m.localizacao || "").toLowerCase().includes(filtro.localizacao.toLowerCase()) &&
      (m.status || "").toLowerCase().includes(filtro.status.toLowerCase())
  );

  const handleExportCSV = () => {
    if (filtrados.length === 0) {
      alert("Nenhum dado para exportar.");
      return;
    }
    const headers = ["Cód. Patrimonial", "Nº de Série", "Localização", "Valor (R$)", "Status", "ID Responsável"];
    const rows = filtrados.map(m =>
      [
        `"${m.codPatrimonial || ''}"`,
        `"${m.numSerie || ''}"`,
        `"${m.localizacao || ''}"`,
        m.valor?.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(",", ".") || "0.00",
        `"${m.status || ''}"`,
        `"${m.idResponsavel || 'N/A'}"`
      ].join(',')
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "relatorio_maquinas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    if (filtrados.length === 0) {
      alert("Nenhum dado para exportar.");
      return;
    }
    try {
      const doc = new jsPDF();
      const tableColumn = ["Cód. Patrimonial", "Nº de Série", "Localização", "Valor (R$)", "Status", "ID Responsável"];
      const tableRows = [];

      filtrados.forEach(m => {
        const maquinaData = [
          m.codPatrimonial || "-",
          m.numSerie || "-",
          m.localizacao || "-",
          m.valor?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) || "R$ 0,00",
          m.status || "-",
          m.idResponsavel || 'N/A'
        ];
        tableRows.push(maquinaData);
      });

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        didDrawPage: (data) => {
          doc.setFontSize(18);
          doc.text("Relatório de Máquinas", data.settings.margin.left, 15);
        }
      });
      doc.save("relatorio_maquinas.pdf");
    } catch (error) {
      console.error("Falha ao gerar o PDF:", error);
      alert("Ocorreu um erro ao tentar gerar o PDF.");
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-10 bg-white min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
        Lista de Máquinas
      </h1>

      <div className="mt-8 flex justify-center">
        <Link to="/cadastrar-maquina" className="w-full max-w-xs md:w-auto">
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full text-lg">
            Cadastrar Máquina
          </button>
        </Link>
      </div>

      <div className="flex flex-col items-center gap-4 my-6 md:flex-row md:flex-wrap md:justify-center">
        <input type="text" placeholder="Código Patrimonial" className="border rounded px-3 py-2 text-sm w-full max-w-xs md:w-auto" value={filtro.codPatrimonial} onChange={(e) => setFiltro({ ...filtro, codPatrimonial: e.target.value })} />
        <input type="text" placeholder="Nº de Série" className="border rounded px-3 py-2 text-sm w-full max-w-xs md:w-auto" value={filtro.numSerie} onChange={(e) => setFiltro({ ...filtro, numSerie: e.target.value })} />
        <input type="text" placeholder="Localização" className="border rounded px-3 py-2 text-sm w-full max-w-xs md:w-auto" value={filtro.localizacao} onChange={(e) => setFiltro({ ...filtro, localizacao: e.target.value })} />
        <input type="text" placeholder="Status" className="border rounded px-3 py-2 text-sm w-full max-w-xs md:w-auto" value={filtro.status} onChange={(e) => setFiltro({ ...filtro, status: e.target.value })} />
        <button onClick={() => setFiltro({ codPatrimonial: "", numSerie: "", localizacao: "", status: "" })} className="border rounded px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 w-full max-w-xs md:w-auto">
          Limpar Filtros
        </button>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button onClick={handleExportCSV} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-full text-sm">
          Exportar para CSV 📊
        </button>
        <button onClick={handleExportPDF} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full text-sm">
          Exportar para PDF 📄
        </button>
      </div>

      <div className="space-y-4 md:hidden">
        {filtrados.length > 0 ? (
          filtrados.map((m) => (
            <div key={`card-${m.codPatrimonial}`} className="bg-gray-50 p-4 rounded-lg shadow space-y-2">
              <div className="flex justify-between items-start font-bold">
                <span className="text-gray-800">CP: {m.codPatrimonial}</span>
                <span className={`px-2 py-1 text-xs rounded-full text-white ${m.status === 'Ativa' ? 'bg-green-500' : m.status === 'Inativa' ? 'bg-red-500' : 'bg-yellow-500'}`}>{m.status}</span>
              </div>
              <p className="text-sm"><span className="font-semibold">Nº Série:</span> {m.numSerie}</p>
              <p className="text-sm"><span className="font-semibold">Local:</span> {m.localizacao}</p>
              <div className="flex justify-between items-center border-t pt-2 mt-2">
                <span className="text-sm"><span className="font-semibold">Responsável ID:</span> {m.idResponsavel || 'N/A'}</span>
                <span className="font-bold text-gray-700">{m.valor?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">Nenhuma máquina encontrada.</div>
        )}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border-t border-gray-300">
          <thead>
            <tr className="text-left text-sm text-gray-700 bg-gray-50">
              <th className="py-3 px-4">Cód. Patrimonial</th>
              <th className="py-3 px-4">Nº de Série</th>
              <th className="py-3 px-4">Localização</th>
              <th className="py-3 px-4">Valor (R$)</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">ID Responsável</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((m) => (
              <tr key={`row-${m.codPatrimonial}`} className="border-t text-sm hover:bg-gray-50">
                <td className="py-3 px-4">{m.codPatrimonial}</td>
                <td className="py-3 px-4">{m.numSerie}</td>
                <td className="py-3 px-4">{m.localizacao}</td>
                <td className="py-3 px-4">{m.valor?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                <td className="py-3 px-4">{m.status}</td>
                <td className="py-3 px-4">{m.idResponsavel || 'N/A'}</td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr><td colSpan="6" className="text-center py-4 text-gray-500">Nenhuma máquina encontrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}