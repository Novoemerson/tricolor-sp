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
async function obterNoticias() {
    const noticias = [];

    for (const url of sources) {
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);

            // Exemplo: Procurar títulos de matérias e links
            $("h2, h3").each((index, element) => {
                noticias.push({
                    titulo: $(element).text().trim(),
                    link: $(element).parent().attr("href") || url
                });
            });

        } catch (erro) {
            console.error(`Erro ao acessar ${url}:`, erro.message);
        }
    }

    return noticias;
}

// Exportando função
module.exports = { obterNoticias };
