import React, { useState, useEffect } from "react";
import axios from "axios";

export default function RegistrarManutencao() {
  const [maquinas, setMaquinas] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resMaquinas, resFuncionarios] = await Promise.all([
          axios.get("http://localhost:8081/maquinas"),
          axios.get("http://localhost:8081/funcionarios"),
        ]);
        setMaquinas(resMaquinas.data);
        setFuncionarios(resFuncionarios.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;


  const formData = {
    
    idMaquina: form[1].value,    
    idFuncionario: form[2].value,   
    tipoManutencao: form[4].value,                 
    procedimentos: form[5].value,            
 
  };


    try {
      await axios.post("http://localhost:8081/manutencoes", formData);
      alert("Manutenção registrada com sucesso!");
      form.reset();
    } catch (error) {
      console.error("Erro ao registrar manutenção:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
        Registrar Manutenção
      </h1>

      <form className="max-w-2xl mx-auto space-y-8 text-lg" onSubmit={handleSubmit}>
        {/* Campo de data */}
        <div className="flex justify-between items-center">
          <label className="font-semibold">Data da manutenção:</label>
          <input
            className="bg-gray-300 rounded px-4 py-2 w-72"
            type="date"
            id="data"
            name="data"
            required
          />
        </div>

        {/* Campo da máquina */}
        <div className="flex justify-between items-center">
          <label className="font-semibold">Máquina manutenida:</label>
          <select name="maquina" className="bg-gray-300 rounded px-4 py-2 w-72 font-bold" required>
            <option value="">Nenhuma máquina</option>
            {maquinas.map((maq) => (
              <option key={maq.idMaquina} value={maq.idMaquina}>
                {maq.codPatrimonial || maq.numSerie || `Máquina ${maq.idMaquina}`}
              </option>
            ))}
          </select>
        </div>

        {/* Campo de responsável */}
        <div className="flex justify-between items-center">
          <label className="font-semibold">Responsável pela manutenção:</label>
          <select name="responsavel" className="bg-gray-300 rounded px-4 py-2 w-72 font-bold" required>
            <option value="">Nenhum responsável</option>
            {funcionarios.map((f) => (
              <option key={f.idFuncionario} value={f.idFuncionario}>
                {f.nomeFuncionario}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de manutenção */}
        <div className="flex justify-between items-center">
          <label className="font-semibold">Tipo de manutenção:</label>
          <select name="tipo" className="bg-gray-300 rounded px-4 py-2 w-72 font-bold" required>
            <option value="preventiva">Preventiva</option>
            <option value="corretiva">Corretiva</option>
          </select>
        </div>

        {/* Campo descritivo */}
        <div className="flex justify-between items-center">
          <label className="font-semibold">O que foi feito:</label>
          <textarea
            name="descricao"
            className="bg-gray-300 rounded w-72 resize-none px-4 py-2"
            placeholder="Digite aqui..."
            required
          ></textarea>
        </div>

        {/* Botão de envio */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full"
          >
            Registrar
          </button>
        </div>
      </form>
    </div>
  );
}
