#!/bin/bash
# Automatic cache busting script using git commit hash
# This script updates all HTML files with the current git commit hash as version

set -e  # Exit on error

# Get short git commit hash (7 characters)
VERSION=$(git rev-parse --short HEAD 2>/dev/null || echo "dev-$(date +%s)")

echo "Updating cache-busting version to: $VERSION"

# Update each HTML file in src/templates
for file in src/templates/*.html; do
  if [ -f "$file" ]; then
    sed -i.bak -e "s/href=\"styles\.css?v=[^\"]*\"/href=\"styles.css?v=$VERSION\"/g" \
               -e "s/href=\"styles\.css\"/href=\"styles.css?v=$VERSION\"/g" "$file" 2>/dev/null || true
    
    sed -i.bak -e "s/src=\"script\.js?v=[^\"]*\"/src=\"script.js?v=$VERSION\"/g" \
               -e "s/src=\"script\.js\"/src=\"script.js?v=$VERSION\"/g" "$file" 2>/dev/null || true
    
    rm -f "$file.bak" 2>/dev/null || true
    echo "✓ Updated $file"
  fi
done

echo "Cache-busting version update complete!"
