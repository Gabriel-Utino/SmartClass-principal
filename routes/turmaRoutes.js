// routes/turmaRoutes.js
const express = require('express');
const router = express.Router();
const turmaController = require('../controllers/turmaController');

// TurmaのCRUDエンドポイント
router.get('/', turmaController.getAllTurmas);
router.get('/:id_turma', turmaController.getTurmaById);
router.post('/', turmaController.addTurma);
router.put('/:id_turma', turmaController.updateTurma);
router.delete('/:id_turma', turmaController.deleteTurma);

// Turmaの特定のdisciplinasを取得するルート aplicarNotasで使用
router.get('/:turmaId/disciplinas', turmaController.getTurmaDisciplinas);



module.exports = router;