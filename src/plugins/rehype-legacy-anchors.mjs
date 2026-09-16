import fs from 'node:fs';
import { visit } from 'unist-util-visit';
const aliases=JSON.parse(fs.readFileSync(new URL('../data/legacy-anchors.json',import.meta.url),'utf8'));
// Keep bookmarks from the previous MkDocs site while using readable heading IDs.
export default function rehypeLegacyAnchors(){
 return (tree,file)=>{
  const map=aliases[file.data.astro?.frontmatter?.route];
  if(!map)return;
  const ids=new Set();
  visit(tree,'element',node=>{if(node.properties?.id)ids.add(node.properties.id);});
  visit(tree,'element',node=>{
   if(!/^h[1-6]$/.test(node.tagName))return;
   for(const id of map[node.properties?.id]||[]){
    if(ids.has(id))continue;
    ids.add(id);
    node.children.unshift({type:'element',tagName:'span',properties:{id,className:['legacy-anchor'],ariaHidden:'true','data-pagefind-ignore':true},children:[]});
   }
  });
 };
}
