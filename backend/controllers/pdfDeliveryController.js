const pdfDeliveryService = require('../services/pdfDeliveryService');
const ApiError = require('../errors/ApiError');

class PdfDeliveryController {
    async sendPdf(req, res, next) {
        try {
            const { kpNumber } = req.params;

            if (!req.file) {
                return next(ApiError.badRequest('Файл не передан'));
            }

            // multer/busboy декодируют filename из multipart как latin1 (RFC 2388),
            // хотя браузер шлёт UTF-8 — возвращаем исходные байты.
            const fileName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');

            await pdfDeliveryService.sendPdf({
                kpNumber,
                buffer: req.file.buffer,
                fileName,
                mimeType: req.file.mimetype,
                caption: req.body.caption,
                userId: req.user.id
            });

            return res.json({ message: 'Файл отправлен' });
        } catch (err) {
            if (err instanceof pdfDeliveryService.PdfDeliveryError) {
                return res.status(err.status).json({ message: err.message });
            }
            next(ApiError.internal('Ошибка при отправке файла'));
        }
    }
}

module.exports = new PdfDeliveryController();
