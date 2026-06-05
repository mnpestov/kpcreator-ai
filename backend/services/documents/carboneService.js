const carbone = require('carbone');
const fs = require('fs').promises;
const path = require('path');

/**
 * Promise-based wrapper for Carbone rendering engine.
 */
const render = async (templateName, data) => {
    const templatePath = path.join(__dirname, '../../templates', templateName);

    try {
        // 1. Check if template exists
        await fs.access(templatePath);
    } catch (err) {
        throw new Error(`Template not found: ${templateName}`);
    }

    return new Promise((resolve, reject) => {
        // 2. Render the template
        carbone.render(templatePath, data, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

module.exports = {
    render
};
