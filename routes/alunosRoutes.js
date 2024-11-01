/* const express = require('express');
const router = express.Router();
const disciplinasController = require('../controllers/alunosController');
const alunosController = require('../controllers/alunosController');

router.get('/:id', alunosController.getAlunoById);
router.get('/:id/notas_faltas', alunosController.getNotasFaltasByAluno);

router.get('/', disciplinasController.getAllDisciplinas);
router.get('/:id_disciplina', disciplinasController.getDisciplinaById);
router.post('/', disciplinasController.createDisciplina);
router.put('/:id_disciplina', disciplinasController.updateDisciplina);
router.delete('/:id_disciplina', disciplinasController.deleteDisciplina);

module.exports = router;
 */

/* const express = require('express');
const router = express.Router();
const pool = require('../database'); // データベース接続

// 全ての生徒を取得
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Aluno');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    res.status(500).json({ error: 'Erro ao buscar alunos' });
  }
});

// IDで特定の生徒を取得
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT * FROM Aluno WHERE id_aluno = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar aluno:', error);
    res.status(500).json({ error: 'Erro ao buscar aluno' });
  }
});

// 生徒の成績と欠席情報を取得
router.get('/:id/notas_faltas', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT nf.*, d.nome AS disciplina 
       FROM NotasFaltas nf
       JOIN Disciplina d ON nf.id_disciplina = d.id_disciplina
       WHERE nf.id_aluno = ?`,
      [id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar notas e faltas do aluno:', error);
    res.status(500).json({ error: 'Erro ao buscar notas e faltas' });
  }
});

module.exports = router;
 */





// AlunosRoutes.js
const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunosController');

// すべての生徒のリストを取得
router.get('/', alunoController.getAllAluno);

// 特定の生徒の情報を取得する
router.get('/:id_aluno', alunoController.getAlunoById);

// 特定の生徒の成績情報を取得する
router.get('/:id_aluno/notas_faltas', alunoController.getNotasFaltasByAluno);


module.exports = router;
