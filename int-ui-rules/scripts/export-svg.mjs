// Plugin API evaluator script: exportAsync returns exact native SVG geometry.
export async function exportSourceSvg() {
  const ids = [

  "5875:79108",,
  "1146:54209",,
  "7278:46644",,
  "7040:84853",,
  "217:51357",,
  "605:47011",,
  "6551:84194",,
  "7070:138481",,
  "3342:83343",,
  "3346:81595",,
  "7944:74792",,
  "46:11087",,
  "3894:82043",,
  "3894:82033",,
  "7944:74566",,
  "7070:146044",,
  "6517:82734",,
  "7281:46903",,
  "7059:86469",,
  "5767:82631",,
  "3595:83697",,
  "55:9038",,
  "56:8740",,
  "71:11758",,
  "5664:79159",,
  "6222:73548",,
  "3711:79011",,
  "146:52058",,
  "146:52068",,
  "146:52071",,
  "733:47034",,
  "146:52092",,
  "7399:46819",,
  "7399:46991",,
  "3590:81640",,
  "3590:81636",,
  "3590:81646",,
  "5168:84067",,
  "5168:84071",,
  "7070:146270",
];
  const result = {};
  for (const id of ids) {
    const node = await pixso.getNodeByIdAsync(id);
    if (!node) throw new Error(`Missing source node ${id}`);
    const bytes = new Uint8Array(await node.exportAsync({ format: "SVG" }));
    let svg = "";
    for (let i = 0; i < bytes.length; i += 8192)
      svg += String.fromCharCode(...bytes.subarray(i, i + 8192));
    svg = svg.trim().replace(/^<\?xml[^>]*>\s*/, "").replace(/<!--[\s\S]*?-->\s*/g, "");
    if (!svg.startsWith("<svg") || !svg.endsWith("</svg>"))
      throw new Error(`Incomplete SVG ${id}`);
    result[id] = svg;
  }
  return result;
}
// For Pixso eval_script, invoke: exportSourceSvg()
if (process.argv[1]?.endsWith("export-svg.mjs")) console.log(`(${exportSourceSvg})()`);
