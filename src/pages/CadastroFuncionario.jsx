import React, { useState, useEffect } from "react";
// 💡 Importa a instância configurada do Axios (api) que anexa o token
import api from "../api"; 

export default function CadastroFuncionario() {
  const [setores, setSetores] = useState([]);
  const [sucesso, setSucesso] = useState(null);
  const [erro, setErro] = useState(null); // Estado para gerenciar erros

  // Estado para gerenciar os dados do formulário
  const [formData, setFormData] = useState({
    nomeFuncionario: "",
    nomeSetor: "",
  });

  useEffect(() => {
    // Apenas a busca de setores é necessária para este formulário
    const fetchSetores = async () => {
      setErro(null);
      try {
        // 💡 SUBSTITUIÇÃO: Usando 'api.get' para incluir o token JWT
        const response = await api.get("/setores");
        setSetores(response.data);
      } catch (error) {
        console.error("Erro ao buscar setores:", error);
        setErro("Não foi possível carregar a lista de setores.");
      }
    };

    fetchSetores();
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
      await api.post(
        "/funcionarios",
        {...formData, nomeSetor: formData.nomeSetor || null } // Garante que valor nulo seja enviado se nada for selecionado
      );
      setSucesso("Funcionário cadastrado com sucesso!");
      
      // Limpa o formulário resetando o estado
      setFormData({ nomeFuncionario: "", nomeSetor: "" });

      setTimeout(() => setSucesso(null), 4000);
    } catch (error) {
      console.error("Erro ao cadastrar funcionário:", error);
      const msgErro = error.response?.data?.message || "Ocorreu um erro ao tentar cadastrar o funcionário.";
      setErro(msgErro);
      setTimeout(() => setErro(null), 5000);
    }
  };

  return (
    // O componente pai (Layout) já fornece o container, então usamos um Fragment <>
    <>
      {/* Título responsivo */}
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-10">
        Cadastrar Funcionário
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
        {/* Layout de linha responsivo (coluna no mobile, linha no desktop) */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="nomeFuncionario">
            Nome do funcionário:
          </label>
          <input
            id="nomeFuncionario"
            name="nomeFuncionario"
            type="text"
            // Largura responsiva (total no mobile, fixa no desktop)
            className="bg-gray-200 rounded px-4 py-2 w-full md:w-72"
            value={formData.nomeFuncionario}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="nomeSetor">
            Setor do funcionário:
          </label>
          <select
            id="nomeSetor"
            name="nomeSetor"
            className="bg-gray-200 rounded px-4 py-2 w-full md:w-72 font-semibold"
            value={formData.nomeSetor}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um setor</option>
            {setores.map((setor) => (
              <option key={setor.idSetor} value={setor.nomeSetor}>
                {setor.nomeSetor}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            // Botão com largura responsiva
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