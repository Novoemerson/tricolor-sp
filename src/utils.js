// utils.js - Funções auxiliares do Tricolor-SP

// Função para formatar datas
function formatarData(data) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(data).toLocaleDateString('pt-BR', options);
}

// Função para gerar um identificador único
function gerarIdUnico() {
    return 'id-' + Math.random().toString(36).substr(2, 9);
}

// Exportando funções para uso em outros arquivos
module.exports = {
    formatarData,
    gerarIdUnico
};
