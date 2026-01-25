#!/bin/bash
# Automatic cache busting script using git commit hash
# This script updates all HTML files with the current git commit hash as version

set -e  # Exit on error

# Get short git commit hash (7 characters)
VERSION=$(git rev-parse --short HEAD 2>/dev/null || echo "dev-$(date +%s)")

echo "Updating cache-busting version to: $VERSION"

# List of HTML files to update
HTML_FILES=(
  "index.html"
  "vjencanja.html"
  "poslovni-eventi.html"
  "privatne-zabave.html"
  "galerija.html"
  "about.html"
)

# Update each HTML file
for file in "${HTML_FILES[@]}"; do
  if [ -f "$file" ]; then
    # Update CSS links: href="styles.css?v=X" -> href="styles.css?v=NEW_VERSION"
    # Also handle cases where there's no version yet: href="styles.css" -> href="styles.css?v=VERSION"
    sed -i.bak -e "s/href=\"styles\.css?v=[^\"]*\"/href=\"styles.css?v=$VERSION\"/g" \
               -e "s/href=\"styles\.css\"/href=\"styles.css?v=$VERSION\"/g" "$file" 2>/dev/null || true
    
    # Update JS scripts: src="script.js?v=X" -> src="script.js?v=NEW_VERSION"
    # Also handle cases where there's no version yet: src="script.js" -> src="script.js?v=VERSION"
    # Skip external URLs (http:// or https://)
    sed -i.bak -e "s/src=\"script\.js?v=[^\"]*\"/src=\"script.js?v=$VERSION\"/g" \
               -e "s/src=\"script\.js\"/src=\"script.js?v=$VERSION\"/g" "$file" 2>/dev/null || true
    
    # Remove backup files
    rm -f "$file.bak" 2>/dev/null || true
    
    echo "✓ Updated $file"
  else
    echo "⚠ Skipping $file (not found)"
  fi
done

echo "Cache-busting version update complete!"
