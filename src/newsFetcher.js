const puppeteer = require("puppeteer");

const sources = [
    { url: "https://www.gazetaesportiva.com/tag/sao-paulo", selector: "article.noticia h3" }
];

// Função para capturar notícias corretamente, considerando carregamento dinâmico
async function buscarNoticias(source) {
    const { url, selector } = source;

    try {
        console.log(`🔍 Acessando: ${url} via Puppeteer`);

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: "networkidle2" });

        // Captura os títulos e links das notícias corretamente
        const noticias = await page.evaluate((selector) => {
            return Array.from(document.querySelectorAll(selector)).map(el => ({
                titulo: el.innerText.trim(),
                link: el.closest("a") ? el.closest("a").href : null
            })).filter(noticia => noticia.titulo.length > 5);
        }, selector);

        await browser.close();

        console.log("🔍 Notícias encontradas:", noticias);
        return noticias.length > 0 ? noticias : [];
    } catch (erro) {
        console.error(`❌ Erro ao acessar ${url}:`, erro.message);
        return [];
    }
}

// Função para capturar notícias da Gazeta Esportiva
async function obterNoticias() {
    const resultados = await Promise.all(sources.map(buscarNoticias));
    return resultados.flat();
}

module.exports = { obterNoticias };
