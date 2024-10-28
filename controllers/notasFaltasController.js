// notasFaltasController.js

const pool = require('../db'); // データベース接続

// 特定の生徒の全ての成績を取得
exports.getNotas = async (req, res) => {
    const id_aluno  = req.params.id_aluno;
    try {
        const [rows] = await pool.query('SELECT * FROM notas_faltas WHERE id_aluno = ?', [id_aluno]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'データの取得中にエラーが発生しました。' });
    }
};

// 特定の生徒の特定の学年・学期の成績を取得
exports.getNotasByAnoESemestre = async (req, res) => {
    const { id_aluno , ano_academico, semestre } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT * FROM notas_faltas WHERE id_aluno = ? AND ano_academico = ? AND semestre = ?',
            [id_aluno , ano_academico, semestre]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'データの取得中にエラーが発生しました。' });
    }
};

// 成績を更新
exports.updateNota = async (req, res) => {
    const id_notas_faltas = req.params.id_notas_faltas;
    const { nota, faltas } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE notas_faltas SET nota = ?, faltas = ? WHERE id_notas_faltas = ?',
            [nota, faltas, id_notas_faltas]
        );
        if (result.affectedRows === 0) {
            res.status(404).json({ error: '成績が見つかりません。' });
        } else {
            res.json({ message: '成績が更新されました。' });
        }
    } catch (error) {
        res.status(500).json({ error: 'データの更新中にエラーが発生しました。' });
    }
};

// 新しい成績を追加
exports.addNota = async (req, res) => {
    const { id_aluno , nota, faltas, ano_academico, semestre } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO notas_faltas (id_aluno, nota, faltas, ano_academico, semestre) VALUES (?, ?, ?, ?, ?)',
            [id_aluno , nota, faltas, ano_academico, semestre]
        );
        res.status(201).json({ message: '成績が追加されました。', id_notas_faltas: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'データの追加中にエラーが発生しました。' });
    }
};

// 成績を削除
exports.deleteNota = async (req, res) => {
    const id_notas_faltas = req.params.id_notas_faltas;
    try {
        const [result] = await pool.query('DELETE FROM notas_faltas WHERE id = ?', [id_notas_faltas]);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: '成績が見つかりません。' });
        } else {
            res.json({ message: '成績が削除されました。' });
        }
    } catch (error) {
        res.status(500).json({ error: 'データの削除中にエラーが発生しました。' });
    }
};
