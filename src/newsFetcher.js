const axios = require("axios");
const cheerio = require("cheerio");

// Lista de fontes de notícias sobre o São Paulo FC
const sources = [
    "https://www.lance.com.br/sao-paulo",
    "https://www.gazetaesportiva.com/tag/sao-paulo"
];

// Função para buscar notícias de uma URL específica
async function buscarNoticias(url) {
    try {
        console.log(`🔍 Tentando acessar: ${url}`);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // Timeout de 5 segundos

        const resposta = await axios.get(url, { signal: controller.signal });
        clearTimeout(timeout);

        const $ = cheerio.load(resposta.data);

        console.log("🔍 HTML carregado de:", url);
        console.log($.html().substring(0, 1000)); // Log para diagnóstico

        let noticias = [];

        // Testando múltiplos seletores para encontrar os títulos corretamente
        $("h2, .headline-title, .news-title, article h1, .post-title, .entry-title, .title").each((index, elemento) => {
            const titulo = $(elemento).text().trim();
            let link = $(elemento).closest("a").attr("href");

            // Se o link não for absoluto, completamos com a URL base
            if (link && !link.startsWith("http")) {
                link = new URL(link, url).href;
            }

            if (titulo && titulo.length > 5) { // Evita títulos vazios ou genéricos
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

// Função para buscar notícias de todas as fontes definidas
async function obterNoticias() {
    const resultados = await Promise.all(sources.map(buscarNoticias));
    return resultados.flat(); // Junta todas as notícias em um único array
}

// Exportando função corretamente
module.exports = { obterNoticias };
