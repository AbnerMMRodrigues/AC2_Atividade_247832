const projetoModel = require('../models/projeto');


//GET


exports.listarProjetos = async (req, res) => {
    const projetos = await projetoModel.find();
    return res.status(200).json(projetos);
};

exports.buscarPorCodigo = async (req, res) => {
    const codigo = req.params.codigo;
    const projeto = await projetoModel.findOne({codigo: codigo});
    if (projeto) {
        res.json(projeto);
    } else {
        res.status(400).json({ mensagem: 'Projeto não encontrado' });
    }
};

exports.listarTarefas = async (req, res) => {
    const codigo = req.params.codigo;

    const projeto = await projetoModel.findOne({ codigo });

    if (!projeto) {
        return res.status(404).json({
            mensagem: 'Projeto não encontrado'
        });
    }

    return res.status(200).json(projeto.tarefas);
};

exports.listarTarefas = async (req, res) => {
    const codigo = req.params.codigo;

    const projeto = await projetoModel.findOne({ codigo: codigo });

    if (!projeto) {
        return res.status(404).json({ mensagem: 'Projeto não encontrado' });
    }

    res.json(projeto.tarefas);
};

exports.filtrarPorNome = async (req, res) => {
    const nome = req.query.nome;

    if (!nome) {
        return res.status(400).json({
            mensagem: 'Informe o nome para filtrar'
        });
    }

    const projetos = await projetoModel.find({
        nome: { $regex: nome, $options: 'i' }
    });

    if (projetos.length === 0) {
        return res.status(404).json({
            mensagem: 'Nenhum projeto encontrado'
        });
    }

    return res.status(200).json(projetos);
};

exports.filtrarPorTarefa = async (req, res) => {
    const tarefa = req.query.tarefa;

    const projetos = await projetoModel.find({
        'tarefas.codigo': tarefa
    });

    res.json(projetos);
};

exports.resumo = async (req, res) => {
    const codigo = req.params.codigo;

    const projeto = await projetoModel.findOne({ codigo });

    if (!projeto) {
        return res.status(404).json({
            mensagem: 'Projeto não encontrado'
        });
    }

    const resumo = {
        codigo: projeto.codigo,
        nome: projeto.nome,
        totalTarefas: projeto.tarefas.length,
        responsaveis: [...new Set(
            projeto.tarefas.map(tarefa => tarefa.responsavel)
        )]
    };

    return res.status(200).json(resumo);
};


//POST

exports.cadastrarProjeto = async (req, res) => {
    const { codigo, nome, tarefas } = req.body;

    if (!codigo || !nome) {
        return res.status(400).json({
            mensagem: 'Código e nome são obrigatórios'
        });
    }

    const existente = await projetoModel.findOne({ codigo });

    if (existente) {
        return res.status(409).json({
            mensagem: 'Já existe um projeto com esse código'
        });
    }

    const projeto = await projetoModel.create({
        codigo,
        nome,
        tarefas: tarefas || []
    });

    return res.status(201).json(projeto);
};

exports.adicionarTarefa = async (req, res) => {
    const codigo = req.params.codigo;
    const { codigo: codigoTarefa, nome, responsavel } = req.body;

    if (!codigoTarefa || !nome || !responsavel) {
        return res.status(400).json({
            mensagem: 'Código, nome e responsável são obrigatórios'
        });
    }

    const projeto = await projetoModel.findOne({ codigo });

    if (!projeto) {
        return res.status(404).json({
            mensagem: 'Projeto não encontrado'
        });
    }

    const duplicada = projeto.tarefas.some(
        tarefa => tarefa.codigo === codigoTarefa
    );

    if (duplicada) {
        return res.status(409).json({
            mensagem: 'Já existe uma tarefa com esse código'
        });
    }

    projeto.tarefas.push({
        codigo: codigoTarefa,
        nome,
        responsavel
    });

    await projeto.save();

    return res.status(201).json({
        mensagem: 'Tarefa adicionada com sucesso',
        projeto
    });
};

//PUT

exports.atualizarProjeto = async (req, res) => {
    const codigo = req.params.codigo;
    const nome = req.body.nome;
    const projeto = await
        projetoModel.findOneAndUpdate({codigo: codigo}, {nome: nome}, { new: true });
    if (projeto) {
        res.json({ mensagem: 'O nome do Projeto foi atualizado com sucesso' });
    } else {
        res.status(400).json({ mensagem: 'Projeto não encontrado' });
    }
};

exports.atualizarTarefa = async (req, res) => {
    const codigo = req.params.codigo;
    const codigoTarefa = req.params.codigoTarefa;
    const { nome, responsavel } = req.body;

    if (!nome || !responsavel) {
        return res.status(400).json({
            mensagem: 'Nome e responsável são obrigatórios'
        });
    }

    const projeto = await projetoModel.findOne({ codigo });

    if (!projeto) {
        return res.status(404).json({
            mensagem: 'Projeto não encontrado'
        });
    }

    const tarefa = projeto.tarefas.find(
        tarefa => tarefa.codigo === codigoTarefa
    );

    if (!tarefa) {
        return res.status(404).json({
            mensagem: 'Tarefa não encontrada'
        });
    }

    tarefa.nome = nome;
    tarefa.responsavel = responsavel;

    await projeto.save();

    return res.status(200).json({
        mensagem: 'Tarefa atualizada com sucesso'
    });
};

//DELETE

exports.deletarProjeto = async (req, res) => {
    const codigo = req.params.codigo;
    const projeto = await projetoModel.findOneAndDelete({codigo: codigo});
    if (projeto) {
        res.json({ mensagem: 'Projeto excluído com sucesso' });
    } else {
        res.status(400).json({ mensagem: 'Projeto não encontrado' });
    }
};

exports.deletarTarefa = async (req, res) => {
    const codigo = req.params.codigo;
    const codigoTarefa = req.params.codigoTarefa;

    const projeto = await projetoModel.findOne({ codigo });

    if (!projeto) {
        return res.status(404).json({
            mensagem: 'Projeto não encontrado'
        });
    }

    const tarefaExiste = projeto.tarefas.some(
        tarefa => tarefa.codigo === codigoTarefa
    );

    if (!tarefaExiste) {
        return res.status(404).json({
            mensagem: 'Tarefa não encontrada'
        });
    }

    projeto.tarefas = projeto.tarefas.filter(
        tarefa => tarefa.codigo !== codigoTarefa
    );

    await projeto.save();

    return res.status(204).json({
        mensagem: 'Tarefa deletada com sucesso'
    });

};
