// newsSummarizer.js - Resumo de notícias do São Paulo FC usando IA

const axios = require('axios');
const { obterNoticias } = require('./newsFetcher');

curl -X POST https://api.openai.com/v1/completions \
  -H "Authorization: Bearer SEU_TOKEN_API" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "prompt": "Resuma esta notícia: São Paulo vence clássico e sobe na tabela!",
    "max_tokens": 50
  }'

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
