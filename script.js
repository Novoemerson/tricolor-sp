async function fetchRSS(url) {
    console.log("Carregando feed:", url);
    const proxyUrl = "https://api.allorigins.win/get?url=" + encodeURIComponent(url);
    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        if (!data.contents) throw new Error("Conteúdo vazio");
        console.log("Feed carregado com sucesso:", url);
        return data.contents;
    } catch (e) {
        console.error("Erro ao carregar feed:", url, e.message);
        return null;
    }
}

function parseRSS(xml) {
    console.log("Parseando XML...");
    if (!xml) return [];
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");

    const items = xmlDoc.querySelectorAll("item");
    const noticias = [];

    items.forEach(item => {
        const title = item.querySelector("title")?.textContent || "";
        const link = item.querySelector("link")?.textContent || "";
        const description = item.querySelector("description")?.textContent || "";

        if (title.toLowerCase().includes("são paulo")) {
            noticias.push({
                title,
                link,
                description
            });
        }
    });

    console.log(`Encontradas ${noticias.length} notícias`);
    return noticias;
}
