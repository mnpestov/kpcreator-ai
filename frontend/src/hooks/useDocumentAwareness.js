import { useMemo } from 'react';
import { evaluateSheets } from '../utils/documentAwarenessEngine';

/**
 * React hook that wraps the pure document awareness engine.
 * Computes semantic height awareness data for all sheets.
 * 
 * @param {Array} sheets - The current sheets from state
 * @returns {Map} - A Map of sheetId -> awareness data ({ usedHeight, remainingHeight, fillRatio, status, hintText })
 */
export default function useDocumentAwareness(sheets) {
    return useMemo(() => {
        if (!sheets || sheets.length === 0) return new Map();
        return evaluateSheets(sheets);
    }, [sheets]);
}
