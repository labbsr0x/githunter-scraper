#!/bin/bash
set -e
set -x

echo "Starting GitHunter Scraper..."
cat /app/hosts >> /etc/hosts
cat /etc/hosts
node /app/githunter-scraper.js
