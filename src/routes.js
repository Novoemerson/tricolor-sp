// routes.js - Configuração de rotas do Tricolor-SP

const express = require('express');
const router = express.Router();

// Rota principal
router.get('/', (req, res) => {
    res.send('Bem-vindo ao Tricolor-SP! 🚀🔥');
});

// Rota de status
router.get('/status', (req, res) => {
    res.json({ message: "O sistema está funcionando corretamente!", status: "OK" });
});

module.exports = router;
