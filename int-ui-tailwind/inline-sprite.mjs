import fs from 'node:fs';
import * as cheerio from 'cheerio';
const $=cheerio.load(fs.readFileSync('index.html','utf8'),{decodeEntities:false});
const defs=[];const seen=new Set();const byShape=new Map();
const fileToId=new Map();
$('[data-icon]').each((_,el)=>{
 const file=$(el).attr('data-icon'); if(file.startsWith('gradient-'))return;
 const raw=fs.readFileSync('assets/icons/'+file,'utf8');const s=cheerio.load(raw,{xmlMode:true,decodeEntities:false});
 const svg=s('svg').first();const body=svg.html();
 const cryptoKey=Buffer.from((svg.attr('viewBox')||'')+body).toString('base64url').slice(0,24);
 const id='icon-'+cryptoKey;
 fileToId.set(file,id);
 if(!seen.has(id)){seen.add(id);defs.push(`<symbol id="${id}" viewBox="${svg.attr('viewBox')||'0 0 16 16'}">${body}</symbol>`)}
});
$('[data-icon]').each((_,node)=>{
 const n=$(node),file=n.attr('data-icon');if(!fileToId.has(file))return;
 n.empty();n.append(`<svg aria-hidden="true" focusable="false" class="block w-full h-full"><use href="#${fileToId.get(file)}"/></svg>`);
});
fs.writeFileSync('assets/icons.svg',`<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>${defs.join('')}</defs></svg>`);
const sprite=$('<div hidden aria-hidden="true" class="absolute w-0 h-0 overflow-hidden"></div>');sprite.html(fs.readFileSync('assets/icons.svg','utf8'));$('body').prepend(sprite);
fs.writeFileSync('index.html',$.html());
console.log('SVG symbols',seen.size);
