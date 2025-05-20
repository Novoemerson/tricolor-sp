// newsSummarizer.js - Resumo de notícias do São Paulo FC usando IA

const axios = require('axios');
const { obterNoticias } = require('./newsFetcher');

// Função para gerar resumo usando IA
async function gerarResumo(texto) {
    try {
        const resposta = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
            method: "POST",
            headers: { Authorization: "Bearer HUGGINGFACE_API_KEY", "Content-Type": "application/json" },
            body: JSON.stringify({ inputs: texto })
        });

        const dados = await resposta.json();
        return dados[0]?.summary_text || "Resumo indisponível no momento.";
    } catch (erro) {
        console.error("Erro ao gerar resumo:", erro);
        return "Resumo indisponível no momento.";
    }
}

        return resposta.data.choices[0].text.trim();
    } catch (erro) {
        console.error("Erro ao gerar resumo:", erro);
        return "Resumo indisponível no momento.";
    }
}

// Função para processar e resumir as notícias
async function processarNoticias() {
    const noticias = await obterNoticias();
    const noticiasResumidas = [];

    for (const noticia of noticias.slice(0, 5)) {
        const resumo = await gerarResumo(noticia.titulo);
        noticiasResumidas.push({
            titulo: noticia.titulo,
            resumo: resumo,
            link: noticia.link,
            fonte: noticia.link.includes("lance") ? "Lance!" : 
                   noticia.link.includes("gazetaesportiva") ? "Gazeta Esportiva" :
                   noticia.link.includes("uol") ? "UOL Esporte" :
                   noticia.link.includes("globo") ? "Globo Esporte" : "Fonte desconhecida"
        });
    }

    return noticiasResumidas;
}

// Exportando função para ser usada na API
module.exports = { processarNoticias };
