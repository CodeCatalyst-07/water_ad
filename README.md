# Water Footprint Calculator

## Problem Statement

**"Use of Digital Technology to calculate water footprints for different daily use items."**

Water is one of the most critical natural resources, yet most people are unaware of how much water goes into producing the everyday items they use — from the food they eat to the clothes they wear. This hidden water consumption is called a **water footprint**.

This project uses digital technology (a Python-based terminal application) to help users understand and calculate the water footprint of common daily-use items.

---

## Project Objective

Build a simple, reliable, and easy-to-understand **terminal/CLI application** in Python that:

- Stores water footprint data for common daily-use items (food, beverages, clothing, household products, etc.)
- Allows users to look up items and see how much water is used to produce them
- Calculates the total water footprint based on user-selected items and quantities
- Displays results in a clear, readable format in the terminal
- Helps raise awareness about water consumption in daily life

---

## Proposed Functionality

| Feature | Description |
|---|---|
| View all items | Display a list of all available items with their water footprint (litres per unit) |
| Search for an item | Look up a specific item by name |
| Calculate footprint | Select an item, enter quantity, and see the water footprint |
| Daily summary | Add multiple items and view total water footprint for the day |
| Category browsing | Browse items by category (Food, Beverages, Clothing, etc.) |
| Save report | Save the calculation summary to a file for future reference |
| Water-saving tips | Display tips on how to reduce water footprint |

---

## Technology Stack

| Component | Technology |
|---|---|
| Programming Language | Python 3 |
| Data Storage | JSON file (`data/water_footprints.json`) |
| User Interface | Terminal / Command Line Interface (CLI) |
| Libraries | Python standard library (`json`, `os`, `csv`, `datetime`) |
| Version Control | Git and GitHub |

No external frameworks, databases, or web servers are required.

---

## Project Structure

```
water_ad/
├── main.py                      # Entry point — runs the CLI application
├── data/
│   └── water_footprints.json    # Water footprint data for daily-use items
├── tests/                       # Test scripts (added in later phases)
├── README.md                    # Project documentation (this file)
└── .gitignore                   # Git ignore rules
```

---

## Project Roadmap

| Phase | Description | Status |
|---|---|---|
| Phase 1 | Project setup, structure, and documentation | ✅ Done |
| Phase 2 | Basic terminal menu with navigation | ✅ Done |
| Phase 3 | Water footprint dataset and item listing | ✅ Done |
| Phase 4 | CLI interface with menu-driven interaction | 🔲 Planned |
| Phase 5 | Multi-item daily summary and category browsing | 🔲 Planned |
| Phase 6 | Save/export reports and water-saving tips | 🔲 Planned |
| Phase 7 | Testing, validation, and final polish | 🔲 Planned |

---

## How to Run

```bash
# Clone the repository
git clone https://github.com/CodeCatalyst-07/water_ad.git
cd water_ad

# Run the application (available from Phase 4 onwards)
python main.py
```

> **Note:** The application is currently in the setup phase. The calculator will be functional from Phase 4.

---

## Data Sources

The water footprint values used in this project are **approximate estimates** based on publicly available research. They represent the total amount of freshwater used to produce one unit of an item (including growing, processing, and transportation).

**Primary references:**

- **Water Footprint Network** — [waterfootprint.org](https://waterfootprint.org/en/resources/interactive-tools/product-gallery/)  
  Provides a product gallery with water footprint values for common food, beverages, and industrial products.

- **Mekonnen, M.M. & Hoekstra, A.Y. (2011)** — *"The green, blue and grey water footprint of crops and derived crop products"*, Hydrology and Earth System Sciences, 15(5), 1577–1600.  
  This study provides detailed water footprint data for agricultural products worldwide.

- **UNESCO-IHE Institute for Water Education** — Research reports on water footprints for consumer goods.

> **Disclaimer:** The values in this project are global averages for educational purposes. Actual water footprints vary significantly based on region, farming methods, climate, and production processes.

---

## Authors

- **CodeCatalyst-07** — [GitHub Profile](https://github.com/CodeCatalyst-07)

---

## License

This project is developed for academic/educational purposes.
