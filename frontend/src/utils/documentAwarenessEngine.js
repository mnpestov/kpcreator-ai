export const PAGE_BUDGET = 900;
export const BASE_ROW_HEIGHT = 52;
export const TITLE_LINE_HEIGHT = 22;
export const DESC_LINE_HEIGHT = 18;
export const WEIGHT_LINE_BONUS = 14;
export const SHEET_HEADER_HEIGHT = 64;
export const SHEET_FOOTER_HEIGHT = 48;
// Fixed PDF typography constants instead of responsive viewport ones
export const PDF_CHARS_PER_LINE_TITLE = 30;
export const PDF_CHARS_PER_LINE_DESC = 50; // Calibrated to real PDF wrapping (~50 chars per line)

export const THRESHOLD_FILLING = 0.7; // Unused directly now
export const THRESHOLD_TIGHT = 0.9; // Unused directly now

export const estimateRowHeight = (row) => {
    let uiVisualHeight = BASE_ROW_HEIGHT;
    let pdfSemanticHeight = BASE_ROW_HEIGHT;

    if (row.product) {
        const titleLines = Math.ceil(row.product.length / PDF_CHARS_PER_LINE_TITLE);
        const titleH = Math.max(1, titleLines) * TITLE_LINE_HEIGHT;
        uiVisualHeight += titleH;
        pdfSemanticHeight += titleH;
    } else {
        uiVisualHeight += TITLE_LINE_HEIGHT;
        pdfSemanticHeight += TITLE_LINE_HEIGHT;
    }

    let descLines = 0;
    if (row.composition) {
        descLines = Math.ceil(row.composition.length / PDF_CHARS_PER_LINE_DESC);
        uiVisualHeight += descLines * DESC_LINE_HEIGHT;
        
        // Smooth and linear PDF semantic growth for descriptions
        let descRiskH = descLines * DESC_LINE_HEIGHT;
        
        // Additional wrapped lines add only a small amount of extra semantic height (+15% per extra line)
        if (descLines >= 2) {
            descRiskH += (descLines - 1) * (DESC_LINE_HEIGHT * 0.15);
        }
        
        pdfSemanticHeight += descRiskH;
        
        // VERY_LONG_DESCRIPTION_INLINE_PENALTY
        // In the real PDF, title and description flow INLINE together. 
        // When descriptions are extremely long (4+ lines), the typography saturates and vertical rhythm 
        // compresses unpredictably, significantly increasing semantic density.
        if (descLines > 3) {
            let inlinePenalty = 0;
            if (descLines === 4) {
                inlinePenalty = DESC_LINE_HEIGHT * 0.8; // Tiny penalty for the 4th line
            } else {
                // Progressive escalation for 5th+ lines
                inlinePenalty = (DESC_LINE_HEIGHT * 0.8) + ((descLines - 4) * (DESC_LINE_HEIGHT * 1.8));
            }
            pdfSemanticHeight += inlinePenalty;
        }
    }

    // Weight doesn't cause unpredictable mobile wrapping in fixed PDF layout

    return { uiVisualHeight, pdfSemanticHeight, descLines };
};

export const estimateSheetHeight = (sheet) => {
    if (!sheet || !sheet.rows) return { uiVisualHeight: 0, pdfSemanticHeight: 0, pdfFillRatio: 0, uiFillRatio: 0 };
    
    let totalUiHeight = SHEET_HEADER_HEIGHT;
    let totalPdfHeight = SHEET_HEADER_HEIGHT;
    let totalDescLines = 0;
    
    for (const row of sheet.rows) {
        const est = estimateRowHeight(row);
        totalUiHeight += est.uiVisualHeight;
        totalPdfHeight += est.pdfSemanticHeight;
        totalDescLines += est.descLines;
    }
    
    totalUiHeight += SHEET_FOOTER_HEIGHT;
    totalPdfHeight += SHEET_FOOTER_HEIGHT;

    // Density Escalation Layer
    const rowCount = sheet.rows.length;
    if (rowCount > 0) {
        // Average raw content height per row (using semantic PDF height)
        const avgPdfHeight = (totalPdfHeight - SHEET_HEADER_HEIGHT - SHEET_FOOTER_HEIGHT) / rowCount;
        const avgDescLines = totalDescLines / rowCount;
        
        let escalationFactor = 1.0;
        
        // 1. Loss of whitespace (many rows)
        // Each row past 5 adds a compounding 2.5% risk penalty due to padding/borders stacking
        if (rowCount > 5) {
            escalationFactor += (rowCount - 5) * 0.025;
        }
        
        // 2. Thick blocks saturation (several medium/large rows)
        // If we have several rows and they are consistently tall, the layout feels overcompressed
        if (rowCount >= 3 && avgPdfHeight > 70) {
            escalationFactor += 0.08;
        }
        
        // 3. Text wall saturation (dense multiline descriptions)
        // If the average row has 2+ lines of description, text density saturates the PDF
        if (rowCount >= 3 && avgDescLines >= 1.5) {
            escalationFactor += 0.05;
        }
        
        totalPdfHeight *= escalationFactor;
    }
    
    const uiFillRatio = totalUiHeight / PAGE_BUDGET;
    const pdfFillRatio = totalPdfHeight / PAGE_BUDGET;

    return { uiVisualHeight: totalUiHeight, pdfSemanticHeight: totalPdfHeight, pdfFillRatio, uiFillRatio };
};

export const getSheetStatus = (pdfFillRatio) => {
    if (pdfFillRatio >= 0.98) {
        return 'tight'; // OVERFLOW_RISK
    }
    if (pdfFillRatio >= 0.85) {
        return 'filling';
    }
    return 'comfortable';
};

/**
 * Returns a soft operational hint for the user based on sheet status.
 */
export const getHintText = (status) => {
    switch (status) {
        case 'tight':
            return 'Часть позиций может не поместиться в PDF';
        case 'filling':
            return 'Лист почти заполнен';
        case 'comfortable':
        default:
            return null;
    }
};

export const evaluateSheets = (sheets) => {
    const awarenessMap = new Map();
    
    for (const sheet of sheets) {
        const { uiVisualHeight, pdfSemanticHeight, pdfFillRatio, uiFillRatio } = estimateSheetHeight(sheet);
        
        // Status is driven entirely by PDF semantic thresholds, ignoring UI layout
        const status = getSheetStatus(pdfFillRatio);
        const hintText = getHintText(status);
        
        awarenessMap.set(sheet.id, {
            uiVisualHeight, // DEV-only reference
            uiFillRatio,    // DEV-only reference
            pdfSemanticHeight,
            pdfFillRatio,
            status,
            hintText
        });
    }
    
    return awarenessMap;
};
