// notasFaltasController.js
const db = require('../db') // データベース接続

// 特定の生徒の全ての成績を取得
exports.getNotas = async (req, res) => {
  const id_aluno = req.params.id_aluno
  try {
    const [rows] = await db.query(`SELECT * FROM notas_faltas WHERE id_aluno = ?`, [id_aluno])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Nota not found' });
    }
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'データの取得中にエラーが発生しました。' })
  }
}

// 特定の生徒の全ての成績を取得
exports.getNotasByid_notas_faltas = async (req, res) => {
  const id_notas_faltas  = req.params.id_notas_faltas 
  try {
    const [rows] = await db.query(`SELECT * FROM notas_faltas WHERE id_notas_faltas  = ?`, [id_notas_faltas])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Nota not found' });
    }
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'データの取得中にエラーが発生しました。' })
  }
}

// 特定の生徒の特定の学年・学期の成績を取得
exports.getNotasByAnoESemestre = async (req, res) => {
  const { id_aluno, ano_academico, semestre } = req.params
  try {
    const [rows] = await db.query(
      'SELECT * FROM notas_faltas WHERE id_aluno = ? AND ano_academico = ? AND semestre = ?',
      [id_aluno, ano_academico, semestre]
    )
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'データの取得中にエラーが発生しました。' })
  }
}

// 成績を更新
exports.updateNota = async (req, res) => {
  const id_notas_faltas = req.params.id_notas_faltas
  const { n1, ai, ap, faltas } = req.body
  try {
    const [result] = await db.query('UPDATE notas_faltas SET n1 = ?, ai = ?, ap = ?, faltas = ? WHERE id_notas_faltas = ?', [
      n1,
      ai,
      ap,
      faltas,
      id_notas_faltas
    ])
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Nenhuma nota encontrada.' })
    } else {
      res.json({ message: 'As notas foram atualizadas.' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Ocorreu um erro ao atualizar os dados.' })
  }
}

// 新しい成績を追加
exports.addNota = async (req, res) => {
  const { id_aluno, nota, faltas, ano_academico, semestre } = req.body
  try {
    const [result] = await db.query(
      'INSERT INTO notas_faltas (id_aluno, nota, faltas, ano_academico, semestre) VALUES (?, ?, ?, ?, ?)',
      [id_aluno, nota, faltas, ano_academico, semestre]
    )
    res.status(201).json({ message: '成績が追加されました。', id_notas_faltas: result.insertId })
  } catch (error) {
    res.status(500).json({ error: 'データの追加中にエラーが発生しました。' })
  }
}

// 成績を削除
exports.deleteNota = async (req, res) => {
  const id_notas_faltas = req.params.id_notas_faltas
  try {
    const [result] = await db.query('DELETE FROM notas_faltas WHERE id = ?', [id_notas_faltas])
    if (result.affectedRows === 0) {
      res.status(404).json({ error: '成績が見つかりません。' })
    } else {
      res.json({ message: '成績が削除されました。' })
    }
  } catch (error) {
    res.status(500).json({ error: 'データの削除中にエラーが発生しました。' })
  }
}

exports.getEditNotaPage = (req, res) => {
  const { alunoId, disciplinaId, idNotasFaltas } = req.query

  // 必要なデータをデータベースから取得するロジックを追加
  // 例えば、特定の生徒の成績を取得するためのクエリを実行
  res.render('editarNota', {
    alunoId,
    disciplinaId,
    idNotasFaltas
    // 他の必要なデータを渡す
  })
}

// turmaId, disciplinaId, year, semestre に基づき notas_faltas データを取得する関数
exports.getNotasFaltasApri = async (req, res) => {
  const { turmaId, disciplinaId, year, semestre } = req.query

  try {
    const [results] = await db.query(
      `
        SELECT nf.id_notas_faltas, nf.id_disciplina, nf.id_aluno, nf.N1, nf.AI, nf.AP, SUM(fd.justificado) AS faltas, 
          nf.ano_academico, nf.semestre, u.nome_usuario AS nome_aluno, u.foto, fd.id_faltas_detalhes
        FROM notas_faltas nf
        JOIN aluno a ON nf.id_aluno = a.id_aluno
        JOIN usuario u ON a.id_usuario = u.id_usuario
        JOIN faltas_detalhes fd ON fd.id_notas_faltas = nf.id_notas_faltas
        WHERE a.id_turma = ? AND nf.id_disciplina = ? AND nf.ano_academico = ? AND nf.semestre = ?
        GROUP BY u.nome_usuario;
    `,
      [turmaId, disciplinaId, year, semestre]
    )

    res.json(results)
  } catch (error) {
    console.error('Error fetching notas_faltas:', error)
    res.status(500).json({ message: 'Error retrieving notas_faltas' })
  }
}


// notas_faltasを取得する関数
exports.getNotasFaltasDetails = async (req, res) => {
  const { alunoId, disciplinaId, year, semestre } = req.query

  try {
    const [results] = await db.query(
      `
        SELECT nf.id_disciplina, nf.id_aluno, nf.ano_academico, nf.semestre, u.nome_usuario AS nome_aluno, fd.data_falta
        FROM notas_faltas nf
        JOIN aluno a ON nf.id_aluno = a.id_aluno
        JOIN usuario u ON a.id_usuario = u.id_usuario
        JOIN faltas_detalhes fd ON fd.id_notas_faltas = nf.id_notas_faltas
        WHERE a.id_aluno = ? AND nf.id_disciplina = ? AND nf.ano_academico = ? AND nf.semestre = ? AND fd.justificado = ?;
    `,
      [alunoId, disciplinaId, year, semestre]
    )

    res.json(results)
  } catch (error) {
    console.error('Error fetching notas_faltas:', error)
    res.status(500).json({ message: 'Error retrieving notas_faltas' })
  }
};

