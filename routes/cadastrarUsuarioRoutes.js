// routes/cadastroUsuarioRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const cadastrarUsuarioController = require('../controllers/cadastrarUsuarioController');

router.get('/', cadastrarUsuarioController.getAllUsuarios);

router.get('/:id_usuario', cadastrarUsuarioController.getUsuarioById);

router.post('/', upload.single('foto'), cadastrarUsuarioController.createUsuario);

router.put('/:id_usuario', cadastrarUsuarioController.updateUsuario);

router.delete('/:id_usuario', cadastrarUsuarioController.deleteUsuario);

module.exports = router;