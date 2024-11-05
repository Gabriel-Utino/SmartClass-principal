const express = require('express');
const router = express.Router();
const calendarioController = require('../controllers/calendarioController'); // Verifique se o caminho está correto
const { ensureAuthenticated, authorizeRoles } = require('../middleware/authorize');

// Rota para criar um evento
router.post('/', ensureAuthenticated, authorizeRoles('admin', 'professor'), calendarioController.createEvento);

// Rota para listar todos os eventos
router.get('/', ensureAuthenticated, calendarioController.getAllEventos);

// Rota para atualizar um evento
router.put('/:id_evento', ensureAuthenticated, authorizeRoles('admin', 'professor'), calendarioController.updateEvento);

// Rota para deletar um evento
router.delete('/:id_evento', ensureAuthenticated, authorizeRoles('admin', 'professor'), calendarioController.deleteEvento);

module.exports = router;
