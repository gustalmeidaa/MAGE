import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; 
import api from "../api"; 

export default function CadastroFuncionario() {
  const [searchParams] = useSearchParams();
  const idFuncionario = searchParams.get("id"); // Captura o ID do funcionário na URL
  
  const [setores, setSetores] = useState([]);
  const [sucesso, setSucesso] = useState(null);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);

  const isEditing = !!idFuncionario; 

  const [formData, setFormData] = useState({
    nomeFuncionario: "",
    nomeSetor: "", // Armazena o nome do setor
  });

  useEffect(() => {
    fetchData();
  }, [idFuncionario]);

  const fetchData = async () => {
    setLoading(true);
    setErro(null);
    setSucesso(null);

    try {
      // 1. Busca Setores
      const resSetores = await api.get("/setores");
      setSetores(resSetores.data || []);

      // 2. Se houver ID, busca os dados do funcionário para edição
      if (idFuncionario) {
        // Assume que a rota GET /funcionarios/{id} existe
        const resFuncionario = await api.get(`/funcionarios/${idFuncionario}`); 
        const dadosFuncionario = resFuncionario.data;

        // Preenche o estado do formulário
        setFormData({
            nomeFuncionario: dadosFuncionario.nomeFuncionario || "",
            // Pega o nome do setor do objeto aninhado
            nomeSetor: dadosFuncionario.setor?.nomeSetor || "", 
        });
      }

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      const statusCode = error.response?.status;
      if (isEditing) {
          setErro(`Erro ao carregar dados para edição. Status: ${statusCode || 'Sem Conexão'}.`);
      } else {
          setErro("Erro ao carregar lista de setores.");
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
        // ESSENCIAL: Garante que o ID está no corpo para o PUT
        idFuncionario: isEditing ? parseInt(idFuncionario) : undefined, 
        ...formData,
        nomeSetor: formData.nomeSetor || null,
    };

    try {
      if (isEditing) {
        // MODO EDIÇÃO (PUT)
        await api.put(`/funcionarios/${idFuncionario}`, payload);
        setSucesso("Funcionário atualizado com sucesso!");
      } else {
        // MODO CADASTRO (POST)
        await api.post("/funcionarios", payload);
        setSucesso("Funcionário cadastrado com sucesso!");
        
        // Limpa o formulário após o cadastro
        setFormData({ nomeFuncionario: "", nomeSetor: "" });
      }

      setTimeout(() => setSucesso(null), 4000);
    } catch (error) {
      console.error("Erro ao salvar funcionário:", error);
      const msgErro = error.response?.data?.message || `Falha ao ${isEditing ? 'atualizar' : 'cadastrar'} o funcionário.`;
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
        {isEditing ? "Editar Funcionário" : "Cadastrar Funcionário"}
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
          <label className="font-semibold" htmlFor="nomeFuncionario">
            Nome do funcionário:
          </label>
          <input
            id="nomeFuncionario"
            name="nomeFuncionario"
            type="text"
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
            className="w-full max-w-xs md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg"
          >
            {isEditing ? "Salvar Edição" : "Cadastrar"}
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