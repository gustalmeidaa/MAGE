import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api"; 

export default function AgendarManutencao() {
  const [searchParams] = useSearchParams();
  const idAgendamento = searchParams.get("id");
  const navigate = useNavigate();
  
  const [maquinas, setMaquinas] = useState([]);
  const [sucesso, setSucesso] = useState(null);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const isEditing = !!idAgendamento;

  const [formData, setFormData] = useState({
    dataAgendada: "",
    idMaquina: "",
    tipoManutencao: "preventiva",
    procedimentos: "",
    custoManutencao: "", // Novo campo para custo da manutenção
  });

  useEffect(() => {
    fetchData();
  }, [idAgendamento]);

  const fetchData = async () => {
    setLoading(true);
    setErro(null);
    setSucesso(null);

    try {
      const resMaquinas = await api.get("/maquinas");
      setMaquinas(resMaquinas.data || []);
      
      if (idAgendamento) {
        const resAgendamento = await api.get(`/manutencoes-agendadas/${idAgendamento}`); 
        const dadosAgendamento = resAgendamento.data;

        const dataFormatada = new Date(dadosAgendamento.dataAgendada).toISOString().substring(0, 16);

        setFormData({
            dataAgendada: dataFormatada || "",
            idMaquina: dadosAgendamento.idMaquina?.toString() || "", 
            tipoManutencao: dadosAgendamento.tipoManutencao || "preventiva",
            procedimentos: dadosAgendamento.procedimentos || "",
            custoManutencao: dadosAgendamento.custoManutencao?.toFixed(2) || "", // Formatação do custo
        });
      }

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      const statusCode = error.response?.status;
      if (isEditing) {
          setErro(`Erro ao carregar dados para edição. Status: ${statusCode || 'Sem Conexão'}.`);
      } else {
          setErro("Erro ao carregar lista de máquinas.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSucesso(null);
    setErro(null);

    const payload = {
        idManutencaoAgendada: isEditing ? parseInt(idAgendamento) : undefined,
        ...formData,
        idMaquina: formData.idMaquina ? parseInt(formData.idMaquina) : null,
        custoManutencao: parseFloat(formData.custoManutencao.replace(',', '.')), // Conversão para BigDecimal
    };
    
    try {
      if (isEditing) {
        await api.put(`/manutencoes-agendadas/${idAgendamento}`, payload);
        setSucesso("Manutenção agendada atualizada com sucesso!");
      } else {
        await api.post("/manutencoes-agendadas", payload);
        setSucesso("Manutenção agendada com sucesso!");
        
        setFormData({
            dataAgendada: "", idMaquina: "", 
            tipoManutencao: "preventiva", procedimentos: "", custoManutencao: "",
        });
      }

      setTimeout(() => setSucesso(null), 4000);
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
      const msgErro = error.response?.data?.message || `Falha ao ${isEditing ? 'atualizar' : 'agendar'} a manutenção.`;
      setErro(msgErro);
      setTimeout(() => setErro(null), 5000);
    }
  };
  
  const handleVolta = () => {
    navigate(-1);
  };

    if (loading) {
    return <p className="p-6 text-gray-600">Carregando dados...</p>;
  }

  return (
    <>
      <div className="flex items-center justify-start mb-6 relative">
        <button
          onClick={handleVolta}
          className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-full transition duration-150 flex items-center gap-2 z-10"
        >
          &#8592; Voltar
        </button>

        <div className="absolute left-1/2 transform -translate-x-1/2 w-full text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 whitespace-nowrap">
            {isEditing ? "Editar Agendamento" : "Agendar Manutenção"}
          </h1>
        </div>
      </div>

      {sucesso && (
        <div className="max-w-md mx-auto mb-8 p-4 bg-green-100 border border-green-400 rounded-lg text-green-700 shadow-md animate-fade-in">
          {sucesso}
        </div>
      )}

      {erro && (
        <div className="max-w-md mx-auto mb-8 p-4 bg-red-100 border border-red-400 rounded-lg text-red-700 shadow-md animate-fade-in">
          {erro}
        </div>
      )}

      <form className="max-w-2xl mx-auto space-y-6 text-base" onSubmit={handleSubmit}>
        {/* Campo de Data */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="dataAgendada">
            Data do agendamento:
          </label>
          <input
            id="dataAgendada"
            name="dataAgendada" 
            type="datetime-local"
            className="bg-gray-200 rounded px-4 py-2 w-full md:w-72"
            value={formData.dataAgendada}
            onChange={handleChange}
            required
          />
        </div>

        {/* Campo de Máquina */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="idMaquina">
            Máquina:
          </label>
          <select
            id="idMaquina"
            name="idMaquina"
            className="bg-gray-200 rounded px-4 py-2 w-full md:w-72 font-semibold"
            value={formData.idMaquina}
            onChange={handleChange}
            required
          >
            <option value="">Selecione a máquina</option>
            {maquinas.map((maq) => (
              <option key={`maquina-${maq.idMaquina}`} value={maq.idMaquina}>
                {maq.codPatrimonial || `Série: ${maq.numSerie}`}
              </option>
            ))}
          </select>
        </div>
        
        {/* Campo de Tipo de Manutenção */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="tipoManutencao">
            Tipo de manutenção:
          </label>
          <select
            id="tipoManutencao"
            name="tipoManutencao"
            className="bg-gray-200 rounded px-4 py-2 w-full md:w-72 font-semibold"
            value={formData.tipoManutencao}
            onChange={handleChange}
            required
          >
            <option value="preventiva">Preventiva</option>
            <option value="corretiva">Corretiva</option>
          </select>
        </div>

        {/* Campo de Procedimentos */}
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <label className="font-semibold pt-2" htmlFor="procedimentos">
            Procedimentos a serem feitos:
          </label>
          <textarea
            id="procedimentos"
            name="procedimentos"
            className="bg-gray-200 rounded w-full md:w-72 resize-none px-4 py-2"
            placeholder="Digite aqui..."
            rows="4"
            value={formData.procedimentos}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {/* Campo de Custo da Manutenção */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <label className="font-semibold" htmlFor="custoManutencao">
            Custo da manutenção:
          </label>
          <input
            id="custoManutencao"
            name="custoManutencao"
            type="number"
            className="bg-gray-200 rounded px-4 py-2 w-full md:w-72"
            value={formData.custoManutencao}
            onChange={handleChange}
            placeholder="Ex: 150.00"
            required
          />
        </div>

        {/* Botão de Submissão */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="w-full max-w-xs md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg"
          >
            {isEditing ? "Salvar Edição" : "Agendar"}
          </button>
        </div>
      </form>

      {/* Animação */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease forwards;
        }
      `}</style>
    </>
  );
}


