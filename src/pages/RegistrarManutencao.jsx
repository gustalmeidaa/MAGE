import React, { useState, useEffect } from "react";

export default function RegistarManutencao() {
    return (
        <div className="container">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
                Registrar Movimentação
            </h1>

            <form className="max-w-2xl mx-auto space-y-8 text-lg">
                {/* Campo de data */}
                <div className="flex justify-between items-center">
                    <label className="font-semibold">
                        Selecione a data da manutenção:
                    </label>
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
                    <label className="font-semibold">
                        Selecione a máquina manuteniada:
                    </label>
                    <select className="bg-gray-300 rounded px-4 py-2 w-72 font-bold">
                        <option value="">Nenhuma máquina</option>
                    </select>
                </div>

                {/* Campo de responsável */}
                <div className="flex justify-between items-center">
                    <label className="font-semibold">
                        Selecione o responsável pela manutenção:
                    </label>
                    <select className="bg-gray-300 rounded px-4 py-2 w-72 font-bold">
                        <option value="">Nenhum responsável</option>
                    </select>
                </div>

                {/* Tipo de manutenção */}
                <div className="flex justify-between items-center">
                    <label className="font-semibold">
                        Selecione o tipo de manutenção:
                    </label>
                    <select
                        className="bg-gray-300 rounded px-4 py-2 w-72 font-bold"
                        required
                    >
                        <option value="preventiva">Preventiva</option>
                        <option value="corretiva">Corretiva</option>
                    </select>
                </div>

                {/* Campo descritivo */}
                <div className="flex justify-between items-center">
                    <label className="font-semibold">
                        Digite o que foi feito:
                    </label>
                    <textarea
                        className="bg-gray-300 rounded w-72 resize-none"
                        id="descricao"
                        name="descricao"
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
