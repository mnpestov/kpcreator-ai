const pdfDeliveryService = require('../services/pdfDeliveryService');
const ApiError = require('../errors/ApiError');

class PdfDeliveryController {
    async sendPdf(req, res, next) {
        try {
            const { kpNumber } = req.params;

            if (!req.file) {
                return next(ApiError.badRequest('Файл PDF не передан'));
            }

            await pdfDeliveryService.sendPdf({
                kpNumber,
                buffer: req.file.buffer,
                fileName: req.file.originalname,
                userId: req.user.id
            });

            return res.json({ message: 'PDF отправлен' });
        } catch (err) {
            if (err instanceof pdfDeliveryService.PdfDeliveryError) {
                return res.status(err.status).json({ message: err.message });
            }
            next(ApiError.internal('Ошибка при отправке PDF'));
        }
    }
}

module.exports = new PdfDeliveryController();
