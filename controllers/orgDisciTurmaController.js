const db = require('../db'); // DB接続ファイル

// 全てのTurmaを取得
exports.getAllTurmas = async (req, res) => {
  try {
    const [turmas] = await db.query('SELECT * FROM Turma');
    res.json(turmas);
  } catch (error) {
    console.error('Error fetching Turmas:', error);
    res.status(500).json({ message: 'Error fetching Turmas' });
  }
};

// 特定のTurmaに関連するDisciplinasを取得
exports.getTurmaDisciplinas = async (req, res) => {
  const { turmaId } = req.params;
  try {
    const [disciplinas] = await db.query(`
      SELECT d.*
      FROM disciplina d
      JOIN turma_disciplina td ON td.id_disciplina = d.id_disciplina
      WHERE td.id_turma = ?
    `, [turmaId]);
    res.json(disciplinas);
  } catch (error) {
    console.error('Error retrieving disciplinas for turma:', error);
    res.status(500).json({ message: 'Error retrieving disciplinas' });
  }
};
/* 
// Notas_faltasエントリを作成
exports.assignDisciplinas = (req, res) => {
  const { id_turma, id_disciplinas, ano_academico, semestre } = req.body;
  db.query('SELECT id_aluno FROM Aluno WHERE id_turma = ?', [id_turma], (err, alunos) => {
    if (err) {
      console.error('Error fetching Alunos:', err);
      res.status(500).json({ message: 'Failed to retrieve Alunos' });
      return;
    }


    id_disciplinas.forEach(id_disciplina => {
      alunos.forEach(aluno => {
        db.query(
          'INSERT INTO Notas_faltas (id_disciplina, id_aluno, ano_academico, semestre) VALUES (?, ?, ?, ?)',
          [id_disciplina, aluno.id_aluno, ano_academico, semestre],
          err => {
            if (err) {
              console.error('Error creating Notas_faltas entry:', err);
            }
          }
        );
      });
    });

    res.json({ message: 'Disciplinas assigned successfully' });
  });
};

 */
exports.assignDisciplinas = async (req, res) => {
  const { id_turma, id_disciplinas, ano_academico, semestre } = req.body;

  try {
    // AlunoのIDを取得する
    const alunos = await db.query('SELECT id_aluno FROM aluno WHERE id_turma = ?', [id_turma]);
    
    // Alunosが見つからない場合はエラーメッセージを返す
    if (!alunos.length) {
      return res.status(404).json({ message: 'No students found for the given turma.' });
    }

    // 各disciplineについて、学生ごとにNotas_faltasエントリを作成
    for (const id_disciplina of id_disciplinas) {
      for (const aluno of alunos) {
        try {/* 
          await db.query(
            'INSERT INTO Notas_faltas (id_disciplina, id_aluno, ano_academico, semestre) VALUES (?, ?, ?, ?)',
            [id_disciplina, aluno, ano_academico, semestre]
          ); */
          console.log(aluno)
          console.log("alunos :" + aluno)
        } catch (err) {
          console.error('Error creating Notas_faltas entry:', err);
        }
      }
    }

    // 成功した場合のレスポンス
    res.json({ message: 'Disciplinas assigned successfully' });

  } catch (err) {
    console.error('Error fetching Alunos or inserting Notas_faltas:', err);
    res.status(500).json({ message: 'Failed to assign disciplinas' });
  }
};