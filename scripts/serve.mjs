import http from 'node:http';
import { createReadStream, existsSync, statSync, readFileSync } from 'node:fs';
import { resolve, dirname, extname, sep, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../dist');
if(!existsSync(join(root,'index.html'))){console.error('Run npm run build first.');process.exit(1);}
const portArg=process.argv.find(a=>a.startsWith('--port='));
const port=Number(portArg?.split('=')[1]||process.env.PORT||4173);
const host=process.env.HOST||'127.0.0.1';
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.pdf':'application/pdf','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg'};
const server=http.createServer((req,res)=>{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});return res.end('Method not allowed');}
 try{
  const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let file=resolve(root,'.'+path);
  if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403);return res.end('Forbidden');}
  if(existsSync(file)&&statSync(file).isDirectory()){if(!path.endsWith('/')){res.writeHead(301,{Location:path+'/'});return res.end();}file=join(file,'index.html');}
  const status=existsSync(file)&&statSync(file).isFile()?200:404;if(status===404)file=join(root,'404.html');
  const headers={'Content-Type':mime[extname(file)]||'application/octet-stream','Content-Length':statSync(file).size,'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Cache-Control':'no-cache'};
  res.writeHead(status,headers);if(req.method==='HEAD')return res.end();
  const stream=createReadStream(file);stream.on('error',()=>res.destroy());stream.pipe(res);
 }catch{res.writeHead(400);res.end('Bad request');}
});
server.listen(port,host,()=>console.log(`Portfolio preview: http://${host}:${port}\nPress Ctrl+C to stop.`));
server.on('error',error=>{console.error(error.message);process.exitCode=1;});
