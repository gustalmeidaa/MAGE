import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// Importações para o PDF
import jsPDF from "jspdf";
import "jspdf-autotable";
// 💡 Importa a instância configurada do Axios (api) que anexa o token
import api from "../api"; 

export default function Movimentacoes() { // Mantém o nome da função Movimentacoes, mas se refere a Manutenções
  const [manutencoes, setManutencoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState({
    id: "",
    data: "",
    tipo: "",
    idMaquina: "",
    idResponsavel: "",
  });

  useEffect(() => {
    const fetchManutencoes = async () => {
      setLoading(true);
      try {
        // 💡 SUBSTITUIÇÃO: Usando 'api.get' para incluir o token JWT
        const response = await api.get("/manutencoes");
        // Com Axios, os dados estão em response.data
        const data = response.data; 

        const dataArray = data || [];
        // Ordena por ID crescente
        const sortedData = dataArray.sort(
          (a, b) => a.idHistoricoManutencoes - b.idHistoricoManutencoes
        );

        setManutencoes(sortedData);
      } catch (error) {
        console.error("Erro ao buscar manutenções:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchManutencoes();
  }, []);

  const filtrados = manutencoes.filter((mov) => {
    let dataFiltroFormatada = "";
    if (filtro.data) {
      try {
        const dataObj = new Date(filtro.data);
        dataFiltroFormatada = dataObj.toISOString().split('T')[0];
      } catch (e) {
        /* Data inválida, ignora filtro */
      }
    }
    
    const dataMovFormatada = new Date(mov.data).toISOString().split('T')[0];

    return (
      (filtro.id
        ? mov.idHistoricoManutencoes.toString().includes(filtro.id)
        : true) &&
      (filtro.data ? dataMovFormatada === dataFiltroFormatada : true) &&
      (filtro.tipo
        ? mov.tipoManutencao.toLowerCase().includes(filtro.tipo.toLowerCase())
        : true) &&
      (filtro.idMaquina
        ? mov.idMaquina?.idMaquina.toString().includes(filtro.idMaquina)
        : true) &&
      (filtro.idResponsavel
        ? mov.idFuncionario?.idFuncionario
            .toString()
            .includes(filtro.idResponsavel)
        : true)
    );
  });

  // Função de exportar CSV
  const handleExportCSV = () => {
    if (filtrados.length === 0) {
      alert("Não há dados para exportar.");
      return;
    }

    const headers = [
      "ID",
      "Data",
      "Tipo",
      "ID Máquina",
      "Responsável",
      "Procedimento",
    ];
    const csvRows = [headers.join(",")];

    filtrados.forEach((mov) => {
      const row = [
        mov.idHistoricoManutencoes,
        new Date(mov.data).toLocaleDateString("pt-BR"),
        mov.tipoManutencao || "-",
        mov.idMaquina?.idMaquina || "-",
        mov.idFuncionario?.nomeFuncionario || "-",
        mov.procedimentos || "-",
      ];
      csvRows.push(
        row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")
      );
    });

    const csvData = new Blob(["\uFEFF" + csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(csvData);
    const link = document.createElement("a");
    link.href = url;
    link.download = "historico_manutencoes.csv";
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
      const tableColumn = [
        "ID",
        "Data",
        "Tipo",
        "ID Máquina",
        "Responsável",
        "Procedimento",
      ];
      const tableRows = [];

      filtrados.forEach((mov) => {
        const manutencaoData = [
          mov.idHistoricoManutencoes,
          new Date(mov.data).toLocaleDateString("pt-BR"),
          mov.tipoManutencao || "-",
          mov.idMaquina?.idMaquina || "-",
          mov.idFuncionario?.nomeFuncionario || "-",
          mov.procedimentos || "-",
        ];
        tableRows.push(manutencaoData);
      });

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        didDrawPage: (data) => {
          doc.setFontSize(18);
          doc.text("Relatório de Manutenções", data.settings.margin.left, 15);
        },
        columnStyles: {
          5: { cellWidth: 'wrap' } 
        }
      });
      doc.save("relatorio_manutencoes.pdf");
    } catch (error)
 {
      console.error("Falha ao gerar o PDF:", error);
      alert("Ocorreu um erro ao tentar gerar o PDF.");
    }
  };
  
  if (loading)
    return <p className="p-6 text-gray-600">Carregando manutenções...</p>;

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold text-gray-800">
          Histórico de Manutenções
        </h2>

        <div className="flex flex-wrap gap-3">
          <Link to="/registrar-manutencao">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition">
              + Registrar Manutenção
            </button>
          </Link>
          <Link to="/manutencoes-agendadas">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md shadow-md transition border border-gray-300">
              Ver Agendadas
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
          onFocus={(e) => (e.target.type = "date")}
          onBlur={(e) => (e.target.type = "text")}
          placeholder="Filtrar por Data"
          className="border rounded px-3 py-2 text-sm w-full md:w-auto"
          value={filtro.data}
          onChange={(e) => setFiltro({ ...filtro, data: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filtrar por Tipo"
          className="border rounded px-3 py-2 text-sm w-full md:w-auto"
          value={filtro.tipo}
          onChange={(e) => setFiltro({ ...filtro, tipo: e.target.value })}
        />
        <input
          type="number"
          placeholder="ID da Máquina"
          className="border rounded px-3 py-2 text-sm w-full md:w-auto"
          value={filtro.idMaquina}
          onChange={(e) => setFiltro({ ...filtro, idMaquina: e.target.value })}
        />
        <input
          type="number"
          placeholder="ID do Responsável"
          className="border rounded px-3 py-2 text-sm w-full md:w-auto"
          value={filtro.idResponsavel}
          onChange={(e) =>
            setFiltro({ ...filtro, idResponsavel: e.target.value })
          }
        />
        <button
          onClick={() =>
            setFiltro({
              id: "",
              data: "",
              tipo: "",
              idMaquina: "",
              idResponsavel: "",
            })
          }
          className="border rounded px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 w-full md:w-auto"
        >
          Limpar Filtros
        </button>
      </div>

      {/* Estado Vazio */}
      {filtrados.length === 0 ? (
        <div className="text-center text-gray-500 py-8 border rounded-lg shadow-sm bg-gray-50">
          Nenhuma manutenção encontrada 😅
        </div>
      ) : (
        // Wrapper da Lista
        <div className="overflow-x-auto">
          {/* Tabela Desktop */}
          <table className="hidden md:table min-w-full border border-gray-300 rounded-lg shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border text-left">ID</th>
                <th className="px-4 py-2 border text-left">Data</th>
                <th className="px-4 py-2 border text-left">Tipo</th>
                <th className="px-4 py-2 border text-left">ID Máquina</th>
                <th className="px-4 py-2 border text-left">Responsável</th>
                <th className="px-4 py-2 border text-left">Procedimento</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((mov) => (
                <tr
                  key={mov.idHistoricoManutencoes}
                  className="hover:bg-gray-50 text-sm"
                >
                  <td className="border px-4 py-2">
                    {mov.idHistoricoManutencoes}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(mov.data).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="border px-4 py-2">
                    {mov.tipoManutencao || "-"}
                  </td>
                  <td className="border px-4 py-2">
                    {mov.idMaquina?.idMaquina || "-"}
                  </td>
                  <td className="border px-4 py-2">
                    {mov.idFuncionario?.nomeFuncionario || "-"}
                  </td>
                  <td
                    className="border px-4 py-2 max-w-xs truncate"
                    title={mov.procedimentos}
                  >
                    {mov.procedimentos || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Cards Mobile */}
          <div className="md:hidden space-y-4">
            {filtrados.map((mov) => (
              <div
                key={mov.idHistoricoManutencoes}
                className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between mb-2 pb-2 border-b">
                  <span className="font-semibold text-gray-700">ID:</span>
                  <span className="font-bold">{mov.idHistoricoManutencoes}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Data:</span>
                  <span>{new Date(mov.data).toLocaleDateString("pt-BR")}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tipo:</span>
                  <span>{mov.tipoManutencao || "-"}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Máquina:</span>
                  <span>{mov.idMaquina?.idMaquina || "-"}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Responsável:</span>
                  <span>{mov.idFuncionario?.nomeFuncionario || "-"}</span>
                </div>
                <div className="text-sm text-gray-600 mt-2 pt-2 border-t">
                  <span className="font-semibold">Procedimentos:</span>
                  <p className="text-xs mt-1 break-words">
                    {mov.procedimentos || "-"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}