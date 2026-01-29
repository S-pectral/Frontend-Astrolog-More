#!/bin/bash

echo "========================================"
echo " COSMIC EXPLORER - Starting..."
echo "========================================"
echo ""
echo "Opening Cosmic Explorer in your browser..."
echo ""
echo "If browser doesn't open automatically, navigate to:"
echo "file://$(pwd)/index.html"
echo ""
echo "Press Ctrl+C to exit"
echo "========================================"

# Open in default browser based on OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open index.html
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open index.html
fi

echo ""
echo "Cosmic Explorer is running!"
echo "Enjoy your journey through the cosmos! 🚀✨"