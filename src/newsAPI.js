// newsAPI.js - API que retorna notícias resumidas sobre o São Paulo FC

const express = require("express");
const { processarNoticias } = require("./newsSummarizer");

const app = express();
const PORT = process.env.PORT || 10000;  // Atualizando para a porta correta

// Endpoint de teste
app.get("/", (req, res) => {
    res.send("<h1>🚀 Tricolor-SP está rodando! 🔥</h1><p>Acesse <a href='/api/noticias'>/api/noticias</a> para ver as últimas notícias.</p>");
});

// Endpoint de notícias com timeout
app.get("/api/noticias", async (req, res) => {
    try {
        const noticias = await processarNoticias();

        if (!noticias.length) {
            return res.json({ erro: "Nenhuma notícia encontrada." });
        }

        res.json(noticias);
    } catch (erro) {
        console.error("❌ Erro ao processar notícias:", erro);
        res.status(500).json({ erro: "Erro ao carregar as notícias." });
    }
});

// Iniciando o servidor na porta correta
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
