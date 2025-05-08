import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="container">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
                Ferramenta de Busca
            </h1>
            <form className="max-w-2xl mx-auto space-y-8 text-lg">
                <div className="flex justify-between items-center">
                    <label className="font-semibold">
                        Selecione como deseja realizar a busca:
                    </label>
                    <select className="bg-gray-300 rounded px-4 py-2 w-72 font-bold">
                        <option>Service Tag</option>
                        <option>Patrimônio</option>
                        <option>Número de śérie</option>
                    </select>
                </div>
                <div className="flex justify-between items-center">
                <label className="font-semibold">
                    Digite o código de patrimônio da máquina:
                </label>
                <input
                    type="text"
                    className="bg-gray-300 rounded px-4 py-2 w-72"
                />
                </div>
                <div className="flex justify-center">
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full">
                    Pesquisar
                </button>
        </div>
            </form>
        </div>
    );
}