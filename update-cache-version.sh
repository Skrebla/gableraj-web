#!/bin/bash
# Automatic cache busting script using git commit hash
# This script updates all HTML files with the current git commit hash as version

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
    sed -i.bak "s/href=\"styles\.css?v=[^\"]*\"/href=\"styles.css?v=$VERSION\"/g" "$file"
    
    # Update JS scripts: src="script.js?v=X" -> src="script.js?v=NEW_VERSION"
    # Skip external URLs (http:// or https://)
    sed -i.bak "s/src=\"script\.js?v=[^\"]*\"/src=\"script.js?v=$VERSION\"/g" "$file"
    
    # Remove backup files
    rm -f "$file.bak"
    
    echo "✓ Updated $file"
  else
    echo "⚠ Skipping $file (not found)"
  fi
done

echo "Cache-busting version update complete!"
