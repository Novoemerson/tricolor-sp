// Fontes de notícias
const feeds = [
    "https://lance.com.br/rss",
    "https://www.gazetaesportiva.com/rss/",
    "https://rss.uol.com.br/feed/noticias.php?canal=4"
];

async function fetchRSS(url) {
    const proxyUrl = "https://api.allorigins.win/get?url=" + encodeURIComponent(url);
    try {
        console.log("🚀 Carregando feed:", url);
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        if (!data.contents) throw new Error("Conteúdo vazio");
        return data.contents;
    } catch (e) {
        console.error("❌ Erro ao carregar feed:", url, e.message);
        return null;
    }
}

function parseRSS(xml) {
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

    console.log(`📰 Encontradas ${noticias.length} notícias`);
    return noticias;
}

async function resumirTexto(texto) {
    if (!texto) return "Texto não disponível.";
    try {
        const response = await fetch("https://api.aiss.fun/summarize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: texto })
        });
        const data = await response.json();
        return data.summary || texto.substring(0, 200) + "...";
    } catch (e) {
        return texto.substring(0, 200) + "...";
    }
}

async function buscarImagem(termo) {
    return `https://source.unsplash.com/featured/?${encodeURIComponent(termo)}&sig=${Math.floor(Math.random() * 9999)}`;
}

function getNomePortal(url) {
    try {
        const hostname = new URL(url).hostname;
        return hostname.replace(/^www\./, "").split(".")[0];
    } catch (e) {
        return "Fonte desconhecida";
    }
}

async function exibirNoticia(title, summary, link) {
    const main = document.getElementById("noticias");
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
        <img src="${await buscarImagem(title)}" alt="${title}">
        <h3><a href="${link}" target="_blank">${title}</a></h3>
        <p>${summary}</p>
        <div class="fonte">Fonte: <a href="${link}" target="_blank">${getNomePortal(link)}</a></div>
    `;

    main.appendChild(card);
}

async function carregarNoticias() {
    let totalNoticias = 0;
    document.getElementById("noticias").innerHTML = "";

    for (let feed of feeds) {
        const xml = await fetchRSS(feed);
        const noticias = parseRSS(xml);

        for (let noticia of noticias.slice(0, 3)) {
            const resumo = await resumirTexto(noticia.description);
            await exibirNoticia(noticia.title, resumo, noticia.link);
            totalNoticias++;
        }
    }

    if (totalNoticias === 0) {
        document.getElementById("noticias").innerHTML = "<p>⚠️ Nenhuma notícia encontrada sobre o São Paulo FC.</p>";
    } else {
        console.log(`🎉 Total de notícias exibidas: ${totalNoticias}`);
    }
}

carregarNoticias();
