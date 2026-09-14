# main.py — Entry point for the Water Footprint Calculator
# This file contains the CLI menu and runs the application loop.


def display_menu():
    """Display the main menu options to the user."""
    print("\nPlease choose an option:\n")
    print("  1. Calculate Water Footprint")
    print("  2. View Available Items")
    print("  3. Exit")
    print()


def calculate_footprint():
    """Placeholder for the water footprint calculation feature."""
    print("\n[Coming Soon] This feature will let you calculate")
    print("the water footprint of daily-use items.")
    print("It will be implemented in the next phase.\n")


def view_items():
    """Placeholder for viewing available items."""
    print("\n[Coming Soon] This feature will display all available")
    print("items and their water footprint values.")
    print("It will be implemented in the next phase.\n")


def main():
    """Main function — runs the menu loop until the user exits."""
    # Display the application title
    print("=" * 50)
    print("   Water Footprint Calculator")
    print("=" * 50)

    # Main application loop
    while True:
        display_menu()

        choice = input("Enter your choice (1/2/3): ").strip()

        if choice == "1":
            calculate_footprint()
        elif choice == "2":
            view_items()
        elif choice == "3":
            print("\nThank you for using the Water Footprint Calculator!")
            print("Save water, save life.\n")
            break
        else:
            print("\nInvalid choice! Please enter 1, 2, or 3.")


if __name__ == "__main__":
    main()
