// calculator.js — Core calculation logic for the Water Footprint Calculator
// This file contains functions related to computing water footprints.
// It is kept separate from main.js so the logic is modular and easy to test.

/**
 * Look up the water footprint value for a given item.
 *
 * @param {string} itemName - The name of the item (as entered by the user).
 * @param {object} data - The object of all items loaded from the JSON file.
 * @returns {object|null} Item info object if found, or null if not found.
 */
function getFootprintValue(itemName, data) {
    // Convert to lowercase to make the search case-insensitive
    // Also replace spaces with underscores to match JSON keys
    const lookupKey = itemName.toLowerCase().trim().replace(/ /g, "_");

    if (data[lookupKey]) {
        return data[lookupKey];
    }

    return null;
}

/**
 * Calculate the total water footprint.
 *
 * This is the core formula:
 *     total water footprint = quantity × water footprint per unit
 *
 * @param {number} footprintPerUnit - Water footprint for one unit (in litres).
 * @param {number} quantity - Number of units the user wants to calculate for.
 * @returns {number} The total water footprint in litres.
 */
function computeWaterFootprint(footprintPerUnit, quantity) {
    return footprintPerUnit * quantity;
}

/**
 * Validate and convert the user's quantity input to a number.
 *
 * @param {string} quantityStr - The raw string input from the user.
 * @returns {object} { isValid: boolean, value: number|string }
 *     - { isValid: true, value: parsedNumber } if the input is valid.
 *     - { isValid: false, value: errorMessage } if the input is invalid.
 */
function validateQuantity(quantityStr) {
    // Check for empty input
    if (!quantityStr || !quantityStr.trim()) {
        return { isValid: false, value: "Quantity cannot be empty." };
    }

    // Try to convert to a number
    const num = Number(quantityStr);

    if (isNaN(num)) {
        return { isValid: false, value: `'${quantityStr}' is not a valid number.` };
    }

    // Check for zero or negative
    if (num <= 0) {
        return { isValid: false, value: "Quantity must be greater than zero." };
    }

    return { isValid: true, value: num };
}

/**
 * Search for items whose name contains the search term.
 *
 * The search is case-insensitive and supports partial matches.
 * For example, searching "ch" would match "chicken", "chocolate", "cheese".
 *
 * @param {string} searchTerm - The text the user typed to search for.
 * @param {object} data - The object of all items loaded from the JSON file.
 * @returns {Array} Array of objects: [{ key, info }, ...]
 *     Returns an empty array if no items match.
 */
function searchItems(searchTerm, data) {
    const searchLower = searchTerm.toLowerCase().trim();

    const matches = [];
    for (const [itemKey, itemInfo] of Object.entries(data)) {
        // Compare against the key (with underscores replaced by spaces)
        const readableName = itemKey.replace(/_/g, " ");
        if (readableName.includes(searchLower)) {
            matches.push({ key: itemKey, info: itemInfo });
        }
    }

    return matches;
}

/**
 * Calculate summary statistics from the calculation history.
 *
 * Computes:
 *  - Total number of calculations
 *  - Total estimated water footprint across all calculations
 *  - Average water footprint per calculation
 *  - Item and footprint for the calculation with the highest footprint
 *
 * @param {Array} history - Array of previous calculation records.
 * @returns {object|null} Statistics object, or null if history is empty.
 */
function calculateStatistics(history) {
    if (!history || !Array.isArray(history) || history.length === 0) {
        return null;
    }

    const totalCalculations = history.length;
    let totalWaterFootprint = 0;
    let highestCalculation = history[0];

    for (const record of history) {
        totalWaterFootprint += record.total_footprint;

        if (record.total_footprint > highestCalculation.total_footprint) {
            highestCalculation = record;
        }
    }

    const averageFootprint = totalWaterFootprint / totalCalculations;

    return {
        totalCalculations,
        totalWaterFootprint,
        averageFootprint,
        highestItem: highestCalculation.item_name,
        highestFootprint: highestCalculation.total_footprint,
    };
}

// Export all functions so main.js can use them
module.exports = {
    getFootprintValue,
    computeWaterFootprint,
    validateQuantity,
    searchItems,
    calculateStatistics,
};
