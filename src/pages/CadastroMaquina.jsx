import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CadastroMaquina() {
  const [funcionarios, setFuncionarios] = useState([]);

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        const response = await axios.get("http://localhost:8080/funcionarios");
        setFuncionarios(response.data);
      } catch (error) {
        console.error("Erro ao buscar funcionários:", error);
      }
    };

    fetchFuncionarios();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Impede o comportamento padrão de recarregar a página

    const formData = {
      codPatrimonial: event.target[0].value,
      numSerie: event.target[1].value,
      valor: event.target[2].value,
      idResponsavel: event.target[3].value,
      localizacao: event.target[4].value,
      status: event.target[5].value,
    };

    try {
      const response = await axios.post("http://localhost:8080/maquinas", formData);
      console.log("Máquina cadastrada com sucesso:", response.data);
      // *limpar o formulário ou mostrar uma mensagem de sucesso*
    } catch (error) {
      console.log(formData)
      console.error("Erro ao cadastrar máquina:", error);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
        Cadastrar Máquina
      </h1>
      <form className="max-w-2xl mx-auto space-y-8 text-lg" onSubmit={handleSubmit}>
        <div className="flex justify-between items-center">
          <label className="font-semibold">
            Digite o código de patrimônio da máquina:
          </label>
          <input
            type="text"
            className="bg-gray-300 rounded px-4 py-2 w-72"
            required
          />
        </div>

        <div className="flex justify-between items-center">
          <label className="font-semibold">
            Digite o número de série da máquina:
          </label>
          <input
            type="text"
            className="bg-gray-300 rounded px-4 py-2 w-72"
            required
          />
        </div>

        <div className="flex justify-between items-center">
          <label className="font-semibold">
            Digite o valor da máquina:
          </label>
          <input
            type="number"
            className="bg-gray-300 rounded px-4 py-2 w-72"
            required
          />
        </div>

        <div className="flex justify-between items-center">
          <label className="font-semibold">
            Selecione o responsável pela máquina:
          </label>
          <select className="bg-gray-300 rounded px-4 py-2 w-72 font-bold" required>
            <option value="">Selecione um responsável</option>
            {funcionarios.map((funcionario) => (
              <option key={funcionario.idFuncionario} value={funcionario.idFuncionario}>
                {funcionario.nomeFuncionario}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between items-center">
          <label className="font-semibold">
            Digite a localização da máquina:
          </label>
          <input
            type="text"
            className="bg-gray-300 rounded px-4 py-2 w-72"
            required
          />
        </div>

        <div className="flex justify-between items-center">
          <label className="font-semibold">
            Selecione o status da máquina:
          </label>
          <select className="bg-gray-300 rounded px-4 py-2 w-72 font-bold" required>
            <option>Ativa</option>
            <option>Inativa</option>
            <option>Em manutenção</option>
          </select>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full"
          >
            Cadastrar
          </button>
          </div>
      </form>
    </>
  );
}
