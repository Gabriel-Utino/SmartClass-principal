// routes/calendarioRoutes.js
const express = require('express');
const router = express.Router();
const calendarioController = require('../controllers/calendarioController');
const authorize = require('../middlewares/authMiddleware');

// Rota para criar um evento (somente para 'admin' e 'professor')
router.post('/event', authorize(['admin', 'professor']), calendarioController.createEvent);

// Rota para listar eventos (acesso a todos os usuários)
router.get('/events', calendarioController.getEvents);

module.exports = router;
