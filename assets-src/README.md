# assets-src

Source material for generated assets. Nothing in here is served to the browser.

`fonts/` holds static instances cut from the Archivo and Source Serif 4 variable
fonts (SIL Open Font License, same families the site loads from Google Fonts).
They are here so `scripts/build_resume.py` can render the resume PDF in the same
typefaces as the site without a network fetch.
