// routes/notasFaltasRoutes.js
const express = require('express');
const router = express.Router();
const notasFaltasController = require('../controllers/notasFaltasController');
/* const { getNotasFaltas } = require('../controllers/notasFaltasController'); */
const faltasController = require('../controllers/faltasController');

// 成績を取得するルート
router.get('/notas/:alunoId', notasFaltasController.getNotas);
router.get('/notasByid_notas_faltas/:id_notas_faltas', notasFaltasController.getNotasByid_notas_faltas);
// 成績を特定の学年・学期で取得するルート
router.get('/notas/:alunoId/:ano/:semestre', notasFaltasController.getNotasByAnoESemestre);
// 成績を更新するルート（例えば教員向けの機能）
router.put('/notas/:id_notas_faltas', notasFaltasController.updateNota);
// 新しい成績を追加するルート（例えば教員向けの機能）
router.post('/notas', notasFaltasController.addNota);
// 成績を削除するルート
router.delete('/notas/:notaId', notasFaltasController.deleteNota);

// /notas_faltasApri エンドポイントのルート設定
router.get('/notas_faltasApri', notasFaltasController.getNotasFaltasApri);


/* router.get('/notas_faltas/:notaId', notasFaltasController.getNotasFaltas); */
// /notas_faltasApriエンドポイントにGETリクエストを設定
router.get('/notas_faltasDetails', notasFaltasController.getNotasFaltasDetails);



module.exports = router;
