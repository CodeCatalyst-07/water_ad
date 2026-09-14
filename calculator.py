# calculator.py — Core calculation logic for the Water Footprint Calculator
# This file contains functions related to computing water footprints.
# It is kept separate from main.py so the logic is modular and easy to test.


def get_footprint_value(item_name, data):
    """Look up the water footprint value for a given item.

    Args:
        item_name: The name of the item (as entered by the user).
        data: The dictionary of all items loaded from the JSON file.

    Returns:
        A dictionary with item info if found, or None if the item
        does not exist in the dataset.
    """
    # Convert to lowercase to make the search case-insensitive
    # Also replace spaces with underscores to match JSON keys
    lookup_key = item_name.lower().strip().replace(" ", "_")

    if lookup_key in data:
        return data[lookup_key]

    return None


def compute_water_footprint(footprint_per_unit, quantity):
    """Calculate the total water footprint.

    This is the core formula:
        total water footprint = quantity × water footprint per unit

    Args:
        footprint_per_unit: Water footprint for one unit (in litres).
        quantity: Number of units the user wants to calculate for.

    Returns:
        The total water footprint in litres.
    """
    return footprint_per_unit * quantity


def validate_quantity(quantity_str):
    """Validate and convert the user's quantity input to a number.

    Args:
        quantity_str: The raw string input from the user.

    Returns:
        A tuple (is_valid, value):
            - (True, float_value) if the input is a valid positive number.
            - (False, error_message) if the input is invalid.
    """
    # Check for empty input
    if not quantity_str.strip():
        return (False, "Quantity cannot be empty.")

    # Try to convert to a number
    try:
        value = float(quantity_str)
    except ValueError:
        return (False, f"'{quantity_str}' is not a valid number.")

    # Check for zero or negative
    if value <= 0:
        return (False, "Quantity must be greater than zero.")

    return (True, value)


def search_items(search_term, data):
    """Search for items whose name contains the search term.

    The search is case-insensitive and supports partial matches.
    For example, searching "ch" would match "chicken", "chocolate", "cheese".

    Args:
        search_term: The text the user typed to search for.
        data: The dictionary of all items loaded from the JSON file.

    Returns:
        A list of tuples: [(item_key, item_info), ...]
        Each tuple contains the item's JSON key and its info dictionary.
        Returns an empty list if no items match.
    """
    search_lower = search_term.lower().strip()

    matches = []
    for item_key, item_info in data.items():
        # Compare against the key (with underscores replaced by spaces)
        readable_name = item_key.replace("_", " ")
        if search_lower in readable_name:
            matches.append((item_key, item_info))

    return matches
