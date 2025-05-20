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
        const resposta = await axios.get(url);
        const $ = cheerio.load(resposta.data);
        
        console.log("🔍 HTML carregado de:", url);
        console.log($.html().substring(0, 500)); // Exibe um trecho do código da página
        
        const titulo = $("h2, .headline-title").first().text().trim();
        console.log("🔍 Título encontrado:", titulo);

        return titulo ? { titulo, link: url } : null;
    } catch (erro) {
        console.error(`❌ Erro ao acessar ${url}:`, erro.message);
        return null;
    }
}

// Função para processar todas as fontes de notícias
async function obterNoticias() {
    const resultados = await Promise.all(sources.map(buscarNoticias));
    return resultados.filter(noticia => noticia !== null); // Remove valores nulos
}

// Exportando função corretamente
module.exports = { obterNoticias };
