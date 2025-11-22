import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom"; 
import api from "../api"; 

export default function CadastroMaquina() {
  const [searchParams] = useSearchParams();
  const idMaquina = searchParams.get("id");
  
  const [funcionarios, setFuncionarios] = useState([]);
  const [sucesso, setSucesso] = useState(null); 
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    codPatrimonial: "",
    numSerie: "",
    valor: "0.00",
    idResponsavel: "",
    localizacao: "",
    status: "ATIVA", 
  });

  useEffect(() => {
    fetchData();
  }, [idMaquina]);

  const fetchData = async () => {
    setLoading(true);
    setErro(null);
    setSucesso(null);
    setIsEditing(!!idMaquina);

    try {
      const resFuncionarios = await api.get("/funcionarios");
      setFuncionarios(resFuncionarios.data || []);
      
      if (idMaquina) {
        const resMaquina = await api.get(`/maquinas/${idMaquina}`);
        const dadosMaquina = resMaquina.data;
        
        const valorFormatado = dadosMaquina.valor != null ? parseFloat(dadosMaquina.valor).toFixed(2) : "0.00";
        
        setFormData({
          codPatrimonial: dadosMaquina.codPatrimonial || "",
          numSerie: dadosMaquina.numSerie || "",
          localizacao: dadosMaquina.localizacao || "",
          status: dadosMaquina.status || "ATIVA",
          valor: valorFormatado, 
          idResponsavel: dadosMaquina.idResponsavel?.toString() || "", 
        });
      }
      
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      const statusCode = error.response?.status;
      if (idMaquina) {
         setErro(`Erro ao carregar dados para edição. Status: ${statusCode || 'Sem Conexão'}. Verifique o token/Role.`);
      } else {
         setErro("Erro ao carregar lista de funcionários.");
      }
      
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 🛑 BLOQUEIO DUPLO: Impede alteração do codPatrimonial ou numSerie no modo edição
    if (isEditing && (name === 'codPatrimonial' || name === 'numSerie')) {
        return;
    }

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
        idMaquina: idMaquina ? parseInt(idMaquina) : undefined,
        ...formData,
        idResponsavel: formData.idResponsavel ? parseInt(formData.idResponsavel) : null,
        valor: parseFloat(formData.valor),
    };
    
    try {
      if (idMaquina) {
        // MODO EDIÇÃO (PUT)
        await api.put(`/maquinas/${idMaquina}`, payload); 
        setSucesso("Máquina atualizada com sucesso!");
      } else {
        // MODO CADASTRO (POST)
        await api.post("/maquinas", payload);
        setSucesso("Máquina cadastrada com sucesso!");
        
        setFormData({
          codPatrimonial: "", numSerie: "", valor: "0.00", idResponsavel: "",
          localizacao: "", status: "ATIVA",
        });
      }

      setTimeout(() => setSucesso(null), 4000);
    } catch (error) {
      console.error("Erro ao salvar máquina:", error);
      const msgErro = error.response?.data?.message || `Falha ao ${idMaquina ? 'atualizar' : 'cadastrar'} a máquina.`;
      setErro(msgErro);
      setTimeout(() => setErro(null), 5000);
    }
  };
  
  if (loading) {
    return <p className="p-6 text-gray-600">Carregando dados...</p>;
  }


  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-10">
        {idMaquina ? "Editar Máquina" : "Cadastrar Máquina"}
      </h1>

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

      <form
        className="max-w-2xl mx-auto space-y-6 text-base"
        onSubmit={handleSubmit}
      >
        
        {/* Código Patrimonial - BLOQUEADO PARA EDIÇÃO */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="codPatrimonial">Código de patrimônio:</label>
          <input
            id="codPatrimonial"
            name="codPatrimonial"
            type="text"
            readOnly={isEditing} 
            className={`rounded px-4 py-2 w-full md:w-72 ${isEditing ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200'}`}
            value={formData.codPatrimonial}
            onChange={handleChange}
            required
          />
        </div>

        {/* Número de Série - BLOQUEADO PARA EDIÇÃO */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="numSerie">Número de série:</label>
          <input
            id="numSerie"
            name="numSerie"
            type="text"
            readOnly={isEditing} 
            className={`rounded px-4 py-2 w-full md:w-72 ${isEditing ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200'}`}
            value={formData.numSerie}
            onChange={handleChange}
            required
          />
        </div>

        {/* Valor da Máquina */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="valor">Valor da máquina:</label>
          <input
            id="valor"
            name="valor"
            type="number"
            step="0.01"
            className="bg-gray-200 rounded px-4 py-2 w-full md:w-72"
            value={formData.valor}
            onChange={handleChange}
            required
          />
        </div>

        {/* Responsável pela Máquina */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="idResponsavel">Responsável pela máquina:</label>
          <select
            id="idResponsavel"
            name="idResponsavel"
            className="bg-gray-200 rounded px-4 py-2 w-full md:w-72 font-semibold"
            value={formData.idResponsavel}
            onChange={handleChange}
          >
            <option value="">Nenhum responsável</option>
            {funcionarios.map((func) => (
              <option key={func.idFuncionario} value={func.idFuncionario}>
                {func.nomeFuncionario} - ID: {func.idFuncionario}
              </option>
            ))}
          </select>
        </div>

        {/* Localização da Máquina */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="localizacao">Localização da máquina:</label>
          <input
            id="localizacao"
            name="localizacao"
            type="text"
            className="bg-gray-200 rounded px-4 py-2 w-full md:w-72"
            value={formData.localizacao}
            onChange={handleChange}
            required
          />
        </div>

        {/* Status da Máquina */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="status">Status da máquina:</label>
          <select
            id="status"
            name="status"
            className="bg-gray-200 rounded px-4 py-2 w-full md:w-72 font-semibold"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="ATIVA">ATIVA</option>
            <option value="INATIVA">INATIVA</option>
            <option value="EM_MANUTENCAO">EM MANUTENÇÃO</option>
          </select>
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="w-full max-w-xs md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg"
          >
            {idMaquina ? "Salvar Edição" : "Cadastrar"}
          </button>
        </div>
      </form>

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