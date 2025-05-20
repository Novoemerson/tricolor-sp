const axios = require("axios");
const cheerio = require("cheerio");

const sources = [
    { url: "https://www.gazetaesportiva.com/tag/sao-paulo", selector: "h2" }
];

async function buscarNoticias(url) {
    try {
        console.log(`🔍 Tentando acessar: ${url}`);

        const resposta = await axios.get(url);
        const $ = cheerio.load(resposta.data);

        console.log("🔍 HTML carregado de:", url);
        console.log($.html().substring(0, 1000)); // Log para diagnóstico

        let noticias = [];

        // Ignorando propagandas e focando apenas em conteúdo relevante
        $("h2, .headline-title, .news-title, article h1, .post-title, .entry-title, .title").each((index, elemento) => {
            if ($(elemento).closest(".ads").length === 0) { // Ignora manchetes dentro de anúncios
                const titulo = $(elemento).text().trim();
                let link = $(elemento).closest("a").attr("href");

                if (link && !link.startsWith("http")) {
                    link = new URL(link, url).href;
                }

                if (titulo && titulo.length > 5) {
                    noticias.push({ titulo, link: link || url, fonte: url });
                }
            }
        });

        console.log("🔍 Notícias encontradas:", noticias);

        if (noticias.length === 0) {
            console.error(`❌ Nenhuma notícia encontrada em ${url}. Revise os seletores.`);
        }

        return noticias.length > 0 ? noticias : [];
    } catch (erro) {
        console.error(`❌ Erro ao acessar ${url}:`, erro.message);
        return [];
    }
}

async function obterNoticias() {
    const resultados = await Promise.all(sources.map(buscarNoticias));
    return resultados.flat();
}

module.exports = { obterNoticias };
