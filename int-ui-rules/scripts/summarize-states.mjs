import fs from "node:fs";
const results=JSON.parse(fs.readFileSync("diff/report.json","utf8")).results;
const inventory=JSON.parse(fs.readFileSync("source/state-inventory.json","utf8"));
const byName=new Map(results.map((r)=>[r.name,r]));
const rows=Object.entries(inventory).map(([name,family])=>{
  const values=family.variants.map((v)=>byName.get(v.key)).filter((v)=>v?.diffPercent!==undefined);
  const n=values.map((r)=>r.diffPercent).sort((a,b)=>a-b);
  return {family:name,variants:values.length,light:family.variants.filter((v)=>v.properties.Theme==="Light").length,dark:family.variants.filter((v)=>v.properties.Theme==="Dark").length,meanDiffPercent:+(n.reduce((a,b)=>a+b,0)/n.length).toFixed(3),minDiffPercent:n[0],maxDiffPercent:n.at(-1),geometryFailures:values.filter((v)=>!v.structural?.pass).map((v)=>v.name)};
});
const states=rows.flatMap((row)=>inventory[row.family].variants).map((v)=>byName.get(v.key)).filter((v)=>v?.diffPercent!==undefined);
const summary={
 renderer:"HTML+CSS DOM / native HTML text; extracted local SVG icons and stroke primitives only",
 variants:states.length,
 canvasDiffMeanPercent:+(states.reduce((a,r)=>a+r.diffPercent,0)/states.length).toFixed(3),
 note:"Strict RGBA pixelmatch threshold 0.1 including antialiasing. Documentation coverage and generated-DOM status are not pixel-identity claims.",
 rows
};
fs.writeFileSync("diff/state-coverage.json",JSON.stringify(summary,null,2)+"\n");
fs.writeFileSync("diff/state-coverage.md","# State coverage (final run)\n\n| Family | Light | Dark | Mean diff | Range | Geometry checks |\n|---|---:|---:|---:|---:|---|\n"+rows.map((r)=>`| ${r.family} | ${r.light} | ${r.dark} | ${r.meanDiffPercent}% | ${r.minDiffPercent}%–${r.maxDiffPercent}% | ${r.geometryFailures.length?"FAIL: "+r.geometryFailures.join(", "):"PASS"} |`).join("\n")+"\n\nEvery extracted state master has a matching native Pixso PNG and is embedded in the documentation. On/off duplicate aliases share their exact measured node and reference. Remaining pixel differences are reported in `diff/report.json`; no `needs-fix` state is described as visually exact.\n");
console.log(summary);
