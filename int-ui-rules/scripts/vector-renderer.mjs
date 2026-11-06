import fs from 'node:fs';
const assets=JSON.parse(fs.readFileSync('source/vector-and-styles.json','utf8'));
const {chromium}=await import('playwright');
fs.mkdirSync('assets/vectors',{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--force-device-scale-factor=1']});
const page=await browser.newPage();
for(const asset of assets.vectors){
 if(!asset.svg)continue;
 await page.setContent(`<style>html,body{margin:0;padding:0;background:transparent}</style>${asset.svg}`);
 const svg=page.locator('svg');await svg.screenshot({path:`assets/vectors/${asset.id.replaceAll(':','-')}.png`,omitBackground:true});
}
await browser.close();
console.log(`Rendered ${assets.vectors.filter(a=>a.svg).length} rule-extracted SVG assets at native pixel dimensions.`);
