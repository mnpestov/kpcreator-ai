const Router = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = new Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/check', authMiddleware, authController.check);

module.exports = router;
