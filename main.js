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
} = require("./calculator");

// Path to the water footprint data file
const DATA_FILE = path.join(__dirname, "data", "water_footprints.json");

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
        const fileContent = fs.readFileSync(filepath, "utf-8");
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

// ─── Helper Functions ───────────────────────────────────────

/**
 * Convert an item key like "cotton_shirt" to a readable name like "Cotton Shirt".
 *
 * @param {string} key - The JSON key for the item.
 * @returns {string} A human-readable version of the key.
 */
function formatItemName(key) {
    return key
        .replace(/_/g, " ")
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
    return Math.round(num).toLocaleString();
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
    console.log("  4. Exit");
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
 * the water footprint.
 *
 * @param {object} data - Dictionary of items loaded from the JSON file.
 * @param {function} askQuestion - Function to ask the user a question.
 * @returns {Promise<void>}
 */
async function calculateFootprint(data, askQuestion) {
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
    const displayName = formatItemName(itemName);

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

        const choice = (await askQuestion("Enter your choice (1/2/3/4): ")).trim();

        if (choice === "1") {
            await calculateFootprint(data, askQuestion);
        } else if (choice === "2") {
            viewItems(data);
        } else if (choice === "3") {
            await searchItem(data, askQuestion);
        } else if (choice === "4") {
            console.log("\nThank you for using the Water Footprint Calculator!");
            console.log("Save water, save life.\n");
            running = false;
        } else {
            console.log("\nInvalid choice! Please enter 1, 2, 3, or 4.");
        }
    }

    // Close the readline interface
    rl.close();
}

// Run the application
main();
