// Baut das Spiel zu einer einzigen HTML-Datei (web/index.html) – wie beim Original: keine Bilddateien, alles Code.
// Aufruf: node game/build.js
const fs = require('fs'), path = require('path');
const SRC = path.join(__dirname, 'src');
const argv = process.argv.slice(2), arg = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
const OUT = arg('--out') || path.join(__dirname, '..', 'web');
const ONLY = arg('--rooms') ? arg('--rooms').split(',') : null;   // nur diese Räume (Kunst + Logik), Rest weglassen
function list(dir) { return fs.readdirSync(dir).flatMap(f => { const p = path.join(dir, f); return fs.statSync(p).isDirectory() ? list(p) : (f.endsWith('.js') ? [p] : []); }); }
// Reihenfolge: Kern (00–09), Inhalte (10–89, auch Unterordner rooms/), Story (90–98), Start (99)
const files = list(SRC).sort((a, b) => {
  const ka = path.relative(SRC, a).replace(/\\/g, '/'), kb = path.relative(SRC, b).replace(/\\/g, '/');
  const rank = k => { const n = parseInt(path.basename(k), 10); if (k.startsWith('portraits/')) return 40; if (k.startsWith('rooms/art/')) return 45; if (k.startsWith('rooms/')) return 50; return isNaN(n) ? 60 : n; };
  return rank(ka) - rank(kb) || ka.localeCompare(kb);
});
let js = 'var M={VERSION:"1.0.0"};\n';
const keep = f => { if (!ONLY) return true; const k = path.relative(SRC, f).replace(/\\/g, '/'); if (!k.startsWith('rooms/')) return true; const id = path.basename(k, '.js'); if (k.startsWith('rooms/art/')) return ONLY.indexOf(id) >= 0; return id === 'flat'; };
for (const f of files.filter(keep)) js += `/* ---- ${path.relative(SRC, f).replace(/\\/g, '/')} ---- */\n` + fs.readFileSync(f, 'utf8') + '\n';
if (js.includes('</script')) throw new Error('</script im Quelltext');
const html = `<!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<meta name="theme-color" content="#08070d">
<title>Mala – Kapitel 1: Split</title>
<style>
:root{ background:#08070d; }
html,body{ margin:0; height:100%; background:#08070d; overflow:hidden; touch-action:none; overscroll-behavior:none; }
body{ display:flex; flex-direction:column; align-items:center; justify-content:center; -webkit-user-select:none; user-select:none; -webkit-touch-callout:none; }
#game{ display:block; image-rendering:pixelated; image-rendering:crisp-edges; touch-action:none; cursor:none; background:#08070d; }
#hint{ display:none; color:#82c1c9; font:13px/1.4 "Courier New",monospace; text-align:center; padding:14px 18px 0; max-width:30em; }
</style>
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icon-180.png">
<link rel="icon" type="image/png" href="icon-192.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="Mala">
</head><body>
<canvas id="game" width="320" height="200" aria-label="Mala – Kapitel 1: Split. Ein Point-and-Click-Adventure."></canvas>
<div id="hint">Dreh das Gerät quer.</div>
<script>
${js}
</script>
<div id="offline-note" style="display:none;position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:9;padding:8px 14px;border-radius:6px;background:#13111c;color:#82c1c9;font:14px/1.3 -apple-system,Helvetica,sans-serif;pointer-events:none;transition:opacity .6s"></div>
<script>
(function(){
  if (!('serviceWorker' in navigator) || location.protocol==='file:') return;
  var note=document.getElementById('offline-note');
  function show(t,ms){ note.textContent=t; note.style.display='block'; note.style.opacity='1'; if(ms) setTimeout(function(){ note.style.opacity='0'; setTimeout(function(){ note.style.display='none'; },700); },ms); }
  var shown=false;
  navigator.serviceWorker.addEventListener('message',function(e){ if(e.data==='offline-ready' && !shown){ shown=true; show('Offline bereit \\u2713',4000); } });
  window.addEventListener('load',function(){
    var first=!navigator.serviceWorker.controller; if(first) show('Wird f\\u00fcr offline gespeichert \\u2026');
    navigator.serviceWorker.register('sw.js').then(function(){ return navigator.serviceWorker.ready; }).then(function(reg){ if(reg.active) reg.active.postMessage('check'); }).catch(function(err){ console.warn('SW',err); if(first) note.style.display='none'; });
  });
})();
</script>
</body></html>
`;
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), html);
// Offline-Speicher: Versionsname aus dem Inhalt, damit installierte Fassungen Updates bekommen
{ const swp = path.join(OUT, 'sw.js'), src = path.join(__dirname, '..', 'web', 'sw.js');
  if (fs.existsSync(src)) { const hash = require('crypto').createHash('sha1').update(html).digest('hex').slice(0, 10);
    fs.writeFileSync(swp, fs.readFileSync(src, 'utf8').replace(/var VERSION = '[^']*';/, "var VERSION = 'mala-split-" + hash + "';")); } }
// Fassung als claude.ai-Artefakt: ohne eigenes Gerüst (wird beim Veröffentlichen ergänzt), ohne Offline-Teil
const ai = process.argv.indexOf('--artifact');
if (ai >= 0) {
  const page = `<title>Mala in Split</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
:root{ color-scheme:dark; background:#08070d; }
html,body{ height:100%; margin:0; background:#08070d; overflow:hidden; touch-action:none; overscroll-behavior:none; }
body{ box-sizing:border-box; display:flex; flex-direction:column; align-items:center; justify-content:center; padding-left:max(16px, env(safe-area-inset-left, 0px)); padding-right:max(16px, env(safe-area-inset-right, 0px)); padding-block:0; color:#82c1c9; -webkit-user-select:none; user-select:none; -webkit-touch-callout:none; }
#game{ display:block; image-rendering:pixelated; image-rendering:crisp-edges; touch-action:none; cursor:none; background:#08070d; }
#hint{ display:none; color:#82c1c9; font:13px/1.4 "Courier New",monospace; text-align:center; padding:14px 18px 0; max-width:30em; }
</style>
<canvas id="game" width="320" height="200" aria-label="Mala in Split. Ein Point-and-Click-Adventure."></canvas>
<div id="hint">Dreh das Gerät quer.</div>
<script>
window.MALA_FIT=function(){ var b=document.body, cs=getComputedStyle(b); return [b.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight), b.clientHeight]; };
${js}
</script>
`;
  const af = process.argv[ai + 1];
  fs.mkdirSync(path.dirname(af), { recursive: true });
  fs.writeFileSync(af, page);
  console.log('Artefakt', af, (page.length / 1024).toFixed(0) + ' KB');
}
console.log(path.relative(process.cwd(), path.join(OUT, 'index.html')) || 'index.html', (html.length / 1024).toFixed(0) + ' KB', files.length + ' Module');
