const Router = require('express');
const router = new Router();
const menuItemController = require('../controllers/menuItemController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, menuItemController.getAll);
router.post('/', authMiddleware, menuItemController.create);
router.get('/:id', authMiddleware, menuItemController.getOne);
router.put('/:id', authMiddleware, menuItemController.update);
router.delete('/:id', authMiddleware, menuItemController.delete);

module.exports = router;
