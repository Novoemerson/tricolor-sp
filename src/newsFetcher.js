// newsFetcher.js - Buscar notícias esportivas sobre o São Paulo FC

const axios = require('axios');
const cheerio = require('cheerio');

// URLs das fontes de notícias (ajuste conforme necessário)
const sources = [
    "https://www.lance.com.br/sao-paulo",
    "https://www.gazetaesportiva.com/tag/sao-paulo",
    "https://www.uol.com.br/esporte/futebol/times/sao-paulo/",
];

// Função para buscar e processar notícias
async function buscarNoticias(url) {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const resposta = await axios.get(url, { signal: controller.signal });

        clearTimeout(timeout);
        
        const $ = cheerio.load(resposta.data);
        console.log("🔍 HTML carregado de:", url); // Adicionando log de depuração
        return resposta.data;
    } catch (erro) {
        console.error(`❌ Erro ao acessar ${url}:`, erro.message);
        return null;
    }
}

// Exportando função
module.exports = { buscarNoticias };
