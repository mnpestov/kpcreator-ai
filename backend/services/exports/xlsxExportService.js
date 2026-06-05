const kpService = require('../kpService');
const documentBuilder = require('../documents/documentBuilder');
const carboneService = require('../documents/carboneService');
const { User } = require('../../models/models');

/**
 * Orchestrates the XLSX export process.
 */
const generateKpXlsx = async (kpNumber) => {
    // 1. Load data from DB
    const kp = await kpService.loadKpByNumber(kpNumber);
    if (!kp) {
        throw new Error('KP not found');
    }

    // 2. If manager is missing, try to find a fallback (e.g. Mikhail Pestov)
    if (!kp.managerId) {
        const fallbackManager = await User.findOne({ order: [['id', 'ASC']] });
        if (fallbackManager) {
            kp.manager = fallbackManager;
        }
    }

    // 3. Build DocumentModel (agnostic JSON)
    const docModel = documentBuilder.buildDocumentModel(kp);

    // 4. Render via Carbone
    const report = await carboneService.render('kp-v1.xlsx', docModel);

    return {
        buffer: report,
        fileName: `KP_${kpNumber}.xlsx`
    };
};

module.exports = {
    generateKpXlsx
};
