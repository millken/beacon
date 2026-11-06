import {chromium} from 'playwright';
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
page.on('pageerror',e=>console.error('JS ERROR',e.message));
await page.goto('file:///workspace/int-ui-tailwind/index.html');await page.screenshot({path:'screenshots/html-before-assets.png',fullPage:true});
console.log(await page.evaluate(()=>({height:document.body.scrollHeight,width:document.body.scrollWidth,components:document.querySelectorAll('[data-component]').length,title:document.querySelector('[data-pixso-id="6222:74502"]')?.getBoundingClientRect().toJSON(),basics:document.querySelector('[data-pixso-id="8063:76782"]')?.getBoundingClientRect().toJSON(),componentsRect:document.querySelector('[data-section="Components"]')?.getBoundingClientRect().toJSON(),guide:document.querySelector('[data-pixso-id="8151:76094"]')?.getBoundingClientRect().toJSON()})));
await browser.close();
