if (!document.documentElement.dataset.archiveReady) {
document.documentElement.dataset.archiveReady='true';

function filterArchive(){
 const root=document.querySelector('#archive');if(!root)return;
 const params=new URLSearchParams(location.search),tags=params.getAll('tag'),categories=params.getAll('category');
 let count=0;
 root.querySelectorAll<HTMLElement>('[data-archive-entry]').forEach(row=>{
  const rowTags:string[]=JSON.parse(row.dataset.tags||'[]');
  row.hidden=!!((tags.length&&!tags.some(tag=>rowTags.includes(tag)))||(categories.length&&!categories.includes(row.dataset.category||''))||(params.has('uncategorized')&&row.dataset.category));
  if(!row.hidden)count++;
 });
 root.querySelectorAll<HTMLElement>('[data-archive-year]').forEach(group=>{group.hidden=!group.querySelector('[data-archive-entry]:not([hidden])');});
 const status=root.querySelector('#archive-filter')!;
 status.textContent=[...tags,...categories,params.has('uncategorized')?'未分类':''].filter(Boolean).join(' · ') || '全部文章与笔记';
 status.textContent+=` · ${count} 篇`;
}
filterArchive();
document.addEventListener('astro:page-load',filterArchive);

}
