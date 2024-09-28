// ミドルウェア: authenticateToken.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) return res.sendStatus(401); // トークンがない場合

  jwt.verify(token, 'あなたのシークレットキー', (err, user) => {
    if (err) return res.sendStatus(403); // トークンが無効の場合
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
