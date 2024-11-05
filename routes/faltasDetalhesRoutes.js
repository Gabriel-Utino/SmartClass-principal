// routes/faltasDetalhesRoutes.js
const express = require('express');
const router = express.Router();
const faltasDetalhesController = require('../controllers/faltasDetalhesController');

router.post('/', faltasDetalhesController.addFaltaDetalhes); // 新しい欠席データを追加
router.get('/:id_notas_faltas', faltasDetalhesController.getFaltasDetalhes); // 特定の生徒の欠席データを取得

module.exports = router;
