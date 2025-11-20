import React, { useState, useEffect } from "react";
// 💡 Importa a instância configurada do Axios (api) que anexa o token
import api from "../api"; 

export default function AgendarManutencao() {
  const [maquinas, setMaquinas] = useState([]);
  const [sucesso, setSucesso] = useState(null);
  const [erro, setErro] = useState(null); // Estado para gerenciar erros

  // Estado do formulário para corresponder ao modelo ManutencaoAgendada
  const [formData, setFormData] = useState({
    dataAgendada: "",
    idMaquina: "",
    tipoManutencao: "preventiva", // Valor padrão
    procedimentos: "",
  });

  useEffect(() => {
    // Busca apenas as máquinas
    const fetchMaquinas = async () => {
      setErro(null);
      try {
        // 💡 SUBSTITUIÇÃO: Usando 'api.get' para incluir o token JWT
        const resMaquinas = await api.get("/maquinas");
        setMaquinas(resMaquinas.data);
      } catch (error) {
        console.error("Erro ao buscar máquinas:", error);
        setErro("Não foi possível carregar a lista de máquinas.");
      }
    };

    fetchMaquinas();
  }, []);

  // Função genérica para lidar com mudanças nos campos
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

    try {
      // 💡 SUBSTITUIÇÃO: Usando 'api.post' para incluir o token JWT
      // Endpoint para agendamento e envio do novo 'formData'
      await api.post("/manutencoes-agendadas", formData);
      setSucesso("Manutenção agendada com sucesso!");
      
      // Limpa o formulário resetando o estado para a nova estrutura
      setFormData({
        dataAgendada: "", idMaquina: "", 
        tipoManutencao: "preventiva", procedimentos: "",
      });

      setTimeout(() => setSucesso(null), 4000);
    } catch (error) {
      console.error("Erro ao agendar manutenção:", error);
      const msgErro = error.response?.data?.message || "Ocorreu um erro ao tentar agendar a manutenção.";
      setErro(msgErro);
      setTimeout(() => setErro(null), 5000);
    }
  };

  return (
    <>
      {/* Título da página */}
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-10">
        Agendar Manutenção
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

        {/* Botão de Submissão */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="w-full max-w-xs md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg"
          >
            Agendar
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