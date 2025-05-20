// services.js - Integração com serviços externos do Tricolor-SP

const axios = require('axios'); // Dependência para requisições HTTP

// Função para obter dados de uma API externa
async function buscarDados(url) {
    try {
        const resposta = await axios.get(url);
        return resposta.data;
    } catch (erro) {
        console.error("Erro ao buscar dados da API:", erro);
        return null;
    }
}

// Exportando funções para uso em outros arquivos
module.exports = {
    buscarDados
};
