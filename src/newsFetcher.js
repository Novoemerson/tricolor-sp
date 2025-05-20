const axios = require("axios");
const cheerio = require("cheerio");

// Fonte de notícias sem Puppeteer
const sources = [
    { url: "https://www.gazetaesportiva.com/tag/sao-paulo", selector: "article.noticia h3" }
];

// Função para capturar notícias
async function buscarNoticias(source) {
    const { url, selector } = source;

    try {
        console.log(`🔍 Acessando: ${url} via Axios`);

        const resposta = await axios.get(url);
        const $ = cheerio.load(resposta.data);

        let noticias = [];

        // Extraindo títulos e links das notícias corretamente
        $(selector).each((index, elemento) => {
            const titulo = $(elemento).text().trim();
            let link = $(elemento).closest("a").attr("href");

            if (link && !link.startsWith("http")) {
                link = new URL(link, url).href;
            }

            if (titulo.length > 5) {
                noticias.push({ titulo, link: link || url, fonte: url });
            }
        });

        console.log("🔍 Notícias extraídas:", noticias);
        return noticias.length > 0 ? noticias : [];
    } catch (erro) {
        console.error(`❌ Erro ao acessar ${url}:`, erro.message);
        return [];
    }
}

// Captura notícias da Gazeta Esportiva
async function obterNoticias() {
    const resultados = await Promise.all(sources.map(buscarNoticias));
    return resultados.flat();
}

module.exports = { obterNoticias };
