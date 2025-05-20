// newsAPI.js - API que retorna notícias resumidas sobre o São Paulo FC

const express = require("express");
const { processarNoticias } = require("./newsSummarizer");

const app = express();
const PORT = process.env.PORT || 10000;  // Atualizando para a porta correta

// Endpoint de teste
app.get("/", (req, res) => {
    res.send("<h1>🚀 Tricolor-SP está rodando! 🔥</h1><p>Acesse <a href='/api/noticias'>/api/noticias</a> para ver as últimas notícias.</p>");
});

// Endpoint de notícias
app.get("/api/noticias", async (req, res) => {
    try {
        console.log("🔍 Testando processamento de notícias...");
        const noticias = await processarNoticias();
        console.log("✅ Notícias processadas:", noticias);
        res.json(noticias);
    } catch (erro) {
        console.error("❌ Erro ao processar notícias:", erro);
        res.status(500).json({ erro: "Não foi possível carregar as notícias." });
    }
});

// Iniciando o servidor na porta correta
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
