const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController');
const { ensureAuthenticated, authorizeRoles } = require('../middleware/authorize');

// ルートにGETリクエストが来た時の処理
router.get('/', (req, res) => {
  res.send('Welcome to the application!')
})

// その他のルートの設定もここに追加できます
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

router.get('/turma', ensureAuthenticated, authorizeRoles(1, 5), (req, res) => {
  res.render('turma', { user: req.session.user }) // views/turma.ejs
})
router.get('/disciplina', ensureAuthenticated, authorizeRoles(1, 5), (req, res) => {
  res.render('disciplina', { user: req.session.user }) // views/disciplina.ejs
})
router.get('/aluno', ensureAuthenticated, authorizeRoles(1, 5), (req, res) => {
  res.render('aluno', { user: req.session.user }) // views/aluno.ejs
})
router.get('/responsavel', ensureAuthenticated, authorizeRoles(1, 5), (req, res) => {
  res.render('responsavel', { user: req.session.user }) // views/responsavel.ejs
})
router.get('/organizacao', ensureAuthenticated, authorizeRoles(1, 5), (req, res) => {
  res.render('organizacao', { user: req.session.user }) // views/organizacao.ejs
})
router.get('/professor', ensureAuthenticated, authorizeRoles(1, 5), (req, res) => {
  res.render('professor', { user: req.session.user }) // views/professor.ejs
})

module.exports = router
