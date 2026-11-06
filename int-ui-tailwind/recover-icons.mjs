import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
const manifest=JSON.parse(fs.readFileSync('source/assets-to-export.json','utf8'));
const used=new Set([...fs.readFileSync('index.html','utf8').matchAll(/assets\/icons\/([^)'"_]+\.svg)/g)].map(x=>x[1]));
const files=fs.readdirSync('source/exports').filter(x=>x.endsWith('.svg'));
const docs=files.map(file=>({file,$:cheerio.load(fs.readFileSync('source/exports/'+file,'utf8'),{xmlMode:true,decodeEntities:false})}));
const norm=s=>s.toLowerCase().replace(/[^a-z0-9]/g,'');
const base=s=>norm(s.replace(/\.svg$/,'').replace(/([a-zA-Z])\d+$/, '$1'));
fs.mkdirSync('assets/icons',{recursive:true});
const report=[];
for(const item of manifest.filter(x=>used.has(x.name))){
 let matches=[];let target=base(item.name);
 for(const {file,$} of docs){
  $('g').each((_,g)=>{const id=$(g).attr('id')||'';const aliases={cup:'cup',vector20:'Vector 20',vector309:'Vector 309',vector11:'Vector 11',group10:'Group 10',group1214:'Group 1214',minwidth:'min-width',leftlegs:'left-legs',rightlegs:'right-legs',toolwindowmaven20x20:'toolwindow / maven@20x20',toolwindowrun20x20:'toolwindow / run@20x20',toolwindowvcs20x20:'toolwindow / vcs@20x20',toolwindowproblems20x20:'toolwindow / problems@20x20',toolwindowcommit20x20:'toolwindow / commit@20x20',toolwindowbookmarks20x20:'toolwindow / bookmarks@20x20'};if(!id||norm(id)!==target && norm(id)!==norm(aliases[target]||'') && norm(id)!==norm(target.replace('20x20','')) )return;
   const r=$(g).children('rect').first();let w=parseFloat(r.attr('width')),h=parseFloat(r.attr('height'));
   if(!(w>0&&h>0&&w<100&&h<100))return;
   if($(g).attr('opacity')==='0')return;
   const paths=$(g).find('path').length+$(g).find('circle').length+$(g).find('ellipse').length+$(g).find('rect[fill]').length;
   if(!paths)return;
   matches.push({file,$,g,w,h,paths,x:parseFloat(r.attr('x')||0),y:parseFloat(r.attr('y')||0)});
  });
 }
 if(!matches.length){report.push({name:item.name,guid:item.guid,status:'unmatched'});continue}
 // Exact vector group recovered from source exports. Prefer a small non-empty icon group.
 matches.sort((a,b)=>(a.paths-b.paths)||(a.w*a.h-b.w*b.h));
 let m=matches[0];const {file,$,g,w,h,x,y}=m;
 const defs=$('defs').first().clone();const group=$(g).clone();
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${w}" height="${h}" fill="none">\n${defs.length?$.html(defs):''}\n${$.html(group)}\n</svg>\n`;
 fs.writeFileSync('assets/icons/'+item.name,svg);
 report.push({name:item.name,guid:item.guid,status:'recovered',source:file,group:$(g).attr('id'),width:w,height:h});
}
fs.writeFileSync('source/icon-recovery.json',JSON.stringify(report,null,2));
console.log('Recovered',report.filter(x=>x.status==='recovered').length,'of',report.length);console.log('Unmatched:',report.filter(x=>x.status!=='recovered').map(x=>x.name+' '+x.guid).join('\n'));
