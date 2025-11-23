import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importado useNavigate
import api from "../api";
// Importações para PDF
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ManutencoesAgendadas() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const carregarAgendamentos = async () => {
    try {
      const response = await api.get("/manutencoes-agendadas");
      
      const dataArray = response.data || [];
      const sortedData = dataArray.sort(
        (a, b) => a.idManutencaoAgendada - b.idManutencaoAgendada
      );

      setAgendamentos(sortedData);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este agendamento?"))
      return;

    try {
      await api.delete(`/manutencoes-agendadas/${id}`);
      setAgendamentos((prev) =>
        prev.filter((item) => item.idManutencaoAgendada !== id)
      );
      alert("Agendamento excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error.response || error);
      alert("Erro ao excluir o agendamento.");
    }
  };

  const handleEditar = (id) => {
    navigate(`/agendar-manutencao?id=${id}`);
  };

  const handleNovoAgendamento = () => {
    navigate("/agendar-manutencao");
  };

  const handleExportCSV = () => {
    if (agendamentos.length === 0) {
      alert("Não há dados para exportar.");
      return;
    }

    const headers = ["ID", "Máquina", "Data", "Tipo", "Procedimentos"];
    const csvRows = [headers.join(",")];

    agendamentos.forEach((ag) => {
      const row = [
        ag.idManutencaoAgendada,
        ag.maquina?.codPatrimonial || "-",
        new Date(ag.dataAgendada).toLocaleDateString("pt-BR"),
        ag.tipoManutencao || "-",
        ag.procedimentos || "-",
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
    link.download = "manutencoes_agendadas.csv";
    link.click();
  };

  const handleExportPDF = () => {
    if (agendamentos.length === 0) {
      alert("Nenhum dado para exportar.");
      return;
    }
    try {
      const doc = new jsPDF();
      const tableColumn = ["ID", "Máquina", "Data", "Tipo", "Procedimentos"];
      const tableRows = [];

      agendamentos.forEach((ag) => {
        const agendamentoData = [
          ag.idManutencaoAgendada,
          ag.maquina?.codPatrimonial || "-",
          new Date(ag.dataAgendada).toLocaleDateString("pt-BR"),
          ag.tipoManutencao || "-",
          ag.procedimentos || "-",
        ];
        tableRows.push(agendamentoData);
      });

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        didDrawPage: (data) => {
          doc.setFontSize(18);
          doc.text(
            "Relatório de Manutenções Agendadas",
            data.settings.margin.left,
            15
          );
        },
         columnStyles: {
          4: { cellWidth: 'wrap' } 
        }
      });
      doc.save("manutencoes_agendadas.pdf");
    } catch (error) {
      console.error("Falha ao gerar o PDF:", error);
      alert("Ocorreu um erro ao tentar gerar o PDF.");
    }
  };
  
  const handleVolta = () => {
    navigate(-1);
  };

  if (loading)
    return <p className="p-6 text-gray-600">Carregando agendamentos...</p>;

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3 relative">
        
        {/* Lado Esquerdo (Botão Voltar) */}
        <button
            onClick={handleVolta}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-full transition duration-150 flex items-center gap-2"
        >
            &#8592; Voltar
        </button>

        {/* Título Centralizado */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 w-full md:relative md:left-auto md:transform-none md:w-auto md:text-left">
            <h2 className="text-2xl font-bold text-gray-800 whitespace-nowrap">
                Manutenções Agendadas
            </h2>
        </div>
        
        {/* Lado Direito (Botões de Ação) */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleNovoAgendamento}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition"
          >
            + Novo Agendamento
          </button>

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

      {agendamentos.length === 0 ? (
        <div className="text-center text-gray-500 py-8 border rounded-lg shadow-sm bg-gray-50">
          Nenhuma manutenção agendada no momento 😅
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* Tabela Desktop */}
          <table className="hidden md:table min-w-full border border-gray-300 rounded-lg shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border text-left">ID</th>
                <th className="px-4 py-2 border text-left">Máquina</th>
                <th className="px-4 py-2 border text-left">Data</th>
                <th className="px-4 py-2 border text-left">Tipo</th>
                <th className="px-4 py-2 border text-left">Procedimentos</th>
                <th className="px-4 py-2 border text-center">Ações</th>
              </tr>
            </thead>

            <tbody>
              {agendamentos.map((ag) => (
                <tr
                  key={ag.idManutencaoAgendada}
                  className="hover:bg-gray-50 text-sm"
                >
                  <td className="border px-4 py-2">
                    {ag.idManutencaoAgendada}
                  </td>
                  <td className="border px-4 py-2">
                    {ag.maquina?.codPatrimonial || "-"}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(ag.dataAgendada).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="border px-4 py-2">
                    {ag.tipoManutencao || "-"}
                  </td>
                  <td className="border px-4 py-2 max-w-xs truncate" title={ag.procedimentos}>
                    {ag.procedimentos || "-"}
                  </td>
                  <td className="border px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEditar(ag.idManutencaoAgendada)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleExcluir(ag.idManutencaoAgendada)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Cards Mobile */}
          <div className="md:hidden space-y-4">
            {agendamentos.map((ag) => (
              <div
                key={ag.idManutencaoAgendada}
                className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-700">Máquina:</span>
                  <span>{ag.maquina?.codPatrimonial || "-"}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Data:</span>
                  <span>
                    {new Date(ag.dataAgendada).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tipo:</span>
                  <span>{ag.tipoManutencao || "-"}</span>
                </div>
                <div className="text-sm text-gray-600 mt-2 pt-2 border-t">
                  <span className="font-semibold">Procedimentos:</span>
                  <p className="text-xs mt-1 break-words">
                    {ag.procedimentos || "-"}
                  </p>
                </div>
                <div className="flex justify-end mt-3 gap-2">
                  <button
                    onClick={() => handleEditar(ag.idManutencaoAgendada)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleExcluir(ag.idManutencaoAgendada)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}