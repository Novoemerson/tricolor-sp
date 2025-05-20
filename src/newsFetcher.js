const axios = require("axios");
const cheerio = require("cheerio");

// Função para buscar e processar notícias
async function buscarNoticias(url) {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // Timeout de 5 segundos

        const resposta = await axios.get(url, { signal: controller.signal });

        clearTimeout(timeout);

        const $ = cheerio.load(resposta.data);
        console.log("🔍 HTML carregado de:", url);

        // Testando diferentes seletores para encontrar títulos das notícias
        let noticias = [];

        $("h2, .headline-title, .news-title, article h1, .post-title, .entry-title").each((index, elemento) => {
            const titulo = $(elemento).text().trim();
            const link = $(elemento).closest("a").attr("href") || url; // Obtém o link se houver

            if (titulo && link) {
                noticias.push({ titulo, link, fonte: url });
            }
        });

        console.log("🔍 Notícias encontradas:", noticias);

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
