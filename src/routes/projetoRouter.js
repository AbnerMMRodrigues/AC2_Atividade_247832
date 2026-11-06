
const express = require('express');
const projetoController = require('../controllers/projetoController');

const router = express.Router();


//Consultas

router.get('/:codigo', projetoController.buscarPorCodigo);
router.get('/:codigo/tarefas', projetoController.listarTarefas);
router.get('/', (req, res) => {
    if (req.query.nome) {
        return projetoController.filtrarPorNome(req, res);
    }

    if (req.query.tarefa) {
        return projetoController.filtrarPorTarefa(req, res);
    }

    return projetoController.listarProjetos(req, res);
});


//Cadastro, Atualização e Exclusão
router.post('/', projetoController.cadastrarProjeto);
router.put('/:codigo', projetoController.atualizarProjeto);
router.delete('/:codigo', projetoController.deletarProjeto);

//Gerenciamento de Tarefas

router.post('/:codigo/tarefas', projetoController.adicionarTarefa);
router.put('/:codigo/tarefas/:codigoTarefa', projetoController.atualizarTarefa);
router.delete('/:codigo/tarefas/:codigoTarefa', projetoController.deletarTarefa);

//Consultas Avançadas

router.get('/:codigo/resumo', projetoController.resumo);

module.exports = router;