const pool = require('../config/database'); // Certifique-se de que o caminho do seu banco de dados está correto

// Função para criar um evento
exports.createEvento = async (req, res) => {
    const { nome_evento, link_evento, data_evento } = req.body; // Obtém os dados do corpo da requisição

    try {
        const [result] = await pool.query(
            'INSERT INTO evento (nome_evento, link_evento, data_evento) VALUES (?, ?, ?)', 
            [nome_evento, link_evento, data_evento]
        );
        res.status(201).json({
            id_evento: result.insertId,
            nome_evento,
            link_evento,
            data_evento
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar o evento' });
    }
};

// Função para listar todos os eventos
exports.getAllEventos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM evento');
        res.status(200).json(rows); // Retorna todos os eventos
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar eventos' });
    }
};

// Função para atualizar um evento
exports.updateEvento = async (req, res) => {
    const { id_evento } = req.params; // Obtém o ID do evento da URL
    const { nome_evento, link_evento, data_evento } = req.body; // Obtém os dados atualizados

    try {
        const [result] = await pool.query(
            'UPDATE evento SET nome_evento = ?, link_evento = ?, data_evento = ? WHERE id_evento = ?', 
            [nome_evento, link_evento, data_evento, id_evento]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Evento não encontrado' });
        }
        res.status(200).json({ message: 'Evento atualizado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar o evento' });
    }
};

// Função para deletar um evento
exports.deleteEvento = async (req, res) => {
    const { id_evento } = req.params; // Obtém o ID do evento da URL

    try {
        const [result] = await pool.query('DELETE FROM evento WHERE id_evento = ?', [id_evento]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Evento não encontrado' });
        }
        res.status(200).json({ message: 'Evento deletado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar o evento' });
    }
};
