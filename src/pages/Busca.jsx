import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import jsPDF from "jspdf";
import "jspdf-autotable";

import api from "../api"; 

export default function Busca() {
  const [maquinas, setMaquinas] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [setores, setSetores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState({
    codPatrimonial: "",
    numSerie: "",
    localizacao: "",
    status: "",
    idSetor: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resMaquinas, resFuncionarios, resSetores] = await Promise.all([
          api.get("/maquinas"),
          api.get("/funcionarios"),
          api.get("/setores"),
        ]);
        
        const dataArray = resMaquinas.data || [];
        const sortedData = dataArray.sort((a, b) =>
          (a.codPatrimonial || "").localeCompare(b.codPatrimonial || "")
        );

        setMaquinas(sortedData);
        setFuncionarios(resFuncionarios.data || []);
        setSetores(resSetores.data || []);

      } catch (error) {
        console.error("Erro ao buscar dados das máquinas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const funcionarioSetorMap = {};
  funcionarios.forEach(f => {
    if (f.idFuncionario) {
      funcionarioSetorMap[f.idFuncionario] = f.setor?.idSetor;
    }
  });


  const filtrados = maquinas.filter(
    (m) => {
      const baseFilter = (m.codPatrimonial || "")
        .toLowerCase()
        .includes(filtro.codPatrimonial.toLowerCase()) &&
        (m.numSerie || "").toLowerCase().includes(filtro.numSerie.toLowerCase()) &&
        (m.localizacao || "")
          .toLowerCase()
          .includes(filtro.localizacao.toLowerCase()) &&
        (m.status || "").toLowerCase().includes(filtro.status.toLowerCase());

      if (!baseFilter) return false;

      if (filtro.idSetor) {
        const maquinaResponsavelId = m.idResponsavel;
        
        if (!maquinaResponsavelId) return false;

        const responsavelSetorId = funcionarioSetorMap[maquinaResponsavelId];

        return responsavelSetorId?.toString() === filtro.idSetor;
      }

      return true;
    }
  );

  const handleExportCSV = () => {
    if (filtrados.length === 0) {
      alert("Nenhum dado para exportar.");
      return;
    }
    const headers = [
      "Cód. Patrimonial",
      "Nº de Série",
      "Localização",
      "Valor (R$)",
      "Status",
      "ID Responsável",
      "Setor Responsável",
    ];
    const csvRows = [headers.join(",")];

    filtrados.forEach((m) => {
      const responsavelSetorId = funcionarioSetorMap[m.idResponsavel];
      const setorNome = setores.find(s => s.idSetor === responsavelSetorId)?.nomeSetor || 'N/A';

      const row = [
        m.codPatrimonial || "-",
        m.numSerie || "-",
        m.localizacao || "-",
        m.valor
          ?.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
          .replace(".", "")
        || "0,00",
        m.status || "-",
        m.idResponsavel || "N/A",
        setorNome,
      ];
      csvRows.push(row.map((val) => `"${val}"`).join(","));
    });

    const csvData = new Blob(["\uFEFF" + csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(csvData);
    const link = document.createElement("a");
    link.href = url;
    link.download = "relatorio_maquinas.csv";
    link.click();
  };

  const handleExportPDF = () => {
    if (filtrados.length === 0) {
      alert("Nenhum dado para exportar.");
      return;
    }
    try {
      const doc = new jsPDF("landscape");
      const tableColumn = [
        "Cód. Patrimonial",
        "Nº de Série",
        "Localização",
        "Valor (R$)",
        "Status",
        "ID Responsável",
        "Setor Responsável",
      ];
      const tableRows = [];

      filtrados.forEach((m) => {
        const responsavelSetorId = funcionarioSetorMap[m.idResponsavel];
        const setorNome = setores.find(s => s.idSetor === responsavelSetorId)?.nomeSetor || 'N/A';
        
        const maquinaData = [
          m.codPatrimonial || "-",
          m.numSerie || "-",
          m.localizacao || "-",
          m.valor?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }) || "R$ 0,00",
          m.status || "-",
          m.idResponsavel || "N/A",
          setorNome,
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
        },
      });
      doc.save("relatorio_maquinas.pdf");
    } catch (error) {
      console.error("Falha ao gerar o PDF:", error);
      alert("Ocorreu um erro ao tentar gerar o PDF.");
    }
  };

  if (loading)
    return <p className="p-6 text-gray-600">Carregando máquinas...</p>;

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold text-gray-800">Lista de Máquinas</h2>

        <div className="flex flex-wrap gap-3">
          <Link to="/cadastrar-maquina">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition">
              + Cadastrar Máquina
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
          type="text"
          placeholder="Cód. Patrimonial"
          className="border rounded px-3 py-2 text-sm w-full md:w-auto"
          value={filtro.codPatrimonial}
          onChange={(e) =>
            setFiltro({ ...filtro, codPatrimonial: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Nº de Série"
          className="border rounded px-3 py-2 text-sm w-full md:w-auto"
          value={filtro.numSerie}
          onChange={(e) => setFiltro({ ...filtro, numSerie: e.target.value })}
        />
        <input
          type="text"
          placeholder="Localização"
          className="border rounded px-3 py-2 text-sm w-full md:w-auto"
          value={filtro.localizacao}
          onChange={(e) =>
            setFiltro({ ...filtro, localizacao: e.target.value })
          }
        />
        
        <select
          className="border rounded px-3 py-2 text-sm w-full md:w-auto bg-white"
          value={filtro.idSetor}
          onChange={(e) => setFiltro({ ...filtro, idSetor: e.target.value })}
        >
          <option value="">Filtrar por Setor</option>
          {setores.map(setor => (
            <option key={setor.idSetor} value={setor.idSetor}>
              {setor.nomeSetor}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Status"
          className="border rounded px-3 py-2 text-sm w-full md:w-auto"
          value={filtro.status}
          onChange={(e) => setFiltro({ ...filtro, status: e.target.value })}
        />

        <button
          onClick={() =>
            setFiltro({
              codPatrimonial: "",
              numSerie: "",
              localizacao: "",
              status: "",
              idSetor: "",
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
          Nenhuma máquina encontrada 😅
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* Tabela para telas médias/grandes */}
          <table className="hidden md:table min-w-full border border-gray-300 rounded-lg shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border text-left">Cód. Patrimonial</th>
                <th className="px-4 py-2 border text-left">Nº de Série</th>
                <th className="px-4 py-2 border text-left">Localização</th>
                <th className="px-4 py-2 border text-left">Status</th>
                <th className="px-4 py-2 border text-left">Responsável (ID)</th>
                <th className="px-4 py-2 border text-left">Setor</th>
                <th className="px-4 py-2 border text-left">Valor (R$)</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((m) => {
                const responsavelSetorId = funcionarioSetorMap[m.idResponsavel];
                const setorNome = setores.find(s => s.idSetor === responsavelSetorId)?.nomeSetor || 'N/A';

                return (
                  <tr
                    key={`row-${m.codPatrimonial}`}
                    className="hover:bg-gray-50 text-sm"
                  >
                    <td className="border px-4 py-2">{m.codPatrimonial || "-"}</td>
                    <td className="border px-4 py-2">{m.numSerie || "-"}</td>
                    <td className="border px-4 py-2">{m.localizacao || "-"}</td>
                    <td className="border px-4 py-2">{m.status || "-"}</td>
                    <td className="border px-4 py-2">{m.idResponsavel || "N/A"}</td>
                    <td className="border px-4 py-2">{setorNome}</td>
                    <td className="border px-4 py-2">
                      {m.valor?.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }) || "R$ 0,00"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Layout de cartões para telas pequenas */}
          <div className="md:hidden space-y-4">
            {filtrados.map((m) => {
              const responsavelSetorId = funcionarioSetorMap[m.idResponsavel];
              const setorNome = setores.find(s => s.idSetor === responsavelSetorId)?.nomeSetor || 'N/A';
              
              return (
                <div
                  key={`card-${m.codPatrimonial}`}
                  className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm space-y-2"
                >
                  <div className="flex justify-between items-start font-bold">
                    <span className="text-gray-800">CP: {m.codPatrimonial}</span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full text-white ${
                        m.status === "ATIVA"
                          ? "bg-green-500"
                          : m.status === "INATIVA"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {m.status || "N/A"}
                    </span>
                  </div>
                  <p className="text-sm">
                    <span className="font-semibold">Nº Série:</span> {m.numSerie || "-"}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Local:</span> {m.localizacao || "-"}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Setor:</span> {setorNome}
                  </p>
                  <div className="flex justify-between items-center border-t pt-2 mt-2">
                    <span className="text-sm">
                      <span className="font-semibold">Responsável ID:</span>{" "}
                      {m.idResponsavel || "N/A"}
                    </span>
                    <span className="font-bold text-gray-700">
                      {m.valor?.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }) || "R$ 0,00"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}