import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // 💡 Adicionado useSearchParams
import api from "../api"; 

export default function RegistrarManutencao() {
  const [searchParams] = useSearchParams();
  const idHistorico = searchParams.get("id"); // Captura o ID da manutenção na URL
  
  const [maquinas, setMaquinas] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [sucesso, setSucesso] = useState(null);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // O modo Edição é determinado pela presença do ID na URL
  const isEditing = !!idHistorico; 

  const [formData, setFormData] = useState({
    data: "",
    idMaquina: "",
    idFuncionario: "",
    tipoManutencao: "preventiva",
    procedimentos: "",
  });

  useEffect(() => {
    fetchData();
  }, [idHistorico]);

  const fetchData = async () => {
    setLoading(true);
    setErro(null);
    setSucesso(null);

    try {
      // 1. Busca Funcionários e Máquinas
      const [resMaquinas, resFuncionarios] = await Promise.all([
        api.get("/maquinas"),
        api.get("/funcionarios"),
      ]);
      setMaquinas(resMaquinas.data || []);
      setFuncionarios(resFuncionarios.data || []);
      
      // 2. Se houver ID, busca os dados da manutenção para edição
      if (idHistorico) {
        const resManutencao = await api.get(`/manutencoes/${idHistorico}`); // Assume que a rota GET /manutencoes/{id} existe
        const dadosManutencao = resManutencao.data;

        // Formata a data e preenche o formulário
        const dataFormatada = new Date(dadosManutencao.data).toISOString().substring(0, 16);

        setFormData({
            data: dataFormatada || "",
            // Garante que o ID é string para o select
            idMaquina: dadosManutencao.idMaquina?.idMaquina?.toString() || "",
            idFuncionario: dadosManutencao.idFuncionario?.idFuncionario?.toString() || "",
            tipoManutencao: dadosManutencao.tipoManutencao || "preventiva",
            procedimentos: dadosManutencao.procedimentos || "",
        });
      }

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      const statusCode = error.response?.status;
      if (isEditing) {
          setErro(`Erro ao carregar dados para edição. Status: ${statusCode || 'Sem Conexão'}.`);
      } else {
          setErro("Erro ao carregar listas de seleção.");
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

    // Converte os IDs de volta para Number ou null
    const payload = {
        ...formData,
        idMaquina: formData.idMaquina ? parseInt(formData.idMaquina) : null,
        idFuncionario: formData.idFuncionario ? parseInt(formData.idFuncionario) : null,
    };
    
    try {
      if (isEditing) {
        // MODO EDIÇÃO (PUT)
        await api.put(`/manutencoes/${idHistorico}`, payload); // Assume que a rota PUT /manutencoes/{id} existe
        setSucesso("Manutenção atualizada com sucesso!");
      } else {
        // MODO CADASTRO (POST)
        await api.post("/manutencoes", payload);
        setSucesso("Manutenção registrada com sucesso!");
        
        // Limpa o formulário após o cadastro
        setFormData({
            data: "", idMaquina: "", idFuncionario: "",
            tipoManutencao: "preventiva", procedimentos: "",
        });
      }

      setTimeout(() => setSucesso(null), 4000);
    } catch (error) {
      console.error("Erro ao salvar manutenção:", error);
      const msgErro = error.response?.data?.message || `Falha ao ${isEditing ? 'atualizar' : 'registrar'} a manutenção.`;
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
        {isEditing ? "Editar Manutenção" : "Registrar Manutenção"}
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

      <form className="max-w-2xl mx-auto space-y-6 text-base" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="data">
            Data da manutenção:
          </label>
          <input
            id="data"
            name="data"
            type="datetime-local"
            className="bg-gray-200 rounded px-4 py-2 w-full md:w-72"
            value={formData.data}
            onChange={handleChange}
            required
          />
        </div>

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

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="idFuncionario">
            Responsável:
          </label>
          <select
            id="idFuncionario"
            name="idFuncionario"
            className="bg-gray-200 rounded px-4 py-2 w-full md:w-72 font-semibold"
            value={formData.idFuncionario}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o responsável</option>
            {funcionarios.map((f) => (
              <option key={`funcionario-${f.idFuncionario}`} value={f.idFuncionario}>
                {f.nomeFuncionario}
              </option>
            ))}
          </select>
        </div>

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

        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <label className="font-semibold pt-2" htmlFor="procedimentos">
            Procedimentos realizados:
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

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="w-full max-w-xs md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg"
          >
            {isEditing ? "Salvar Edição" : "Registrar"}
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