const Router = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = new Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/check', authMiddleware, authController.check);
router.post('/telegram', authController.telegramAuth);
router.post('/telegram/bind', authController.telegramBind);

module.exports = router;
