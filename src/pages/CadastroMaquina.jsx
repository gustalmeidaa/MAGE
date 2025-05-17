import React from "react";

export default function CadastroMaquina() {
  return (
    <>
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
        Cadastrar Máquina
      </h1>
      <form className="max-w-2xl mx-auto space-y-8 text-lg">
        <div className="flex justify-between items-center">
          <label className="font-semibold">
            Digite o código de patrimônio da máquina:
          </label>
          <input
            type="text"
            className="bg-gray-300 rounded px-4 py-2 w-72"
          />
        </div>

        <div className="flex justify-between items-center">
          <label className="font-semibold">
            Digite o número de série da máquina:
          </label>
          <input
            type="text"
            className="bg-gray-300 rounded px-4 py-2 w-72"
          />
        </div>

        <div className="flex justify-between items-center">
          <label className="font-semibold">
            Digite o valor da máquina:
          </label>
          <input
            type="number"
            className="bg-gray-300 rounded px-4 py-2 w-72"
          />
        </div>

        <div className="flex justify-between items-center">
          <label className="font-semibold">
            Selecione o responsável pela máquina:
          </label>
          <select className="bg-gray-300 rounded px-4 py-2 w-72 font-bold">
            <option>Tito Fonfon</option>
            <option>Maria Souza</option>
            <option>Carlos Lima</option>
          </select>
        </div>

        <div className="flex justify-between items-center">
          <label className="font-semibold">
            Digite a localização da máquina:
          </label>
          <input
            type="text"
            className="bg-gray-300 rounded px-4 py-2 w-72"
          />
        </div>

        <div className="flex justify-between items-center">
          <label className="font-semibold">
            Selecione o status da máquina:
          </label>
          <select className="bg-gray-300 rounded px-4 py-2 w-72 font-bold">
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
