/** Read-only Pixso extraction. Run `node scripts/extract-component.mjs` to print the script.
 * Pass its output to user-Pixso/eval_script. Save returned roots individually as
 * source/components/<id-with-colon-replaced-by-dash>.json; no prior HTML is read. */
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
const fields = [
  "fills",
  "strokes",
  "strokeWeight",
  "strokeAlign",
  "cornerRadius",
  "topLeftRadius",
  "topRightRadius",
  "bottomLeftRadius",
  "bottomRightRadius",
  "opacity",
  "effects",
  "layoutMode",
  "primaryAxisSizingMode",
  "counterAxisSizingMode",
  "primaryAxisAlignItems",
  "counterAxisAlignItems",
  "itemSpacing",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "clipsContent",
  "characters",
  "fontName",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  "textAlignHorizontal",
  "textAlignVertical",
  "textAutoResize",
  "fillStyleId",
  "strokeStyleId",
  "textStyleId",
  "effectStyleId",
];
function pick(n, depth) {
  const o = {
    id: n.id,
    name: n.name,
    type: n.type,
    width: n.width,
    height: n.height,
    x: n.x,
    y: n.y,
    visible: n.visible,
  };
  for (const k of fields) {
    try {
      if (n[k] !== undefined) o[k] = n[k];
    } catch {}
  }
  if (depth > 0 && "children" in n)
    o.children = n.children.map((c) => pick(c, depth - 1));
  return o;
}
const roots = [];
for (const id of ids) roots.push(pick(await pixso.getNodeByIdAsync(id), 12));
return { roots };
