// notasFaltasRoutes.js

const express = require('express');
const router = express.Router();
const notasFaltasController = require('../controllers/notasFaltasController');

// 成績を取得するルート
router.get('/notas/:alunoId', notasFaltasController.getNotas);

// 成績を特定の学年・学期で取得するルート
router.get('/notas/:alunoId/:ano/:semestre', notasFaltasController.getNotasByAnoESemestre);

// 成績を更新するルート（例えば教員向けの機能）
router.put('/notas/:notaId', notasFaltasController.updateNota);

// 新しい成績を追加するルート（例えば教員向けの機能）
router.post('/notas', notasFaltasController.addNota);

// 成績を削除するルート
router.delete('/notas/:notaId', notasFaltasController.deleteNota);

module.exports = router;
