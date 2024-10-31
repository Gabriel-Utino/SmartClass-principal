// routes/notasFaltasRoutes.js
const express = require('express');
const router = express.Router();
const notasFaltasController = require('../controllers/notasFaltasController');
/* const { getNotasFaltas } = require('../controllers/notasFaltasController'); */
const faltasController = require('../controllers/faltasController');
/* const db = require('../db') // データベース接続設定 */

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

router.put('/notas_faltasApri/faltas', faltasController.applyFaltas);

/* router.get('/notas_faltas/:notaId', notasFaltasController.getNotasFaltas); */
// /notas_faltasApriエンドポイントにGETリクエストを設定
router.get('/notas_faltasDetails', notasFaltasController.getNotasFaltasDetails);


// 欠席日を適用するルート 日付も追加するためのルート
/* router.put('/faltas', (req, res) => {
  const { ids, dataFalta } = req.body
  const values = ids.map(id => [id, dataFalta])

  const query = `
    INSERT INTO faltas_detalhes (id_notas_faltas, data_falta) VALUES ?
  `

  db.query(query, [values], (err, results) => {
    if (err) {
      console.error('Error ao inserir faltas:', err)
      res.status(500).json({ success: false, message: 'Não foi possível registrar faltas' })
    } else {
      res.json({ success: true, message: 'Faltas registradas com sucesso' })
    }
  })
}) */


module.exports = router;
