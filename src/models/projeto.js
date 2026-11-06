
const mongoose = require('mongoose');

const Projeto = mongoose.model('Projeto', {
    codigo: String,
    nome: String,
    tarefas: [
        {
            codigo: String,
            nome: String,
            responsavel: String
        }
    ]
}, 'projeto');

module.exports = Projeto;
