import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function ManutencoesAgendadas() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  // 🔹 Carrega todas as manutenções agendadas
  const carregarAgendamentos = async () => {
    try {
      const response = await api.get("/manutencoes-agendadas");
      setAgendamentos(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Excluir
  const handleExcluir = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este agendamento?")) return;

    try {
      await api.delete(`/manutencoes-agendadas/${id}`);
      setAgendamentos((prev) => prev.filter((item) => item.idManutencaoAgendada !== id));
      alert("Agendamento excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error.response || error);
      alert("Erro ao excluir o agendamento.");
    }
  };

  // ✏️ Editar
  const handleEditar = (id) => {
    navigate(`/agendar-manutencao?id=${id}`);
  };

  // ➕ Novo agendamento
  const handleNovoAgendamento = () => {
    navigate("/agendar-manutencao");
  };

  if (loading)
    return <p className="p-6 text-gray-600">Carregando agendamentos...</p>;

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Manutenções Agendadas
        </h2>
        <button
          onClick={handleNovoAgendamento}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition"
        >
          + Novo Agendamento
        </button>
      </div>

      {/* Caso não existam agendamentos */}
      {agendamentos.length === 0 ? (
        <div className="text-center text-gray-500 py-8 border rounded-lg shadow-sm bg-gray-50">
          Nenhuma manutenção agendada no momento 😅
        </div>
      ) : (
        // ✅ Tabela só aparece quando houver registros
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg shadow">
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
                <tr key={ag.idManutencaoAgendada} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{ag.idManutencaoAgendada}</td>
                  <td className="border px-4 py-2">
                    {ag.maquina?.codPatrimonial || "-"}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(ag.dataAgendada).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="border px-4 py-2">{ag.tipoManutencao || "-"}</td>
                  <td className="border px-4 py-2">{ag.procedimentos || "-"}</td>

                  {/* 🟡 Botões só aparecem quando há dados */}
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
        </div>
      )}
    </div>
  );
}
