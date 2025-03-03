#!/usr/bin/env python3
"""
A simple Hello World script that demonstrates Python script execution from TaskMaster CLI.
"""

import sys
import time
import random

def main():
    print("Hello from TaskMaster CLI!")
    print("-" * 30)
    print("This is a demonstration of Python script execution.")
    print("Running Python version:", sys.version)
    
    # Add a small delay to simulate processing
    print("\nProcessing", end="")
    for _ in range(5):
        time.sleep(0.3)
        print(".", end="", flush=True)
    print("\n")
    
    # Show some colored output (will show as ANSI escape codes in the terminal)
    colors = [
        "\033[92m",  # Green
        "\033[94m",  # Blue
        "\033[93m",  # Yellow
        "\033[91m",  # Red
        "\033[0m"    # Reset
    ]
    
    for i in range(5):
        color = random.choice(colors[:-1])
        reset = colors[-1]
        print(f"{color}Line {i+1}: TaskMaster can run Python scripts!{reset}")
    
    print("\nScript completed successfully!")
    return 0

if __name__ == "__main__":
    sys.exit(main()) 