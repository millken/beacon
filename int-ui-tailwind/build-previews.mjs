import fs from 'node:fs';
import * as cheerio from 'cheerio';
const inventory=JSON.parse(fs.readFileSync('inventory.json','utf8'));
const sprite=fs.readFileSync('assets/icons.svg','utf8');
const font='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">';
fs.mkdirSync('previews',{recursive:true});
const links=[];
for(const item of inventory){
 const file='previews/'+item.file.split('/').pop();
 const slug=item.file.split('/').pop().replace('.html','');
 const html=fs.readFileSync(item.file,'utf8');
 fs.writeFileSync(file,`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${item.name} — Int UI</title>${font}<link rel="stylesheet" href="../dist/tailwind.css"></head><body class="font-sans bg-white"><div hidden aria-hidden="true">${sprite}</div><main class="w-fit m-8">${html}</main></body></html>`);
 links.push(`<li class="py-1"><a class="text-[#3574f0] underline" href="${slug}.html">${item.name}</a> <code class="text-xs text-[#6c707e]">${item.node}</code></li>`);
}
fs.writeFileSync('previews/index.html',`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Int UI component previews</title>${font}<link rel="stylesheet" href="../dist/tailwind.css"></head><body class="font-sans p-8"><h1 class="text-2xl font-semibold mb-2">Int UI component previews</h1><p class="mb-5 text-[#6c707e]"><a class="text-[#3574f0] underline" href="../index.html">Full Getting started page</a></p><ul>${links.join('')}</ul></body></html>`);
console.log('Created',inventory.length,'standalone component previews');
