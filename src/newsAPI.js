// API que retorna notícias resumidas sobre o São Paulo FC

const express = require("express");
const cors = require("cors"); // Adicionando CORS para evitar bloqueios
const { obterNoticias } = require("./newsFetcher"); // Correção na importação

const app = express();
const PORT = process.env.PORT || 10000; // Porta dinâmica para evitar conflito

app.use(cors()); // Permitir requisições de qualquer origem
app.use(express.json()); // Garantir que JSON seja processado corretamente

// Endpoint de teste
app.get("/", (req, res) => {
    res.send("<h1>🚀 Tricolor-SP está rodando! 🔥</h1><p>Acesse <a href='/api/noticias'>/api/noticias</a> para ver as últimas notícias.</p>");
});

// Endpoint de notícias com timeout e melhor tratamento de erros
app.get("/api/noticias", async (req, res) => {
    try {
        console.log("🔍 Processando notícias...");
        
        const noticias = await obterNoticias(); // Correção da chamada de função

        if (!noticias || noticias.length === 0) {
            return res.status(404).json({ erro: "Nenhuma notícia encontrada." });
        }

        res.json(noticias);
    } catch (erro) {
        console.error("❌ Erro ao processar notícias:", erro);
        res.status(500).json({ erro: "Erro ao carregar as notícias." });
    }
});

// Correção: Verifica se a porta está disponível antes de iniciar o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
}).on("error", (erro) => {
    console.error(`❌ Erro ao iniciar servidor: ${erro.message}`);
});
