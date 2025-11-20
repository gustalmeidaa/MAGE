import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import api from "../api"; 

export default function CadastroMaquina() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [sucesso, setSucesso] = useState(null); 
  const [erro, setErro] = useState(null); // Adicionando estado para erros

  const [formData, setFormData] = useState({
    codPatrimonial: "",
    numSerie: "",
    valor: "",
    idResponsavel: "",
    localizacao: "",
    status: "ATIVA", 
  });

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        // 💡 SUBSTITUIÇÃO: Usando 'api.get' para incluir o token JWT
        const response = await api.get("/funcionarios");
        setFuncionarios(response.data);
      } catch (error) {
        console.error("Erro ao buscar funcionários:", error);
        setErro("Erro ao carregar lista de funcionários.");
      }
    };
    fetchFuncionarios();
  }, []);

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
      await api.post(
        "/maquinas",
        {...formData, idResponsavel: formData.idResponsavel || null}
      );
      
      setSucesso("Máquina cadastrada com sucesso!");
      
      // Limpa o formulário resetando o estado
      setFormData({
        codPatrimonial: "", numSerie: "", valor: "", idResponsavel: "",
        localizacao: "", status: "ATIVA",
      });

      setTimeout(() => setSucesso(null), 4000);
    } catch (error) {
      console.error("Erro ao cadastrar máquina:", error);
      // Tratamento de erro mais específico
      const msgErro = error.response?.data?.message || "Ocorreu um erro ao tentar cadastrar a máquina.";
      setErro(msgErro);
      setTimeout(() => setErro(null), 5000);
    }
  };

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-10">
        Cadastrar Máquina
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
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="codPatrimonial">
            Código de patrimônio:
          </label>
          <input
            id="codPatrimonial"
            name="codPatrimonial"
            type="text"
            className="bg-gray-200 rounded px-4 py-2 w-full md:w-72"
            value={formData.codPatrimonial}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="numSerie">
            Número de série:
          </label>
          <input
            id="numSerie"
            name="numSerie"
            type="text"
            className="bg-gray-200 rounded px-4 py-2 w-full md:w-72"
            value={formData.numSerie}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="valor">
            Valor da máquina:
          </label>
          <input
            id="valor"
            name="valor"
            type="number"
            className="bg-gray-200 rounded px-4 py-2 w-full md:w-72"
            value={formData.valor}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="idResponsavel">
            Responsável pela máquina:
          </label>
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

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="localizacao">
            Localização da máquina:
          </label>
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

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="status">
            Status da máquina:
          </label>
          <select
            id="status"
            name="status"
            className="bg-gray-200 rounded px-4 py-2 w-full md:w-72 font-semibold"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option>ATIVA</option>
            <option>INATIVA</option>
            <option>EM_MANUTENCAO</option>
          </select>
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="w-full max-w-xs md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg"
          >
            Cadastrar
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