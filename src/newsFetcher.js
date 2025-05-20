const puppeteer = require("puppeteer");

const sources = [
    { url: "https://www.gazetaesportiva.com/tag/sao-paulo", selector: "article.noticia a" }
];

// Função para capturar notícias corretamente via Puppeteer
async function buscarNoticias(source) {
    const { url, selector } = source;

    try {
        console.log(`🔍 Acessando: ${url} via Puppeteer`);

        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });
        const page = await browser.newPage();

        // Simula um navegador real para evitar bloqueios do site
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
        await page.goto(url, { waitUntil: "domcontentloaded" });

        // Captura os títulos e links das notícias corretamente
       const html = await page.content();
require("fs").writeFileSync("log.html", html);
        
        // Salva o HTML em um arquivo
console.log("🔍 HTML da página carregado.");
        
        // Debug para ver o HTML no Render

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

// Função para capturar notícias corretamente
async function obterNoticias() {
    const resultados = await Promise.all(sources.map(buscarNoticias));
    return resultados.flat();
}

module.exports = { obterNoticias };
