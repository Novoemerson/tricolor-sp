const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 10000;

app.get("/api/noticias", async (req, res) => {
    try {
        const response = await axios.get("https://www.msn.com/pt-br/esportes/other/lesões-preocupam-no-são-paulo-veja-situação-e-previsões-de-retorno/ar-AA1F2Ned");
        const noticias = [
            {
                titulo: "Lesões preocupam no São Paulo",
                subtitulo: "O Tricolor enfrenta dificuldades com jogadores lesionados e busca soluções rápidas.",
                imagem: "https://www.msn.com/pt-br/esportes/other/lesões-preocupam-no-são-paulo-veja-situação-e-previsões-de-retorno/ar-AA1F2Ned"
            },
            {
                titulo: "Lucas Moura pode voltar a ser titular",
                subtitulo: "O atacante se recupera de lesão e pode reforçar o São Paulo contra o Palmeiras.",
                imagem: "https://www.gazetaesportiva.com/times/sao-paulo/lucas-pode-voltar-a-ser-titular-do-sao-paulo-enfrentando-o-mesmo-rival-contra-o-qual-se-lesionou/"
            }
        ];

        res.json(noticias);
    } catch (error) {
        console.error("Erro ao buscar notícias:", error);
        res.status(500).json({ erro: "Não foi possível carregar as notícias." });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
