// newsSummarizer.js - Resumo de notícias do São Paulo FC usando IA

const axios = require('axios');
const { obterNoticias } = require('./newsFetcher');

// Função para gerar resumo usando IA do Hugging Face
async function gerarResumo(texto) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // Limite de 8 segundos

    try {
        const resposta = await axios.post(
            "https://api-inference.huggingface.co/models/google/pegasus-xsum",
            { inputs: texto },
            { 
                headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
                signal: controller.signal 
            }
        );

        clearTimeout(timeout);
        return resposta.data[0]?.summary_text || "Resumo indisponível no momento.";
    } catch (erro) {
        console.error("❌ Tempo limite excedido ou erro na API:", erro);
        return "Resumo indisponível no momento.";
    }
}

// Função para processar e resumir as notícias
async function processarNoticias() {
    try {
        const noticias = await obterNoticias();
        const noticiasResumidas = await Promise.all(noticias.map(async (noticia) => {
            const textoCompleto = `Título: ${noticia.titulo}. O que aconteceu: ${noticia.titulo} é uma notícia sobre o São Paulo FC publicada na ${noticia.fonte}. Resuma esta notícia corretamente, focando apenas no clube São Paulo FC e evitando informações genéricas.`;

            const resumo = await gerarResumo(textoCompleto);
            return {
                titulo: noticia.titulo,
                resumo: resumo,
                link: noticia.link,
                fonte: noticia.fonte
            };
        }));

        return noticiasResumidas;
    } catch (erro) {
        console.error("❌ Erro ao processar notícias:", erro);
        return [];
    }
}

// Exportando função para ser usada na API
module.exports = { processarNoticias };
