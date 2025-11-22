import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importado useNavigate
// Importações para o PDF
import jsPDF from "jspdf";
import "jspdf-autotable";
// Importa a instância configurada do Axios (api) que anexa o token
import api from "../api"; 

export default function Movimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Inicializa useNavigate
  
  const [filtro, setFiltro] = useState({
    id: "",
    data: "",
    maquinaMovimentada: "",
    tipo: "",
    origem: "",
    destino: "",
  });

  useEffect(() => {
    fetchMovimentacoes();
  }, []);

  const fetchMovimentacoes = async () => {
    setLoading(true);
    try {
      const response = await api.get("/movimentacoes");
      const data = response.data;
      
      const dataArray = data || [];
      const sortedData = dataArray.sort(
        (a, b) => a.idMovimentacoes - b.idMovimentacoes
      );

      setMovimentacoes(sortedData);
    } catch (error) {
      console.error("Erro ao buscar movimentações:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtrados = movimentacoes.filter((mov) => {
    let dataFiltroFormatada = "";
    if (filtro.data) {
      try {
        const dataObj = new Date(filtro.data);
        dataFiltroFormatada = dataObj.toISOString().split('T')[0];
      } catch (e) {
        /* Data inválida, ignora */
      }
    }
    
    const dataMovFormatada = new Date(mov.data).toISOString().split('T')[0];

    return (
      (filtro.id ? mov.idMovimentacoes.toString().includes(filtro.id) : true) &&
      (filtro.data ? dataMovFormatada === dataFiltroFormatada : true) &&
      (filtro.maquinaMovimentada
        ? mov.maquinaMovimentada?.idMaquina
            .toString()
            .includes(filtro.maquinaMovimentada)
        : true) &&
      (filtro.tipo
        ? mov.tipo.toLowerCase().includes(filtro.tipo.toLowerCase())
        : true) &&
      (filtro.origem
        ? mov.origem.toLowerCase().includes(filtro.origem.toLowerCase())
        : true) &&
      (filtro.destino
        ? mov.destino.toLowerCase().includes(filtro.destino.toLowerCase())
        : true)
    );
  });
  
  // FUNÇÕES DE AÇÃO

  const handleEditar = (idMovimentacao) => {
      // Redireciona para a página de registro de movimentação com o ID para edição
      navigate(`/registrar-movimentacao?id=${idMovimentacao}`); // Assume que a rota de edição é /registrar-movimentacao
  };

  const handleExcluir = async (idMovimentacao) => {
      if (!window.confirm(`Tem certeza que deseja excluir a movimentação ID ${idMovimentacao}?`))
        return;

      try {
        // Assume que a rota de delete é /movimentacoes/{id}
        await api.delete(`/movimentacoes/${idMovimentacao}`);
        
        // Atualiza a lista removendo o item
        setMovimentacoes((prev) =>
          prev.filter((item) => item.idMovimentacoes !== idMovimentacao)
        );
        alert("Movimentação excluída com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir movimentação:", error.response || error);
        alert("Erro ao excluir a movimentação.");
      }
  };

  const handleExportCSV = () => {
    if (filtrados.length === 0) {
      alert("Não há dados para exportar.");
      return;
    }

    const headers = ["ID", "Data", "Máquina ID", "Tipo", "Origem", "Destino"];
    const csvRows = [headers.join(",")];

    filtrados.forEach((mov) => {
      const row = [
        mov.idMovimentacoes,
        new Date(mov.data).toLocaleDateString("pt-BR"),
        mov.maquinaMovimentada?.idMaquina || "-",
        mov.tipo || "-",
        mov.origem || "-",
        mov.destino || "-",
      ];
      csvRows.push(row.map((val) => `"${val}"`).join(","));
    });

    const csvData = new Blob(["\uFEFF" + csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(csvData);
    const link = document.createElement("a");
    link.href = url;
    link.download = "movimentacoes.csv";
    link.click();
  };

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
        "Máquina ID",
        "Tipo",
        "Origem",
        "Destino",
      ];
      const tableRows = [];

      filtrados.forEach((mov) => {
        const movData = [
          mov.idMovimentacoes,
          new Date(mov.data).toLocaleDateString("pt-BR"),
          mov.maquinaMovimentada?.idMaquina || "-",
          mov.tipo || "-",
          mov.origem || "-",
          mov.destino || "-",
        ];
        tableRows.push(movData);
      });

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        didDrawPage: (data) => {
          doc.setFontSize(18);
          doc.text(
            "Relatório de Movimentações",
            data.settings.margin.left,
            15
          );
        },
      });
      doc.save("relatorio_movimentacoes.pdf");
    } catch (error) {
      console.error("Falha ao gerar o PDF:", error);
      alert("Ocorreu um erro ao tentar gerar o PDF.");
    }
  };
  
  if (loading)
    return <p className="p-6 text-gray-600">Carregando movimentações...</p>;

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold text-gray-800">
          Lista de Movimentações
        </h2>

        {/* BOTÕES */}
        <div className="flex flex-wrap gap-3">
          <Link to="/registrar-movimentacao">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition">
              + Registrar Movimentação
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
          onFocus={(e) => (e.target.type = "date")}
          onBlur={(e) => (e.target.type = "text")}
          placeholder="Filtrar por Data"
          className="border rounded px-3 py-2 text-sm w-full md:w-auto"
          value={filtro.data}
          onChange={(e) => setFiltro({ ...filtro, data: e.target.value })}
        />
        <input
          type="text"
          placeholder="ID da Máquina"
          className="border rounded px-3 py-2 text-sm w-full md:w-auto"
          value={filtro.maquinaMovimentada}
          onChange={(e) =>
            setFiltro({ ...filtro, maquinaMovimentada: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Tipo de Movimentação"
          className="border rounded px-3 py-2 text-sm w-full md:w-auto"
          value={filtro.tipo}
          onChange={(e) => setFiltro({ ...filtro, tipo: e.target.value })}
        />
        <input
          type="text"
          placeholder="Origem"
          className="border rounded px-3 py-2 text-sm w-full md:w-auto"
          value={filtro.origem}
          onChange={(e) => setFiltro({ ...filtro, origem: e.target.value })}
        />
        <input
          type="text"
          placeholder="Destino"
          className="border rounded px-3 py-2 text-sm w-full md:w-auto"
          value={filtro.destino}
          onChange={(e) => setFiltro({ ...filtro, destino: e.target.value })}
        />
        <button
          onClick={() =>
            setFiltro({
              id: "",
              data: "",
              maquinaMovimentada: "",
              tipo: "",
              origem: "",
              destino: "",
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
          Nenhuma movimentação encontrada 😅
        </div>
      ) : (
        // Wrapper da Lista
        <div className="overflow-x-auto">
          {/* Tabela Desktop */}
          <table className="hidden md:table min-w-full border border-gray-300 rounded-lg shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border text-left">ID</th>
                <th className="px-4 py-2 border text-left">Máquina</th>
                <th className="px-4 py-2 border text-left">Data</th>
                <th className="px-4 py-2 border text-left">Tipo</th>
                <th className="px-4 py-2 border text-left">Origem</th>
                <th className="px-4 py-2 border text-left">Destino</th>
                <th className="px-4 py-2 border text-center">Ações</th> {/* Nova Coluna */}
              </tr>
            </thead>

            <tbody>
              {filtrados.map((mov) => (
                <tr
                  key={mov.idMovimentacoes}
                  className="hover:bg-gray-50 text-sm"
                >
                  <td className="border px-4 py-2">{mov.idMovimentacoes}</td>
                  <td className="border px-4 py-2">
                    {mov.maquinaMovimentada?.idMaquina || "-"}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(mov.data).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="border px-4 py-2">{mov.tipo || "-"}</td>
                  <td className="border px-4 py-2">{mov.origem || "-"}</td>
                  <td className="border px-4 py-2">{mov.destino || "-"}</td>
                  {/* Botões de Ação na Tabela */}
                  <td className="border px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEditar(mov.idMovimentacoes)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleExcluir(mov.idMovimentacoes)}
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
            {filtrados.map((mov) => (
              <div
                key={mov.idMovimentacoes}
                className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-700">Máquina:</span>
                  <span>{mov.maquinaMovimentada?.idMaquina || "-"}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Data:</span>
                  <span>{new Date(mov.data).toLocaleDateString("pt-BR")}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tipo:</span>
                  <span>{mov.tipo || "-"}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Origem:</span>
                  <span>{mov.origem || "-"}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Destino:</span>
                  <span>{mov.destino || "-"}</span>
                </div>
                {/* Botões de Ação no Mobile */}
                <div className="flex justify-end mt-3 gap-2">
                    <button
                        onClick={() => handleEditar(mov.idMovimentacoes)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => handleExcluir(mov.idMovimentacoes)}
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