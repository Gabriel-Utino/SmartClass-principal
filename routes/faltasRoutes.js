const express = require('express');
const router = express.Router();
const faltasController = require('../controllers/faltasController');

// 欠席データ表示
router.get('/', faltasController.getFaltas);

// 日付追加
router.post('/add-date', faltasController.addDate);

module.exports = router;
