const axios = require("axios");

// Função para gerar um resumo da notícia
async function gerarResumo(texto) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // Timeout de 8 segundos

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
        console.error("❌ Erro ao gerar resumo:", erro);
        return "Resumo indisponível no momento.";
    }
}

// Função para processar todas as notícias corretamente
async function processarNoticias(obterNoticias) {
    try {
        const noticias = await obterNoticias();

        if (!noticias || noticias.length === 0) {
            return [];
        }

        const noticiasResumidas = await Promise.all(noticias.map(async (noticia) => {
            const textoCompleto = `Título: ${noticia.titulo}. 
            Fonte: ${noticia.fonte}. 
            Resuma essa notícia destacando os principais pontos sobre o São Paulo FC.`;

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

module.exports = { processarNoticias };
