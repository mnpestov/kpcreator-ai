const Router = require('express');
const router = new Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, eventController.getAll);
router.get('/:id', authMiddleware, eventController.getOne);
router.post('/', authMiddleware, eventController.create);
router.put('/:id', authMiddleware, eventController.update);
router.post('/:id/propagate', authMiddleware, eventController.propagate);
router.delete('/:id', authMiddleware, eventController.delete);

module.exports = router;
