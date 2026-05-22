const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const authController = require('../controllers/authController');
const pratoController = require('../controllers/pratoController');
const cardapioDiaController = require('../controllers/cardapioDiaController');
const { adminRequired, redirectLoggedAdmin } = require('../middlewares/authMiddleware');
const uploadImage = require('../middlewares/uploadMiddleware');

router.get('/', publicController.home);

router.get('/admin/setup', authController.setupPage);
router.post('/admin/setup', authController.setup);
router.get('/admin/login', redirectLoggedAdmin, authController.loginPage);
router.post('/admin/login', redirectLoggedAdmin, authController.login);
router.get('/admin/logout', adminRequired, authController.logout);

router.get('/admin', adminRequired, (req, res) => res.redirect('/admin/cardapio'));

router.get('/admin/pratos', adminRequired, pratoController.index);
router.get('/admin/pratos/novo', adminRequired, pratoController.novoPage);
router.post('/admin/pratos/novo', adminRequired, uploadImage, pratoController.criar);
router.get('/admin/pratos/editar/:id', adminRequired, pratoController.editarPage);
router.post('/admin/pratos/editar/:id', adminRequired, uploadImage, pratoController.atualizar);
router.post('/admin/pratos/excluir/:id', adminRequired, pratoController.excluir);
 
router.get('/admin/cardapio', adminRequired, cardapioDiaController.index);
router.post('/admin/cardapio/adicionar', adminRequired, cardapioDiaController.adicionar);
router.post('/admin/cardapio/editar-item/:id', adminRequired, cardapioDiaController.editarItem);
router.post('/admin/cardapio/remover-item/:id', adminRequired, cardapioDiaController.removerItem);

module.exports = router;
