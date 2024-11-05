// controllers/calendarioController.js
const pool = require('../db');

// Função para criar um evento
exports.createEvent = async (req, res) => {
    const { title, date } = req.body;
    const userRole = req.user.role; // Supondo que o middleware de autenticação adiciona `user` no `req`

    // Verifica se o usuário tem permissão para criar um evento
    if (userRole !== 'admin' && userRole !== 'professor') {
        return res.status(403).json({ message: 'Acesso negado: permissão insuficiente' });
    }

    try {
        await pool.query('INSERT INTO events (title, date) VALUES (?, ?)', [title, date]);
        res.status(201).send('Evento criado com sucesso');
    } catch (err) {
        console.error('Erro ao criar evento:', err);
        res.status(500).send('Erro ao criar evento');
    }
};

// Função para listar eventos (com acesso a todos os usuários)
exports.getEvents = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM events');
        res.json(rows);
    } catch (err) {
        console.error('Erro ao buscar eventos:', err);
        res.status(500).json({ message: 'Erro ao buscar eventos' });
    }
};
