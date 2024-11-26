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
    const [rows] = await pool.query('SELECT * FROM notas_faltas WHERE id_aluno = ?', [id_aluno])
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
