// Synchronize the optional root static export without accumulating old bundles.
import { cpSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const dist=join(root,'dist');
if(!existsSync(join(dist,'index.html')))throw new Error('Run npm run build first.');
const assets=join(root,'assets');
for(const file of readdirSync(assets)){
 if(/^(styles|ui|form)-[a-f0-9]{12}\.(css|js)$/.test(file)&&!existsSync(join(dist,'assets',file)))rmSync(join(assets,file));
}
const versioned=join(assets,'versioned');
if(existsSync(versioned))for(const file of readdirSync(versioned)){
 if(/^[a-z0-9-]+-[a-f0-9]{12}\.(png|jpe?g|webp)$/.test(file)&&!existsSync(join(dist,'assets/versioned',file)))rmSync(join(versioned,file));
}
for(const entry of readdirSync(dist))cpSync(join(dist,entry),join(root,entry),{recursive:true});
console.log('Root static export synchronized; obsolete hashed bundles removed.');
