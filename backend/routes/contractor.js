const Router = require('express');
const router = new Router();
const contractorController = require('../controllers/contractorController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, contractorController.getAll);
router.get('/:id', authMiddleware, contractorController.getOne);
router.post('/', authMiddleware, contractorController.create);
router.put('/:id', authMiddleware, contractorController.update);
router.delete('/:id', authMiddleware, contractorController.delete);

module.exports = router;
