// Local-only docs preview. Keep generated assets, tokens and isolated previews
// at their natural project-root URLs while exposing public/pages at /pages.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { URL, fileURLToPath } from "node:url";

const root = fs.realpathSync(process.cwd());
const publicRoot = path.join(root, "public");
const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : fallback;
};
const host = arg("--host", "127.0.0.1");
const port = Number(arg("--port", "3000"));
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".ttf": "font/ttf", ".svg": "image/svg+xml", ".png": "image/png", ".md": "text/markdown; charset=utf-8" };

function resolveRequest(url) {
  let pathname;
  try { pathname = decodeURIComponent(new URL(url, "http://localhost").pathname); }
  catch { return null; }
  const fromPublic = pathname === "/" || pathname === "/index.html" || pathname === "/site.css" || pathname === "/site.js" || pathname.startsWith("/pages/");
  const candidate = path.resolve(fromPublic ? publicRoot : root, `.${pathname === "/" ? "/index.html" : pathname}`);
  const allowed = fromPublic ? publicRoot + path.sep : root + path.sep;
  if (!candidate.startsWith(allowed)) return null;
  return candidate;
}

export const createDocsServer = () => http.createServer((req, res) => {
  const file = resolveRequest(req.url || "/");
  if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }
  res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
  fs.createReadStream(file).on("error", () => res.destroy()).pipe(res);
});
// Importing the server does not reserve a port; npm run check uses an ephemeral port.
export function listenDocs({listenHost = host, listenPort = 0, quiet = true} = {}) {
  const server = createDocsServer();
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(listenPort, listenHost, () => {
      server.off("error", reject);
      if (!quiet) console.log(`Int UI docs: http://${listenHost}:${listenPort} (Ctrl+C to stop)`);
      resolve(server);
    });
  });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createDocsServer();
  server.on("error", error => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, host, () => console.log(`Int UI docs: http://${host}:${port} (Ctrl+C to stop)`));
}
