import React, { useState, useEffect } from "react";

export default function RegistarMovimentacao() {
    return (
        <div className="container">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
                Registrar Movimentação
            </h1>

            <form className="max-w-2xl mx-auto space-y-8 text-lg">
                {/* Campo de data */}
                <div className="flex justify-between items-center">
                    <label className="font-semibold">
                        Selecione a data da movimentação:
                    </label>
                    <input
                        className="bg-gray-300 rounded px-4 py-2 w-72"
                        type="date"
                        id="data"
                        name="data"
                        required
                    />
                </div>

                {/* Campo de responsável */}
                <div className="flex justify-between items-center">
                    <label className="font-semibold">
                        Selecione o responsável pela máquina:
                    </label>
                    <select className="bg-gray-300 rounded px-4 py-2 w-72 font-bold">
                        <option value="">Nenhum responsável</option>
                    </select>
                </div>

                {/* Campo de tipo de movimentação */}
                <div className="flex justify-between items-center">
                    <label className="font-semibold">
                        Selecione o tipo de movimentação:
                    </label>
                    <select
                        className="bg-gray-300 rounded px-4 py-2 w-72 font-bold"
                        required
                    >
                        <option value="entrada">Entrada</option>
                        <option value="sadia">Saída</option>
                        <option value="transferencia">Transferência</option>
                    </select>
                </div>

                {/* Campo de origem */}
                <div className="flex justify-between items-center">
                    <label className="font-semibold">
                        Selecione a origem da máquina:
                    </label>
                    <select className="bg-gray-300 rounded px-4 py-2 w-72 font-bold">
                        <option value="">Nenhuma origem</option>
                    </select>
                </div>

                {/* Campo da destino */}
                <div className="flex justify-between items-center">
                    <label className="font-semibold">
                        Selecione o destino da máquina:
                    </label>
                    <select className="bg-gray-300 rounded px-4 py-2 w-72 font-bold">
                        <option value="">Nenhuma destino</option>
                    </select>
                </div>

                {/* Botão */}
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
