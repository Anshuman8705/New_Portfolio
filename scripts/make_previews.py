"""Recreate web previews from the bundled PDFs / prepared certificate images.
Optional maintenance tool: pip install pymupdf pillow
The original documents are never modified. Photos in the document field have
already been rotated for viewing; raw originals remain in originalDocument.
"""
from pathlib import Path
import subprocess,json
import fitz
from PIL import Image,ImageOps
ROOT=Path(__file__).resolve().parents[1]
content=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {certificates} from './src/data.js'; console.log(JSON.stringify(certificates));"],cwd=ROOT,text=True,encoding='utf-8'))
for c in content:
 if not c.get('document'):continue
 source=ROOT/'public'/c['document'].lstrip('/')
 if source.suffix.lower()=='.pdf':
  with fitz.open(source) as doc:
   page=doc[0]
   scale=min(2400/page.rect.width,1800/page.rect.height)
   pix=page.get_pixmap(matrix=fitz.Matrix(scale,scale),alpha=False)
   image=Image.frombytes('RGB',(pix.width,pix.height),pix.samples)
 else:image=ImageOps.exif_transpose(Image.open(source)).convert('RGB')
 image.thumbnail((2400,1800))
 preview=ROOT/'public'/c['preview'].lstrip('/');preview.parent.mkdir(parents=True,exist_ok=True)
 image.save(preview,quality=94,method=6)
 image.thumbnail((600,430));image.save(ROOT/'public'/c['thumbnail'].lstrip('/'),quality=90,method=6)
 print(c['id'])
print('Previews refreshed. Run npm run build to update dist/.')
