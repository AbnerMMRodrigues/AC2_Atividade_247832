const express = require('express');
const mongoose = require('mongoose');
const projetoRouter = require('./routes/projetoRouter');

const app = express();
app.use(express.json());

require('dotenv').config();
const CONEXAO = process.env.MONGODB_URI;

app.use('/projetos', projetoRouter);

mongoose.connect(CONEXAO).then(() => {
    app.listen(3000, () => {
        console.log('Servidor rodando na porta 3000');
    });
}).catch((erro) => {
    console.error('Erro ao conectar ao MongoDB:', erro);
});