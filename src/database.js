// database.js - Gerenciamento de banco de dados do Tricolor-SP

const sqlite3 = require('sqlite3').verbose();

// Criando a conexão com banco de dados SQLite
const db = new sqlite3.Database('./tricolor-sp.db', (erro) => {
    if (erro) {
        console.error("Erro ao conectar ao banco de dados:", erro);
    } else {
        console.log("Conectado ao banco de dados SQLite!");
    }
});

// Criar tabela de exemplo
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL
        )
    `);
    console.log("Tabela 'usuarios' criada ou já existente.");
});

// Exportando a conexão do banco de dados
module.exports = db;
