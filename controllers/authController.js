// controllers/authController.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../db');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const User = require('../models/User'); // ユーザーモデルを読み込み
const baseURL = process.env.BASE_URL || 'http://localhost:5000'; 

// SendGridのAPIキー設定
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ログイン処理
exports.login = async (req, res) => {
  const { email_usuario, senha } = req.body;

  try {
    const user = await User.findByEmail(email_usuario);

    if (!user) {
      req.flash('error', 'E-mail ou senha estão incorretos');
      return res.redirect('/login');
    }

    const match = await bcrypt.compare(senha, user.senha);

    if (!match) {
      req.flash('error', 'E-mail ou senha estão incorretos');
      return res.redirect('/login');
    }

    req.session.user = {
      id_usuario: user.id_usuario,
      nome_usuario: user.nome_usuario,
      cpf_usuario: user.cpf_usuario,
      endereco_usuario: user.endereco_usuario,
      telefone_usuario: user.telefone_usuario,
      email_usuario: user.email_usuario,
      nascimento_usuario: user.nascimento_usuario,
      id_perfil: user.id_perfil,
      id_aluno: user.id_aluno,
      ra_aluno: user.ra_aluno, // Alunoの情報を追加
      data_matricula: user.data_matricula,
      id_turma: user.id_turma,
      id_responsavel: user.id_responsavel,
      id_professor: user.id_professor,
      foto: user.foto
    };

    res.redirect('/home');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro do servidor');
  }
};

// ログアウト処理
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/home');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
};

// ユーザー登録処理
exports.register = async (req, res) => {
  const { nome_usuario, cpf_usuario, email_usuario, senha } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    await User.create({
      nome_usuario,
      cpf_usuario,
      email_usuario,
      senha: hashedPassword,
      id_perfil: 3
    });

    res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Ocorreu um erro durante o registro');
    res.redirect('/register');
  }
};

// パスワードリセットフォームを表示
exports.getForgotPassword = (req, res) => {
  const error = req.flash('error') || '';
  const info = req.flash('info') || '';
  res.render('forgot-password', { error, info });
};

// パスワードリセットリクエストの処理
exports.postForgotPassword = (req, res, next) => {
  const { email_usuario } = req.body;

  // リセットトークンを生成
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Ocorreu um erro ao redefinir sua senha');
      return res.redirect('/forgot-password');
    }
    const token = buffer.toString('hex');

    try {
      // ユーザーを検索してリセットトークンと有効期限を保存
      const user = await User.findByEmail(email_usuario);
      if (!user) {
        req.flash('error', 'Nenhum usuário encontrado com esse endereço de e-mail');
        return res.redirect('/forgot-password');
      }

      const expiration = new Date(Date.now() + 3600000); // 1時間後
      await User.saveResetToken(user.id_usuario, token, expiration);

      // リセットリンクをメールで送信
      const resetURL = `${baseURL}/reset-password/${token}`;
      const msg = {
        to: email_usuario,
        from: process.env.SENDGRID_SENDER, // SendGridで認証済みの送信元メールアドレス
        subject: 'Redefinição de senha',
        html: `
          <p>Você solicitou uma redefinição de senha.</p>
          <p>Clique no link abaixo para definir uma nova senha.</p>
          <a href="${resetURL}">link de redefinição de senha</a>
          <p>Este link irá expirar em 1 hora.</p>
        `
      };

      await sgMail.send(msg);

      req.flash('info', 'Enviamos a você um link de redefinição por e-mail.');
      res.redirect('/login');
    } catch (error) {
      console.log('SendGrid Erro:', error.response ? error.response.body : error);
      req.flash('error', 'Ocorreu um erro ao redefinir sua senha');
      res.redirect('/forgot-password');
    }
  });
};

// パスワードリセットページを表示
exports.getResetPassword = async (req, res, next) => {
  const token = req.params.token;
  try {
    const user = await User.findByResetToken(token);
    if (!user) {
      req.flash('error', 'O token de redefinição é inválido ou expirou.');
      return res.redirect('/forgot-password');
    }
    res.render('reset-password', { userId: user.id_usuario, token: token, message: req.flash('error') });
  } catch (err) {
    console.log(err);
    req.flash('error', 'Ocorreu um erro ao recuperar a página de redefinição de senha');
    res.redirect('/forgot-password');
  }
};

// 新しいパスワードの保存
exports.postResetPassword = async (req, res, next) => {
  const { userId, password, token } = req.body;

  try {
    const user = await User.findByResetToken(token);
    if (!user || user.id_usuario !== parseInt(userId, 10)) {
      req.flash('error', 'O token de redefinição é inválido ou expirou.');
      return res.redirect('/forgot-password');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.updatePassword(userId, hashedPassword);

    req.flash('info', 'Sua senha foi redefinida. Faça login novamente.');
    res.redirect('/login');
  } catch (err) {
    console.log(err);
    req.flash('error', 'Ocorreu um erro ao redefinir sua senha');
    res.redirect('/forgot-password');
  }
};
