const { User } = require('../models/models');

class PdfDeliveryError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

const GATEWAY_BASE_URL = process.env.TELEGRAM_GATEWAY_BASE_URL;
const GATEWAY_API_KEY = process.env.TELEGRAM_GATEWAY_API_KEY;

// Единственная точка интеграции с Telegram Gateway.
// Backend не обращается к Telegram Bot API напрямую — только к Gateway.
async function sendPdf({ kpNumber, buffer, fileName, userId }) {
    if (!GATEWAY_BASE_URL || !GATEWAY_API_KEY) {
        throw new PdfDeliveryError(500, 'Telegram Gateway не сконфигурирован');
    }

    const user = await User.findByPk(userId);
    if (!user?.telegramId) {
        throw new PdfDeliveryError(409, 'Ваш аккаунт не привязан к Telegram');
    }

    const form = new FormData();
    form.append('chatId', user.telegramId);
    form.append('caption', `КП № ${kpNumber}`);
    form.append('document', new Blob([buffer], { type: 'application/pdf' }), fileName);

    let response;
    try {
        response = await fetch(`${GATEWAY_BASE_URL}/send-document`, {
            method: 'POST',
            headers: { 'X-Gateway-Key': GATEWAY_API_KEY },
            body: form
        });
    } catch (err) {
        throw new PdfDeliveryError(502, 'Telegram Gateway недоступен');
    }

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.ok) {
        throw new PdfDeliveryError(502, 'Не удалось отправить PDF через Telegram Gateway');
    }

    return data;
}

module.exports = {
    sendPdf,
    PdfDeliveryError
};
