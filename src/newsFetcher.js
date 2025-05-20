const axios = require("axios");
const cheerio = require("cheerio");

// Função para buscar notícias e garantir que extração funcione corretamente
async function buscarNoticias(url) {
    try {
        console.log(`🔍 Tentando acessar: ${url}`);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // Timeout de 5 segundos

        const resposta = await axios.get(url, { signal: controller.signal });
        clearTimeout(timeout);

        const $ = cheerio.load(resposta.data);

        // Log do HTML carregado para diagnóstico
        console.log("🔍 HTML carregado de:", url);
        console.log($.html().substring(0, 1000)); // Mostra um trecho do código HTML para análise

        let noticias = [];

        // Testando múltiplos seletores para garantir captura dos títulos
        $("h2, .headline-title, .news-title, article h1, .post-title, .entry-title, .title").each((index, elemento) => {
            const titulo = $(elemento).text().trim();
            const link = $(elemento).closest("a").attr("href") || url;

            if (titulo && titulo.length > 5) { // Evita títulos vazios ou genéricos
                noticias.push({ titulo, link, fonte: url });
            }
        });

        console.log("🔍 Notícias extraídas:", noticias);

        return noticias.length > 0 ? noticias : null;
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
