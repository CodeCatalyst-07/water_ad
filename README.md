# Water Footprint Calculator — CLI Application

## Problem Statement

**"Use of Digital Technology to calculate water footprints for different daily use items."**

---

## Problem Overview

Water is one of Earth's most critical natural resources. While people are generally mindful of their direct water usage (such as drinking, bathing, and cleaning), the vast majority of human water consumption is **indirect** — hidden in the production, agricultural cultivation, industrial processing, and transportation of everyday goods. This hidden volume of freshwater consumed throughout an item's entire supply chain is defined as its **water footprint**.

Most consumers lack convenient digital tools to quantify this indirect water usage. This application addresses that gap by using digital technology — specifically a lightweight, terminal-based JavaScript application — to allow users to calculate, explore, and understand the estimated water footprints of common daily-use items.

> **Educational Note:** The footprint figures in this tool represent approximate educational estimates based on global averages from published literature. They serve to raise environmental awareness rather than provide real-time scientific telemetry.

---

## Project Objective

The objective of this project is to build a simple, reliable, and easy-to-understand **terminal/CLI application** using Node.js that:

- Maintains a clean dataset of estimated water footprints for daily-use goods (food, beverages, clothing, household products).
- Provides an intuitive command-line interface for calculating the total water footprint based on user-selected items and quantities.
- Supports item discovery through case-insensitive keyword searches and structured listings.
- Automatically records calculation history with persistent storage across sessions.
- Generates summary statistics (total consumption, averages, and peak items) from historical calculations.
- Implements robust error handling and defensive input validation to prevent crashes.

---

## Technology Stack

| Component | Technology | Description |
|---|---|---|
| **Runtime Environment** | Node.js | Cross-platform JavaScript runtime |
| **Language** | JavaScript (ES6+) | Standard modern JavaScript |
| **User Interface** | Terminal / CLI | Text-based interactive command-line interface |
| **CLI Input Handling** | `readline` | Built-in Node.js module for terminal I/O |
| **File Handling** | `fs` | Built-in Node.js file system module (`readFileSync`, `writeFileSync`, `existsSync`) |
| **Path Resolution** | `path` | Built-in Node.js module for cross-platform file paths |
| **Data Persistence** | JSON files | Human-readable flat-file storage (`data/water_footprints.json`, `data/history.json`) |
| **Dependencies** | Zero (0) external npm packages | Uses only Node.js standard built-in libraries |

---

## Features

1. **Calculate Water Footprint**:
   - Lookup items from a dataset of 25 common daily-use items.
   - Enter item quantity in relevant metric units (e.g., kg, litres, cups, pieces, pairs).
   - Display clear calculation result cards showing unit values and total footprint.
2. **View Available Items**:
   - Neatly formatted terminal table listing all items, categories, footprint values, and measurement units.
3. **Search Items**:
   - Case-insensitive search supporting partial and full matches (e.g., `"ch"` finds Chicken, Chocolate, and Cheese).
4. **Input Validation**:
   - Rejects empty inputs, unknown items, non-numeric values (`"abc"`), non-finite numbers (`Infinity`), and zero or negative quantities with clear error feedback.
   - Normalizes irregular whitespace (e.g., `"cotton   shirt"` matches `"cotton_shirt"`).
5. **Persistent Calculation History**:
   - Automatically appends each successful calculation to `data/history.json`.
   - Records item name, quantity, unit, per-unit footprint, total footprint, and timestamp.
   - Persists data across terminal restarts.
6. **Calculation Statistics**:
   - Aggregates historical calculations to report:
     - Total number of calculations performed
     - Total water footprint across all calculations
     - Average water footprint per calculation
     - Item and total footprint for the highest single calculation
7. **Robust Error Handling**:
   - Safely handles missing, empty, or corrupted JSON files without crashing.
   - Falls back gracefully with informative warnings.

---

## Project Structure

```
water_ad/
├── main.js                      # Application entry point, CLI menus, and terminal I/O
├── calculator.js                # Core calculation, lookup, search, and statistics logic
├── data/
│   ├── water_footprints.json    # Predefined dataset of items and footprint values
│   └── history.json             # Persistent log of user calculations
├── package.json                 # Node.js package configuration (metadata and start script)
├── README.md                    # Complete project documentation
└── .gitignore                   # Version control ignore rules
```

---

## How It Works

The application operates in two distinct operational flows:

### 1. Calculation & Storage Flow
```
User Input (Item & Quantity)
       ↓
Input Normalization & Validation (lowercase, trim, regex whitespace cleanup)
       ↓
Item Lookup in Dataset (`getFootprintValue`)
       ↓
Quantity Validation (`validateQuantity` > 0 and finite)
       ↓
Mathematical Computation (`computeWaterFootprint = quantity × footprintPerUnit`)
       ↓
Result Display in Terminal
       ↓
Record Persistence to `data/history.json` (`saveHistory`)
```

### 2. History & Statistics Flow
```
Read `data/history.json` (`loadHistory`)
       ↓
Validate Array Structure & Parse
       ↓
Aggregation Loop (`calculateStatistics`)
  ├── Count calculations (`history.length`)
  ├── Sum total water (`totalWaterFootprint += record.total_footprint`)
  ├── Track peak item (`max(total_footprint)`)
  └── Calculate average (`totalWater / count`)
       ↓
Formatted Output Display in Terminal
```

---

## Core Formula

The water footprint calculation follows this fundamental equation:

$$\text{Total Water Footprint (litres)} = \text{Quantity} \times \text{Water Footprint per Unit}$$

### Worked Example:
- **Item**: Rice
- **Unit**: kilogram (kg)
- **Footprint per Unit**: 2,500 litres / kg
- **Quantity**: 2 kg
- **Calculation**:
  $$\text{Total Footprint} = 2 \times 2,500 = 5,000\text{ litres}$$

---

## How to Run

### Prerequisites
- **Node.js** (v14 or higher recommended) installed on your system.
- No third-party packages need to be installed (`npm install` is **not** required).

### Execution Commands

```bash
# Clone the repository
git clone https://github.com/CodeCatalyst-07/water_ad.git
cd water_ad

# Run via npm script
npm start

# Or run directly with Node.js
node main.js
```

---

## Example CLI Usage

Below is a realistic terminal transcript illustrating the application flow:

```
==================================================
   Water Footprint Calculator
==================================================

Please choose an option:

  1. Calculate Water Footprint
  2. View Available Items
  3. Search Item
  4. View Calculation History
  5. View Statistics
  6. Exit

Enter your choice (1/2/3/4/5/6): 1

--- Calculate Water Footprint ---
(Type the item name, e.g., 'rice', 'coffee', 'jeans')

Enter item name: rice
Enter quantity (in kg): 2

=============================================
  Calculation Result
=============================================
  Item          : Rice
  Quantity      : 2 kg
  Footprint/unit: 2500 litres per kg
  Total         : 5,000 litres
=============================================

  ✓ Calculation saved to history.

Please choose an option:

  1. Calculate Water Footprint
  2. View Available Items
  3. Search Item
  4. View Calculation History
  5. View Statistics
  6. Exit

Enter your choice (1/2/3/4/5/6): 4

=====================================================================================
  Calculation History
=====================================================================================

  No.   Date/Time                Item             Quantity     Per Unit       Total (litres)
  -------------------------------------------------------------------------------------
  1     9/14/2026, 8:45:10 PM    Rice             2 kg         2,500 L        5,000 L
  -------------------------------------------------------------------------------------
  Total calculations recorded: 1

Please choose an option:

  1. Calculate Water Footprint
  2. View Available Items
  3. Search Item
  4. View Calculation History
  5. View Statistics
  6. Exit

Enter your choice (1/2/3/4/5/6): 5

=============================================
  CALCULATION STATISTICS
=============================================
  Total calculations      : 1
  Total water footprint   : 5,000 L
  Average per calculation : 5,000 L
  Highest footprint item  : Rice (5,000 L)
=============================================

Please choose an option:

  1. Calculate Water Footprint
  2. View Available Items
  3. Search Item
  4. View Calculation History
  5. View Statistics
  6. Exit

Enter your choice (1/2/3/4/5/6): 6

Thank you for using the Water Footprint Calculator!
Save water, save life.
```

---

## Data Storage

Instead of requiring external relational or NoSQL database servers (e.g., MySQL, MongoDB, SQLite), this application utilizes local **JSON flat files**:

1. **`data/water_footprints.json`**: Read-only dataset storing item definitions, categories, measurement units, and footprint values.
2. **`data/history.json`**: Appendable array persisting previous calculations.

### Why JSON for an Academic Project?
- **Zero Configuration**: Runs immediately on any computer with Node.js without database setup, connection strings, or daemon processes.
- **Human Readable**: Students, teachers, and examiners can open and inspect data files directly in any text editor.
- **Native Support**: Node.js has native parsing and serialization capabilities through `JSON.parse()` and `JSON.stringify()`.
- **Portability**: The entire application and its state can be version-controlled, copied, or cloned as a single directory.

---

## Testing & Robustness

The application was validated across a comprehensive test matrix in Phase 8:

| Test Category | Inputs Tested | Expected Outcome | Result |
|---|---|---|---|
| **Menu Options** | Choices `1` through `6` | Correct screen or functionality triggered | Pass |
| **Invalid Menu Input** | `""`, `"abc"`, `"0"`, `"7"`, `"-1"` | Displays friendly error; prompts for retry | Pass |
| **Item Casing** | `"rice"`, `"RICE"`, `"RiCe"` | Case-insensitive lookup succeeds | Pass |
| **Item Spacing** | `"cotton shirt"`, `"cotton   shirt"` | Whitespace normalized; matches key | Pass |
| **Unknown Items** | `"xyz_unknown"`, `""` | Informative error displayed; suggests listing | Pass |
| **Quantity Validation** | `"abc"`, `"!@"`, `"0"`, `"-5"` | Rejected with specific validation message | Pass |
| **Special Numbers** | `"Infinity"`, `"-Infinity"`, `"NaN"` | Rejected via `Number.isFinite()` check | Pass |
| **Decimal Quantities** | `"2.5"`, `"0.5"` | Accurately parsed and calculated | Pass |
| **Large Quantities** | `"1000000"` | Computed and formatted with commas | Pass |
| **Missing Data File** | Deleted `water_footprints.json` | Graceful warning; runs with 0 items | Pass |
| **Corrupted JSON** | Malformed syntax `{bad json` | `try...catch` handles gracefully without crash | Pass |
| **Non-Array History** | Object `{}` in `history.json` | Detected via `Array.isArray()`; resets safely | Pass |
| **Persistence** | Calculate $\rightarrow$ Exit $\rightarrow$ Re-open | Previous calculations read from disk | Pass |

---

## Limitations

To maintain academic clarity and simplicity, the project has the following known boundaries:
- **Estimated Global Averages**: Water footprint numbers are based on global research averages; actual footprints vary by agricultural methods, climate, and geography.
- **Finite Dataset**: The application currently contains 25 common items.
- **Local Single-User CLI**: Runs in a local terminal window without remote multi-user synchronization.
- **Static In-Memory Cache**: Dataset is loaded once at startup.

---

## Future Scope

While out of scope for the current academic release, potential future extensions include:
- **Expanded Dataset**: Adding hundreds of additional agricultural and industrial products.
- **Graphical User Interface (GUI)**: Developing a web or desktop interface (e.g., using Electron or a web frontend).
- **Database Backend**: Migrating to SQLite or PostgreSQL for complex querying and multi-user scaling.
- **Daily Consumption Tracker**: Allowing users to log daily consumption logs and set conservation targets.
- **Visual Analytics**: Generating ASCII charts or SVG graphs to visualize water consumption over time.

---

## Viva Preparation & Technical Concepts

Key technical concepts demonstrated in this project for examination and viva review:

1. **Node.js Runtime Architecture**:
   - Executes JavaScript outside the browser using the V8 engine and libuv for I/O.
2. **CommonJS Module System**:
   - Using `module.exports` to export pure logic from `calculator.js`, and `require("./calculator")` to import it into `main.js`.
3. **Promise-based Asynchronous Terminal I/O**:
   - Wrapping Node.js's callback-based `rl.question()` inside `new Promise((resolve) => ...)` to enable clean, sequential `async/await` control flow inside the menu loop.
4. **Synchronous File Operations**:
   - Leveraging `fs.readFileSync` and `fs.writeFileSync` for deterministic, sequential file handling without callback hell or race conditions.
5. **JSON Serialization & Deserialization**:
   - `JSON.parse()` converting file text into in-memory JavaScript objects/arrays.
   - `JSON.stringify(history, null, 2)` formatting memory structures into formatted JSON text with 2-space indentation.
6. **Defensive Programming & Guard Clauses**:
   - Validating data types, file existence, and numerical bounds at the start of functions to prevent unhandled runtime exceptions.
7. **Numerical Integrity**:
   - Using `Number.isFinite()` alongside `isNaN()` to guard against floating-point anomalies like `Infinity`.
8. **Regular Expressions**:
   - Using `/\s+/g` to normalize arbitrary consecutive whitespace into a single underscore for dictionary lookups.
9. **Separation of Concerns**:
   - Keeping computational functions (`calculator.js`) independent of input/output and presentation code (`main.js`), enabling straightforward modular testing.

---

## Data Sources

The water footprint values in this project are approximate educational estimates derived from published peer-reviewed water footprint assessments:

- **Water Footprint Network (WFN)** — [waterfootprint.org](https://waterfootprint.org/en/resources/interactive-tools/product-gallery/)  
  Product gallery providing global benchmark estimates for agricultural, beverage, and manufactured goods.
- **Mekonnen, M.M. & Hoekstra, A.Y. (2011)** — *"The green, blue and grey water footprint of crops and derived crop products"*, Hydrology and Earth System Sciences, 15(5), 1577–1600.  
  Comprehensive data on agricultural water consumption worldwide.
- **UNESCO-IHE Institute for Water Education** — Research reports and educational datasets on consumer product footprints.

---

## Authors

- **CodeCatalyst-07** — [GitHub Profile](https://github.com/CodeCatalyst-07)

---

## License

This project is developed for educational and academic evaluation purposes.
