// controllers/cadastrarUsuario.js
const db = require('../config/database'); 

// 
exports.getAllUsuario = async (req, res) => {
    // como pegar dado do banco de dados 
  try {
    const [rows] = await connection.query('SELECT * FROM usuario;');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching data from Disciplina: ' + err);
    res.status(500).json({ message: 'Error fetching disciplinas' });
  }
};

