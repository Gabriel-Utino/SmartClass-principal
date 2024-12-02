// Controller/eventController.js
const pool = require('../db');

exports.createEvent = async (req, res) => {
    const { title, date } = req.body;

    try {
        await pool.query('INSERT INTO events (title, date) VALUES (?, ?)', [title, date]);
        res.send('evento criado');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ocorreu um erro ao criar o evento');
    }
};
