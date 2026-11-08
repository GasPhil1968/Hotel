// Baut das Spiel zu einer einzigen HTML-Datei (web/index.html) – wie beim Original: keine Bilddateien, alles Code.
// Aufruf: node game/build.js
const fs = require('fs'), path = require('path');
const SRC = (process.argv.indexOf('--src') >= 0 ? require('path').resolve(process.argv[process.argv.indexOf('--src') + 1]) : path.join(__dirname, 'src'));
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
// Syntaxprüfung je Datei: ein Tippfehler bricht den Bau mit Dateiname und Zeile ab, statt eine leere Seite zu liefern
for (const f of files.filter(keep)) { try { new (require('vm').Script)(fs.readFileSync(f, 'utf8'), { filename: path.relative(SRC, f) }); } catch (e) { console.error('Syntaxfehler: ' + (e.stack || e).toString().split('\n').slice(0, 4).join('\n')); process.exit(1); } }
if (js.includes('</script')) throw new Error('</script im Quelltext');
// Schriften für die HTML-Schicht (07_shell.js): „MALA Pixel“ aus der Spielschrift (design/tools/makefont.js) und die Leseschrift
// Atkinson Hyperlegible Next (SIL OFL 1.1, game/fonts/AtkinsonHyperlegibleNext-OFL.txt), lokal eingebettet – auch offline.
const FONTDIR = path.join(__dirname, 'fonts'), b64 = (f) => fs.readFileSync(path.join(FONTDIR, f)).toString('base64');
const UR_LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const UR_EXT = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';
let FONTS = '';
if (fs.existsSync(path.join(FONTDIR, 'MALAPixel.otf'))) {
  FONTS += `@font-face{font-family:"MALA Pixel";src:url(data:font/otf;base64,${b64('MALAPixel.otf')}) format("opentype");font-display:block}\n`;
  for (const w of [400, 700]) for (const [sub, ur] of [['latin', UR_LATIN], ['latin-ext', UR_EXT]])
    FONTS += `@font-face{font-family:"Atkinson Hyperlegible Next";font-weight:${w};font-style:normal;font-display:swap;src:url(data:font/woff2;base64,${b64('atkinson-hyperlegible-next-' + sub + '-' + w + '-normal.woff2')}) format("woff2");unicode-range:${ur}}\n`;
  FONTS += ':root{--mala-read:"Atkinson Hyperlegible Next",system-ui,-apple-system,"Segoe UI",sans-serif}\n';
}
// Passt die eingebettete Pixelschrift noch zur Schrifttabelle im Code? (makefont.js schreibt den Fingerabdruck daneben)
{ const core = fs.readFileSync(path.join(SRC, '00_core.js'), 'utf8'), m = core.match(/var F\s*=\s*\{[\s\S]*?\n\};/), fp = path.join(FONTDIR, 'MALAPixel.src.sha1');
  if (m && fs.existsSync(fp)) { const h = require('crypto').createHash('sha1').update(m[0]).digest('hex'); if (h !== fs.readFileSync(fp, 'utf8').trim()) console.warn('Hinweis: Schrifttabelle in 00_core.js geändert – design/tools/makefont.js neu ausführen (game/fonts/MALAPixel.otf)'); } }
const html = `<!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#08070d">
<title>Mala – Split, Sarajevo, Mostar, München</title>
<style>
${FONTS}:root{ background:#08070d; }
html,body{ margin:0; height:100%; background:#08070d; overflow:hidden; touch-action:manipulation; overscroll-behavior:none; }
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
<canvas id="game" width="320" height="200" aria-label="Mala – Kapitel 1: Split, Kapitel 2: Sarajevo, Kapitel 3: Mostar, Kapitel 4: München. Ein Point-and-Click-Adventure."></canvas>
<div id="hint">Dreh das Gerät quer.</div>
<script>
${js}
</script>
<div id="offline-note" role="status" style="display:none;position:fixed;top:8px;right:8px;z-index:9;max-width:18em;padding:4px 8px;border:1px solid #2c6074;border-radius:2px;background:rgba(8,7,13,.88);color:#82c1c9;font:12px/1.3 var(--mala-read,system-ui,-apple-system,Helvetica,sans-serif);pointer-events:none;transition:opacity .6s"></div>
<script>
(function(){
  if (!('serviceWorker' in navigator) || location.protocol==='file:') return;
  var note=document.getElementById('offline-note');
  // Systemmeldungen als kleine Marke oben rechts im Bild (in der Szene), nie über Menüzeilen oder Inventar (UI-Konzept D14)
  function place(){ var c=(window.M&&M.sceneRect)?M.sceneRect():document.getElementById('game'), r=c&&(c.getBoundingClientRect?c.getBoundingClientRect():c);
    if (!r||!r.width||document.documentElement.classList.contains('mala-rot')){ note.style.top='8px'; note.style.right='8px'; return; }
    note.style.top=Math.max(4,r.top+6)+'px'; note.style.right=Math.max(4,window.innerWidth-r.right+6)+'px'; }
  window.addEventListener('resize',function(){ if(note.style.display==='block') place(); });
  function show(t,ms){ try{ if(window.M&&M.trUI) t=M.trUI(t); }catch(e){} note.textContent=t; place(); note.style.display='block'; note.style.opacity='1'; if(ms) setTimeout(function(){ note.style.opacity='0'; setTimeout(function(){ note.style.display='none'; },700); },ms); }
  var shown=false;
  navigator.serviceWorker.addEventListener('message',function(e){ if(e.data==='offline-ready' && !shown){ shown=true; show('Offline bereit \\u2713',4000); } });
  // Update: Übernimmt eine neue Fassung die Seite, wird sie gleich geladen (auf dem Titelbild sofort, mitten im Spiel beim nächsten Titelbild)
  var hadCtl=!!navigator.serviceWorker.controller, reloading=false;
  function reloadNow(){ if(reloading) return; reloading=true; location.reload(); }
  navigator.serviceWorker.addEventListener('controllerchange',function(){ if(!hadCtl) return;
    if(!window.M||!M.E||M.E.screen==='title'){ reloadNow(); return; }
    show('Neue Fassung geladen \\u2013 sie startet beim n\\u00e4chsten Titelbild',6000);
    var iv=setInterval(function(){ if(window.M&&M.E&&M.E.screen==='title'){ clearInterval(iv); reloadNow(); } },1500); });
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
  const page = `<title>Mala in Sarajevo</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
${FONTS}:root{ color-scheme:dark; background:#08070d; }
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
