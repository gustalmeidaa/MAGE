import React, { useState, useEffect } from "react";
import axios from "axios";

export default function RegistrarMovimentacao() {
  const [maquinas, setMaquinas] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [sucesso, setSucesso] = useState(null);

  // ALTERAÇÃO: Estado único para gerenciar todos os dados do formulário
  const [formData, setFormData] = useState({
    data: "",
    idMaquinaMovimentada: "",
    idResponsavel: "",
    tipo: "entrada", // Valor padrão
    origem: "",
    destino: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resMaquinas, resFuncionarios] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/maquinas`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/funcionarios`),
        ]);
        setMaquinas(resMaquinas.data);
        setFuncionarios(resFuncionarios.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, []);

  // ALTERAÇÃO: Função de 'change' aprimorada para lidar com a lógica da origem
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Atualiza o estado para o campo que foi alterado
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
    try {
      // ALTERAÇÃO: Enviando os dados do estado 'formData'
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/movimentacoes`, {
          ...formData,
          idResponsavel: formData.idResponsavel || null
      });
      setSucesso("Movimentação registrada com sucesso!");
      
      // Limpa o formulário resetando o estado
      setFormData({
        data: "", idMaquinaMovimentada: "", idResponsavel: "",
        tipo: "entrada", origem: "", destino: "",
      });

      setTimeout(() => setSucesso(null), 4000);
    } catch (error) {
      console.error("Erro ao registrar movimentação:", error);
    }
  };

  return (
    <>
      {/* ALTERAÇÃO: Título responsivo */}
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-10">
        Registrar Movimentação
      </h1>

      {sucesso && (
        <div className="max-w-md mx-auto mb-8 p-4 bg-green-100 border border-green-400 rounded-lg text-green-700 shadow-md animate-fade-in">
          {sucesso}
        </div>
      )}

      <form className="max-w-2xl mx-auto space-y-6 text-base" onSubmit={handleSubmit}>
        {/* ALTERAÇÃO: Layout de todos os campos agora é responsivo */}
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
            value={formData.origem} // O valor vem do estado
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
            Registrar
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