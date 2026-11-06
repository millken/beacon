import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import postcss from 'postcss';

const root=process.cwd();
const source=JSON.parse(fs.readFileSync('source/getting-started.json','utf8'));
const $=cheerio.load(source.pages[0].code,{decodeEntities:false});
const cssRoot=postcss.parse($('style').text());
const rules=new Map(), extraBase=[];
const colors=new Set(['white']);
const fmt=n=>{const v=Math.round(Number(n)*100000)/100000;return String(v)};
function color(v){
  if(v==='white')return 'white';
  let m=v.match(/^rgba?\(([^)]+)\)$/);
  if(!m) throw new Error('Unsupported color '+v);
  let p=m[1].split(',').map(s=>s.trim()); let [r,g,b,a]=p.map(Number);
  let hex='#'+[r,g,b].map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
  if(a===undefined||a===1)return hex;
  return hex+Math.round(a*255).toString(16).padStart(2,'0');
}
function value(prop,v){
  v=v.trim();
  if(prop==='box-sizing')return v==='border-box'?'box-border':'box-content';
  if(prop==='display')return {flex:'flex','inline-flex':'inline-flex',block:'block','inline-block':'inline-block',grid:'grid',none:'hidden'}[v]||`[display:${v}]`;
  if(prop==='position')return {absolute:'absolute',relative:'relative',fixed:'fixed',sticky:'sticky',static:'static'}[v];
  if(prop==='flex-direction')return {row:'flex-row',column:'flex-col','row-reverse':'flex-row-reverse','column-reverse':'flex-col-reverse'}[v];
  if(prop==='justify-content')return {'flex-start':'justify-start','flex-end':'justify-end',center:'justify-center','space-between':'justify-between','space-around':'justify-around','space-evenly':'justify-evenly'}[v];
  if(prop==='align-items')return {'flex-start':'items-start','flex-end':'items-end',center:'items-center',stretch:'items-stretch',baseline:'items-baseline'}[v];
  if(prop==='align-self')return {'flex-start':'self-start','flex-end':'self-end',center:'self-center',stretch:'self-stretch'}[v];
  if(prop==='overflow')return {hidden:'overflow-hidden',auto:'overflow-auto',scroll:'overflow-scroll',visible:'overflow-visible'}[v];
  if(prop==='pointer-events')return v==='none'?'pointer-events-none':'pointer-events-auto';
  if(prop==='isolation')return v==='isolate'?'isolate':'isolation-auto';
  if(prop==='white-space')return {pre:'whitespace-pre',nowrap:'whitespace-nowrap',normal:'whitespace-normal','pre-wrap':'whitespace-pre-wrap'}[v];
  if(prop==='word-break')return v==='break-word'?'wrap-break-word':v==='break-all'?'break-all':'break-normal';
  if(prop==='text-align')return {left:'text-left',right:'text-right',center:'text-center',justify:'text-justify'}[v];
  if(prop==='text-decoration')return v==='underline'?'underline':v==='line-through'?'line-through':'no-underline';
  if(prop==='font-weight')return `font-[${v}]`;
  if(prop==='font-family'){
    if(v.includes('JetBrains'))return 'font-mono';
    if(v.includes('SF Pro'))return 'font-sf';
    return 'font-sans';
  }
  if(prop==='font-feature-settings')return `[font-feature-settings:${v.replaceAll(' ','_')}]`;
  if(prop==='background-color'){const c=color(v);colors.add(c);return c==='white'?'bg-white':`bg-[${c}]`;}
  if(prop==='color'){const c=color(v);colors.add(c);return c==='white'?'text-white':`text-[${c}]`;}
  if(prop==='border-color'){const c=color(v);colors.add(c);return `border-[${c}]`;}
  if(prop==='background-repeat')return {'no-repeat':'bg-no-repeat',repeat:'bg-repeat'}[v];
  if(prop==='background-size'){if(v==='cover')return 'bg-cover';if(v==='contain')return 'bg-contain';return `bg-[length:${v.replaceAll(' ','_')}]`;}
  if(prop==='background-position')return `bg-[position:${v.replaceAll(' ','_')}]`;
  if(prop==='background-image'){
    const urls=[...v.matchAll(/url\(([^)]+)\)/g)].map(m=>m[1].replace('./image/',''));
    let out=[];
    if(v.startsWith('url("data:image/svg+xml;utf8,')) { const n='gradient-'+Buffer.from(v).toString('base64url').slice(0,24)+'.svg'; const svg=decodeURIComponent(v.match(/url\("data:image\/svg\+xml;utf8,([^"]+)"\)/)[1]); fs.mkdirSync('assets/icons',{recursive:true}); fs.writeFileSync('assets/icons/'+n,svg); return `bg-[url(../assets/icons/${n})]`; }
    for(const u of urls){let target=u.endsWith('.svg')?'assets/icons/'+u:'assets/images/'+u;out.push(`bg-[url(../${target})]`)}
    if(urls.length===0)return `[background-image:${v.replaceAll(' ','_')}]`;
    if(urls.length>1)out.push(`[background-image:${v.replaceAll('./image/','../assets/images/').replaceAll(' ','_')}]`);
    return out;
  }
  if(prop==='mask-image'||prop==='-webkit-mask-image'){
    const pre=prop.startsWith('-')?'[-webkit-mask-image:':'[mask-image:';const uri='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 30 30%22%3E%3Ccircle cx=%2215%22 cy=%2215%22 r=%2215%22 fill=%22white%22/%3E%3C/svg%3E';return pre+v.replace(/url\(\.\/image\/Ellipse470\.svg\)/,'url('+uri+')').replaceAll('./image/','../assets/icons/').replaceAll(' ','_')+']';
  }
  if(prop==='mask-position'||prop==='-webkit-mask-position')return `[${prop}:${v.replaceAll(' ','_')}]`;
  if(prop==='mask-repeat'||prop==='-webkit-mask-repeat')return `[${prop}:${v}]`;
  if(prop==='mask-size'||prop==='-webkit-mask-size')return `[${prop}:${v.replaceAll(' ','_')}]`;
  if(prop==='box-shadow')return `[box-shadow:${v.replaceAll(' ','_')}]`;
  if(prop==='text-shadow')return `[text-shadow:${v.replaceAll(' ','_')}]`;
  if(prop==='filter')return `[filter:${v.replaceAll(' ','_')}]`;
  if(prop==='opacity')return `opacity-[${v}]`;
  if(prop==='transform')return `[transform:${v.replaceAll(' ','_')}]`;
  if(prop==='inset')return `inset-[${v}]`;
  if(prop==='left'||prop==='right'||prop==='top'||prop==='bottom'||prop==='width'||prop==='height'||prop==='min-width'||prop==='gap'||prop==='flex-basis'||prop==='margin-left'||prop==='margin-right'||prop==='margin-top'||prop==='margin-bottom'||prop==='font-size'||prop==='line-height'||prop==='letter-spacing'||prop==='border-radius'||prop==='z-index'||prop==='flex-grow'||prop==='flex-shrink'||prop==='-webkit-line-clamp'){
    const map={left:'left',right:'right',top:'top',bottom:'bottom',width:'w',height:'h','min-width':'min-w',gap:'gap','flex-basis':'basis','margin-left':'ml','margin-right':'mr','margin-top':'mt','margin-bottom':'mb','font-size':'text','line-height':'leading','letter-spacing':'tracking','border-radius':'rounded','z-index':'z','flex-grow':'grow','flex-shrink':'shrink','-webkit-line-clamp':'line-clamp'};
    if(v==='100%')return map[prop]==='w'?'w-full':map[prop]==='h'?'h-full':`${map[prop]}-full`;
    if(v==='0px'&&prop==='flex-shrink')return 'shrink-0';
    if(v==='0'&&prop==='flex-grow')return 'grow-0';
    if(v==='0px'&&prop==='z-index')return 'z-0';
    if(v==='1'&&prop==='z-index')return 'z-1';
    if(prop==='border-radius' && v.split(/\s+/).every(x=>x===v.split(/\s+/)[0]))v=v.split(/\s+/)[0];
    return `${map[prop]}-[${v}]`;
  }
  if(prop==='padding'){const a=v.split(/\s+/);let t=a[0],r=a[1]??t,b=a[2]??t,l=a[3]??r;let out=[];if(t===b)out.push(`py-[${t}]`);else out.push(`pt-[${t}]`,`pb-[${b}]`);if(l===r)out.push(`px-[${l}]`);else out.push(`pl-[${l}]`,`pr-[${r}]`);return out;}
  if(prop==='border-width'){const a=v.split(/\s+/);let t=a[0],r=a[1]??t,b=a[2]??t,l=a[3]??r;let out=[];if(t===b)out.push(`border-y-[${t}]`);else out.push(`border-t-[${t}]`,`border-b-[${b}]`);if(l===r)out.push(`border-x-[${l}]`);else out.push(`border-l-[${l}]`,`border-r-[${r}]`);return out;}
  if(prop==='border-style')return 'border-solid';
  if(prop==='margin'){
    const a=v.split(/\s+/);let t=a[0],r=a[1]??t,b=a[2]??t,l=a[3]??r;let out=[];if(t===b)out.push(`my-[${t}]`);else out.push(`mt-[${t}]`,`mb-[${b}]`);if(l===r)out.push(`mx-[${l}]`);else out.push(`ml-[${l}]`,`mr-[${r}]`);return out;
  }
  if(prop==='padding-inline-start')return `ps-[${v}]`;
  if(prop==='list-style')return 'list-none';
  if(prop==='-webkit-box-orient')return `[${prop}:${v}]`;
  throw new Error('Unsupported '+prop+' '+v);
}
for(const node of cssRoot.nodes){
 if(node.type!=='rule')continue;
 const sel=node.selector;
 const sels=sel.split(',').map(s=>s.trim());
 if(sels.every(s=>/^\.[\w-]+$/.test(s))){
  const arr=[];node.walkDecls(d=>{const out=value(d.prop,d.value);arr.push(...(Array.isArray(out)?out:[out]))});
  for(const cs of sels){const c=cs.slice(1);rules.set(c,[...(rules.get(c)||[]),...arr])}
 }else extraBase.push(node.toString());
}
let usedClasses=new Set();
$('[class]').each((_,el)=>{
 const e=$(el);const old=(e.attr('class')||'').split(/\s+/).filter(Boolean);let out=[];
 for(const c of old){if(rules.has(c))out.push(...rules.get(c));else if(c.startsWith('Pixso-')||c.startsWith('frame-content-')||c==='scroll-container'){}else out.push(c)}
 e.attr('class',[...new Set(out)].join(' '));
 if(e.attr('style')?.includes('cursor: pointer'))e.attr('class',e.attr('class')+' cursor-pointer');
 e.removeAttr('style');
 const list=e.attr('class').split(/\s+/).filter(Boolean);list.forEach(c=>usedClasses.add(c));
 if(e.attr('id'))e.attr('data-pixso-id',e.attr('id').replace('_',':'));
 e.removeAttr('id');
});
// Icons use exact SVG node exports as CSS background images. Keep the local
// assets alongside the partials so the design remains easy to inspect and edit.
$('[class]').each((_,el)=>{
 const e=$(el),cls=e.attr('class')||'';
 const m=cls.match(/bg-\[url\(\.\.\/assets\/icons\/([^\)]+)\)\]/);
 if(m)e.attr('data-icon',m[1]);
});
$('p').each((_,el)=>{el.tagName='span'});
$('body').children().each((_,el)=>{if(el.tagName==='script')$(el).remove()});
// Convert each source tile to a named semantic component partial.
const inventory=[];
const tileIds=['8028_81782','8028_81717','8028_81747','8028_81931','8028_82362','8028_81934','8028:83753'.replace(':','_'),'8028_81937','8028_82004','8028_83554','8028_82007','8028_83468','8028_82010','8028_82077','8073_77805','8028_82080','8028_82083','8028_82150','8028_82153','8028_82156','8028_83848','8028_83569','8028_83557','8028_83667','8028_83652','8028_83655','8028:83765'.replace(':','_'),'8028_83750','8028_83862','8028_83860'];
const names=['Alert','Banner','Button','Checkbox','Combo box','Context menu','Dialog','Dropdown','Group header','Input field','Link','Loader','Notification','Popup','Progress bar','Radio button','Segmented control','Search','Scrollbar','Shortcut and code sample','Tab','Table','Toggle','Toolbar','Tooltip','Tooltip: Editor','Tooltip: Got It','Tree','Tool window','Main window'];
const slug=s=>s.toLowerCase().replaceAll(':','').replaceAll(' ','-');
let tiles=[];
for(let i=0;i<tileIds.length;i++){
 const node=$('[data-pixso-id="'+tileIds[i].replace('_',':')+'"]').first();
 if(!node.length)throw new Error('Missing tile '+tileIds[i]);
 node.attr('data-component',names[i]);node.attr('aria-label',names[i]+' component example');
 const partial=`<!-- Int UI / ${names[i]} / Pixso ${tileIds[i].replace('_',':')} -->\n<article data-component="${names[i]}" aria-label="${names[i]} component example" data-pixso-id="${tileIds[i].replace('_',':')}" class="relative block w-[320px] h-[280px]">\n${node.html()}\n</article>\n`;
 fs.writeFileSync(`components/${slug(names[i])}.html`,partial);
 inventory.push({name:names[i],file:`components/${slug(names[i])}.html`,node:tileIds[i].replace('_',':')});
 tiles.push(partial);
}
// Main composition: source title + guide + design basics + component grid.
const title=$('[data-pixso-id="6222:74502"]').prop('outerHTML');
const basics=$('[data-pixso-id="8063:76782"]').prop('outerHTML');
const guide=$('[data-pixso-id="8151:76094"]').prop('outerHTML');
let body=`<main class="relative w-full" data-pixso-id="0:1">\n${title}\n${guide}\n<!-- Design basics -->\n${basics}\n<!-- Component gallery -->\n<section data-section="Components" aria-label="Int UI component gallery" class="relative w-full h-[2280px] min-w-[1320px] shrink-0 bg-white">\n<div class="absolute left-[20px] top-[20px] grid w-[1280px] grid-cols-4 grid-rows-8">\n${tiles.join('\n')}\n</div>\n</section>\n</main>`;
let head=`<!doctype html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>Int UI Kit — Tailwind CSS</title>\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">\n<link rel="stylesheet" href="dist/tailwind.css">\n</head>\n<body class="font-sans bg-white text-black">\n${body}\n</body>\n</html>`;
fs.writeFileSync('index.html',head);
const vars=[...colors].sort().map(c=>`  --int-${c.replace('#','')}: ${c};`).join('\n');
const input=`@import "tailwindcss";\n@source "../index.html";\n@source "../components";\n\n:root {\n${vars}\n}\n@theme inline {\n  --font-sans: "Inter", sans-serif;\n  --font-mono: "JetBrains Mono", monospace;\n  --font-sf: "SF Pro Text", "Inter", sans-serif;\n}\n@layer base {\n  html, body { min-height: 100%; }\n  span { overflow-wrap: break-word; }\n}\n`;
fs.writeFileSync('tailwind.css',input);
fs.writeFileSync('inventory.json',JSON.stringify(inventory,null,2));
fs.writeFileSync('source/unused-base.css',extraBase.join('\n'));
console.log('Converted',inventory.length,'components;',usedClasses.size,'Tailwind utilities; HTML',head.length,'bytes');
