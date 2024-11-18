const express = require('express');
const router = express.Router();
const calendarioController = require('../controllers/calendarioController');
const { ensureAuthenticated, authorizeRoles } = require('../middleware/authorize');

// Rota para listar todos os eventos (permite acesso ao administrador e professor)
router.get('/listar', ensureAuthenticated, authorizeRoles(1, 2, 5), calendarioController.getAllEventos);

// Rota para criar um novo evento (permite acesso ao administrador e professor)
router.post('/criar', ensureAuthenticated, authorizeRoles(1, 2, 5), calendarioController.createEvento);

// Rota para editar um evento existente (permite acesso ao administrador e professor)
router.put('/editar/:id_evento', ensureAuthenticated, authorizeRoles(1, 2, 5), calendarioController.updateEvento);

// Rota para excluir um evento (permite acesso ao administrador e professor)
router.delete('/deletar/:id_evento', ensureAuthenticated, authorizeRoles(1, 2, 5), calendarioController.deleteEvento);

module.exports = router;
