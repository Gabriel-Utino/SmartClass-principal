// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { ensureAuthenticated, authorizeRoles } = require('../middleware/authorize');

// 認証関連のルート
router.get('/login', (req, res) => res.render('login', { message: req.flash('error') }));
/* router.get('/register', (req, res) => res.render('register', { message: req.flash('error') })); */
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/logout', authController.logout);


// **ユーザー登録ルートを秘書と管理者に限定**
router.get('/register', ensureAuthenticated, authorizeRoles(5, 1), (req, res) => res.render('register', { message: req.flash('error') }));
router.post('/register', ensureAuthenticated, authorizeRoles(5, 1), authController.register);

// paginas
router.get('/calendario', (req, res) => {
    res.render('calendario', { user: req.session.user }) // views/apricarFaltas.ejs
});
router.get('/apricarFaltas', ensureAuthenticated, authorizeRoles(2), (req, res) => {
    res.render('apricarFaltas', { user: req.session.user }) // views/apricarFaltas.ejs
})
router.get('/apricarNotas', ensureAuthenticated, authorizeRoles(2), (req, res) => {
    res.render('apricarNotas', { user: req.session.user }) // views/apricarNotas.ejs
})


router.get('/variFaltas', ensureAuthenticated, authorizeRoles(3), (req, res) => {
    res.render('variFaltas', { user: req.session.user }) // views/variFaltas.ejs
})
router.get('/variNotas', ensureAuthenticated, authorizeRoles(3), (req, res) => {
    res.render('variNotas', { user: req.session.user }) // views/variNotas.ejs
})

router.get('/turma', ensureAuthenticated, authorizeRoles(5, 1), (req, res) => {
  res.render('turma', { user: req.session.user }) // views/turma.ejs
})
router.get('/disciplina', ensureAuthenticated, authorizeRoles(5, 1), (req, res) => {
  res.render('disciplina', { user: req.session.user }) // views/disciplina.ejs
})
router.get('/aluno', ensureAuthenticated, authorizeRoles(5, 1), (req, res) => {
  res.render('aluno', { user: req.session.user }) // views/aluno.ejs
})
router.get('/responsavel', ensureAuthenticated, authorizeRoles(5, 1), (req, res) => {
  res.render('responsavel', { user: req.session.user }) // views/responsavel.ejs
})
router.get('/organizacao', ensureAuthenticated, authorizeRoles(5, 1), (req, res) => {
  res.render('organizacao', { user: req.session.user }) // views/organizacao.ejs
})
router.get('/professor', ensureAuthenticated, authorizeRoles(5, 1), (req, res) => {
  res.render('professor', { user: req.session.user }) // views/professor.ejs
})

// パスワードリセット関連のルート
router.get('/forgot-password', authController.getForgotPassword);
router.post('/forgot-password', authController.postForgotPassword);
router.get('/reset-password/:token', authController.getResetPassword);
router.post('/reset-password/:token', authController.postResetPassword);

module.exports = router;
