#!/usr/bin/env node

/**
 * Simple script to update cache-busting version query strings in HTML files
 * Usage: node update-version.js [version]
 * If no version is provided, it will increment the patch version automatically
 */

const fs = require('fs');
const path = require('path');

const VERSION_FILE = path.join(__dirname, 'version.json');
const HTML_FILES = [
  'index.html',
  'vjencanja.html',
  'poslovni-eventi.html',
  'privatne-zabave.html',
  'galerija.html',
  'about.html'
];

function getVersion() {
  if (fs.existsSync(VERSION_FILE)) {
    const versionData = JSON.parse(fs.readFileSync(VERSION_FILE, 'utf8'));
    return versionData.version;
  }
  return '1.0.0';
}

function saveVersion(version) {
  fs.writeFileSync(VERSION_FILE, JSON.stringify({ version }, null, 2) + '\n');
  console.log(`✓ Version saved: ${version}`);
}

function incrementVersion(currentVersion) {
  const parts = currentVersion.split('.');
  const major = parseInt(parts[0]) || 1;
  const minor = parseInt(parts[1]) || 0;
  const patch = parseInt(parts[2]) || 0;
  return `${major}.${minor}.${patch + 1}`;
}

function updateHtmlFile(filePath, version) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠ Skipping ${filePath} (file not found)`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  // Update CSS links: href="styles.css" -> href="styles.css?v=X.X.X"
  const cssPattern = /href=["']([^"']*\.css)(\?v=[\d.]+)?["']/g;
  content = content.replace(cssPattern, (match, file, existingVersion) => {
    updated = true;
    return `href="${file}?v=${version}"`;
  });

  // Update JS scripts: src="script.js" -> src="script.js?v=X.X.X"
  const jsPattern = /src=["']([^"']*\.js)(\?v=[\d.]+)?["']/g;
  content = content.replace(jsPattern, (match, file, existingVersion) => {
    // Skip external CDN scripts
    if (file.startsWith('http://') || file.startsWith('https://')) {
      return match;
    }
    updated = true;
    return `src="${file}?v=${version}"`;
  });

  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated ${filePath}`);
    return true;
  }
  return false;
}

// Main execution
const newVersion = process.argv[2] || incrementVersion(getVersion());
const currentVersion = getVersion();

console.log(`Current version: ${currentVersion}`);
console.log(`New version: ${newVersion}`);
console.log('');

let updatedCount = 0;
HTML_FILES.forEach(file => {
  if (updateHtmlFile(file, newVersion)) {
    updatedCount++;
  }
});

if (updatedCount > 0) {
  saveVersion(newVersion);
  console.log(`\n✓ Successfully updated ${updatedCount} file(s) with version ${newVersion}`);
} else {
  console.log('\n⚠ No files were updated');
}
