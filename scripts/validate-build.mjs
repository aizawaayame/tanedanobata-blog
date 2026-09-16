import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const domain='https://www.tanedanobata.top';
const manifest=JSON.parse(fs.readFileSync('docs/migration-manifest.json','utf8'));
const config=JSON.parse(fs.readFileSync('vercel.json','utf8'));
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const htmlFiles=walk('dist').filter(f=>f.endsWith('.html'));
const decode=s=>s.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'");
const urlOf=file=>file.endsWith('404.html')?'/404/':'/'+path.relative('dist',file).replaceAll('\\','/').replace(/index\.html$/,'');
const pages=new Map(htmlFiles.map(file=>{const html=fs.readFileSync(file,'utf8');return [urlOf(file),{file,html,ids:new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>decode(m[1])))}]}));
const errors=[];
assert.equal(manifest.length,78,'Every original Markdown file must have a disposition');
assert.equal(manifest.filter(e=>e.status==='migrated').length,61);
assert.equal(manifest.filter(e=>e.status==='excluded').length,16);
for(const entry of manifest){
 if(entry.status==='migrated'&&!pages.has(entry.url))errors.push(`Missing migrated page: ${entry.source} → ${entry.url}`);
 if(entry.status==='excluded'&&pages.has(entry.oldUrl))errors.push(`Excluded page still published: ${entry.oldUrl}`);
}
for(const [route,page] of pages){
 const canonical=page.html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/);
 if(!canonical || decodeURIComponent(canonical[1])!==domain+route)errors.push(`Incorrect canonical: ${route}`);
 if(/This Is a Fake Search Result|Lorem Ipsum|Demo Site|demo-avatar|demo-banner/.test(page.html))errors.push(`Demo residue: ${route}`);
 if(/class="katex-error"/.test(page.html))errors.push(`Formula error: ${route}`);
 if(/<iframe\b/i.test(page.html))errors.push(`Eager iframe: ${route}`);
 for(const m of page.html.matchAll(/\bhref="([^"]*)"/g)){
  const href=decode(m[1]);
  if(href.startsWith("/") && href.split(/[?#]/)[0].includes("+"))errors.push(`Unencoded plus in internal path: ${route} → ${href}`);if(!href || /^(mailto:|tel:|javascript:)/.test(href))continue;
  const link=new URL(href,domain+route);if(link.origin!==domain)continue;
  const target=decodeURIComponent(link.pathname);
  if(!pages.has(target)){
   if(config.redirects.some(r=>r.source===target)){errors.push(`Internal link uses old redirect: ${route} → ${target}`);continue;}
   if(fs.existsSync(path.join('dist',target)))continue;
   errors.push(`Broken link: ${route} → ${target}`);continue;
  }
  if(link.hash && !pages.get(target).ids.has(decodeURIComponent(link.hash.slice(1))))errors.push(`Broken anchor: ${route} → ${target}${decodeURIComponent(link.hash)}`);
 }
}
for(const rule of config.redirects){
 if(rule.source.includes(':'))continue;
 if(/[^\x00-\x7f ]/.test(rule.source)||rule.source.includes(" "))errors.push(`Unencoded Vercel redirect source: ${rule.source}`);
 const destination=decodeURIComponent(rule.destination.split('?')[0]);
 if(!pages.has(destination))errors.push(`Redirect target missing: ${rule.source} → ${destination}`);
 if(rule.source===destination||config.redirects.some(r=>r.source===destination))errors.push(`Redirect chain/loop: ${rule.source}`);
}
const aliases=JSON.parse(fs.readFileSync('src/data/legacy-anchors.json','utf8'));
for(const [route,headings] of Object.entries(aliases))for(const ids of Object.values(headings))for(const id of ids){
 if(!pages.get(route)?.ids.has(id))errors.push(`Missing legacy anchor: ${route}#${id}`);
}
const report={pages:pages.size,migrated:61,excluded:16,errors:[...new Set(errors)]};
console.log(JSON.stringify(report,null,2));
if(errors.length)process.exit(1);
