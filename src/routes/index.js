const express = require('express')
const router = express.Router()


const UserController = require('../controllers/userController')
const PontoController = require('../controllers/pontoController')
const ConfirmacaoController = require('../controllers/confirmacaoController')
const Auth = require('../middleware/Auth')

router.post('/signin', UserController.signin);
router.post('/signup', UserController.signup);

router.post('/validar', Auth.validar);

router.post('/buscar_ponto', Auth.validar, PontoController.buscar_ponto);
router.post('/buscar_periodo', Auth.validar, PontoController.buscar_periodo)

router.post('/salvar_ponto', PontoController.registrar)

router.get('/auth/:hash',ConfirmacaoController.home)



module.exports =  router;