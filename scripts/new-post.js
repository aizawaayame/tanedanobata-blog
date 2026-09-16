import fs from 'node:fs';
import path from 'node:path';
const [slug,...titleParts]=process.argv.slice(2);
if(!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)){
 console.error('用法：pnpm new-post <英文短横线-slug> [文章标题]');process.exit(1);
}
const title=titleParts.join(' ')||slug;
const destination=path.join('src/content/posts',`${slug}.md`);
const text=`---
title: ${JSON.stringify(title)}
slug: ${slug}
published: ${new Date().toISOString().slice(0,10)}
draft: true
description: ''
tags: []
category: ''
lang: zh_CN
kind: post
directory: ''
route: /posts/${slug}/
---

`;
fs.mkdirSync(path.dirname(destination),{recursive:true});
fs.writeFileSync(destination,text,{flag:'wx'});
console.log(`已创建草稿：${destination}`);
