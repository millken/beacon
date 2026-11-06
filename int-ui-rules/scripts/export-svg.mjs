// Plugin API evaluator script: exportAsync returns exact native SVG geometry.
export async function exportSourceSvg() {
  const ids = [
    "146:52058",
    "146:52068",
    "146:52071",
    "733:47034",
    "146:52092",
    "7399:46819",
    "7399:46991",
    "3590:81636",
    "3590:81640",
    "3590:81646",
    "5168:84067",
    "5168:84071",
    "7070:146270",
  ];
  const result = {};
  for (const id of ids) {
    const node = await pixso.getNodeByIdAsync(id);
    if (!node) throw new Error(`Missing source node ${id}`);
    const bytes = new Uint8Array(await node.exportAsync({ format: "SVG" }));
    const svg = String.fromCharCode(...bytes);
    if (!svg.startsWith("<svg") || !svg.endsWith("</svg>"))
      throw new Error(`Incomplete SVG ${id}`);
    result[id] = svg;
  }
  return result;
}
// For Pixso eval_script, invoke: exportSourceSvg()
