// UI-Bestandsaufnahme im echten Browser (Playwright): Screenshots der Oberflächenzustände von MALA und Vermessung aller
// Tipp-/Klickflächen (M.uiHit-Codes) in CSS-Pixeln je Gerät. Bedienung über Maus/Touch auf dem Canvas; der Spielzustand wird nur
// gelesen. Spielstände für spätere Stellen kommen aus qa/results/browser/states.json (regulär erspielt, über das Menü gespeichert).
//   node design/tools/capture.js [--device desktop|phone|tablet|phonePortrait] [--intro]
'use strict';
const path = require('path'), fs = require('fs'), http = require('http');
const a = process.argv.slice(2), arg = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const ROOT = path.join(__dirname, '..', '..'); const WEB = path.join(ROOT, 'web');
const STATES = JSON.parse(fs.readFileSync(path.join(ROOT, 'qa', 'results', 'browser', 'states.json'), 'utf8')).states;
const ST = (n) => STATES.find(s => s.name === n);
const pw = require('playwright'); const { launch, contextOpts } = require(path.join(ROOT, 'qa', 'browser', 'engines'));
const DEVICE = arg('--device', 'desktop'); const ENGINE = { desktop: 'chromium', tablet: 'chromium', phone: 'webkit', phonePortrait: 'webkit' }[DEVICE];
const OUT = path.join(ROOT, 'design', 'evidence', DEVICE); fs.mkdirSync(OUT, { recursive: true });
const PORT = 8170 + ['desktop', 'tablet', 'phone', 'phonePortrait'].indexOf(DEVICE);

function serve(dir, port) { const types = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain' };
  const srv = http.createServer((req, res) => { let p = decodeURIComponent(req.url.split('?')[0]); if (p === '/') p = '/index.html'; const f = path.join(dir, p); if (!f.startsWith(dir) || !fs.existsSync(f)) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-cache' }); fs.createReadStream(f).pipe(res); });
  return new Promise(r => srv.listen(port, '127.0.0.1', () => r(srv))); }

const HELPERS = `window.__qa = {
  rect: function(){ var cv=document.getElementById('game'), r=cv.getBoundingClientRect(); return { left:r.left, top:r.top, width:r.width, height:r.height, rot: !!(M.isRotated && M.isRotated()), vw: innerWidth, vh: innerHeight, dpr: devicePixelRatio }; },
  toClient: function(x,y){ var cv=document.getElementById('game'), r=cv.getBoundingClientRect(); if (M.isRotated && M.isRotated()) return [r.right - (y+0.5)/200*r.width, r.top + (x+0.5)/320*r.height]; return [r.left+(x+0.5)/320*r.width, r.top+(y+0.5)/200*r.height]; },
  scan: function(code){ M.renderFrame(); for (var y=1;y<200;y+=2) for (var x=1;x<320;x+=2){ if (M.uiHit(x,y)===code) return [x,y]; } for (var y2=0;y2<200;y2++) for (var x2=0;x2<320;x2++){ if (M.uiHit(x2,y2)===code) return [x2,y2]; } return null; },
  boxes: function(){ M.renderFrame(); var b={}; for (var y=0;y<200;y++) for (var x=0;x<320;x++){ var h=M.uiHit(x,y); if (!h) continue; var o=b[h]||(b[h]={x0:x,y0:y,x1:x,y1:y,n:0}); if(x<o.x0)o.x0=x; if(y<o.y0)o.y0=y; if(x>o.x1)o.x1=x; if(y>o.y1)o.y1=y; o.n++; } return b; },
  st: function(){ var E=M.E, p=E.player&&E.player(); return { scr:E.screen, room:E.room&&E.room.id, busy:!!E.busy, dlg:E.dlg?E.dlg.opts.map(function(o){return o.t;}):null, ov:E.overlay?E.overlay.kind:null, speech:E.speech?{t:E.speech.text||E.speech.t||null, who:E.speech.who||null}:null, acting:E.acting||0, walk:!!(p&&p.mode==='walk'), active:M.GS&&M.GS.active, phase:M.GS&&M.GS.phase, pop:E.pop?E.pop.opts.map(function(o){return o.t;}):null, menu:!!E.menu, title:(E.screen==='title'&&M.titleLabels)?M.titleLabels():null, msg:E.msg?(E.msg.t||E.msg):null }; }
};`;

(async () => {
  const srv = await serve(WEB, PORT); const URL = 'http://127.0.0.1:' + PORT + '/';
  const browser = await launch(pw, ENGINE); const log = { device: DEVICE, engine: ENGINE, version: browser.version(), shots: [], geometry: {}, notes: [], errors: [] };
  let n = 0;
  async function page0(opts = {}) {
    const ctx = await browser.newContext(Object.assign(contextOpts(pw, ENGINE, DEVICE), opts.ctx || {}));
    if (opts.storage) await ctx.addInitScript((s) => { if (!sessionStorage.getItem('__qaInit')) { sessionStorage.setItem('__qaInit', '1'); localStorage.clear(); Object.entries(s).forEach(([k, v]) => localStorage.setItem(k, v)); } }, opts.storage);
    const page = await ctx.newPage(); page.on('pageerror', e => log.errors.push(String(e.message || e)));
    await page.goto(URL); await page.waitForFunction(() => window.M && M.E && M.E.screen === 'title', null, { timeout: 30000 }); await page.addScriptTag({ content: HELPERS });
    if (opts.turbo) await page.evaluate((t) => { M.TURBO = t; }, opts.turbo);
    const touch = DEVICE !== 'desktop';
    const P = { ctx, page,
      st: () => page.evaluate(() => window.__qa.st()),
      async tap(x, y) { const c = await page.evaluate(([x, y]) => window.__qa.toClient(x, y), [x, y]); if (touch) await page.touchscreen.tap(c[0], c[1]); else await page.mouse.click(c[0], c[1]); await page.waitForTimeout(80); },
      async hover(x, y) { const c = await page.evaluate(([x, y]) => window.__qa.toClient(x, y), [x, y]); await page.mouse.move(c[0], c[1]); await page.waitForTimeout(150); },
      async tapCode(code) { const p = await page.evaluate((c) => window.__qa.scan(c), code); if (!p) throw new Error('nicht sichtbar: ' + code); await P.tap(p[0], p[1]); return p; },
      async title(label) { const p = await page.evaluate((lab) => { M.renderFrame(); const L = M.titleLabels(); const i = L.findIndex(t => t.indexOf(lab) >= 0); if (i < 0) return { miss: L }; return window.__qa.scan('t:' + i); }, label); if (!p || p.miss) throw new Error('Titelzeile fehlt: ' + label + ' ' + JSON.stringify(p)); await P.tap(p[0], p[1]); await page.waitForTimeout(200); },
      async until(pred, ms, what) { const t = Date.now(); let s; while (Date.now() - t < ms) { s = await P.st(); if (pred(s)) return s; await page.waitForTimeout(50); } throw new Error('Zeitüberschreitung ' + what + ' ' + JSON.stringify(s).slice(0, 300)); },
      async drain(max = 80) { for (let i = 0; i < max; i++) { const s = await P.st(); if (s.scr === 'card') { await P.tap(160, 100); continue; } if (s.speech) { await page.waitForTimeout(150); continue; } if (s.ov === 'memory' || s.ov === 'doc') { await P.tap(160, 60); await page.waitForTimeout(150); continue; } if (s.dlg) return s; if (s.scr === 'game' && !s.busy && !s.ov && !s.walk && !s.acting) return s; await page.waitForTimeout(120); } return P.st(); },
      async hsPoint(pred) { return page.evaluate((src) => { const f = eval('(' + src + ')'); const E = M.E, R = E.room, cam = Math.round(E.camX); for (const h of R.hotspots) { if (!f(h)) continue; const r = E.hsRect(h); if (!r) continue; for (let y = r[1] + 1; y < r[1] + r[3]; y += 2) for (let x = r[0] + 1; x < r[0] + r[2]; x += 2) { if (x - cam < 2 || x - cam > 317 || y > 142) continue; if (E.hotspotAt(x, y) === h) return { id: h.id, x: x - cam, y }; } } return null; }, String(pred)); },
      async esc(ctxName) { const b = await P.st(); await page.keyboard.press('Escape'); await page.waitForTimeout(250); const a2 = await P.st(); log.esc = log.esc || []; log.esc.push({ wo: ctxName, vorher: { pop: !!b.pop, ov: b.ov, menu: b.menu, dlg: !!b.dlg }, nachher: { pop: !!a2.pop, ov: a2.ov, menu: a2.menu, dlg: !!a2.dlg } }); return a2; },
      async closeAll() { for (let i = 0; i < 12; i++) { const s = await P.st(); if (s.menu) { await P.tapCode('m:0'); await page.waitForTimeout(200); continue; } if (s.pop) { await page.keyboard.press('Escape'); await page.waitForTimeout(200); continue; } if (s.dlg && !s.speech) { const k = s.dlg.length - 1; await P.tapCode('c:' + k).catch(async () => { await P.tapCode('cx').catch(() => {}); }); await page.waitForTimeout(300); continue; } if (s.ov === 'map') { await page.evaluate(() => (M.closeMap ? M.closeMap() : M.TA.closeOverlay(null))); continue; } if (s.ov) { await page.evaluate(() => M.TA.closeOverlay(null)); await page.waitForTimeout(200); continue; } if (s.speech || s.busy || s.walk) { await page.waitForTimeout(250); continue; } return s; } return P.st(); },
      async shot(name, note) { const f = String(++n).padStart(2, '0') + '_' + name + '.png'; await page.screenshot({ path: path.join(OUT, f) }); const geo = await page.evaluate(() => ({ rect: window.__qa.rect(), boxes: window.__qa.boxes(), st: window.__qa.st() })); log.geometry[f] = geo; log.shots.push({ file: f, note: note || '' }); return f; }
    };
    return P;
  }
  const step = async (name, fn) => { try { await fn(); } catch (e) { log.notes.push(name + ': ' + String(e.message || e).slice(0, 300)); console.log('  ! ' + name + ': ' + String(e.message || e).slice(0, 200)); } };

  // 1) Erststart ohne Spielstand: Titelbild (mit „Offline bereit“-Meldung), Platzwahl, Beginn Kapitel 1
  await step('erststart', async () => { const P = await page0(); await P.page.waitForTimeout(1500); await P.shot('titel_erststart', 'Erster Aufruf über http, leerer Speicher'); await P.page.waitForTimeout(4500); await P.shot('titel_ohne_meldung');
    if (DEVICE === 'desktop') { const p = await P.page.evaluate(() => window.__qa.scan('t:1')); if (p) { await P.hover(p[0], p[1]); await P.shot('titel_hover', 'Maus über der 2. Titelzeile'); } }
    await P.title('Kapitel 1'); await P.shot('titel_platzwahl', 'nach Tipp auf „Kapitel 1: Split“');
    if (arg('--intro') !== undefined || DEVICE === 'desktop') {
      // Intro in Echtzeit: jede neue Textzeile mit Zeitpunkt; Bilder zu festen Zeiten
      await P.title('Platz 1'); const t0 = Date.now(); const lines = []; let last = null; const marks = [1, 4, 8, 13, 20, 30, 45]; let mi = 0; let ctrlAt = null;
      while (Date.now() - t0 < 150000) { const s = await P.st(); const key = s.speech ? (s.speech.who || '') + '|' + (s.speech.t || '') : (s.scr + '|' + (s.ov || '') + '|' + (s.dlg ? 'dlg' : '')); const tt = (Date.now() - t0) / 1000;
        if (key !== last) { lines.push({ t: +tt.toFixed(2), scr: s.scr, ov: s.ov, who: s.speech && s.speech.who, text: s.speech && s.speech.t, dlg: s.dlg, room: s.room }); last = key; }
        if (mi < marks.length && tt >= marks[mi]) { await P.shot('intro_' + String(marks[mi]).padStart(2, '0') + 's', 'Intro nach ' + marks[mi] + ' s, ohne Eingabe'); mi++; }
        if (s.scr === 'game' && !s.busy && !s.speech && !s.ov && !s.dlg && !s.acting && !s.walk) { ctrlAt = tt; break; }
        if (s.dlg) { ctrlAt = tt; log.notes.push('Intro endet in einem Dialog nach ' + tt.toFixed(1) + ' s'); break; }
        await P.page.waitForTimeout(100); }
      log.intro = { untilControlS: ctrlAt, lines }; await P.shot('erste_kontrolle', 'erster Moment mit Spielerkontrolle (ohne Eingabe gewartet)');
    } else { await P.title('Platz 1'); await P.page.waitForTimeout(1500); await P.shot('intro_karte', 'Kapitelkarte 1,5 s nach Spielbeginn'); await P.page.waitForTimeout(5000); await P.shot('intro_erzaehlung', 'Erzählzeile im Raum (6,5 s)'); await P.page.evaluate(() => { M.TURBO = 20; }); await P.drain(); await P.page.waitForTimeout(1500); await P.drain(); await P.shot('erste_kontrolle'); }
    await P.page.evaluate(() => { M.TURBO = 20; });
    // HUD-Bedienung im ersten Raum
    if (DEVICE === 'desktop') { const h = await P.hsPoint((h) => !h.exit && !h.npc); if (h) { await P.hover(h.x, h.y); await P.shot('hover_hotspot', 'Maus über „' + h.id + '“'); } }
    const h2 = await P.hsPoint((h) => !h.exit); if (h2) { await P.tap(h2.x, h2.y); await P.page.waitForTimeout(300); await P.shot('verb_popup', 'Tipp auf Hotspot „' + h2.id + '“'); await P.esc('Verb-Popup offen'); await P.closeAll(); }
    await P.drain();
    await step('zeigen', async () => { await P.closeAll(); await P.page.evaluate(() => { M.TURBO = 1; }); await P.tapCode('reveal'); await P.page.waitForTimeout(500); await P.shot('zeigen', 'Knopf „Zeigen“ (normale Geschwindigkeit, 0,5 s danach)'); await P.page.waitForTimeout(3500); await P.shot('zeigen_spaeter', '4 s nach „Zeigen“'); await P.page.evaluate(() => { M.TURBO = 20; }); });
    await step('notizen', async () => { await P.drain(); await P.tapCode('notes'); await P.page.waitForTimeout(400); await P.shot('notizbuch', 'Knopf „Notizen“'); await P.esc('Notizbuch offen'); await P.closeAll(); });
    await step('menue', async () => { await P.drain(); await P.tapCode('menu'); await P.page.waitForTimeout(400); await P.shot('menue', 'Knopf „Menü“'); log.menuCodes = Object.keys(await P.page.evaluate(() => window.__qa.boxes())).filter(c => /^m:/.test(c));
      await P.page.evaluate(() => { M.TURBO = 1; }); await P.tapCode('m:1').catch(() => {}); await P.page.waitForTimeout(300); await P.shot('menue_speichern', '„Speichern (Platz 1)“ angetippt (normale Geschwindigkeit)'); await P.page.evaluate(() => { M.TURBO = 20; }); await P.esc('Pausenmenü offen');
      await P.closeAll(); await P.page.keyboard.press('Escape'); await P.page.waitForTimeout(250); const sm = await P.st(); log.notes.push('Escape im ruhigen Spiel: menu=' + sm.menu); await P.closeAll();
      await P.tapCode('menu'); await P.page.waitForTimeout(250); const mi = await P.page.evaluate(() => Object.keys(window.__qa.boxes()).filter(c => /^m:/.test(c)).length); await P.tapCode('m:' + (mi - 1)); await P.page.waitForTimeout(500); const sz = await P.st(); await P.shot('menue_zum_titelbild', '„Zum Titelbild“ angetippt (ohne Rückfrage?)'); log.notes.push('Zum Titelbild: scr=' + sz.scr + ' title=' + JSON.stringify(sz.title)); });
    await P.ctx.close();
  });

  // 2) Mit Spielstand: Titel mit „Fortsetzen“, Platzwahl, Überschreiben-Bestätigung, Mitgelieferte Spielstände, Über das Spiel
  await step('titel_mit_stand', async () => { const P = await page0({ storage: ST('k2_start').storage, turbo: 20 }); await P.page.waitForTimeout(600); await P.shot('titel_mit_spielstand', 'Spielstand Kapitel 2 im Speicher');
    await P.title('Fortsetzen'); await P.shot('titel_fortsetzen_platz', 'nach „Fortsetzen“'); await P.page.keyboard.press('Escape'); await P.page.waitForTimeout(300);
    let s = await P.st(); if (!(s.title || []).some(t => /Kapitel 1/.test(t))) { await P.page.evaluate(() => M.E.toTitle()); await P.page.waitForTimeout(300); }
    await P.title('Kapitel 1'); await P.shot('titel_neu_platzwahl_belegt', '„Kapitel 1“ bei belegtem Platz 1'); s = await P.st(); log.notes.push('Platzwahl bei belegtem Platz: ' + JSON.stringify(s.title));
    await P.title('Platz 1').catch(() => {}); await P.page.waitForTimeout(300); await P.shot('titel_ueberschreiben', '„Platz 1“ (belegt) angetippt'); s = await P.st(); log.notes.push('Nach Tipp auf belegten Platz: ' + JSON.stringify(s.title) + ' scr=' + s.scr);
    await P.page.evaluate(() => M.E.toTitle()); await P.page.waitForTimeout(300);
    await step('presets', async () => { await P.title('Mitgelieferte'); await P.shot('titel_mitgelieferte', '„Mitgelieferte Spielstände“'); const s2 = await P.st(); log.notes.push('Mitgelieferte: ' + JSON.stringify(s2.title)); await P.page.evaluate(() => M.E.toTitle()); await P.page.waitForTimeout(300); });
    await step('about', async () => { await P.title('Über das Spiel'); await P.page.waitForTimeout(400); await P.shot('titel_ueber', '„Über das Spiel“'); const s3 = await P.st(); log.notes.push('Über: scr=' + s3.scr + ' ov=' + s3.ov + ' title=' + JSON.stringify(s3.title)); await P.page.keyboard.press('Escape'); await P.page.waitForTimeout(300); });
    await step('sprache', async () => { await P.page.evaluate(() => M.E.toTitle()); await P.page.waitForTimeout(300); const before = await P.st(); await P.title('Sprache'); await P.page.waitForTimeout(400); await P.shot('titel_sprache', '„Sprache: …“ angetippt'); const s4 = await P.st(); log.notes.push('Sprache vorher ' + JSON.stringify(before.title) + ' nachher ' + JSON.stringify(s4.title)); await P.title('Jezik').catch(async () => { await P.title('Sprache').catch(() => {}); }); });
    // Spiel in Kapitel 2: Dialog, Inventar, Mala, Rätsel/Dokument, Karte
    await P.page.evaluate(() => M.E.toTitle()); await P.page.waitForTimeout(300); await P.title('Fortsetzen'); await P.title('Platz 1'); await P.until(s => s.scr === 'game', 20000, 'geladen'); await P.drain(); await P.shot('k2_start_hud', 'Spielstand Kapitel 2 geladen');
    await step('dialog', async () => { const f = await P.hsPoint((h) => h.npc === 'fikret'); if (!f) throw new Error('Fikret nicht im Bild'); await P.tap(f.x, f.y); await P.page.waitForTimeout(300); let s = await P.st(); if (s.pop) { await P.shot('npc_popup', 'Tipp auf Fikret'); const i = s.pop.findIndex(t => /Rede/.test(t)); await P.tapCode('p:' + i); }
      s = await P.until(x => x.dlg || x.speech, 15000, 'Gespräch'); await P.page.waitForTimeout(200); if (s.speech) await P.shot('npc_rede', 'Fikret spricht'); s = await P.until(x => x.dlg && !x.speech, 30000, 'Antwortoptionen'); await P.shot('dialog_optionen', 'Antwortoptionen Fikret'); log.dialogOptions = s.dlg;
      const i2 = s.dlg.findIndex(t => /Brief/.test(t)); if (i2 >= 0) { await P.tapCode('c:' + i2); const s2 = await P.until(x => x.ov === 'doc' || x.ov === 'puzzle', 40000, 'Brief'); await P.page.waitForTimeout(300); await P.shot('dokument_brief', 'Brief als Dokument'); if (s2.ov === 'doc') { await P.tap(160, 60); } await P.until(x => x.ov === 'puzzle', 40000, 'Rätsel'); await P.page.waitForTimeout(300); await P.shot('raetsel_puzzle', 'Übersetzungsrätsel'); await P.tapCode('zgo').catch(() => {}); await P.page.waitForTimeout(300); await P.shot('raetsel_rueckmeldung', 'nach „Vorlesen“ mit falscher Fassung'); await P.tapCode('zx').catch(() => {}); } await P.drain(); });
    await P.closeAll();
    await step('notizbuch_k2', async () => { await P.closeAll(); await P.tapCode('notes'); await P.page.waitForTimeout(400); await P.shot('k2_notizbuch', 'Notizbuch in Kapitel 2'); const nb = await P.page.evaluate(() => Object.keys(window.__qa.boxes())); log.notes.push('Notizbuch-Codes: ' + nb.join(',')); await P.closeAll(); });
    await step('menue_k2', async () => { await P.closeAll(); await P.tapCode('menu'); await P.page.waitForTimeout(300); await P.shot('k2_menue', 'Pausenmenü in Kapitel 2'); const L = await P.page.evaluate(() => Object.keys(window.__qa.boxes()).filter(c => /^m:/.test(c))); log.menuRows = L.length;
      await P.tapCode('m:10'); await P.page.waitForTimeout(600); await P.shot('k2_hinweis', '„Hinweis …“'); const sh = await P.st(); log.notes.push('Hinweis: ov=' + sh.ov + ' dlg=' + JSON.stringify(sh.dlg) + ' speech=' + JSON.stringify(sh.speech)); if (sh.dlg) { const i1 = 0; await P.tapCode('c:' + i1).catch(() => {}); await P.page.waitForTimeout(600); await P.shot('k2_hinweis_stufe1', 'erste Hinweiszeile gewählt'); const sh2 = await P.st(); log.notes.push('Hinweis 1: ' + JSON.stringify(sh2.speech || sh2.dlg).slice(0, 300)); }
      await P.closeAll(); await P.tapCode('menu'); await P.page.waitForTimeout(300); await P.tapCode('m:11'); await P.page.waitForTimeout(600); await P.shot('k2_anleitung', '„Spielanleitung“'); const sa = await P.st(); log.notes.push('Anleitung: ov=' + sa.ov + ' speech=' + JSON.stringify(sa.speech)); await P.closeAll(); });
    await step('inventar', async () => { await P.closeAll(); const b = await P.page.evaluate(() => window.__qa.boxes()); const inv = Object.keys(b).filter(c => /^i:\d/.test(c)); log.notes.push('Inventar-Codes: ' + inv.join(',')); if (inv.length) { await P.tapCode(inv[0]); await P.page.waitForTimeout(300); await P.shot('inventar_popup', 'Tipp auf ersten Gegenstand'); const s = await P.st(); if (s.pop) { const i = s.pop.findIndex(t => /Benutze/.test(t)); if (i >= 0) { await P.tapCode('p:' + i); await P.page.waitForTimeout(300); await P.shot('inventar_benutze', '„Benutze“ gewählt (Gegenstand hängt am Zeiger/Finger)'); await P.esc('Gegenstand ausgewählt'); } } await P.closeAll(); } });
    await step('mala', async () => { await P.closeAll(); await P.tapCode('sw'); await P.page.waitForTimeout(800); await P.shot('mala_aktiv', 'Figurenwechsel zu Mala'); await P.tapCode('sw'); await P.page.waitForTimeout(600); });
    await step('karte', async () => { await P.closeAll(); await P.tapCode('map'); await P.page.waitForTimeout(500); await P.shot('karte', 'Knopf „Karte“'); await P.esc('Karte offen'); await P.closeAll(); });
    await P.ctx.close();
  });

  // 3) Spätere Stände: K3 Peilung, K4 Silvester (Tageskarte), K1 Kühlraum (dunkel)
  for (const [st, name] of [['k3_peil', 'k3'], ['k4_silvester', 'k4'], ['k2_limbo', 'k2_limbo']]) {
    await step(name, async () => { const P = await page0({ storage: ST(st).storage, turbo: 20 }); await P.title('Fortsetzen'); await P.title('Platz 1'); await P.until(s => s.scr === 'game' || s.scr === 'card', 20000, 'geladen'); await P.page.waitForTimeout(400); const s = await P.st(); if (s.scr === 'card') await P.shot(name + '_karte', 'Tageskarte nach dem Laden'); await P.drain(); await P.shot(name + '_szene', 'Stand ' + st);
      await step(name + '_mala', async () => { const b = await P.page.evaluate(() => Object.keys(window.__qa.boxes())); if (b.indexOf('sw') < 0) { log.notes.push(name + ': kein Wechselknopf'); return; } await P.page.evaluate(() => { M.TURBO = 1; }); await P.tapCode('sw'); await P.page.waitForTimeout(900); await P.shot(name + '_mala_aktiv', 'Figurenwechsel zu Mala (Porträtknopf)'); await P.tapCode('sw'); await P.page.waitForTimeout(700); await P.page.evaluate(() => { M.TURBO = 20; }); });
      if (name === 'k3') { await step('peil', async () => { const v = await P.hsPoint((h) => h.id === 'view' || /view|aussicht/i.test(h.id)); if (v) { await P.tap(v.x, v.y); await P.page.waitForTimeout(300); const s2 = await P.st(); if (s2.pop) { const i = s2.pop.findIndex(t => /Benutze/.test(t)); if (i >= 0) await P.tapCode('p:' + i); } await P.until(x => x.ov === 'peil' || x.speech || x.dlg, 15000, 'Peilung').catch(() => {}); await P.page.waitForTimeout(500); await P.shot('k3_peilung', 'Aussicht benutzt'); } }); }
      await P.ctx.close(); });
  }
  // 4) Hochformat-Hinweis / gedrehtes Bild bereits durch phonePortrait abgedeckt
  fs.writeFileSync(path.join(OUT, 'capture.json'), JSON.stringify(log, null, 1));
  console.log(DEVICE + ': ' + log.shots.length + ' Bilder, Hinweise: ' + log.notes.length + ', Seitenfehler: ' + log.errors.length);
  await browser.close(); srv.close();
})().catch(e => { console.error(e); process.exit(1); });
