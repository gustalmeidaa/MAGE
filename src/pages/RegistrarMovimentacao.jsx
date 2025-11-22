import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; 
import api from "../api"; 

export default function RegistrarMovimentacao() {
  const [searchParams] = useSearchParams();
  const idMovimentacao = searchParams.get("id"); // Captura o ID da Movimentação na URL
  
  const [maquinas, setMaquinas] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [sucesso, setSucesso] = useState(null);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);

  const isEditing = !!idMovimentacao; 

  const [formData, setFormData] = useState({
    data: "",
    idMaquinaMovimentada: "",
    idResponsavel: "",
    tipo: "entrada",
    origem: "",
    destino: "",
  });

  useEffect(() => {
    fetchData();
  }, [idMovimentacao]);

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

      // 2. Se houver ID, busca os dados da movimentação para edição
      if (idMovimentacao) {
          // Assume que a rota GET /movimentacoes/{id} existe
          const resMovimentacao = await api.get(`/movimentacoes/${idMovimentacao}`); 
          const dadosMovimentacao = resMovimentacao.data;

          // Formata a data para preencher o input datetime-local
          const dataFormatada = new Date(dadosMovimentacao.data).toISOString().substring(0, 16);

          // Preenche o estado do formulário
          setFormData({
              data: dataFormatada || "",
              idMaquinaMovimentada: dadosMovimentacao.maquinaMovimentada?.idMaquina?.toString() || "", 
              idResponsavel: dadosMovimentacao.idResponsavel?.toString() || "",
              tipo: dadosMovimentacao.tipo || "entrada",
              origem: dadosMovimentacao.origem || "",
              destino: dadosMovimentacao.destino || "",
          });
      }

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      const statusCode = error.response?.status;
      if (isEditing) {
          setErro(`Erro ao carregar dados para edição. Status: ${statusCode || 'Sem Conexão'}. Verifique o token/Role.`);
      } else {
          setErro("Erro ao carregar listas de seleção.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prevState => ({ ...prevState, [name]: value }));

    // Lógica especial: se a máquina for alterada, atualiza a origem
    if (name === "idMaquinaMovimentada") {
      const maquina = maquinas.find((m) => m.idMaquina.toString() === value);
      setFormData(prevState => ({
        ...prevState,
        origem: maquina ? maquina.localizacao : "",
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSucesso(null);
    setErro(null);

    // Converte os IDs de volta para Number ou null e garante que o ID da movimentação esteja no payload para o PUT
    const payload = {
        idMovimentacoes: isEditing ? parseInt(idMovimentacao) : undefined,
        ...formData,
        idResponsavel: formData.idResponsavel ? parseInt(formData.idResponsavel) : null,
        idMaquinaMovimentada: formData.idMaquinaMovimentada ? parseInt(formData.idMaquinaMovimentada) : null,
    };

    try {
      if (isEditing) {
        // MODO EDIÇÃO (PUT)
        await api.put(`/movimentacoes/${idMovimentacao}`, payload);
        setSucesso("Movimentação atualizada com sucesso!");
      } else {
        // MODO CADASTRO (POST)
        await api.post("/movimentacoes", payload);
        setSucesso("Movimentação registrada com sucesso!");
        
        // Limpa o formulário após o cadastro
        setFormData({
          data: "", idMaquinaMovimentada: "", idResponsavel: "",
          tipo: "entrada", origem: "", destino: "",
        });
      }

      setTimeout(() => setSucesso(null), 4000);
    } catch (error) {
      console.error("Erro ao salvar movimentação:", error);
      const msgErro = error.response?.data?.message || `Falha ao ${isEditing ? 'atualizar' : 'registrar'} a movimentação.`;
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
        {isEditing ? "Editar Movimentação" : "Registrar Movimentação"}
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
          <label className="font-semibold" htmlFor="data">Data da movimentação:</label>
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
          <label className="font-semibold" htmlFor="idMaquinaMovimentada">Máquina movimentada:</label>
          <select
            id="idMaquinaMovimentada"
            name="idMaquinaMovimentada"
            className="bg-gray-200 rounded px-4 py-2 w-full md:w-72 font-semibold"
            value={formData.idMaquinaMovimentada}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma máquina</option>
            {maquinas.map((maq) => (
              <option key={maq.idMaquina} value={maq.idMaquina}>
                {maq.codPatrimonial || `Série: ${maq.numSerie}`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="idResponsavel">Responsável:</label>
          <select
            id="idResponsavel"
            name="idResponsavel"
            className="bg-gray-200 rounded px-4 py-2 w-full md:w-72 font-semibold"
            value={formData.idResponsavel}
            onChange={handleChange}
          >
            <option value="">Nenhum responsável</option>
            {funcionarios.map((f) => (
              <option key={f.idFuncionario} value={f.idFuncionario}>
                {f.nomeFuncionario}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="tipo">Tipo de movimentação:</label>
          <select
            id="tipo"
            name="tipo"
            className="bg-gray-200 rounded px-4 py-2 w-full md:w-72 font-semibold"
            value={formData.tipo}
            onChange={handleChange}
            required
          >
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
            <option value="transferencia">Transferência</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="origem">Origem:</label>
          <input
            id="origem"
            name="origem"
            type="text"
            className="bg-gray-300 rounded px-4 py-2 w-full md:w-72 cursor-not-allowed"
            value={formData.origem}
            readOnly
          />
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="destino">Destino da máquina:</label>
          <input
            id="destino"
            name="destino"
            type="text"
            className="bg-gray-200 rounded px-4 py-2 w-full md:w-72"
            value={formData.destino}
            onChange={handleChange}
            required
          />
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