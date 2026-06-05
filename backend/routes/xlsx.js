const Router = require('express');
const router = new Router();
const xlsxController = require('../controllers/xlsxController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:kpNumber/export/xlsx', authMiddleware, xlsxController.exportKpXlsx);

module.exports = router;
