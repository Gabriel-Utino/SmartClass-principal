// alunoController.js
const pool = require('../config/database')

exports.getAllAluno = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT us.id_usuario, us.nome_usuario, us.cpf_usuario, 
      us.endereco_usuario, us.telefone_usuario, us.email_usuario, 
      al.id_aluno, al.ra_aluno, al.data_matricula, al.id_turma 
      FROM usuario as us JOIN aluno as al ON us.id_usuario = al.id_usuario 
      `)
    res.json(results)
  } catch (err) {
    console.error('Erro ao obter a lista de Aluno: ' + err)
    res.status(500).json({ message: 'Erro ao obter os dados de tabela aluno' })
  }
}

// 生徒の情報を取得する関数
exports.getAlunoById = async (req, res) => {
  const { id_aluno } = req.params
  try {
    const [rows] = await pool.query(
      `
      SELECT us.id_usuario, us.nome_usuario, us.cpf_usuario, 
      us.endereco_usuario, us.telefone_usuario, us.email_usuario, 
      al.id_aluno, al.ra_aluno, al.data_matricula, al.id_turma 
      FROM usuario as us JOIN aluno as al ON us.id_usuario = al.id_usuario 
      WHERE id_aluno = ?;`,
      [id_aluno]
    )
    if (rows.length > 0) {
      res.json(rows[0])
    } else {
      res.status(404).json({ message: 'Aluno not found' })
    }
  } catch (error) {
    console.error('Error fetching aluno:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// 生徒の成績情報を取得する関数
exports.getNotasFaltasByAluno = async (req, res) => {
  const { id_aluno } = req.params
  try {
    const [rows] = await pool.query(`
      SELECT nf.id_notas_faltas, nf.id_disciplina, nf.id_aluno, 
      nf.N1, nf.AI, nf.AP, SUM(fd.justificado) AS faltas, 
      nf.ano_academico, nf.semestre
      FROM notas_faltas nf
      LEFT JOIN faltas_detalhes fd ON fd.id_notas_faltas = nf.id_notas_faltas
      WHERE id_aluno = ?
      GROUP BY nf.id_notas_faltas;
      `, [id_aluno])
    if (rows.length > 0) {
      res.json(rows)
    } else {
      res.status(404).json({ message: 'Notas_Faltas not found' })
    }
  } catch (error) {
    console.error('Error fetching notas_faltas:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// CPFまたはEmailで生徒を検索
exports.searchAlunosByCPFOrEmail = async (req, res) => {
  const { query } = req.query;
  try {
    const [alunos] = await db.query(`
      SELECT usuario.*, aluno.* 
      FROM aluno 
      JOIN usuario ON usuario.id_usuario = aluno.id_usuario
      WHERE usuario.cpf_usuario LIKE ? OR usuario.email_usuario LIKE ? OR usuario.telefone_usuario = ?;
    `, [`%${query}%`, `%${query}%`, `%${query}%`]);
    res.json(alunos);
  } catch (error) {
    console.error('Error searching alunos:', error);
    res.status(500).json({ message: 'Error searching alunos' });
  }
};