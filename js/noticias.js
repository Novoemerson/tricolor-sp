// noticias.js - Exibir notícias do Tricolor-SP

document.addEventListener("DOMContentLoaded", async () => {
    const noticiasDiv = document.getElementById("noticias");

    try {
        const resposta = await fetch("/api/noticias"); // Ajuste o endpoint correto
        const noticias = await resposta.json();

        noticiasDiv.innerHTML = noticias.map(noticia =>
            `<div class="noticia">
                <h2>${noticia.titulo}</h2>
                <p>${noticia.resumo}</p>
                <p><a href="${noticia.link}" target="_blank">Leia mais na fonte: ${noticia.fonte}</a></p>
            </div>`
        ).join("");
    } catch (erro) {
        noticiasDiv.innerHTML = "<p>Erro ao carregar notícias.</p>";
    }
});
