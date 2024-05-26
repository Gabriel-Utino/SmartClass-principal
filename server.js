const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const crypto = require('crypto') // Importar módulo crypto para gerar token
const nodemailer = require('nodemailer') // Importar nodemailer para envio de email

//

const app = express()
const port = 3000
app.use(express.json())
app.use(cors())
// MySQL接続設定
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'smartclass'
})
connection.connect(err => {
  if (err) {
    console.error('MySQL connection failed: ' + err.stack)
    return
  }
  console.log('Connected to MySQL database')
})

// Middleware para analisar corpos de requisição
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors()) // Habilitar CORS para permitir requisições de diferentes origens

// 商品の配列をMySQLから読み込む
let escolas = []
let turmas = []
let alunos = []
let disciplinas = []
let professores = []
let notas = []
let responsaveis = []
let turmaAlunos = []
let eventoAlunos = []
let eventoProfessors = []
let turmaDisciplinas = []

// Professorのサーバー管理に関わる部分
// Professorテーブルのデータ取得
connection.query('SELECT * FROM Professor;', (err, results) => {
  if (err) {
    console.error('Professorテーブルでエラー発生: ' + err)
  } else {
    professores = results
  }
})
// リスト化
app.get('/professores', (req, res) => {
  res.json(professores)
})
// 取得
app.get('/professores/:id_prof', (req, res) => {
  const professorID = parseInt(req.params.id_prof)
  const professor = professores.find(professor => professor.id_prof === professorID)
  if (professor) {
    res.json(professor)
  } else {
    res.status(404).json({ message: '見つかりません' })
  }
})
// 追加
app.post('/professores', (req, res) => {
  const newProfessor = req.body
  connection.query(
    'INSERT INTO Professor (nome_prof, cpf_prof, telefone_prof, email_consti_prof, email_pess_prof, nascimento_prof, endereco_prof, id_disciplina, id_escola) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      newProfessor.nome_prof,
      newProfessor.cpf_prof,
      newProfessor.telefone_prof,
      newProfessor.email_consti_prof,
      newProfessor.email_pess_prof,
      newProfessor.nascimento_prof,
      newProfessor.endereco_prof,
      newProfessor.id_disciplina,
      newProfessor.id_escola
    ],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        res.status(500).json({ message: 'Professorを追加できませんでした' })
      } else {
        newProfessor.id_prof = result.insertId
        professores.push(newProfessor)
        res.status(201).json(newProfessor)
      }
    }
  )
})
// 更新
app.put('/professores/:id_prof', (req, res) => {
  const id_prof = parseInt(req.params.id_prof)
  const updatedProfessor = req.body
  const index = professores.findIndex(professor => professor.id_prof === id_prof)
  if (index !== -1) {
    connection.query(
      'UPDATE Professor SET nome_prof=?, cpf_prof=?, telefone_prof=?, email_consti_prof=?, email_pess_prof=?, nascimento_prof=?, endereco_prof=?, id_disciplina=?, id_escola=? WHERE id_prof=?',
      [
        updatedProfessor.nome_prof,
        updatedProfessor.cpf_prof,
        updatedProfessor.telefone_prof,
        updatedProfessor.email_consti_prof,
        updatedProfessor.email_pess_prof,
        updatedProfessor.nascimento_prof,
        updatedProfessor.endereco_prof,
        updatedProfessor.id_disciplina,
        updatedProfessor.id_escola,
        id_prof
      ],
      err => {
        if (err) {
          console.error('Error updating data in MySQL: ' + err)
          res.status(500).json({ message: 'Professorを更新できませんでした' })
        } else {
          professores[index] = { ...professores[index], ...updatedProfessor }
          res.json(professores[index])
        }
      }
    )
  } else {
    res.status(404).json({ message: 'Professorが見つかりません' })
  }
})
// 削除
app.delete('/professores/:id_prof', (req, res) => {
  const id_prof = parseInt(req.params.id_prof)
  const index = professores.findIndex(professor => professor.id_prof === id_prof)
  if (index !== -1) {
    connection.query('DELETE FROM Professor WHERE id_prof=?', [id_prof], err => {
      if (err) {
        console.error('Professorテーブル - Erro ao excluir dados do MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível excluir' })
      } else {
        const removedProfessor = professores.splice(index, 1)
        res.json(removedProfessor[0])
      }
    })
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})

// Turmaのサーバー管理に関わる部分
// Turmaテーブルのデータ取得
connection.query('SELECT * FROM Turma;', (err, results) => {
  if (err) {
    console.error('Turmaテーブルでエラー発生: ' + err)
  } else {
    turmas = results
  }
})
// リスト化
app.get('/turmas', (req, res) => {
  res.json(turmas)
})
// 取得
app.get('/turmas/:id_turma', (req, res) => {
  const turmaID = parseInt(req.params.id_turma)
  const turma = turmas.find(turma => turma.id_turma === turmaID)
  if (turma) {
    res.json(turma)
  } else {
    res.status(404).json({ message: '見つかりません' })
  }
})
// 追加
app.post('/turmas', (req, res) => {
  const newTurma = req.body
  connection.query(
    'INSERT INTO Turma (nome_turma, periodo, id_prof) VALUES (?, ?, ?)',
    [newTurma.nome_turma, newTurma.periodo, newTurma.id_prof],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        res.status(500).json({ message: 'Turmaを追加できませんでした' })
      } else {
        newTurma.id_turma = result.insertId
        turmas.push(newTurma)
        res.status(201).json(newTurma)
      }
    }
  )
})
// 更新
app.put('/turmas/:id_turma', (req, res) => {
  const id_turma = parseInt(req.params.id_turma)
  const updatedTurma = req.body
  const index = turmas.findIndex(turma => turma.id_turma === id_turma)
  if (index !== -1) {
    connection.query(
      'UPDATE Turma SET nome_turma=?, periodo=?, id_prof=? WHERE id_turma=?',
      [updatedTurma.nome_turma, updatedTurma.periodo, updatedTurma.id_prof, id_turma],
      err => {
        if (err) {
          console.error('Error updating data in MySQL: ' + err)
          res.status(500).json({ message: 'Turmaを更新できませんでした' })
        } else {
          turmas[index] = { ...turmas[index], ...updatedTurma }
          res.json(turmas[index])
        }
      }
    )
  } else {
    res.status(404).json({ message: 'Turmaが見つかりません' })
  }
})
// 削除
app.delete('/turmas/:id_turma', (req, res) => {
  const id_turma = parseInt(req.params.id_turma)
  const index = turmas.findIndex(turma => turma.id_turma === id_turma)
  if (index !== -1) {
    connection.query('DELETE FROM Turma WHERE id_turma=?', [id_turma], err => {
      if (err) {
        console.error('Turmaテーブル - Erro ao excluir dados do MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível excluir' })
      } else {
        const removedTurma = turmas.splice(index, 1)
        res.json(removedTurma[0])
      }
    })
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})

// Disciplinaのサーバー管理に関わる部分
// Disciplinaテーブルのデータ取得
connection.query('SELECT * FROM Disciplina;', (err, results) => {
  if (err) {
    console.error('Disciplinaテーブルでエラー発生: ' + err)
  } else {
    disciplinas = results
  }
})
// リスト化
app.get('/disciplinas', (req, res) => {
  res.json(disciplinas)
})
// 取得
app.get('/disciplinas/:id_disciplina', (req, res) => {
  const disciplinaID = parseInt(req.params.id_disciplina)
  const disciplina = disciplinas.find(disciplina => disciplina.id_disciplina === disciplinaID)
  if (disciplina) {
    res.json(disciplina)
  } else {
    res.status(404).json({ message: '見つかりません' })
  }
})
// 追加
app.post('/disciplinas', (req, res) => {
  const newDisciplina = req.body
  connection.query(
    'INSERT INTO Disciplina (disciplina, id_prof) VALUES (?, ?)',
    [newDisciplina.disciplina, newDisciplina.id_prof],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        res.status(500).json({ message: 'Disciplinaを追加できませんでした' })
      } else {
        newDisciplina.id_disciplina = result.insertId
        disciplinas.push(newDisciplina)
        res.status(201).json(newDisciplina)
      }
    }
  )
})
// 更新
app.put('/disciplinas/:id_disciplina', (req, res) => {
  const id_disciplina = parseInt(req.params.id_disciplina)
  const updatedDisciplina = req.body
  const index = disciplinas.findIndex(disciplina => disciplina.id_disciplina === id_disciplina)
  if (index !== -1) {
    connection.query(
      'UPDATE Disciplina SET disciplina=?, id_prof=? WHERE id_disciplina=?',
      [updatedDisciplina.disciplina, updatedDisciplina.id_prof, id_disciplina],
      err => {
        if (err) {
          console.error('Error updating data in MySQL: ' + err)
          res.status(500).json({ message: 'Disciplinaを更新できませんでした' })
        } else {
          disciplinas[index] = { ...disciplinas[index], ...updatedDisciplina }
          res.json(disciplinas[index])
        }
      }
    )
  } else {
    res.status(404).json({ message: 'Disciplinaが見つかりません' })
  }
})
// 削除
app.delete('/disciplinas/:id_disciplina', (req, res) => {
  const id_disciplina = parseInt(req.params.id_disciplina)
  const index = disciplinas.findIndex(disciplina => disciplina.id_disciplina === id_disciplina)
  if (index !== -1) {
    connection.query('DELETE FROM Disciplina WHERE id_disciplina=?', [id_disciplina], err => {
      if (err) {
        console.error('Disciplinaテーブル - Erro ao excluir dados do MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível excluir' })
      } else {
        const removedDisciplina = disciplinas.splice(index, 1)
        res.json(removedDisciplina[0])
      }
    })
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})

// Responsavelのサーバー管理に関わる部分
// Responsavelテーブルのデータ取得
connection.query('SELECT * FROM Responsavel;', (err, results) => {
  if (err) {
    console.error('Responsavelテーブルでエラー発生: ' + err)
  } else {
    responsaveis = results
  }
})
// リスト化
app.get('/responsaveis', (req, res) => {
  res.json(responsaveis)
})
// 取得
app.get('/responsaveis/:id_resp', (req, res) => {
  const responsavelID = parseInt(req.params.id_resp)
  const responsavel = responsaveis.find(responsavel => responsavel.id_resp === responsavelID)
  if (responsavel) {
    res.json(responsavel)
  } else {
    res.status(404).json({ message: '見つかりません' })
  }
})
// 追加
app.post('/responsaveis', (req, res) => {
  const newResponsavel = req.body
  connection.query(
    'INSERT INTO Responsavel (nome_pesp, cpf_resp, endereco_pesp, telefone_pesp, email_pesp, id_escola) VALUES (?, ?, ?, ?, ?, ?)',
    [
      newResponsavel.nome_pesp,
      newResponsavel.cpf_resp,
      newResponsavel.endereco_pesp,
      newResponsavel.telefone_pesp,
      newResponsavel.email_pesp,
      newResponsavel.id_escola
    ],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        res.status(500).json({ message: 'Responsavelを追加できませんでした' })
      } else {
        newResponsavel.id_resp = result.insertId
        responsaveis.push(newResponsavel)
        res.status(201).json(newResponsavel)
      }
    }
  )
})
// 更新
app.put('/responsaveis/:id_resp', (req, res) => {
  const id_resp = parseInt(req.params.id_resp)
  const updatedResponsavel = req.body
  const index = responsaveis.findIndex(responsavel => responsavel.id_resp === id_resp)
  if (index !== -1) {
    connection.query(
      'UPDATE Responsavel SET nome_pesp=?, cpf_resp=?, endereco_pesp=?, telefone_pesp=?, email_pesp=?, id_escola=? WHERE id_resp=?',
      [
        updatedResponsavel.nome_pesp,
        updatedResponsavel.cpf_resp,
        updatedResponsavel.endereco_pesp,
        updatedResponsavel.telefone_pesp,
        updatedResponsavel.email_pesp,
        updatedResponsavel.id_escola,
        id_resp
      ],
      err => {
        if (err) {
          console.error('Error updating data in MySQL: ' + err)
          res.status(500).json({ message: 'Responsavelを更新できませんでした' })
        } else {
          responsaveis[index] = { ...responsaveis[index], ...updatedResponsavel }
          res.json(responsaveis[index])
        }
      }
    )
  } else {
    res.status(404).json({ message: 'Responsavelが見つかりません' })
  }
})
// 削除
app.delete('/responsaveis/:id_resp', (req, res) => {
  const id_resp = parseInt(req.params.id_resp)
  const index = responsaveis.findIndex(responsavel => responsavel.id_resp === id_resp)
  if (index !== -1) {
    connection.query('DELETE FROM Responsavel WHERE id_resp=?', [id_resp], err => {
      if (err) {
        console.error('Responsavelテーブル - Erro ao excluir dados do MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível excluir' })
      } else {
        const removedResponsavel = responsaveis.splice(index, 1)
        res.json(removedResponsavel[0])
      }
    })
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})

// Alunoのサーバー管理に関わる部分
// Alunoテーブルのデータ取得
connection.query('SELECT * FROM Aluno;', (err, results) => {
  if (err) {
    console.error('Alunoテーブルでエラー発生: ' + err)
  } else {
    alunos = results
  }
})
// リスト化
app.get('/alunos', (req, res) => {
  res.json(alunos)
})
// 取得
app.get('/alunos/:id_aluno', (req, res) => {
  const alunoID = parseInt(req.params.id_aluno)
  const aluno = alunos.find(aluno => aluno.id_aluno === alunoID)
  if (aluno) {
    res.json(aluno)
  } else {
    res.status(404).json({ message: '見つかりません' })
  }
})
// 追加
app.post('/alunos', (req, res) => {
  const newAluno = req.body
  connection.query(
    'INSERT INTO Aluno (nome_aluno, cpf_aluno, endereco_aluno, telefone_aluno, email_aluno, nascimento_aluno, ra_aluno, date_matricula) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      newAluno.nome_aluno,
      newAluno.cpf_aluno,
      newAluno.endereco_aluno,
      newAluno.telefone_aluno,
      newAluno.email_aluno,
      newAluno.nascimento_aluno,
      newAluno.ra_aluno,
      newAluno.date_matricula
    ],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        res.status(500).json({ message: 'Alunoを追加できませんでした' })
      } else {
        newAluno.id_aluno = result.insertId
        alunos.push(newAluno)
        res.status(201).json(newAluno)
      }
    }
  )
})
// 更新
app.put('/alunos/:id_aluno', (req, res) => {
  const id_aluno = parseInt(req.params.id_aluno)
  const updatedAluno = req.body
  const index = alunos.findIndex(aluno => aluno.id_aluno === id_aluno)
  if (index !== -1) {
    connection.query(
      'UPDATE Aluno SET nome_aluno=?, cpf_aluno=?, endereco_aluno=?, telefone_aluno=?, email_aluno=?, nascimento_aluno=?, ra_aluno=?, date_matricula=? WHERE id_aluno=?',
      [
        updatedAluno.nome_aluno,
        updatedAluno.cpf_aluno,
        updatedAluno.endereco_aluno,
        updatedAluno.telefone_aluno,
        updatedAluno.email_aluno,
        updatedAluno.nascimento_aluno,
        updatedAluno.ra_aluno,
        updatedAluno.date_matricula,
        id_aluno
      ],
      err => {
        if (err) {
          console.error('Error updating data in MySQL: ' + err)
          res.status(500).json({ message: 'Alunoを更新できませんでした' })
        } else {
          alunos[index] = { ...alunos[index], ...updatedAluno }
          res.json(alunos[index])
        }
      }
    )
  } else {
    res.status(404).json({ message: 'Alunoが見つかりません' })
  }
})
// 削除
app.delete('/alunos/:id_aluno', (req, res) => {
  const id_aluno = parseInt(req.params.id_aluno)
  const index = alunos.findIndex(aluno => aluno.id_aluno === id_aluno)
  if (index !== -1) {
    connection.query('DELETE FROM Aluno WHERE id_aluno=?', [id_aluno], err => {
      if (err) {
        console.error('Alunoテーブル - Erro ao excluir dados do MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível excluir' })
      } else {
        const removedAluno = alunos.splice(index, 1)
        res.json(removedAluno[0])
      }
    })
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})

// Aluno_Respのサーバー管理に関わる部分
// Aluno_Respテーブルのデータ取得
connection.query('SELECT * FROM responsavel_aluno;', (err, results) => {
  if (err) {
    console.error('Aluno_Respテーブルでエラー発生: ' + err)
  } else {
    alunoResps = results
  }
})
// リスト化
app.get('/aluno_resps', (req, res) => {
  res.json(alunoResps)
})
// 取得
app.get('/aluno_resps/:id_aluno/:id_resp', (req, res) => {
  const alunoID = parseInt(req.params.id_aluno)
  const respID = parseInt(req.params.id_resp)
  const alunoResp = alunoResps.find(alunoResp => alunoResp.id_aluno === alunoID && alunoResp.id_resp === respID)
  if (alunoResp) {
    res.json(alunoResp)
  } else {
    res.status(404).json({ message: '見つかりません' })
  }
})
// 追加
app.post('/aluno_resps', (req, res) => {
  const newAlunoResp = req.body
  connection.query(
    'INSERT INTO Aluno_Resp (id_aluno, id_resp) VALUES (?, ?)',
    [newAlunoResp.id_aluno, newAlunoResp.id_resp],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        res.status(500).json({ message: 'Aluno_Respを追加できませんでした' })
      } else {
        /* newAlunoResp.id_aluno = result.insertId */
        alunoResps.push(newAlunoResp)
        res.status(201).json(newAlunoResp)
      }
    }
  )
})
// 削除
app.delete('/aluno_resps/:id_aluno/:id_resp', (req, res) => {
  const alunoID = parseInt(req.params.id_aluno)
  const respID = parseInt(req.params.id_resp)
  const index = alunoResps.findIndex(alunoResp => alunoResp.id_aluno === alunoID && alunoResp.id_resp === respID)
  if (index !== -1) {
    connection.query('DELETE FROM Aluno_Resp WHERE id_aluno=? AND id_resp=?', [alunoID, respID], err => {
      if (err) {
        console.error('Aluno_Respテーブル - Erro ao excluir dados do MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível excluir' })
      } else {
        const removedAlunoResp = alunoResps.splice(index, 1)
        res.json(removedAlunoResp[0])
      }
    })
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})

// Notasのサーバー管理に関わる部分
// NotasTableのデータ取得
connection.query('SELECT * FROM Notas_faltas;', (err, results) => {
  if (err) {
    console.error('Ocorreu erro na tabela Notas: ' + err)
  } else {
    notas = results
  }
})
// リスト化
app.get('/notas_faltas', (req, res) => {
  res.json(notas)
})
// 取得
app.get('/notas_faltas/:id_notas_faltas', (req, res) => {
  const notasID = parseInt(req.params.id_notas_faltas)
  const nota = notas.find(nota => nota.id_notas_faltas === notasID)
  if (nota) {
    res.json(nota)
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})
// 追加
app.post('/notas_faltas', (req, res) => {
  const newNota = req.body
  connection.query(
    'INSERT INTO Notas_faltas (id_disciplina, id_aluno, n1, AI, AP, faltas, academic_year, data_matricula, semestre) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      newNota.id_disciplina,
      newNota.id_aluno,
      newNota.n1,
      newNota.AI,
      newNota.AP,
      newNota.faltas,
      newNota.academic_year,
      newNota.data_matricula,
      newNota.semestre
    ],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível adicionar notas' })
      } else {
        newNota.id_notas_faltas = result.insertId
        notas.push(newNota)
        res.status(201).json(newNota)
      }
    }
  )
})
// 更新
app.put('/notas_faltas/:id_notas_faltas', (req, res) => {
  const id_notas_faltas = parseInt(req.params.id_notas_faltas)
  const updatedNota = req.body
  const index = notas.findIndex(nota => nota.id_notas_faltas === id_notas_faltas)
  if (index !== -1) {
    connection.query(
      'UPDATE Notas_faltas SET id_disciplina=?, id_aluno=?, n1=?, AI=?, AP=?, faltas=?, academic_year=?, data_matricula=?, semestre=? WHERE id_notas_faltas=?',
      [
        updatedNota.id_disciplina,
        updatedNota.id_aluno,
        updatedNota.n1,
        updatedNota.AI,
        updatedNota.AP,
        updatedNota.faltas,
        updatedNota.academic_year,
        updatedNota.data_matricula,
        updatedNota.semestre,
        id_notas_faltas
      ],
      err => {
        if (err) {
          console.error('Error updating data in MySQL: ' + err)
          res.status(500).json({ message: 'Falha ao atualizar Notas' })
        } else {
          notas[index] = { ...notas[index], ...updatedNota }
          res.json(notas[index])
        }
      }
    )
  } else {
    res.status(404).json({ message: 'Notas não encontradas' })
  }
})
// 削除
app.delete('/notas_faltas/:id_notas_faltas', (req, res) => {
  const id_notas_faltas = parseInt(req.params.id_notas)
  const index = notas.findIndex(nota => nota.id_notas_faltas === id_notas_faltas)
  if (index !== -1) {
    connection.query('DELETE FROM Notas_faltas WHERE id_notas_faltas=?', [id_notas_faltas], err => {
      if (err) {
        console.error('Tabela Notas - Erro ao excluir dados do MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível excluir' })
      } else {
        const removedNota = notas.splice(index, 1)
        res.json(removedNota[0])
      }
    })
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})
// 生徒IDに関連する成績や欠席情報を取得するエンドポイントを追加
app.get('/alunos/:id_aluno/notas_faltas', (req, res) => {
  const id_aluno = parseInt(req.params.id_aluno)
  // 生徒IDに関連する成績や欠席情報を取得するクエリを実行
  connection.query('SELECT * FROM Notas_faltas WHERE id_aluno = ?', [id_aluno], (err, results) => {
    if (err) {
      console.error('Ocorreu erro na tabela Notas: ' + err)
      res.status(500).json({ message: 'Ocorreu um erro' })
    } else {
      res.json(results)
    }
  })
})

// Eventoのサーバー管理に関わる部分
// Eventoテーブルのデータ取得
connection.query('SELECT * FROM Evento;', (err, results) => {
  if (err) {
    console.error('Eventoテーブルでエラー発生: ' + err)
  } else {
    eventos = results
  }
})
// リスト化
app.get('/eventos', (req, res) => {
  res.json(eventos)
})
// 取得
app.get('/eventos/:id_evento', (req, res) => {
  const eventoID = parseInt(req.params.id_evento)
  const evento = eventos.find(evento => evento.id_evento === eventoID)
  if (evento) {
    res.json(evento)
  } else {
    res.status(404).json({ message: '見つかりません' })
  }
})
// 追加
app.post('/eventos', (req, res) => {
  const newEvento = req.body
  connection.query(
    'INSERT INTO Evento (nome_evento, link_evento, date_evento) VALUES (?, ?, ?)',
    [newEvento.nome_evento, newEvento.link_evento, newEvento.date_evento],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        res.status(500).json({ message: 'Eventoを追加できませんでした' })
      } else {
        newEvento.id_evento = result.insertId
        eventos.push(newEvento)
        res.status(201).json(newEvento)
      }
    }
  )
})
// 更新
app.put('/eventos/:id_evento', (req, res) => {
  const id_evento = parseInt(req.params.id_evento)
  const updatedEvento = req.body
  const index = eventos.findIndex(evento => evento.id_evento === id_evento)
  if (index !== -1) {
    connection.query(
      'UPDATE Evento SET nome_evento=?, link_evento=?, date_evento=? WHERE id_evento=?',
      [updatedEvento.nome_evento, updatedEvento.link_evento, updatedEvento.date_evento, id_evento],
      err => {
        if (err) {
          console.error('Error updating data in MySQL: ' + err)
          res.status(500).json({ message: 'Eventoを更新できませんでした' })
        } else {
          eventos[index] = { ...eventos[index], ...updatedEvento }
          res.json(eventos[index])
        }
      }
    )
  } else {
    res.status(404).json({ message: 'Eventoが見つかりません' })
  }
})
// 削除
app.delete('/eventos/:id_evento', (req, res) => {
  const id_evento = parseInt(req.params.id_evento)
  const index = eventos.findIndex(evento => evento.id_evento === id_evento)
  if (index !== -1) {
    connection.query('DELETE FROM Evento WHERE id_evento=?', [id_evento], err => {
      if (err) {
        console.error('Eventoテーブル - Erro ao excluir dados do MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível excluir' })
      } else {
        const removedEvento = eventos.splice(index, 1)
        res.json(removedEvento[0])
      }
    })
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})

// evento_alunoのサーバー管理に関わる部分
// evento_alunoテーブルのデータ取得
connection.query('SELECT * FROM evento_aluno;', (err, results) => {
  if (err) {
    console.error('evento_alunoテーブルでエラー発生: ' + err)
  } else {
    eventoAlunos = results
  }
})
// リスト化
app.get('/evento_alunos', (req, res) => {
  res.json(eventoAlunos)
})
// 取得
app.get('/evento_alunos/:id_aluno/:id_evento', (req, res) => {
  const alunoID = parseInt(req.params.id_aluno)
  const eventoID = parseInt(req.params.id_evento)
  const eventoAluno = eventoAlunos.find(
    eventoAluno => eventoAluno.id_aluno === alunoID && eventoAluno.id_evento === eventoID
  )
  if (eventoAluno) {
    res.json(eventoAluno)
  } else {
    res.status(404).json({ message: '見つかりません' })
  }
})
// 追加
app.post('/evento_alunos', (req, res) => {
  const newEventoAluno = req.body
  connection.query(
    'INSERT INTO evento_aluno (id_aluno, id_evento) VALUES (?, ?)',
    [newEventoAluno.id_aluno, newEventoAluno.id_evento],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        res.status(500).json({ message: 'evento_alunoを追加できませんでした' })
      } else {
        /* newEventoAluno.id_aluno = result.insertId */
        eventoAlunos.push(newEventoAluno)
        res.status(201).json(newEventoAluno)
      }
    }
  )
})
// 削除
app.delete('/evento_alunos/:id_aluno/:id_evento', (req, res) => {
  const alunoID = parseInt(req.params.id_aluno)
  const eventoID = parseInt(req.params.id_evento)
  const index = eventoAlunos.findIndex(
    eventoAluno => eventoAluno.id_aluno === alunoID && eventoAluno.id_evento === eventoID
  )
  if (index !== -1) {
    connection.query('DELETE FROM evento_aluno WHERE id_aluno=? AND id_evento=?', [alunoID, eventoID], err => {
      if (err) {
        console.error('evento_alunoテーブル - Erro ao excluir dados do MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível excluir' })
      } else {
        const removedEventoAluno = eventoAlunos.splice(index, 1)
        res.json(removedEventoAluno[0])
      }
    })
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})

// Disciplina_Alunoのサーバー管理に関わる部分
// Disciplina_Alunoテーブルのデータ取得
connection.query('SELECT * FROM aluno_disciplina;', (err, results) => {
  if (err) {
    console.error('Disciplina_Alunoテーブルでエラー発生: ' + err)
  } else {
    disciplinaAlunos = results
  }
})
// リスト化
app.get('/disciplina_alunos', (req, res) => {
  res.json(disciplinaAlunos)
})
// 取得
app.get('/disciplina_alunos/:id_aluno/:id_disciplina', (req, res) => {
  const alunoID = parseInt(req.params.id_aluno)
  const disciplinaID = parseInt(req.params.id_disciplina)
  const disciplinaAluno = disciplinaAlunos.find(
    disciplinaAluno => disciplinaAluno.id_aluno === alunoID && disciplinaAluno.id_disciplina === disciplinaID
  )
  if (disciplinaAluno) {
    res.json(disciplinaAluno)
  } else {
    res.status(404).json({ message: '見つかりません' })
  }
})
// 追加
app.post('/disciplina_alunos', (req, res) => {
  const newDisciplinaAluno = req.body
  connection.query(
    'INSERT INTO Disciplina_Aluno (id_aluno, id_disciplina) VALUES (?, ?)',
    [newDisciplinaAluno.id_aluno, newDisciplinaAluno.id_disciplina],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        res.status(500).json({ message: 'Disciplina_Alunoを追加できませんでした' })
      } else {
        /* newDisciplinaAluno.id_aluno = result.insertId */
        disciplinaAlunos.push(newDisciplinaAluno)
        res.status(201).json(newDisciplinaAluno)
      }
    }
  )
})
// 削除
app.delete('/disciplina_alunos/:id_aluno/:id_disciplina', (req, res) => {
  const alunoID = parseInt(req.params.id_aluno)
  const disciplinaID = parseInt(req.params.id_disciplina)
  const index = disciplinaAlunos.findIndex(
    disciplinaAluno => disciplinaAluno.id_aluno === alunoID && disciplinaAluno.id_disciplina === disciplinaID
  )
  if (index !== -1) {
    connection.query(
      'DELETE FROM Disciplina_Aluno WHERE id_aluno=? AND id_disciplina=?',
      [alunoID, disciplinaID],
      err => {
        if (err) {
          console.error('Disciplina_Alunoテーブル - Erro ao excluir dados do MySQL: ' + err)
          res.status(500).json({ message: 'Não foi possível excluir' })
        } else {
          const removedDisciplinaAluno = disciplinaAlunos.splice(index, 1)
          res.json(removedDisciplinaAluno[0])
        }
      }
    )
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})

// prof_disciplinaのサーバー管理に関わる部分
// prof_disciplinaTableのデータ取得
connection.query('SELECT * FROM prof_disciplina;', (err, results) => {
  if (err) {
    console.error('Ocorreu um erro na tabela prof_disciplina: ' + err)
  } else {
    profDisciplinas = results
  }
})
// リスト化
app.get('/prof_disciplinas', (req, res) => {
  res.json(profDisciplinas)
})
// 取得
app.get('/prof_disciplinas/:id_prof_disc', (req, res) => {
  const id_prof_discID = parseInt(req.params.id_prof_disc)
  const profDisciplina = profDisciplinas.find(profDisciplina => profDisciplina.id_prof_disc === id_prof_discID)
  if (profDisciplina) {
    res.json(profDisciplina)
  } else {
    res.status(404).json({ message: 'Não encontrado' })
  }
})
// 追加
app.post('/prof_disciplinas', (req, res) => {
  const newProfDisciplina = req.body
  connection.query(
    'INSERT INTO prof_disciplina (id_prof, id_disciplina) VALUES (?, ?)',
    [newProfDisciplina.id_prof, newProfDisciplina.id_disciplina],
    (err, result) => {
      if (err) {
        console.error('Ocorreu um erro ao adicionar dados ao MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível adicionar prof_disciplina' })
      } else {
        newProfDisciplina.id_prof_disc = result.insertId
        profDisciplinas.push(newProfDisciplina)
        res.status(201).json(newProfDisciplina)
      }
    }
  )
})
// 削除
app.delete('/prof_disciplinas/:id_prof_disc', (req, res) => {
  const id_prof_discID = parseInt(req.params.id_prof_disc)
  const index = profDisciplinas.findIndex(profDisciplina => profDisciplina.id_prof_disc === id_prof_discID)
  if (index !== -1) {
    connection.query('DELETE FROM prof_disciplina WHERE id_prof_disc=?', [id_prof_discID], err => {
      if (err) {
        console.error('tabela prof_disciplina – Erro ao excluir dados do MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível excluir' })
      } else {
        const removedProfDisciplina = profDisciplinas.splice(index, 1)
        res.json(removedProfDisciplina[0])
      }
    })
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})

// orgDisciTurmaで使用
// 選択されたTurmaのDisciplinaを取得
app.get('/turmas/:id_turma/disciplinas', (req, res) => {
  const id_turma = parseInt(req.params.id_turma)
  connection.query(
    'SELECT d.id_disciplina, d.disciplina FROM Disciplina d INNER JOIN Turma_Disciplina td ON d.id_disciplina = td.id_disciplina WHERE td.id_turma = ?',
    [id_turma],
    (err, results) => {
      if (err) {
        console.error('Error fetching Disciplinas:', err)
        res.status(500).json({ message: 'Falha ao obter Disciplinas' })
      } else {
        res.json(results)
      }
    }
  )
})
// 選択されたTurmaのAlunoと複数のDisciplinaの間にNotas_faltasエントリを作成
app.post('/assign-disciplinas', (req, res) => {
  const { id_turma, id_disciplinas, academic_year, semestre } = req.body

  // Turmaに所属する全てのAlunoを取得
  connection.query('SELECT id_aluno FROM Aluno WHERE id_turma = ?', [id_turma], (err, alunos) => {
    if (err) {
      console.error('Error fetching Alunos:', err)
      res.status(500).json({ message: 'Falha ao obter Aluno' })
      return
    }

    // Notas_faltas criar
    const data_matricula = new Date().toISOString().slice(0, 10)

    id_disciplinas.forEach(id_disciplina => {
      alunos.forEach(aluno => {
        connection.query(
          'INSERT INTO Notas_faltas (id_disciplina, id_aluno, academic_year, data_matricula, semestre) VALUES (?, ?, ?, ?, ?)',
          [id_disciplina, aluno.id_aluno, academic_year, data_matricula, semestre],
          err => {
            if (err) {
              console.error('Error creating Notas_faltas entry:', err)
            }
          }
        )
      })
    })

    res.json({ message: 'Aplicado' })
  })
})

//para adaptar apricar faltas
//Pegue toda Turma
app.get('/turmasFaltas', (req, res) => {
  connection.query('SELECT * FROM Turma;', (err, results) => {
    if (err) {
      console.error('Ocorreu erro na tabela Turma: ' + err)
      res.status(500).json({ message: 'Não foi possível obter Turma' })
    } else {
      res.json(results)
    }
  })
})
// Obtenha Disciplinas relacionadas à Turma especificada
app.get('/turma_disciplinas/:id_turma/disciplinas', (req, res) => {
  const id_turma = parseInt(req.params.id_turma)
  connection.query(
    `SELECT d.id_disciplina, d.disciplina 
     FROM Turma_Disciplina td 
     JOIN Disciplina d ON td.id_disciplina = d.id_disciplina 
     WHERE td.id_turma = ?`,
    [id_turma],
    (err, results) => {
      if (err) {
        console.error('Ocorreu erro na tabela Turma_Disciplina: ' + err)
        res.status(500).json({ message: 'Não foi possível obter Disciplina' })
      } else {
        res.json(results)
      }
    }
  )
})
// notas_faltas Tabela de pesquisa
app.get('/notas_faltasApri', (req, res) => {
  const { turmaId, disciplinaId, year, semestre } = req.query
  connection.query(
    `SELECT nf.id_notas_faltas, nf.faltas, nf.N1, nf.AI, nf.AP, nf.id_aluno, a.nome_aluno, a.foto
     FROM Notas_faltas nf
     JOIN Aluno a ON nf.id_aluno = a.id_aluno
     WHERE nf.id_disciplina = ? AND a.id_turma = ? AND nf.academic_year = ? AND nf.semestre = ?`,
    [disciplinaId, turmaId, year, semestre],
    (err, results) => {
      if (err) {
        console.error('Error fetching notas_faltas:', err)
        res.status(500).json({ message: 'Erro na pesquisa' })
      } else {
        res.json(results)
      }
    }
  )
})
// faltas atualizar
app.put('/notas_faltasApri/faltas', (req, res) => {
  const { ids } = req.body
  const placeholders = ids.map(() => '?').join(',')
  connection.query(
    `UPDATE Notas_faltas SET faltas = faltas + 1 WHERE id_notas_faltas IN (${placeholders})`,
    ids,
    (err, results) => {
      if (err) {
        console.error('Error updating faltas:', err)
        console.log('Conteúdo do erro:' + err)
        res.status(500).json({ success: false, message: 'Não foi possível atualizar' })
      } else {
        res.json({ success: true, message: 'Faltas foi apricada' })
      }
    }
  )
})

// evento_professorのサーバー管理に関わる部分
// evento_professorテーブルのデータ取得
connection.query('SELECT * FROM evento_professor;', (err, results) => {
  if (err) {
    console.error('evento_professorテーブルでエラー発生: ' + err)
  } else {
    eventoProfessors = results
  }
})
// リスト化
app.get('/evento_professors', (req, res) => {
  res.json(eventoProfessors)
})
// 取得
app.get('/evento_professors/:id_prof/:id_evento', (req, res) => {
  const professorID = parseInt(req.params.id_prof)
  const eventoID = parseInt(req.params.id_evento)
  const eventoProfessor = eventoProfessors.find(
    eventoProfessor => eventoProfessor.id_prof === professorID && eventoProfessor.id_evento === eventoID
  )
  if (eventoProfessor) {
    res.json(eventoProfessor)
  } else {
    res.status(404).json({ message: '見つかりません' })
  }
})
// 追加
app.post('/evento_professors', (req, res) => {
  const newEventoProfessor = req.body
  connection.query(
    'INSERT INTO evento_professor (id_prof, id_evento) VALUES (?, ?)',
    [newEventoProfessor.id_prof, newEventoProfessor.id_evento],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        res.status(500).json({ message: 'evento_professorを追加できませんでした' })
      } else {
        /* newEventoProfessor.id_prof = result.insertId */
        eventoProfessors.push(newEventoProfessor)
        res.status(201).json(newEventoProfessor)
      }
    }
  )
})
// 削除
app.delete('/evento_professors/:id_prof/:id_evento', (req, res) => {
  const professorID = parseInt(req.params.id_prof)
  const eventoID = parseInt(req.params.id_evento)
  const index = eventoProfessors.findIndex(
    eventoProfessor => eventoProfessor.id_prof === professorID && eventoProfessor.id_evento === eventoID
  )
  if (index !== -1) {
    connection.query('DELETE FROM evento_professor WHERE id_prof=? AND id_evento=?', [professorID, eventoID], err => {
      if (err) {
        console.error('evento_professorテーブル - Erro ao excluir dados do MySQL: ' + err)
        res.status(500).json({ message: 'Não foi possível excluir' })
      } else {
        const removedEventoProfessor = eventoProfessors.splice(index, 1)
        res.json(removedEventoProfessor[0])
      }
    })
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})

// turma_disciplinaのサーバー管理に関わる部分
// turma_disciplinaテーブルのデータ取得
connection.query('SELECT * FROM turma_disciplina;', (err, results) => {
  if (err) {
    console.error('turma_disciplinaテーブルでエラー発生: ' + err)
  } else {
    turmaDisciplinas = results
  }
})
// リスト化
app.get('/turma_disciplinas', (req, res) => {
  res.json(turmaDisciplinas)
})
// 取得
app.get('/turma_disciplinas/:id_turma/:id_disciplina', (req, res) => {
  const turmaID = parseInt(req.params.id_turma)
  const disciplinaID = parseInt(req.params.id_disciplina)
  const turmaDisciplina = turmaDisciplinas.find(
    turmaDisciplina => turmaDisciplina.id_turma === turmaID && turmaDisciplina.id_disciplina === disciplinaID
  )
  if (turmaDisciplina) {
    res.json(turmaDisciplina)
  } else {
    res.status(404).json({ message: '見つかりません' })
  }
})
// 追加
app.post('/turma_disciplinas', (req, res) => {
  const newTurmaDisciplina = req.body
  connection.query(
    'INSERT INTO turma_disciplina (id_turma, id_disciplina) VALUES (?, ?)',
    [newTurmaDisciplina.id_turma, newTurmaDisciplina.id_disciplina],
    (err, result) => {
      if (err) {
        console.error('Error adding data to MySQL: ' + err)
        res.status(500).json({ message: 'turma_disciplinaを追加できませんでした' })
      } else {
        /* newTurmaDisciplina.id_turma = result.insertId */
        turmaDisciplinas.push(newTurmaDisciplina)
        res.status(201).json(newTurmaDisciplina)
      }
    }
  )
})
// 削除
app.delete('/turma_disciplinas/:id_turma/:id_disciplina', (req, res) => {
  const turmaID = parseInt(req.params.id_turma)
  const disciplinaID = parseInt(req.params.id_disciplina)
  const index = turmaDisciplinas.findIndex(
    turmaDisciplina => turmaDisciplina.id_turma === turmaID && turmaDisciplina.id_disciplina === disciplinaID
  )
  if (index !== -1) {
    connection.query(
      'DELETE FROM turma_disciplina WHERE id_turma=? AND id_disciplina=?',
      [turmaID, disciplinaID],
      err => {
        if (err) {
          console.error('turma_disciplinaテーブル - Erro ao excluir dados do MySQL: ' + err)
          res.status(500).json({ message: 'Não foi possível excluir' })
        } else {
          const removedTurmaDisciplina = turmaDisciplinas.splice(index, 1)
          res.json(removedTurmaDisciplina[0])
        }
      }
    )
  } else {
    res.status(404).json({ message: 'Não foi possível localizar' })
  }
})

///////////////////////////ENVIO DE EMAIL///////////////////////

// Rota para verificar se o email está cadastrado no banco de dados
app.post('/verificarEmail', (req, res) => {
  const { email } = req.body
  let sql

  if (email.endsWith('@uscsonline.com.br')) {
    sql = 'SELECT id_aluno AS id FROM Aluno WHERE email_aluno = ?'
  } else if (email.endsWith('@outlook.com')) {
    sql = 'SELECT id_prof AS id FROM Professor WHERE email_consti_prof = ?'
  } else {
    res.status(404).json({ message: 'Email não encontrado' })
    return
  }

  connection.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Erro ao consultar email no banco de dados:', err)
      res.status(500).json({ message: 'Erro interno do servidor' })
      return
    }

    if (results.length > 0) {
      res.json({ message: 'Email cadastrado' })
    } else {
      res.status(404).json({ message: 'Email não encontrado' })
    }
  })
})

app.post('/enviarEmailRedefinicao', (req, res) => {
  const { email } = req.body

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'teste.pim.uscs@gmail.com',
      pass: 'ozpykegrfsynjaxs'
    }
  })

  let sqlGetUserId
  let tokenTable

  if (email.endsWith('@uscsonline.com.br')) {
    sqlGetUserId = 'SELECT id_aluno AS id FROM Aluno WHERE email_aluno = ?'
    tokenTable = 'password_reset_tokens_aluno'
  } else if (email.endsWith('@outlook.com')) {
    sqlGetUserId = 'SELECT id_prof AS id FROM Professor WHERE email_consti_prof = ?'
    tokenTable = 'password_reset_tokens_professor'
  } else {
    res.status(404).json({ message: 'Usuário não encontrado com o email fornecido' })
    return
  }

  connection.query(sqlGetUserId, [email], (err, results) => {
    if (err) {
      console.error('Erro ao consultar ID do usuário no banco de dados:', err)
      res.status(500).json({ message: 'Erro interno do servidor' })
      return
    }

    if (results.length === 0) {
      res.status(404).json({ message: 'Usuário não encontrado com o email fornecido' })
      return
    }

    const userId = results[0].id
    const token = crypto.randomBytes(20).toString('hex')
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 30)

    const sqlInsertToken = `INSERT INTO ${tokenTable} (user_id, token, expires_at) VALUES (?, ?, ?)`
    connection.query(sqlInsertToken, [userId, token, expiresAt], (err, insertResult) => {
      if (err) {
        console.error('Erro ao inserir token no banco de dados:', err)
        res.status(500).send('Erro ao enviar o email de redefinição.')
        return
      }

      const resetPasswordURL = `http://127.0.0.1:5500/pages/reset-password/reset-password.html?token=${token}`
      const mailOptions = {
        from: 'teste.pim.uscs@gmail.com',
        to: email,
        subject: 'Redefinição de Senha',
        html: `
                  <p>Você solicitou a redefinição de senha. Clique no link abaixo para redefinir sua senha:</p>
                  <p><a href="${resetPasswordURL}">Redefinir Senha</a></p>
              `
      }

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error('Erro ao enviar o email de redefinição:', error)
          res.status(500).send('Erro ao enviar o email de redefinição.')
        } else {
          console.log('Email enviado:', info.response)
          res.status(200).send('Email enviado com sucesso.')
        }
      })
    })
  })
})

app.post('/redefinirSenha', (req, res) => {
  const { token, newPassword } = req.body

  const sqlSelectTokenAluno = 'SELECT * FROM password_reset_tokens_aluno WHERE token = ? AND expires_at > NOW()'
  const sqlSelectTokenProfessor = 'SELECT * FROM password_reset_tokens_professor WHERE token = ? AND expires_at > NOW()'

  const checkToken = sql => {
    return new Promise((resolve, reject) => {
      connection.query(sql, [token], (err, results) => {
        if (err) {
          return reject(err)
        }
        if (results.length === 0) {
          return resolve(null)
        }
        resolve(results[0])
      })
    })
  }

  const updatePassword = (table, userIdColumn, userId) => {
    return new Promise((resolve, reject) => {
      const sqlUpdatePassword = `UPDATE ${table} SET senha = ? WHERE ${userIdColumn} = ?`
      connection.query(sqlUpdatePassword, [newPassword, userId], (err, updateResult) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  const deleteToken = (table, tokenId) => {
    return new Promise((resolve, reject) => {
      const sqlDeleteToken = `DELETE FROM password_reset_tokens_${table} WHERE id = ?`
      connection.query(sqlDeleteToken, [tokenId], (err, deleteResult) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  const processPasswordReset = async () => {
    try {
      let tokenInfo = await checkToken(sqlSelectTokenAluno)
      if (tokenInfo) {
        await updatePassword('Aluno', 'id_aluno', tokenInfo.user_id)
        await deleteToken('aluno', tokenInfo.id)
        res.status(200).json({ message: 'Senha redefinida com sucesso' })
        return
      }

      tokenInfo = await checkToken(sqlSelectTokenProfessor)
      if (tokenInfo) {
        await updatePassword('Professor', 'id_prof', tokenInfo.user_id)
        await deleteToken('professor', tokenInfo.id)
        res.status(200).json({ message: 'Senha redefinida com sucesso' })
        return
      }

      res.status(400).json({ message: 'Token inválido ou expirado' })
    } catch (err) {
      console.error('Erro no processo de redefinição de senha:', err)
      res.status(500).json({ message: 'Erro interno do servidor' })
    }
  }

  processPasswordReset()
})

/////////////////////////LOGIN//////////////////////////////////

// Rota para autenticação de login
app.post('/api/teste', (req, res) => {
  const { email, password } = req.body

  // Verifica se email e senha foram fornecidos
  if (!email || !password) {
    res.status(400).json({ message: 'Email e senha são obrigatórios' })
    return
  }

  // Consulta SQL para verificar as credenciais
  let sql
  let params

  if (email.endsWith('@uscsonline.com.br')) {
    // Verifica no banco de dados dos Alunos
    sql = `SELECT * FROM Aluno WHERE email_aluno = ? AND senha = ?`
    params = [email, password]
  } else if (email.endsWith('@outlook.com')) {
    // Verifica no banco de dados dos Professores
    sql = `SELECT * FROM Professor WHERE email_consti_prof = ? AND senha = ?`
    params = [email, password]
  } else {
    res.status(401).json({ success: false, message: 'Credenciais inválidas' })
    return
  }

  connection.query(sql, params, (err, results) => {
    if (err) {
      console.error('Erro ao executar consulta SQL:', err)
      res.status(500).json({ message: 'Erro interno do servidor' })
      return
    }

    // Verifica se encontrou um usuário com as credenciais fornecidas
    if (results.length > 0) {
      // Se as credenciais forem válidas, envia uma resposta de sucesso
      res.status(200).json({ success: true })
    } else {
      // Se as credenciais forem inválidas, envia uma resposta indicando isso
      res.status(401).json({ success: false, message: 'Credenciais inválidas' })
    }
  })
})

app.listen(port, () => {
  console.log(`ポート${port}でサーバーが開始されました / Servidor iniciado na porta ${port}`)
})
