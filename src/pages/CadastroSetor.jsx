import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function CadastroSetor() {
  const [searchParams] = useSearchParams();
  const idSetor = searchParams.get("id");
  const navigate = useNavigate();

  const [sucesso, setSucesso] = useState(null);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);

  const isEditing = !!idSetor;

  const [formData, setFormData] = useState({
    nomeSetor: "",
  });

  useEffect(() => {
    fetchData();
  }, [idSetor]);

  const fetchData = async () => {
    setLoading(true);
    setErro(null);
    setSucesso(null);

    try {
      if (idSetor) {
        const response = await api.get(`/setores/${idSetor}`);
        const dadosSetor = response.data;

        setFormData({
            nomeSetor: dadosSetor.nomeSetor || "",
        });
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      const statusCode = error.response?.status;
      if (isEditing) {
          setErro(`Erro ao carregar dados para edição. Status: ${statusCode || 'Sem Conexão'}.`);
      } else {
          setErro("Erro ao carregar dados iniciais.");
      }
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSucesso(null);
    setErro(null);

    const payload = {
        idSetor: isEditing ? parseInt(idSetor) : undefined,
        ...formData
    };

    try {
      if (isEditing) {
        await api.put(`/setores/${idSetor}`, payload);
        setSucesso("Setor atualizado com sucesso!");
      } else {
        await api.post("/setores", payload);
        setSucesso("Setor cadastrado com sucesso!");
        
        setFormData({ nomeSetor: "" });
      }

      setTimeout(() => setSucesso(null), 4000);
    } catch (error) {
      console.error("Erro ao salvar setor:", error);
      const msgErro = error.response?.data?.message || `Ocorreu um erro ao tentar ${isEditing ? 'atualizar' : 'cadastrar'} o setor.`;
      setErro(msgErro);
      setTimeout(() => setErro(null), 5000);
    }
  };
  
  const handleVolta = () => {
    navigate(-1);
  };

  if (loading && !isEditing) {
    return <p className="p-6 text-gray-600">Carregando...</p>;
  }
  
  return (
    <>
      <div className="flex items-center justify-between mb-6 relative">
        
        <button
          onClick={handleVolta}
          className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-full transition duration-150 flex items-center gap-2"
        >
          &#8592; Voltar
        </button>
        
        <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 whitespace-nowrap">
                {isEditing ? "Editar Setor" : "Cadastrar Setor"}
            </h1>
        </div>

        <div className="w-24 md:w-auto"></div> 
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

      <form
        className="max-w-2xl mx-auto space-y-6 text-base"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <label className="font-semibold" htmlFor="nomeSetor">
            Nome do setor:
          </label>
          <input
            id="nomeSetor"
            name="nomeSetor"
            type="text"
            className="bg-gray-200 rounded px-4 py-2 w-full md:w-72"
            value={formData.nomeSetor}
            onChange={handleChange}
            required
          />
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