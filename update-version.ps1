# PowerShell script to update cache-busting version query strings in HTML files
# Usage: .\update-version.ps1 [version]
# If no version is provided, it will increment the patch version automatically

param(
    [string]$NewVersion = ""
)

$VERSION_FILE = "version.json"
$HTML_FILES = @(
    "index.html",
    "vjencanja.html",
    "poslovni-eventi.html",
    "privatne-zabave.html",
    "galerija.html",
    "about.html"
)

function Get-Version {
    if (Test-Path $VERSION_FILE) {
        $versionData = Get-Content $VERSION_FILE | ConvertFrom-Json
        return $versionData.version
    }
    return "1.0.0"
}

function Save-Version {
    param([string]$Version)
    $versionObj = @{ version = $Version } | ConvertTo-Json
    Set-Content -Path $VERSION_FILE -Value $versionObj
    Write-Host "✓ Version saved: $Version" -ForegroundColor Green
}

function Increment-Version {
    param([string]$CurrentVersion)
    $parts = $CurrentVersion.Split('.')
    $major = [int]$parts[0]
    $minor = [int]$parts[1]
    $patch = [int]$parts[2]
    return "$major.$minor.$($patch + 1)"
}

function Update-HtmlFile {
    param(
        [string]$FilePath,
        [string]$Version
    )
    
    if (-not (Test-Path $FilePath)) {
        Write-Host "⚠ Skipping $FilePath (file not found)" -ForegroundColor Yellow
        return $false
    }
    
    $content = Get-Content $FilePath -Raw
    $updated = $false
    
    # Update CSS links
    $content = $content -replace 'href=["\']([^"\']*\.css)(\?v=[\d.]+)?["\']', {
        param($match)
        $updated = $true
        $file = $matches[1]
        return "href=`"$file?v=$Version`""
    }
    
    # Update JS scripts (skip external URLs)
    $content = $content -replace 'src=["\']((?!https?://)[^"\']*\.js)(\?v=[\d.]+)?["\']', {
        param($match)
        $updated = $true
        $file = $matches[1]
        return "src=`"$file?v=$Version`""
    }
    
    if ($updated) {
        Set-Content -Path $FilePath -Value $content -NoNewline
        Write-Host "✓ Updated $FilePath" -ForegroundColor Green
        return $true
    }
    return $false
}

# Main execution
$currentVersion = Get-Version
if ([string]::IsNullOrEmpty($NewVersion)) {
    $NewVersion = Increment-Version -CurrentVersion $currentVersion
}

Write-Host "Current version: $currentVersion"
Write-Host "New version: $NewVersion"
Write-Host ""

$updatedCount = 0
foreach ($file in $HTML_FILES) {
    if (Update-HtmlFile -FilePath $file -Version $NewVersion) {
        $updatedCount++
    }
}

if ($updatedCount -gt 0) {
    Save-Version -Version $NewVersion
    Write-Host "`n✓ Successfully updated $updatedCount file(s) with version $NewVersion" -ForegroundColor Green
} else {
    Write-Host "`n⚠ No files were updated" -ForegroundColor Yellow
}
