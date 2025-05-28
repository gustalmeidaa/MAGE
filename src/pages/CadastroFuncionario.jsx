import React, { useState, useEffect } from "react";

export default function CadastroFuncionario() {
    return (
        <div className="container">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
                Cadastrar Funcionário
            </h1>

            <form className="max-w-2xl mx-auto space-y-8 text-lg">
                {/* Campo de nome do funcionário */}
                <div className="flex justify-between items-center">
                <label className="font-semibold">
                    Digite o nome do funcionário:
                </label>
                <input
                    type="text"
                    className="bg-gray-300 rounded px-4 py-2 w-72"
                    required
                />
                </div>

                {/* Campo de setor */}
                <div className="flex justify-between items-center">
                    <label className="font-semibold">
                        Selecione o setor do funcionário:
                    </label>
                    <select className="bg-gray-300 rounded px-4 py-2 w-72 font-bold">
                        <option value="">Nenhum setor selecionado</option>
                    </select>
                </div>

                {/* Botão de envio */}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full"
                    >
                        Cadastrar
                    </button>
                </div>
            </form>
        </div>
    );
}
