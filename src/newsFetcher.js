// newsFetcher.js - Buscar notícias esportivas sobre o São Paulo FC

const axios = require('axios');
const cheerio = require('cheerio');

// URLs das fontes de notícias (ajuste conforme necessário)
const sources = [
    "https://www.lance.com.br/sao-paulo",
    "https://www.gazetaesportiva.com/sao-paulo-fc/",
    "https://www.uol.com.br/esporte/sao-paulo/",
    "https://www.globo.com.br/esporte/sao-paulo-fc/"
];

// Função para buscar e processar notícias
const axios = require('axios');

async function buscarNoticias(url) {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // Timeout de 5 segundos

        const resposta = await axios.get(url, { signal: controller.signal });
        
        clearTimeout(timeout); // Cancela timeout se a resposta for rápida
        return resposta.data;
    } catch (erro) {
        console.error(`❌ Erro ao acessar ${url}:`, erro.message);
        return null; // Evita travamento
    }
}

// Exportando função
module.exports = { obterNoticias };
