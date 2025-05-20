const puppeteer = require("puppeteer");

const sources = [
    { url: "https://www.gazetaesportiva.com/tag/sao-paulo", selector: "article.noticia a[href]" } // Seletor atualizado
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

        // Captura o HTML da página e salva para análise de erros
        const html = await page.content();
        console.log("🔍 HTML carregado!");
        require("fs").writeFileSync("log.html", html); // Salva o HTML em um arquivo para debug

        // Captura os títulos e links das notícias corretamente
        const noticias = await page.evaluate((selector) => {
            return Array.from(document.querySelectorAll(selector)).map(el => ({
                titulo: el.innerText.trim(),
                link: el.href
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
