import os
import sys
import time
import json
import shutil
import glob
import re

def run_build():
    print("Starting build...")

    # Load translations
    with open('translations.json', 'r', encoding='utf-8') as f:
        translations = json.load(f)

    # Sort keys by length descending to avoid partial matches
    sorted_keys = sorted(translations.keys(), key=len, reverse=True)

    # Prepare public directory
    if os.path.exists('public'):
        shutil.rmtree('public')
    os.makedirs('public')

    # Copy static assets
    shutil.copytree('image', 'public/image')
    for ext in ['*.css', '*.js', '*.png', '*.ico', '*.svg', '*.xml', '*.txt', '*.webmanifest', '*.json']:
        for f in glob.glob(ext):
            if f not in ['extracted.json', 'translations.json', 'firebase.json', 'package.json', 'extract_json.py']:
                shutil.copy(f, 'public/')

    # Create language folders
    os.makedirs('public/en', exist_ok=True)
    os.makedirs('public/de', exist_ok=True)

    def inject_head_and_nav(html, lang, current_file):
        base_url = "https://catering-gableraj.hr"
        path = "" if current_file == "index.html" else current_file
        
        hreflangs = f"""
  <link rel="alternate" hreflang="hr" href="{base_url}/{path}" />
  <link rel="alternate" hreflang="en" href="{base_url}/en/{path}" />
  <link rel="alternate" hreflang="de" href="{base_url}/de/{path}" />
  <link rel="alternate" hreflang="x-default" href="{base_url}/{path}" />
"""
        html = html.replace('</head>', hreflangs + '</head>')
        
        # Fix paths to be absolute
        html = re.sub(r'href="(?!http|mailto|tel|#|/)([^"]+)"', r'href="/\1"', html)
        html = re.sub(r'src="(?!http|mailto|tel|#|/)([^"]+)"', r'src="/\1"', html)
        html = re.sub(r'srcset="(?!http|mailto|tel|#|/)([^"]+)"', r'srcset="/\1"', html)
        
        # Update navigation links for languages
        if lang != 'hr':
            for page in ['index.html', 'about.html', 'bozicni-domjenci.html', 'galerija.html', 'poslovni-eventi.html', 'privatne-zabave.html', 'vjencanja.html']:
                if page == 'index.html':
                    html = html.replace(f'href="/{page}"', f'href="/{lang}/"')
                    html = html.replace(f'href="/"', f'href="/{lang}/"')
                else:
                    html = html.replace(f'href="/{page}"', f'href="/{lang}/{page}"')
        else:
            # Fix index.html for HR
            html = html.replace('href="/index.html"', 'href="/"')

        # Add language switcher
        switcher_html = f"""
      <div class="nav-dropdown lang-switcher">
        <a href="#" class="nav-link" onclick="return false;">{lang.upper()} <i class="fas fa-globe"></i></a>
        <div class="nav-dropdown-menu">
          <a href="/{path}" class="nav-dropdown-item" onclick="localStorage.setItem('langOverride', 'hr')">HR</a>
          <a href="/en/{path}" class="nav-dropdown-item" onclick="localStorage.setItem('langOverride', 'en')">EN</a>
          <a href="/de/{path}" class="nav-dropdown-item" onclick="localStorage.setItem('langOverride', 'de')">DE</a>
        </div>
      </div>
    """
        html = html.replace('<div class="nav-mobile-button">', switcher_html + '\n      <div class="nav-mobile-button">')
        return html

    for file_path in glob.glob('src/templates/*.html'):
        filename = os.path.basename(file_path)
        
        with open(file_path, 'r', encoding='utf-8') as f:
            hr_html = f.read()
            
        en_html = hr_html
        de_html = hr_html
        
        # Replace texts
        for key in sorted_keys:
            if key in en_html:
                en_html = en_html.replace(key, translations[key]['en'])
            if key in de_html:
                de_html = de_html.replace(key, translations[key]['de'])
                
        hr_html = inject_head_and_nav(hr_html, 'hr', filename)
        en_html = inject_head_and_nav(en_html, 'en', filename)
        de_html = inject_head_and_nav(de_html, 'de', filename)
        
        with open(f'public/{filename}', 'w', encoding='utf-8') as f:
            f.write(hr_html)
        with open(f'public/en/{filename}', 'w', encoding='utf-8') as f:
            f.write(en_html)
        with open(f'public/de/{filename}', 'w', encoding='utf-8') as f:
            f.write(de_html)

    # Generate Sitemap
    sitemap_urls = []
    pages = ['index.html', 'about.html', 'galerija.html', 'vjencanja.html', 'poslovni-eventi.html', 'privatne-zabave.html', 'bozicni-domjenci.html']
    base_url = "https://catering-gableraj.hr"

    for page in pages:
        path = "" if page == "index.html" else page.replace('.html', '')
        for lang in ['hr', 'en', 'de']:
            lang_path = f"/{lang}/" if lang != 'hr' else "/"
            full_url = f"{base_url}{lang_path}{path}"
            sitemap_urls.append(f"  <url>\n    <loc>{full_url}</loc>\n    <priority>{'1.0' if path == '' and lang == 'hr' else '0.8'}</priority>\n  </url>")

    sitemap_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(sitemap_urls)}
</urlset>"""

    with open('public/sitemap.xml', 'w', encoding='utf-8') as f:
        f.write(sitemap_xml)

    print("Build complete! Output in public/")

def watch_mode():
    print("👀 Watching for changes in src/templates, translations.json, styles.css, script.js...")
    run_build()
    
    def get_mtimes():
        files = glob.glob('src/templates/*.html') + ['translations.json', 'styles.css', 'script.js']
        mtimes = {}
        for f in files:
            if os.path.exists(f):
                mtimes[f] = os.path.getmtime(f)
        return mtimes

    last_mtimes = get_mtimes()
    
    try:
        while True:
            time.sleep(1)
            current_mtimes = get_mtimes()
            if current_mtimes != last_mtimes:
                print("\nChanges detected, rebuilding...")
                last_mtimes = current_mtimes
                try:
                    run_build()
                except Exception as e:
                    print(f"Error during rebuild: {e}")
    except KeyboardInterrupt:
        print("\nStopping watch mode.")

if __name__ == '__main__':
    if '--watch' in sys.argv or '-w' in sys.argv:
        watch_mode()
    else:
        run_build()
