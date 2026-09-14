// main.js — Entry point for the Water Footprint Calculator
// This file contains the CLI menu, data loading, and the application loop.

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const {
    getFootprintValue,
    computeWaterFootprint,
    validateQuantity,
    searchItems,
    calculateStatistics,
} = require("./calculator");

// Path to the water footprint data file
const DATA_FILE = path.join(__dirname, "data", "water_footprints.json");

// Path to the calculation history file
const HISTORY_FILE = path.join(__dirname, "data", "history.json");

// ─── Data Loading ───────────────────────────────────────────

/**
 * Load water footprint data from a JSON file.
 *
 * @param {string} filepath - Path to the JSON data file.
 * @returns {object} A dictionary of items, or empty object if file is missing/invalid.
 */
function loadData(filepath) {
    // Check if the file exists
    if (!fs.existsSync(filepath)) {
        console.log(`\nWarning: Data file '${filepath}' not found.`);
        console.log("The application will run with no items loaded.\n");
        return {};
    }

    try {
        const fileContent = fs.readFileSync(filepath, "utf-8").trim();

        // Check if the file is empty
        if (!fileContent) {
            console.log(`\nWarning: Data file '${filepath}' is empty.`);
            console.log("The application will run with no items loaded.\n");
            return {};
        }

        const data = JSON.parse(fileContent);

        // Basic check — data should be an object (not an array or null)
        if (typeof data !== "object" || data === null || Array.isArray(data)) {
            console.log("\nWarning: Data file format is unexpected.");
            console.log("The application will run with no items loaded.\n");
            return {};
        }

        return data;
    } catch (error) {
        console.log(`\nWarning: Data file '${filepath}' contains invalid JSON.`);
        console.log("The application will run with no items loaded.\n");
        return {};
    }
}

// ─── History Management ─────────────────────────────────────

/**
 * Load calculation history from a JSON file.
 *
 * Safely handles:
 *  - File does not exist -> returns empty array
 *  - File is empty -> returns empty array
 *  - File contains invalid JSON -> returns empty array with warning
 *  - File contains unexpected format (not an array) -> returns empty array with warning
 *
 * @param {string} filepath - Path to the history JSON file.
 * @returns {Array} Array of calculation history objects.
 */
function loadHistory(filepath) {
    if (!fs.existsSync(filepath)) {
        return [];
    }

    try {
        const fileContent = fs.readFileSync(filepath, "utf-8").trim();

        // If the file is completely empty, return an empty list
        if (!fileContent) {
            return [];
        }

        const data = JSON.parse(fileContent);

        // History must be a JSON array of records
        if (!Array.isArray(data)) {
            console.log("\nWarning: History file is corrupted (expected a list). Starting fresh.");
            return [];
        }

        return data;
    } catch (error) {
        console.log("\nWarning: History file contains invalid JSON.");
        return [];
    }
}

/**
 * Save a new calculation record to the history JSON file.
 *
 * @param {string} filepath - Path to the history JSON file.
 * @param {object} record - The calculation record to append.
 */
function saveHistory(filepath, record) {
    // Load existing history (handles missing/empty/corrupted files safely)
    const history = loadHistory(filepath);

    // Append the new calculation record
    history.push(record);

    try {
        // Ensure the parent directory exists
        const dir = path.dirname(filepath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Write the updated history with 2-space indentation for readability
        fs.writeFileSync(filepath, JSON.stringify(history, null, 2), "utf-8");
    } catch (error) {
        console.log(`\nWarning: Could not save calculation to history: ${error.message}\n`);
    }
}

// ─── Helper Functions ───────────────────────────────────────

/**
 * Convert an item key like "cotton_shirt" to a readable name like "Cotton Shirt".
 *
 * @param {string} key - The JSON key for the item.
 * @returns {string} A human-readable version of the key.
 */
function formatItemName(key) {
    return String(key)
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Format a number with commas as thousand separators.
 * For example: 12500 becomes "12,500".
 *
 * @param {number} num - The number to format.
 * @returns {string} The formatted number string.
 */
function formatNumber(num) {
    if (typeof num !== "number" || isNaN(num) || !Number.isFinite(num)) {
        return "0";
    }
    return Math.round(num).toLocaleString();
}

/**
 * Format a decimal number with commas and up to 2 decimal places.
 * For example: 2306.25 becomes "2,306.25", 2500 becomes "2,500".
 *
 * @param {number} num - The number to format.
 * @returns {string} The formatted decimal string.
 */
function formatDecimal(num) {
    if (typeof num !== "number" || isNaN(num) || !Number.isFinite(num)) {
        return "0";
    }
    if (num % 1 === 0) {
        return num.toLocaleString();
    }
    return num.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

/**
 * Pad a string to a fixed width (for table formatting).
 *
 * @param {string|number} text - The text to pad.
 * @param {number} width - The desired width.
 * @returns {string} The padded string.
 */
function padRight(text, width) {
    return String(text).padEnd(width);
}

// ─── Menu Display ───────────────────────────────────────────

/**
 * Display the main menu options to the user.
 */
function displayMenu() {
    console.log("\nPlease choose an option:\n");
    console.log("  1. Calculate Water Footprint");
    console.log("  2. View Available Items");
    console.log("  3. Search Item");
    console.log("  4. View Calculation History");
    console.log("  5. View Statistics");
    console.log("  6. Exit");
    console.log();
}

// ─── Feature: View Items ────────────────────────────────────

/**
 * Display all available items and their water footprint values.
 *
 * @param {object} data - Dictionary of items loaded from the JSON file.
 */
function viewItems(data) {
    const keys = Object.keys(data);

    if (keys.length === 0) {
        console.log("\nNo items available. Please check the data file.\n");
        return;
    }

    console.log("\n" + "=".repeat(60));
    console.log("  Available Items and Their Water Footprints");
    console.log("=".repeat(60));

    // Print table header
    console.log(`\n  ${padRight("No.", 5)} ${padRight("Item", 18)} ${padRight("Water (litres)", 16)} Per Unit`);
    console.log("  " + "-".repeat(55));

    // Print each item with a serial number
    keys.forEach((itemName, index) => {
        const itemInfo = data[itemName];
        const water = itemInfo.water_footprint_litres || "N/A";
        const unit = itemInfo.unit || "N/A";
        const displayName = formatItemName(itemName);

        console.log(`  ${padRight(index + 1, 5)} ${padRight(displayName, 18)} ${padRight(water, 16)} ${unit}`);
    });

    console.log("  " + "-".repeat(55));
    console.log(`  Total items: ${keys.length}\n`);
}

// ─── Feature: Calculate Footprint ───────────────────────────

/**
 * Ask the user for an item and quantity, then calculate and display
 * the water footprint. Saves the calculation to history upon success.
 *
 * @param {object} data - Dictionary of items loaded from the JSON file.
 * @param {function} askQuestion - Function to ask the user a question.
 * @param {string} historyFile - Path to the history JSON file.
 * @returns {Promise<void>}
 */
async function calculateFootprint(data, askQuestion, historyFile = HISTORY_FILE) {
    const keys = Object.keys(data);

    if (keys.length === 0) {
        console.log("\nNo items available. Please check the data file.\n");
        return;
    }

    console.log("\n--- Calculate Water Footprint ---");
    console.log("(Type the item name, e.g., 'rice', 'coffee', 'jeans')");

    // Step 1: Get the item name from the user
    const itemName = (await askQuestion("\nEnter item name: ")).trim();

    if (!itemName) {
        console.log("\nError: Item name cannot be empty.\n");
        return;
    }

    // Step 2: Look up the item in the dataset
    const itemInfo = getFootprintValue(itemName, data);

    if (itemInfo === null) {
        console.log(`\nError: '${itemName}' was not found in the database.`);
        console.log("Use option 2 to view all available items.\n");
        return;
    }

    const footprintPerUnit = itemInfo.water_footprint_litres;
    const unit = itemInfo.unit;
    const lookupKey = itemName.toLowerCase().trim().replace(/\s+/g, "_");
    const displayName = formatItemName(lookupKey);

    // Step 3: Get the quantity from the user
    const quantityStr = (await askQuestion(`Enter quantity (in ${unit}): `)).trim();

    const validation = validateQuantity(quantityStr);

    if (!validation.isValid) {
        // validation.value contains the error message
        console.log(`\nError: ${validation.value}\n`);
        return;
    }

    const quantity = validation.value; // The validated number

    // Step 4: Calculate the total water footprint
    const totalFootprint = computeWaterFootprint(footprintPerUnit, quantity);

    // Step 5: Display the result
    console.log("\n" + "=".repeat(45));
    console.log("  Calculation Result");
    console.log("=".repeat(45));
    console.log(`  Item          : ${displayName}`);
    console.log(`  Quantity      : ${quantity} ${unit}`);
    console.log(`  Footprint/unit: ${footprintPerUnit} litres per ${unit}`);
    console.log(`  Total         : ${formatNumber(totalFootprint)} litres`);
    console.log("=".repeat(45));
    console.log();

    // Step 6: Save calculation to history
    const record = {
        item_name: displayName,
        quantity: quantity,
        unit: unit,
        water_footprint_per_unit: footprintPerUnit,
        total_footprint: totalFootprint,
        date_time: new Date().toLocaleString(),
    };
    saveHistory(historyFile, record);
    console.log("  ✓ Calculation saved to history.\n");
}

// ─── Feature: Search Item ───────────────────────────────────

/**
 * Search for items by name and display matching results.
 *
 * @param {object} data - Dictionary of items loaded from the JSON file.
 * @param {function} askQuestion - Function to ask the user a question.
 * @returns {Promise<void>}
 */
async function searchItem(data, askQuestion) {
    const keys = Object.keys(data);

    if (keys.length === 0) {
        console.log("\nNo items available. Please check the data file.\n");
        return;
    }

    console.log("\n--- Search Items ---");
    const searchTerm = (await askQuestion("Enter search term: ")).trim();

    if (!searchTerm) {
        console.log("\nError: Search term cannot be empty.\n");
        return;
    }

    // Use the search function from calculator.js
    const matches = searchItems(searchTerm, data);

    if (matches.length === 0) {
        console.log(`\nNo items found matching '${searchTerm}'.`);
        console.log("Try a different keyword or use option 2 to see all items.\n");
        return;
    }

    // Display the matching results
    console.log(`\nFound ${matches.length} item(s) matching '${searchTerm}':\n`);
    console.log(`  ${padRight("No.", 5)} ${padRight("Item", 18)} ${padRight("Water (litres)", 16)} Per Unit`);
    console.log("  " + "-".repeat(55));

    matches.forEach((match, index) => {
        const displayName = formatItemName(match.key);
        const water = match.info.water_footprint_litres || "N/A";
        const unit = match.info.unit || "N/A";
        console.log(`  ${padRight(index + 1, 5)} ${padRight(displayName, 18)} ${padRight(water, 16)} ${unit}`);
    });

    console.log("  " + "-".repeat(55));
    console.log();
}

// ─── Feature: View Calculation History ──────────────────────

/**
 * Display previous calculations in a clean and readable terminal format.
 *
 * @param {string} filepath - Path to the history JSON file.
 */
function viewHistory(filepath) {
    const history = loadHistory(filepath);

    if (history.length === 0) {
        console.log("\nNo calculation history found.\n");
        return;
    }

    console.log("\n" + "=".repeat(85));
    console.log("  Calculation History");
    console.log("=".repeat(85));

    // Print table header
    console.log(
        `\n  ${padRight("No.", 5)} ${padRight("Date/Time", 24)} ${padRight("Item", 16)} ${padRight("Quantity", 12)} ${padRight("Per Unit", 14)} Total (litres)`
    );
    console.log("  " + "-".repeat(85));

    // Print each calculation record
    history.forEach((record, index) => {
        const dateTime = record.date_time || "N/A";
        const item = record.item_name || "N/A";
        const qty = `${record.quantity} ${record.unit || ""}`.trim();
        const perUnit = `${formatNumber(record.water_footprint_per_unit)} L`;
        const total = `${formatNumber(record.total_footprint)} L`;

        console.log(
            `  ${padRight(index + 1, 5)} ${padRight(dateTime, 24)} ${padRight(item, 16)} ${padRight(qty, 12)} ${padRight(perUnit, 14)} ${total}`
        );
    });

    console.log("  " + "-".repeat(85));
    console.log(`  Total calculations recorded: ${history.length}\n`);
}

// ─── Feature: View Statistics ───────────────────────────────

/**
 * Display calculation statistics based on the calculation history.
 *
 * @param {string} filepath - Path to the history JSON file.
 */
function viewStatistics(filepath) {
    const history = loadHistory(filepath);
    const stats = calculateStatistics(history);

    if (!stats) {
        console.log("\nNo calculation history available.\n");
        return;
    }

    console.log("\n" + "=".repeat(45));
    console.log("  CALCULATION STATISTICS");
    console.log("=".repeat(45));
    console.log(`  Total calculations      : ${stats.totalCalculations}`);
    console.log(`  Total water footprint   : ${formatNumber(stats.totalWaterFootprint)} L`);
    console.log(`  Average per calculation : ${formatDecimal(stats.averageFootprint)} L`);
    console.log(`  Highest footprint item  : ${stats.highestItem} (${formatNumber(stats.highestFootprint)} L)`);
    console.log("=".repeat(45));
    console.log();
}

// ─── Main Application ───────────────────────────────────────

/**
 * Main function — runs the menu loop until the user exits.
 */
async function main() {
    // Create the readline interface for terminal input/output
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    // Helper: wrap rl.question in a Promise so we can use async/await
    function askQuestion(prompt) {
        return new Promise((resolve) => {
            rl.question(prompt, (answer) => {
                resolve(answer);
            });
        });
    }

    // Display the application title
    console.log("=".repeat(50));
    console.log("   Water Footprint Calculator");
    console.log("=".repeat(50));

    // Load data once at startup
    const data = loadData(DATA_FILE);

    // Main application loop
    let running = true;
    while (running) {
        displayMenu();

        const choice = (await askQuestion("Enter your choice (1/2/3/4/5/6): ")).trim();

        if (choice === "1") {
            await calculateFootprint(data, askQuestion, HISTORY_FILE);
        } else if (choice === "2") {
            viewItems(data);
        } else if (choice === "3") {
            await searchItem(data, askQuestion);
        } else if (choice === "4") {
            viewHistory(HISTORY_FILE);
        } else if (choice === "5") {
            viewStatistics(HISTORY_FILE);
        } else if (choice === "6") {
            console.log("\nThank you for using the Water Footprint Calculator!");
            console.log("Save water, save life.\n");
            running = false;
        } else {
            console.log("\nInvalid choice! Please enter 1, 2, 3, 4, 5, or 6.");
        }
    }

    // Close the readline interface
    rl.close();
}

// Run the application when executed directly
if (require.main === module) {
    main();
}

// Export functions for testing and modularity
module.exports = {
    loadData,
    loadHistory,
    saveHistory,
    viewHistory,
    viewStatistics,
    calculateFootprint,
};
