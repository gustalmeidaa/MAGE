import React, { useState, useEffect } from "react";
import axios from "axios";

export default function RegistrarManutencao() {
  const [maquinas, setMaquinas] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [sucesso, setSucesso] = useState(null);

  // ALTERAÇÃO: Estado para gerenciar os dados do formulário
  const [formData, setFormData] = useState({
    data: "",
    idMaquina: "",
    idFuncionario: "",
    tipoManutencao: "preventiva", // Valor padrão
    procedimentos: "",
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

  // ALTERAÇÃO: Função genérica para lidar com mudanças nos campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // ALTERAÇÃO: Enviando os dados do estado 'formData'
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/manutencoes`, formData);
      setSucesso("Manutenção registrada com sucesso!");
      
      // Limpa o formulário resetando o estado
      setFormData({
        data: "", idMaquina: "", idFuncionario: "",
        tipoManutencao: "preventiva", procedimentos: "",
      });

      setTimeout(() => setSucesso(null), 4000);
    } catch (error) {
      console.error("Erro ao registrar manutenção:", error);
    }
  };

  return (
    <>
      {/* ALTERAÇÃO: Título responsivo */}
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-10">
        Registrar Manutenção
      </h1>

      {sucesso && (
        <div className="max-w-md mx-auto mb-8 p-4 bg-green-100 border border-green-400 rounded-lg text-green-700 shadow-md animate-fade-in">
          {sucesso}
        </div>
      )}

      <form className="max-w-2xl mx-auto space-y-6 text-base" onSubmit={handleSubmit}>
        {/* ALTERAÇÃO: Layout de cada campo agora é responsivo (coluna -> linha) */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="data">
            Data da manutenção:
          </label>
          <input
            id="data"
            name="data"
            type="datetime-local"
            // ALTERAÇÃO: Largura responsiva
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
            // ALTERAÇÃO: Botão com largura responsiva
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