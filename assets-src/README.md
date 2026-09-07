# assets-src

Source material for generated assets. Nothing in here is served to the browser.

`fonts/` holds static instances of Archivo and Source Serif 4 (SIL Open Font
License). They serve two purposes: `scripts/build_resume.py` renders the resume
PDF with them, and they are the source for the subset `.woff2` files in
`public/fonts/` that the site itself loads, so no request ever goes to Google
Fonts. To regenerate the web fonts after changing anything here:

```
pip install fonttools brotli
for f in assets-src/fonts/*.ttf; do
  n=$(basename "$f" .ttf)
  pyftsubset "$f" --output-file="public/fonts/$n.woff2" --flavor=woff2 \
    --layout-features='*' --unicodes="U+0000-00FF,U+0152-0153,U+2000-206F,U+2074,U+20AC,U+2122,U+2212"
done
```
