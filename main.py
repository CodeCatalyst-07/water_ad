# main.py — Entry point for the Water Footprint Calculator
# This file contains the CLI menu, data loading, and the application loop.

import json
import os


# Path to the water footprint data file
DATA_FILE = os.path.join("data", "water_footprints.json")


def load_data(filepath):
    """Load water footprint data from a JSON file.

    Args:
        filepath: Path to the JSON data file.

    Returns:
        A dictionary of items and their water footprint info,
        or an empty dictionary if the file is missing or invalid.
    """
    # Check if the file exists
    if not os.path.exists(filepath):
        print(f"\nWarning: Data file '{filepath}' not found.")
        print("The application will run with no items loaded.\n")
        return {}

    try:
        with open(filepath, "r") as file:
            data = json.load(file)
    except json.JSONDecodeError:
        print(f"\nWarning: Data file '{filepath}' contains invalid JSON.")
        print("The application will run with no items loaded.\n")
        return {}

    # Basic check — data should be a dictionary
    if not isinstance(data, dict):
        print("\nWarning: Data file format is unexpected.")
        print("The application will run with no items loaded.\n")
        return {}

    return data


def display_menu():
    """Display the main menu options to the user."""
    print("\nPlease choose an option:\n")
    print("  1. Calculate Water Footprint")
    print("  2. View Available Items")
    print("  3. Exit")
    print()


def calculate_footprint(data):
    """Placeholder for the water footprint calculation feature."""
    print("\n[Coming Soon] This feature will let you calculate")
    print("the water footprint of daily-use items.")
    print("It will be implemented in the next phase.\n")


def view_items(data):
    """Display all available items and their water footprint values.

    Args:
        data: Dictionary of items loaded from the JSON file.
    """
    if not data:
        print("\nNo items available. Please check the data file.\n")
        return

    print("\n" + "=" * 60)
    print("  Available Items and Their Water Footprints")
    print("=" * 60)

    # Print table header
    print(f"\n  {'No.':<5} {'Item':<18} {'Water (litres)':<16} {'Per Unit'}")
    print("  " + "-" * 55)

    # Print each item with a serial number
    item_number = 1
    for item_name, item_info in data.items():
        water = item_info.get("water_footprint_litres", "N/A")
        unit = item_info.get("unit", "N/A")
        # Make the item name more readable (replace underscores with spaces)
        display_name = item_name.replace("_", " ").title()

        print(f"  {item_number:<5} {display_name:<18} {water:<16} {unit}")
        item_number += 1

    print("  " + "-" * 55)
    print(f"  Total items: {len(data)}\n")


def main():
    """Main function — runs the menu loop until the user exits."""
    # Display the application title
    print("=" * 50)
    print("   Water Footprint Calculator")
    print("=" * 50)

    # Load data once at startup
    data = load_data(DATA_FILE)

    # Main application loop
    while True:
        display_menu()

        choice = input("Enter your choice (1/2/3): ").strip()

        if choice == "1":
            calculate_footprint(data)
        elif choice == "2":
            view_items(data)
        elif choice == "3":
            print("\nThank you for using the Water Footprint Calculator!")
            print("Save water, save life.\n")
            break
        else:
            print("\nInvalid choice! Please enter 1, 2, or 3.")


if __name__ == "__main__":
    main()

