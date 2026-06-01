const Router = require('express');
const router = new Router();
const organisationController = require('../controllers/organisationController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, organisationController.getAll);
router.get('/:id', authMiddleware, organisationController.getOne);
router.post('/', authMiddleware, organisationController.create);
router.put('/:id', authMiddleware, organisationController.update);
router.delete('/:id', authMiddleware, organisationController.delete);

module.exports = router;
