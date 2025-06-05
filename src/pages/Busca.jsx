import React, { useState } from "react";

export default function Home() {
    const [searchType, setSearchType] = useState("Patrimônio"); // Estado para o tipo de busca
    const [searchValue, setSearchValue] = useState(""); // Estado para o valor de busca
    const [result, setResult] = useState([]); // Estado para armazenar o resultado da busca
    const [error, setError] = useState(null); // Estado para armazenar mensagens de erro

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão do formulário

        let url = '';
        // Define a URL com base no tipo de busca selecionado
        switch (searchType) {
            case 'Patrimônio':
                url = `${import.meta.env.VITE_API_BASE_URL}/maquinas/buscar/cod-patrimonial/${searchValue}`;
                break;
            case 'Número de série':
                url = `${import.meta.env.VITE_API_BASE_URL}/maquinas/buscar/num-serie/${searchValue}`;
                break;
            default:
                return;
        }

        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                console.log('Máquinas encontradas:', data);
                setResult(data); // Armazena os dados encontrados no estado
                setError(null); // Limpa mensagens de erro
            } else {
                setError("Máquina não encontrada.");
                setResult([]); // Limpa o resultado se a máquina não for encontrada
            }
        } catch (error) {
            console.error("Erro ao buscar máquina:", error);
            setError("Ocorreu um erro ao buscar a máquina. Tente novamente.");
            setResult([]); // Limpa o resultado em caso de erro
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
                Ferramenta de Busca
            </h1>
            <form className="max-w-2xl mx-auto space-y-8 text-lg" onSubmit={handleSubmit}>
                <div className="flex justify-between items-center">
                    <label className="font-semibold">
                        Selecione como deseja realizar a busca:
                    </label>
                    <select
                        className="bg-gray-300 rounded px-4 py-2 w-72 font-bold"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)} // Atualiza o estado do tipo de busca
                    >
                        <option>Service Tag</option>
                        <option>Patrimônio</option>
                        <option>Número de série</option>
                    </select>
                </div>
                <div className="flex justify-between items-center">
                    <label className="font-semibold">
                        Digite o código de patrimônio da máquina:
                    </label>
                    <input
                        type="text"
                        className="bg-gray-300 rounded px-4 py-2 w-72"
                        value={searchValue} // Atualiza o valor do input
                        onChange={(e) => setSearchValue(e.target.value)} // Atualiza o estado do valor de busca
                    />
                </div>
                <div className="flex justify-center">
                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full">
                        Pesquisar
                    </button>
                </div>
            </form>

            {/* Renderiza mensagens de erro */}
            {error && (
                <div className="mt-4 text-red-600 text-center">
                    <p>{error}</p>
                </div>
            )}

            {/* Renderiza o resultado da busca */}
            {result.length > 0 && (
                <div className="mt-8 p-4 border border-gray-300 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-2">Resultado da Busca:</h2>
                    {result.map((maquina) => (
                        <div key={maquina.idMaquina} className="bg-gray-100 p-4 rounded mb-4">
                            <p><strong>Código Patrimonial:</strong> {maquina.codPatrimonial}</p>
                            <p><strong>Número de Série:</strong> {maquina.numSerie}</p>
                            <p><strong>Valor:</strong> {maquina.valor}</p>
                            <p><strong>Responsável:</strong> {maquina.idResponsavel || "Não especificado"}</p>
                            <p><strong>Localização:</strong> {maquina.localizacao}</p>
                            <p><strong>Status:</strong> {maquina.status}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
