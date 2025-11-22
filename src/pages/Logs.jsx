import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import api from "../api"; 

export default function Logs() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState({ id: "", operacao: "" });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // SUBSTITUIÇÃO: Usando 'api.get' para incluir o token JWT
        const response = await api.get("/logs");
        const data = response.data; 

        const dataArray = data || [];
        // Ordena por ID do Log (idLog)
        const sortedData = dataArray.sort(
          (a, b) => a.idLog - b.idLog
        );

        // Mapeia os dados para o formato que será usado no componente
        const mappedData = sortedData.map((log) => ({
          id: log.idLog.toString(),
          operacao: log.operacao,
          dadosAntigos: log.dadosAntigos,
          dadosNovos: log.dadosNovos,
          dataMovimentacao: new Date(log.dataMovimentacao).toLocaleString(), // Formata a data/hora
          loginUsuario: log.loginUsuario || "N/A",
        }));

        setDados(mappedData);
      } catch (error) {
        console.error("Erro ao buscar logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- FUNÇÕES DE EXPORTAÇÃO ---

  // Colunas para exportação
  const exportHeaders = [
    "ID",
    "Operação",
    "Dados Antigos",
    "Dados Novos",
    "Data",
    "Usuário",
  ];

  // Função para mapear os dados filtrados para um array de linhas
  const mapDataToRows = (data) => {
    return data.map((log) => [
      log.id,
      log.operacao || "-",
      log.dadosAntigos.substring(0, 50) + "...", // Limita o texto para exportação
      log.dadosNovos.substring(0, 50) + "...", // Limita o texto para exportação
      log.dataMovimentacao,
      log.loginUsuario,
    ]);
  };

  // Função de exportar CSV
  const handleExportCSV = () => {
    if (filtrados.length === 0) {
      alert("Não há dados para exportar.");
      return;
    }

    const csvRows = [exportHeaders.join(",")];

    mapDataToRows(filtrados).forEach((row) => {
      csvRows.push(row.map((val) => `"${val.replace(/"/g, '""')}"`).join(","));
    });

    const csvData = new Blob(["\uFEFF" + csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(csvData);
    const link = document.createElement("a");
    link.href = url;
    link.download = "logs.csv";
    link.click();
  };

  // Função de exportar PDF
  const handleExportPDF = () => {
    if (filtrados.length === 0) {
      alert("Nenhum dado para exportar.");
      return;
    }
    try {
      const doc = new jsPDF("landscape"); // Muda para orientação paisagem para mais espaço
      const tableRows = mapDataToRows(filtrados);

      doc.autoTable({
        head: [exportHeaders],
        body: tableRows,
        startY: 20,
        // Adiciona um estilo básico para as colunas com muito texto
        columnStyles: {
          2: { cellWidth: 35 }, // Dados Antigos
          3: { cellWidth: 35 }, // Dados Novos
        },
        didDrawPage: (data) => {
          doc.setFontSize(18);
          doc.text("Relatório de Logs do Sistema", data.settings.margin.left, 15);
        },
      });
      doc.save("relatorio_logs.pdf");
    } catch (error) {
      console.error("Falha ao gerar o PDF:", error);
      alert("Ocorreu um erro ao tentar gerar o PDF.");
    }
  };
  // --- FIM DAS FUNÇÕES DE EXPORTAÇÃO ---


  // Lógica de filtro (por ID do Log e Operação)
  const filtrados = dados.filter(
    (log) =>
      log.id.toLowerCase().includes(filtro.id.toLowerCase()) &&
      log.operacao.toLowerCase().includes(filtro.operacao.toLowerCase())
  );

  if (loading)
    return <p className="p-6 text-gray-600">Carregando logs...</p>;

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold text-gray-800">
          Logs do Sistema 📜
        </h2>

        {/* Botões de Exportação */}
        <div className="flex flex-wrap gap-3">
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
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg shadow-sm border">
        <input
          type="number"
          placeholder="Filtrar por ID do Log"
          className="border rounded px-3 py-2 text-sm w-full md:w-auto"
          value={filtro.id}
          onChange={(e) => setFiltro({ ...filtro, id: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filtrar por Operação"
          className="border rounded px-3 py-2 text-sm w-full md:w-auto"
          value={filtro.operacao}
          onChange={(e) => setFiltro({ ...filtro, operacao: e.target.value })}
        />
        <button
          onClick={() => setFiltro({ id: "", operacao: "" })}
          className="border rounded px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 w-full md:w-auto"
        >
          Limpar Filtros
        </button>
      </div>

      {/* Estado Vazio */}
      {filtrados.length === 0 ? (
        <div className="text-center text-gray-500 py-8 border rounded-lg shadow-sm bg-gray-50">
          Nenhum log encontrado 😔
        </div>
      ) : (
        // Wrapper da Lista
        <div className="overflow-x-auto">
          {/* Tabela Desktop */}
          <table className="hidden md:table min-w-full border border-gray-300 rounded-lg shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border text-left">ID</th>
                <th className="px-4 py-2 border text-left">Operação</th>
                <th className="px-4 py-2 border text-left">Dados Antigos</th>
                <th className="px-4 py-2 border text-left">Dados Novos</th>
                <th className="px-4 py-2 border text-left">Data</th>
                <th className="px-4 py-2 border text-left">Usuário</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 text-sm">
                  <td className="border px-4 py-2 font-mono">{log.id}</td>
                  <td className="border px-4 py-2">{log.operacao}</td>
                  {/* Usa um div para quebra de linha em dados longos */}
                  <td className="border px-4 py-2 max-w-xs">
                    <div className="break-words max-h-20 overflow-y-auto">
                      {log.dadosAntigos}
                    </div>
                  </td>
                  <td className="border px-4 py-2 max-w-xs">
                    <div className="break-words max-h-20 overflow-y-auto">
                      {log.dadosNovos}
                    </div>
                  </td>
                  <td className="border px-4 py-2 whitespace-nowrap">{log.dataMovimentacao}</td>
                  <td className="border px-4 py-2">{log.loginUsuario}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Cards Mobile (Adaptado para Logs) */}
          <div className="md:hidden space-y-4">
            {filtrados.map((log) => (
              <div
                key={log.id}
                className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-700">ID / Operação:</span>
                  <span className="font-bold">{log.id} - {log.operacao}</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-semibold">Usuário:</span>
                  <span> {log.loginUsuario}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Data:</span>
                  <span> {log.dataMovimentacao}</span>
                </div>
                <div className="mt-3 p-2 bg-gray-100 rounded">
                  <span className="font-semibold text-sm block">Dados Antigos:</span>
                  <p className="text-xs break-all max-h-12 overflow-y-auto">{log.dadosAntigos}</p>
                </div>
                <div className="mt-2 p-2 bg-gray-100 rounded">
                  <span className="font-semibold text-sm block">Dados Novos:</span>
                  <p className="text-xs break-all max-h-12 overflow-y-auto">{log.dadosNovos}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}