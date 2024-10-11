const express = require('express');
const router = express.Router();
const disciplinasController = require('../controllers/alunosController');

router.get('/', disciplinasController.getAllDisciplinas);
router.get('/:id_disciplina', disciplinasController.getDisciplinaById);
router.post('/', disciplinasController.createDisciplina);
router.put('/:id_disciplina', disciplinasController.updateDisciplina);
router.delete('/:id_disciplina', disciplinasController.deleteDisciplina);

module.exports = router;
