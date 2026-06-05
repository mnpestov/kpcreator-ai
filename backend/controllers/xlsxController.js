const xlsxExportService = require('../services/exports/xlsxExportService');
const ApiError = require('../errors/ApiError');

class XlsxController {
    async exportKpXlsx(req, res, next) {
        try {
            const { kpNumber } = req.params;

            const { buffer, fileName } = await xlsxExportService.generateKpXlsx(kpNumber);

            // Set headers for file download
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(fileName)}`);
            
            return res.send(buffer);

        } catch (err) {
            console.error('XLSX Export Error:', err);
            if (err.message === 'KP not found') {
                return next(ApiError.badRequest('КП не найден'));
            }
            if (err.message.includes('Template not found')) {
                return next(ApiError.internal('Ошибка сервера: шаблон документа не найден'));
            }
            next(ApiError.internal('Ошибка при формировании документа'));
        }
    }
}

module.exports = new XlsxController();
