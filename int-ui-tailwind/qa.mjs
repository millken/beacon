import fs from 'node:fs';
import {chromium} from 'playwright';
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failed.push({url:r.url(),reason:r.failure()?.errorText}));
await page.goto('file:///workspace/int-ui-tailwind/index.html');await page.evaluate(()=>document.fonts.ready);
const report=await page.evaluate(()=>({title:document.title,components:document.querySelectorAll('[data-component]').length,svgUses:document.querySelectorAll('use').length,missingSvgReferences:[...document.querySelectorAll('use')].filter(x=>!document.querySelector(x.getAttribute('href'))).map(x=>x.getAttribute('href')),undefinedMarkup:document.body.innerHTML.includes('undefined'),width:document.body.scrollWidth,height:document.body.scrollHeight,fonts:{inter:document.fonts.check('13px Inter'),mono:document.fonts.check('13px "JetBrains Mono"')}}));
const files=['index.html',...JSON.parse(fs.readFileSync('inventory.json','utf8')).map(x=>x.file)];
const missingAssets=[];for(const file of files){const html=fs.readFileSync(file,'utf8');for(const m of html.matchAll(/(?:\.\.\/)?assets\/(icons|images)\/([A-Za-z0-9_.-]+)/g)){const p=m[1]==='images'&&m[2].endsWith('.svg')?'assets/icons/'+m[2]:'assets/'+m[1]+'/'+m[2];if(!fs.existsSync(p))missingAssets.push({file,asset:p})}}
const result={...report,pageErrors:errors,failedRequests:failed,missingAssets};fs.writeFileSync('qa-report.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
await browser.close();if(errors.length||failed.length||missingAssets.length||report.components!==30||report.missingSvgReferences.length||report.undefinedMarkup)process.exit(1);
