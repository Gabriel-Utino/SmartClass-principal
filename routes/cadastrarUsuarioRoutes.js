// routes/cadastroUsuarioRoutes.js
const express = require('express');
const router = express.Router();
const cadastrarUsuarioController = require('../controllers/cadastrarUsuarioController');


// 成績を取得するルート
router.get('/', notasFaltasController.getAllUsuario);


module.exports = router;