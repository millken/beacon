import fs from 'node:fs';
import * as cheerio from 'cheerio';
const inventory=JSON.parse(fs.readFileSync('inventory.json','utf8'));
const main=cheerio.load(fs.readFileSync('index.html','utf8'),{decodeEntities:false});
for(const item of inventory){
 const node=main('[data-pixso-id="'+item.node+'"]').first();
 if(!node.length)throw new Error('Missing source component '+item.name);
 const html=node.prop('outerHTML');
 fs.writeFileSync(item.file,`<!-- Int UI / ${item.name} / Pixso ${item.node} -->\n${html}\n`);
}
console.log('Synchronized',inventory.length,'component partials with inline SVG references');
