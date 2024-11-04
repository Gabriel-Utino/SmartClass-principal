// responsavelAlunoRoutes.js
const express = require('express');
const router = express.Router();
const responsavelAlunoController = require('../controllers/responsavelAlunoController');

// すべてのResponsavel_Alunoのリストを取得
router.get('/', responsavelAlunoController.getAllResponsavelAluno);

// 特定のResponsavel_Alunoを取得
router.get('/:id_responsavel', responsavelAlunoController.getResponsavelAlunoByIdResponsavel);

// 新しいResponsavel_Alunoを追加
router.post('/', responsavelAlunoController.addResponsavelAluno);

// 指定されたResponsavel_Alunoを削除
router.delete('/:id_resp_aluno', responsavelAlunoController.deleteResponsavelAluno);

module.exports = router;
