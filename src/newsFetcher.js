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
        const timeout = setTimeout(() => controller.abort(), 5000); // Timeout de 5 segundos

        const resposta = await axios.get(url, { signal: controller.signal });

        clearTimeout(timeout);

        const $ = cheerio.load(resposta.data);
        console.log("🔍 HTML carregado de:", url);
        console.log($.html().substring(0, 500)); // Mostra parte do código da página para depuração

        // Testando diferentes seletores de títulos
        let titulo = $("h2").first().text().trim();
        if (!titulo) titulo = $(".headline-title").first().text().trim();
        if (!titulo) titulo = $(".news-title").first().text().trim();
        if (!titulo) titulo = $("article h1").first().text().trim();

        console.log("🔍 Título encontrado:", titulo);

        return titulo ? { titulo, link: url } : null;
    } catch (erro) {
        console.error(`❌ Erro ao acessar ${url}:`, erro.message);
        return null; // Evita travamento
    }
}

// Função para processar todas as fontes de notícias
async function obterNoticias() {
    const resultados = await Promise.all(sources.map(buscarNoticias));
    return resultados.filter(noticia => noticia !== null); // Remove valores nulos
}

// Exportando função corretamente
module.exports = { obterNoticias };
