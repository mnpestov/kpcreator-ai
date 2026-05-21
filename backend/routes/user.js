const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/fileMiddleware');

router.get('/me', authMiddleware, userController.getUser);
router.patch('/profile', authMiddleware, userController.updateProfile);
router.post('/upload-avatar',authMiddleware,upload.single('avatar'),userController.uploadAvatar);

module.exports = router;
