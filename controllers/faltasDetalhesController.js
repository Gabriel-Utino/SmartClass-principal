// controllers/faltasDetalhesController.js 
const db = require('../db');

// 新しい欠席データを追加
exports.addFaltaDetalhes = async (req, res) => {
    const { id_notas_faltas, data_falta, justificado } = req.body;
    try {
        await db.query(
            'INSERT INTO faltas_detalhes (id_notas_faltas, data_falta, justificado) VALUES (?, ?, ?)',
            [id_notas_faltas, data_falta, justificado]
        );
        res.status(201).json({ message: '欠席データが追加されました' });
    } catch (error) {
        console.error('Error adding falta detalhe:', error);
        res.status(500).json({ message: '欠席データを追加できませんでした' });
    }
};

// 特定の生徒の欠席データを取得
exports.getFaltasDetalhes = async (req, res) => {
    const { id_notas_faltas } = req.params;
    try {
        const [results] = await db.query(
            'SELECT * FROM faltas_detalhes WHERE id_notas_faltas = ?',
            [id_notas_faltas]
        );
        res.json(results);
    } catch (error) {
        console.error('Error fetching falta detalhes:', error);
        res.status(500).json({ message: '欠席データを取得できませんでした' });
    }
};
