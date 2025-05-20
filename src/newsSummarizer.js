// newsSummarizer.js - Resumo de notícias do São Paulo FC usando IA

const axios = require('axios');
const { obterNoticias } = require('./newsFetcher');

// Função para gerar resumo usando IA do Hugging Face
async function gerarResumo(texto) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // Limite de 8 segundos

    try {
        const resposta = await axios.post(
            "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
            { inputs: texto }, // Mantendo entrada simples e clara
            { 
                headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
                signal: controller.signal 
            }
        );

        clearTimeout(timeout); // Cancela timeout se a resposta chegar rápido
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

        const noticiasResumidas = await Promise.all(noticias.slice(0, 5).map(async (noticia) => {
            const resumo = await gerarResumo(noticia.titulo);
            return {
                titulo: noticia.titulo,
                resumo: resumo,
                link: noticia.link,
                fonte: noticia.link.includes("lance") ? "Lance!" : 
                       noticia.link.includes("gazetaesportiva") ? "Gazeta Esportiva" :
                       noticia.link.includes("uol") ? "UOL Esporte" :
                       noticia.link.includes("globo") ? "Globo Esporte" : "Fonte desconhecida"
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
