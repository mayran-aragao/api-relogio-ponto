const express = require('express')
const router = express.Router()


const UserController = require('../controllers/userController')
const PontoController = require('../controllers/pontoController')
const ConfirmacaoController = require('../controllers/confirmacaoController')
const AuthController =  require ('../controllers/authController')
const Auth = require('../middleware/Auth')

router.post('/login', UserController.login);

router.post('/signin', UserController.signin);
router.post('/signup', UserController.signup);
router.post('/add_photo',Auth.private, UserController.add_photo);
router.post('/take_photo',Auth.private, UserController.take_photo);
router.post('/salvar_localizacao',Auth.private, UserController.save_location);
router.post('/buscar_localizacao',Auth.private, UserController.get_location);
router.post('/bloquear',Auth.private, UserController.bloquear);
router.post('/liberar',Auth.private, UserController.liberar);
router.post('/buscar_funcionarios', Auth.private, UserController.buscar_funcionarios)

router.post('/validar', AuthController.validar);

router.post('/buscar_todos', Auth.private, PontoController.buscar_todos)
router.post('/buscar_periodo', Auth.private, PontoController.buscar_periodo)
router.post('/buscar_nsr', Auth.private, PontoController.buscar_nsr)

router.post('/salvar_ponto', Auth.private, PontoController.salvar_ponto)

router.get('/auth/:hash',ConfirmacaoController.home)



module.exports =  router;