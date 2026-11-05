// Klicktests: Bedienung nur über sichtbare Mausklicks (keine Test-API für das, was geprüft wird).
//   node game/tools/klicktests.js <Ordner mit Zwischenständen aus walkthrough3.js (MALA_DUMPALL)> [nur=name,name]
// Prüft (Prüfbericht K3, zweite Prüfung):
//   karte_bleiben / karte_allein  Stadtplan → Partisanenfriedhof vor der Straßenbrücke: die Auswahl „Allein gehen / Bei ihr bleiben“
//                                 muss per Klick erreichbar sein; danach arbeiten Plan und Reisen normal weiter.
//   ordnen8 / ordnen7             „Die Nacht zum 15. Januar 1994“ mit acht Karten (Hühnerfrage gestellt) und mit sieben:
//                                 Karten per Klick tauschen, falsche Reihenfolge zeigt die Rückmeldung im Bild, „So war es“ ist klickbar.
//   bus3 / bus2                   Direkteinstieg in Kapitel 3 und 2: die Erinnerung „Im Bus“ ist sofort sichtbar und per Klick zu schließen.
//   bus3_raum                     dasselbe mit einem schon geladenen Raum (Übergang nach dem Abspann von Kapitel 2): dunkler Grund
//   laden                         Laden während einer Schlussfolgerungsreaktion: Reaktion wird nachgeholt, keine Wartesperre.
// Die Stände werden nach Inhalt gewählt (Phase, Notizen, Schalter), nicht nach Nummer.
// Wo ein Test einen Stand künstlich ändert, steht es dabei (isolierter Teststand).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.argv[2]; const ONLY = (process.argv[3] || '').split(',').filter(Boolean);
if (!DIR || !fs.existsSync(DIR)) { console.error('Ordner mit Zwischenständen fehlt (MALA_DUMPALL von walkthrough3.js)'); process.exit(2); }
const DUMPS = fs.readdirSync(DIR).filter(f => /^\d+\.json$/.test(f)).sort().map(f => ({ f, j: JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')) }));
function pick(pred, what) { const d = DUMPS.find(x => pred(x.j.GS)); if (!d) throw new Error('kein passender Zwischenstand: ' + what); return d; }
const has = (G, n) => G.notes.indexOf(n) >= 0;
let ok = true; const check = (c, t) => { console.log((c ? 'OK     ' : 'FEHLER ') + t); if (!c) ok = false; return c; };

(async () => {
  const browser = await chromium.launch();
  async function page0() {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } }); const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    await page.goto('file://' + (process.env.MALA_HTML || path.join(__dirname, '..', '..', 'web', 'index.html')));
    await page.waitForTimeout(200);
    await page.evaluate(() => { M.TEST = true; M.TURBO = 8; try { localStorage.clear(); } catch (e) {} });
    const P = {
      page, errs,
      ev: (fn, a) => page.evaluate(fn, a),
      async css(x, y) { return page.evaluate(([x, y]) => { const r = document.getElementById('game').getBoundingClientRect(); return [r.left + (x + 0.5) / 320 * r.width, r.top + (y + 0.5) / 200 * r.height]; }, [x, y]); },
      async click(x, y) { const c = await P.css(x, y); await page.mouse.move(c[0], c[1]); await page.waitForTimeout(30); await page.mouse.down(); await page.waitForTimeout(30); await page.mouse.up(); await page.waitForTimeout(120); },
      async clickRect(r) { return P.click(r[0] + (r[2] >> 1), r[1] + (r[3] >> 1)); },
      st: () => page.evaluate(() => { const E = M.E, ov = E.overlay; return { screen: E.screen, ov: ov ? ov.kind : null, acting: !!(ov && ov.data && ov.data.acting), dlg: !!E.dlg, busy: !!E.busy, speech: !!E.speech, room: E.room ? E.room.id : null, phase: M.GS.phase, trn: !!E.transitioning }; }),
      async until(pred, ms, what) { const t0 = Date.now(); let s; while (Date.now() - t0 < ms) { s = await P.st(); if (pred(s)) return s; await page.waitForTimeout(50); } throw new Error('Zeitüberschreitung (' + what + '): ' + JSON.stringify(s)); },
      // Sprechblasen per Klick weiterschalten, bis das Spiel wartet
      async settle(ms, stopAt) { const t0 = Date.now(); while (Date.now() - t0 < (ms || 20000)) { const s = await P.st(); if (stopAt && stopAt(s)) return s; if (s.screen === 'game' && !s.busy && !s.speech && !s.dlg && !s.ov && !s.trn) return s; if (s.dlg || (s.ov && s.ov !== 'map')) return s; await page.waitForTimeout(60); } return P.st(); },   // Sprechblasen laufen von selbst ab (kein Klick ins Bild)
      async load(G) { await page.evaluate((g) => { localStorage.setItem('mala.save.2', JSON.stringify({ GS: g, at: 1 })); M.E.setSlot && M.E.setSlot(2); M.E.loadGame(2); }, G); await page.waitForTimeout(300); },
      // eine sichtbare Auswahlzeile mit diesem Text anklicken
      async chooseText(sub) { const r = await page.evaluate((s) => { const d = M.E.dlg; if (!d || !d.lay) return null; const row = d.lay.rows.find(x => (d.opts[x.k].t || '').indexOf(s) >= 0); return row ? row.r : null; }, sub); if (!r) throw new Error('Auswahl nicht sichtbar: ' + sub); await P.clickRect(r); },
      // Rahmen der gerade gezeichneten Overlay-Flächen
      ovLay: () => page.evaluate(() => { const ov = M.E.overlay; if (!ov || !ov.lay) return null; return { hits: (ov.lay.hits || []).map(h => ({ id: h.id, r: h.r })), msg: ov.lay.msg || null, ord: ov.ord ? ov.ord.slice() : null, n: ov.data.items ? ov.data.items.length : 0, msgText: ov.msg || null }; }),
      // Anteil der Bildpunkte im Erinnerungsbild, die im gezeichneten Bild wirklich so erscheinen (0 = unsichtbar)
      memVisible: () => page.evaluate(() => { const ov = M.E.overlay; if (!ov || ov.kind !== 'memory') return -2; const fb = M.renderFrame(); if (!ov.pic) return -1; let eq = 0, tot = 0; for (let y = 12; y < 92; y++) for (let x = 12; x < 220; x++) { tot++; if (fb.d[(8 + y) * 320 + 44 + x] === ov.pic.d[y * 232 + x]) eq++; } return Math.round(eq / tot * 100) / 100; })
    };
    return P;
  }
  const want = (n) => !ONLY.length || ONLY.indexOf(n) >= 0;
  const inScreen = (r) => r && r[0] >= 0 && r[1] >= 0 && r[0] + r[2] <= 320 && r[1] + r[3] <= 200;

  // ------------------------------------------------ Stadtplan und Reise-Auswahl
  for (const variant of ['bleiben', 'allein']) {
    const name = 'karte_' + variant; if (!want(name)) continue;
    const P = await page0();
    try {
      const d = pick(G => G.phase === 'k3_d1' && has(G, 'l3_flat') && !G.flags['k3.mala.crossed'] && !has(G, 'l3_area'), 'Freitag, flach geschnitten, Mala noch nicht über den Fluss');
      await P.load(d.j.GS); await P.settle();
      await P.ev(() => M.openMap()); await P.until(s => s.ov === 'map', 3000, 'Plan offen'); await P.page.waitForTimeout(400);
      const c = await P.ev(() => M.mapCenter('partizan')); await P.click(c[0], c[1]);
      const s1 = await P.until(s => s.dlg || (s.ov === 'map' && !s.acting && !s.speech), 15000, 'Auswahl nach dem Partisanenfriedhof');
      check(s1.dlg, name + ': die Auswahl „Allein gehen / Bei ihr bleiben“ erscheint (' + d.f + ')');
      const s1b = await P.st(); check(!(s1b.ov === 'map'), name + ': der Plan liegt nicht über der Auswahl');
      await P.chooseText(variant === 'bleiben' ? 'Bei ihr bleiben' : 'Allein gehen');
      const s2 = await P.settle(30000); check(s2.screen === 'game' && !s2.dlg && !s2.ov && !s2.busy, name + ': danach wartet das Spiel wieder (' + JSON.stringify(s2) + ')');
      // weiter: Plan öffnen und zur Straßenbrücke reisen (Klick)
      await P.ev(() => M.openMap()); await P.until(s => s.ov === 'map', 3000, 'Plan wieder offen'); await P.page.waitForTimeout(400);
      const c2 = await P.ev(() => M.mapCenter('strassenbr')); await P.click(c2[0], c2[1]);
      const s3 = await P.settle(30000, s => s.room === 'strassenbr' && !s.trn);
      check(s3.room === 'strassenbr', name + ': die Reise zur Straßenbrücke klappt danach per Klick (' + s3.room + ')');
    } catch (e) { check(false, name + ': ' + e.message); }
    check(!P.errs.length, name + ': keine JS-Fehler' + (P.errs.length ? ': ' + P.errs[0] : '')); await P.page.close();
  }

  // ------------------------------------------------ Die Nacht ordnen (acht und sieben Karten)
  for (const n of [8, 7]) {
    const name = 'ordnen' + n; if (!want(name)) continue;
    const P = await page0();
    try {
      const d = pick(G => G.phase === 'k3_d3' && has(G, 'a3_lightseq') && has(G, 'v3_part1') && !has(G, 'a3_lightroom') && has(G, 'a3_morning'), 'Sonntag, Lichtfolge und Vlados Zeiten, noch nicht geordnet, Hühnerfrage gestellt');
      const G = JSON.parse(JSON.stringify(d.j.GS));
      if (n === 7) G.notes = G.notes.filter(x => x !== 'a3_morning');   // isolierter Teststand: ohne die Hühnernotiz (sieben Karten)
      await P.load(G); await P.settle();
      await P.ev(() => M.TA.combine('a3_lightseq', 'v3_part1'));   // öffnet das Ordnen (Auslöser ist nicht Teil der Prüfung)
      await P.settle(20000, s => s.ov === 'arrange'); await P.until(s => s.ov === 'arrange', 20000, 'Ordnen offen');
      await P.page.waitForTimeout(150);
      let L = await P.ovLay(); check(L.n === n, name + ': ' + L.n + ' Karten (' + d.f + ')');
      const go = L.hits.find(h => h.id === 'go'); check(inScreen(go && go.r), name + ': „So war es“ liegt im Bild ' + JSON.stringify(go && go.r));
      L.hits.filter(h => h.id[0] === 'r').forEach(h => check(inScreen(h.r), name + ': Karte ' + h.id + ' liegt im Bild'));
      // zuerst falsch bestätigen: Rückmeldung muss sichtbar sein
      if (go) await P.clickRect(go.r); await P.page.waitForTimeout(150);
      L = await P.ovLay(); check(!!L && !!L.msgText, name + ': falsche Reihenfolge bekommt eine Rückmeldung');
      check(!!(L && L.msg) && inScreen(L.msg), name + ': die Rückmeldung steht im Bild ' + JSON.stringify(L && L.msg));
      // richtig ordnen: Auswahlsortierung, jede Vertauschung zwei Klicks
      for (let i = 0; i < n; i++) {
        L = await P.ovLay(); const j = L.ord.indexOf(i); if (j === i) continue;
        const ri = L.hits.find(h => h.id === 'r' + i), rj = L.hits.find(h => h.id === 'r' + j);
        await P.clickRect(ri.r); await P.clickRect(rj.r);
      }
      L = await P.ovLay(); check(L.ord.every((k, i) => k === i), name + ': per Klick richtig geordnet');
      const go2 = L.hits.find(h => h.id === 'go'); await P.clickRect(go2.r);
      await P.settle(20000); const done = await P.ev(() => M.GS.notes.indexOf('a3_lightroom') >= 0);
      check(done, name + ': „So war es“ per Klick bestätigt, die Notiz „Licht in Batos Kammer“ ist da');
    } catch (e) { check(false, name + ': ' + e.message); }
    check(!P.errs.length, name + ': keine JS-Fehler' + (P.errs.length ? ': ' + P.errs[0] : '')); await P.page.close();
  }

  // ------------------------------------------------ Erinnerung „Im Bus“ beim Direkteinstieg
  for (const ch of [3, 2]) {
    const name = 'bus' + ch; if (!want(name)) continue;
    const P = await page0();
    try {
      await P.ev((c) => { M.E.newGame(c); }, ch);
      await P.until(s => s.ov === 'memory', 30000, 'Erinnerung offen');
      await P.page.waitForTimeout(300);
      const vis = await P.memVisible(); check(vis > 0.8, name + ': die Erinnerung „Im Bus“ ist zu sehen (' + vis + ' des Bildes im gezeichneten Bild)');
      const card = await P.ev(() => !!M.E.card || M.E.screen === 'card'); check(!card, name + ': keine Titelkarte mehr über der Erinnerung');
      for (let i = 0; i < 12; i++) { const s = await P.st(); if (s.ov !== 'memory') break; await P.click(160, 100); await P.page.waitForTimeout(250); }
      const s2 = await P.settle(30000); check(s2.ov !== 'memory' && s2.room === (ch === 3 ? 'ostbus' : 'stanica'), name + ': per Klick geschlossen, Ankunft in ' + s2.room + (s2.ov ? ' (danach offen: ' + s2.ov + ')' : ''));
    } catch (e) { check(false, name + ': ' + e.message); }
    check(!P.errs.length, name + ': keine JS-Fehler' + (P.errs.length ? ': ' + P.errs[0] : '')); await P.page.close();
  }

  // ------------------------------------------------ Übergang mit geladenem Raum (wie „Weiter mit Kapitel 3“ nach dem Abspann von Kapitel 2)
  if (want('bus3_raum')) {
    const name = 'bus3_raum'; const P = await page0();
    try {
      await P.load(DUMPS[0].j.GS); await P.settle();   // irgendein Raum ist geladen
      await P.ev(() => { M.E.toTitle(); M.E.nextCh = 3; M.E.newGame(3); });
      await P.until(s => s.ov === 'memory', 30000, 'Erinnerung offen'); await P.page.waitForTimeout(300);
      const vis = await P.memVisible(); check(vis > 0.8, name + ': die Erinnerung „Im Bus“ ist zu sehen (' + vis + ')');
      const dark = await P.ev(() => { const fb = M.renderFrame(); let n = 0, t = 0; for (let y = 10; y < 100; y++) for (let x = 4; x < 34; x++) { t++; if (fb.d[y * 320 + x] === M.P.k0) n++; } return n / t; });
      check(dark > 0.95, name + ': dahinter ist kein alter Raum zu sehen (' + Math.round(dark * 100) + ' % dunkel)');
    } catch (e) { check(false, name + ': ' + e.message); }
    check(!P.errs.length, name + ': keine JS-Fehler' + (P.errs.length ? ': ' + P.errs[0] : '')); await P.page.close();
  }

  // ------------------------------------------------ Laden während einer Reaktion
  if (want('laden')) {
    const name = 'laden'; const P = await page0();
    try {
      const d = pick(G => G.phase === 'k3_d1' && has(G, 'l3_area') && has(G, 'l3_oldmap') && !has(G, 'l3_skela'), 'Freitag, Bereich und alte Karte, noch kein Schluss');
      const G = JSON.parse(JSON.stringify(d.j.GS)); G.flags['k3.v.drawer'] = true;   // isolierter Teststand: Schublade schon offen, damit der Schluss den Tag beendet
      await P.load(G); await P.settle();
      await P.ev(() => { M.__speechLog = []; M.TA.combine('l3_area', 'l3_oldmap'); });
      await P.until(s => s.speech, 15000, 'Reaktion beginnt');
      await P.ev(() => { M.E.toTitle(); }); await P.page.waitForTimeout(300);
      await P.ev(() => { M.__speechLog = []; M.E.loadGame(); }); await P.page.waitForTimeout(200);
      const t0 = Date.now(); const s = await P.settle(25000, s => s.phase !== 'k3_d1');
      const lines = await P.ev(() => (M.__speechLog || []).map(x => x[1]).join(' | '));
      check(/Boote|Boot/.test(lines), name + ': die unterbrochene Reaktion wird nachgeholt (' + lines.slice(0, 160) + ')');
      check(s.phase !== 'k3_d1', name + ': der Tageswechsel kommt ohne Wartesperre (' + s.phase + ', ' + Math.round((Date.now() - t0) / 1000) + ' s)');
    } catch (e) { check(false, name + ': ' + e.message); }
    check(!P.errs.length, name + ': keine JS-Fehler' + (P.errs.length ? ': ' + P.errs[0] : '')); await P.page.close();
  }

  await browser.close(); console.log(ok ? 'KLICKTESTS OK' : 'KLICKTESTS FEHLER'); process.exit(ok ? 0 : 1);
})();
