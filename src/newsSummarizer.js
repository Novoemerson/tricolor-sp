// newsSummarizer.js - Resumo de notícias do São Paulo FC usando IA

const axios = require('axios');
const { obterNoticias } = require('./newsFetcher');

// Função para gerar resumo usando IA
async function gerarResumo(texto) {
    try {
        const resposta = await axios.post("https://api.openai.com/v1/completions", {
            model: "gpt-4",
            prompt: `Resuma a seguinte notícia de forma clara e objetiva:\n\n"${texto}"`,
            max_tokens: 150
        }, {
            headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }` }
        });

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

// Teste manual da IA - Esta função foi declarada ANTES de ser chamada
async function testarIA() {
    try {
        const resposta = await axios.post("https://api.openai.com/v1/completions", {
            model: "gpt-4",
            prompt: "Resuma esta notícia: 'São Paulo vence clássico e sobe na tabela!'",
            max_tokens: 50
        }, {
            headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
        });

        console.log("✅ Resumo gerado:", resposta.data.choices[0].text.trim());
    } catch (erro) {
        console.error("❌ Erro ao testar IA:", erro);
    }
}

// Chamada de teste da função
testarIA();

// Exportando funções para uso na API
module.exports = { processarNoticias };
