const { obterNoticias } = require("./newsFetcher"); // Correção na importação
const express = require("express");
const app = express();
const PORT = 10000;

// Função para processar as notícias e gerar uma resposta JSON
async function processarNoticias(req, res) {
    try {
        console.log("🔍 Processando notícias...");
        const noticias = await obterNoticias();

        if (noticias.length === 0) {
            throw new Error("Nenhuma notícia encontrada.");
        }

        res.json({ noticias });
    } catch (erro) {
        console.error("❌ Erro ao processar notícias:", erro.message);
        res.status(500).json({ erro: erro.message });
    }
}

// Rota para buscar as notícias
app.get("/api/noticias", processarNoticias);

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
