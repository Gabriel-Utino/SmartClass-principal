const db = require('../models/db'); // データベース接続をインポート

// 欠席データを取得
exports.getFaltas = async (req, res) => {
    try {
        const students = await db.query(`
            SELECT a.id_aluno, a.nome, fd.data_falta, fd.justificado 
            FROM aluno a 
            LEFT JOIN faltas_detalhes fd ON a.id_aluno = fd.id_notas_faltas
            ORDER BY a.id_aluno, fd.data_falta;
        `);
        res.render('apricarFaltas', { students }); // EJSテンプレートにデータを渡す
    } catch (error) {
        console.error(error);
        res.status(500).send('サーバーエラー');
    }
};

// 日付を追加
exports.addDate = async (req, res) => {
    try {
        const { data_falta } = req.body;

        // 各生徒にデフォルトの出席データを追加
        const alunos = await db.query('SELECT id_aluno FROM aluno');
        for (const aluno of alunos) {
            await db.query(`
                INSERT INTO faltas_detalhes (id_notas_faltas, data_falta, justificado)
                VALUES (?, ?, 1)
            `, [aluno.id_aluno, data_falta]);
        }

        res.status(200).send('新しい日付が追加されました');
    } catch (error) {
        console.error(error);
        res.status(500).send('エラーが発生しました');
    }
};
