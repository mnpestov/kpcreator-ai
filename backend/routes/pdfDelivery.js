const Router = require('express');
const router = new Router();
const multer = require('multer');
const pdfDeliveryController = require('../controllers/pdfDeliveryController');
const authMiddleware = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/:kpNumber/send-pdf', authMiddleware, upload.single('pdf'), pdfDeliveryController.sendPdf);

module.exports = router;
