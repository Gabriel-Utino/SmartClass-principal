// controllers/turmaController.js
const db = require('../db'); // 既存のDB接続ファイルを使用

// すべてのTurmaを取得
exports.getAllTurmas = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM turma');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// 特定のTurmaをIDで取得
exports.getTurmaById = (req, res) => {
  const turmaID = parseInt(req.params.id_turma);
  db.query('SELECT * FROM Turma WHERE id_turma = ?', [turmaID], (err, results) => {
    if (err) {
      console.error('Turma取得エラー: ' + err);
      res.status(500).json({ message: 'データベースからTurmaを取得できませんでした' });
    } else if (results.length === 0) {
      res.status(404).json({ message: '該当するTurmaが見つかりませんでした' });
    } else {
      res.json(results[0]);
    }
  });
};

// Turmaを追加
exports.addTurma = (req, res) => {
  const { nome_turma, ano_letivo } = req.body;
  db.query(
    'INSERT INTO Turma (nome_turma, ano_letivo) VALUES (?, ?)',
    [nome_turma, ano_letivo],
    (err, result) => {
      if (err) {
        console.error('Turma追加エラー: ' + err);
        res.status(500).json({ message: 'データベースにTurmaを追加できませんでした' });
      } else {
        res.status(201).json({ id_turma: result.insertId, nome_turma, ano_letivo });
      }
    }
  );
};

// Turmaを更新
exports.updateTurma = (req, res) => {
  const id_turma = parseInt(req.params.id_turma);
  const { nome_turma, ano_letivo } = req.body;
  db.query(
    'UPDATE Turma SET nome_turma = ?, ano_letivo = ?, WHERE id_turma = ?',
    [nome_turma, ano_letivo, id_turma],
    (err, result) => {
      if (err) {
        console.error('Turma更新エラー: ' + err);
        res.status(500).json({ message: 'データベースでTurmaを更新できませんでした' });
      } else {
        res.json({ message: 'Turmaが更新されました' });
      }
    }
  );
};

// Turmaを削除
exports.deleteTurma = (req, res) => {
  const id_turma = parseInt(req.params.id_turma);
  db.query('DELETE FROM Turma WHERE id_turma = ?', [id_turma], (err) => {
    if (err) {
      console.error('Turma削除エラー: ' + err);
      res.status(500).json({ message: 'データベースからTurmaを削除できませんでした' });
    } else {
      res.json({ message: 'Turmaが削除されました' });
    }
  });
};


// 特定の turmaId に関連する disciplinas を取得する関数
exports.getTurmaDisciplinas = async (req, res) => {
  const { turmaId  } = req.params; // Turma ID
  try {
      const [disciplina] = await db.query(`
          SELECT d.*
          FROM disciplina d
          JOIN turma_disciplina td ON td.id_disciplina  = d.id_disciplina 
          WHERE td.id_turma = ?
      `, [turmaId]);

      console.log('Disciplinas found:', disciplina); // データの確認
      res.json(disciplina);
  } catch (error) {
      console.error('Error retrieving disciplinas for turma:', error);
      res.status(500).json({ message: 'Error retrieving disciplinas' });
  }
};