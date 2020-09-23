#!/bin/bash
set -e
set -x

echo "Starting GitHunter Scraper in Conductor mode..."
node /app/githunter-scraper.js --conductor
