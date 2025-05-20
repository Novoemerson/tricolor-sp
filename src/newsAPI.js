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
        console.log("🔍 Testando processamento de notícias...");

        // Definir um timeout máximo de 10 segundos para processar notícias
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Tempo limite excedido")), 10000)
        );

        // Executar a função de busca de notícias com timeout
        const noticias = await Promise.race([processarNoticias(), timeoutPromise]);

        console.log("✅ Notícias processadas:", noticias);
        res.json(noticias);
    } catch (erro) {
        console.error("❌ Erro ao processar notícias:", erro);
        res.status(500).json({ erro: "Não foi possível carregar as notícias a tempo." });
    }
});

// Iniciando o servidor na porta correta
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
