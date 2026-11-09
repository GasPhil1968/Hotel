// Messung je Spielstand für ANALYSE_GILBERT.md (Abschnitt E.0): Reaktionen auf Gegenstand-Versuche, angebotene Verben,
// Notizbuch-Suchraum und mögliche Schlüsse, gleichzeitig offene Hinweisthemen. Nur lesend: lädt jeden Stand ins gebaute Spiel,
// wertet Hotspots und Handler aus wie doVerb0 (05_engine.js), führt keine Aktion aus.
// Stände erzeugen: MALA_DUMPALL=<ordner>/k1 node game/tools/walkthrough.js  (ebenso walkthrough2..5.js nach k2..k5)
// Aufruf: DUMPS=<ordner> [CH=1,2,3,4,5] node qa/analyse/messung.js   → <ordner>/messung.json
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DUMPS = process.env.DUMPS || process.argv[2]; if (!DUMPS) { console.log('Aufruf: DUMPS=<ordner> node qa/analyse/messung.js'); process.exit(2); }
(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.join(__dirname, '..', '..', 'web', 'index.html')); await p.waitForFunction(() => window.M && M.E && M.E.screen === 'title');
  await p.evaluate(() => { M.TEST = true; M.TURBO = 1; });
  const out = {};
  for (const ch of (process.env.CH||'1,2,3,4,5').split(',').map(Number)) {
    const dir = path.join(DUMPS, 'k' + ch); if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => /^\d+\.json$/.test(f)).sort();
    const rows = [];
    for (const f of files) {
      const d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      const r = await p.evaluate((dump) => {
        try {
          const base = M.freshGame(); Object.keys(base).forEach(k => { if (dump.GS[k] !== undefined) base[k] = dump.GS[k]; });
          const G = JSON.parse(JSON.stringify(base)); M.migrateAll(G);
          localStorage.setItem('mala.probe', JSON.stringify({ sv: 2, kind: 'auto', GS: G, at: Date.now() }));
          if (!M.E.loadKey('mala.probe')) return { err: 'load ' + M.E.loadReason };
          const A = M.API, room = A.room, S = A.S, GS = A.G;
          if (!room) return { err: 'kein Raum' };
          const visFor = (who) => room.hotspots.filter(h => { try { if (h.vis && !h.vis(S, GS)) return false; } catch (e) { return false; } if (h.who === 'm' && who !== 'marko') return false; if (h.who === 'g' && who !== 'mala') return false; return true; });
          const hm = visFor('marko'), hg = visFor('mala');
          const inv = (GS.inv || []).slice();
          // Gegenstand × Hotspot (Marko), wie doVerb0 auflöst
          let pairs = 0, spec = 0, npcPairs = 0, npcSpec = 0; const specList = [];
          hm.forEach(hs => { if (hs.exit && !hs.with && !hs.withAny && !hs.give) return; inv.forEach(it => { const I = M.ITEMS[it] || {}; let h = hs.with && hs.with[it]; if (h === undefined && hs.give && hs.give[it] !== undefined) h = hs.give[it]; if (h === undefined && I.on && I.on[hs.id] !== undefined) h = I.on[hs.id]; if (h === undefined) h = hs.withAny; const ok = h !== undefined && h !== null; pairs++; if (ok) { spec++; specList.push(it + '→' + hs.id); } if (hs.npc) { npcPairs++; if (ok) npcSpec++; } }); });
          // Verben (Marko): ansehen/benutzen/öffnen/nehmen/reden/lesen – eigene Antwort vorhanden?
          const VM = ['look', 'use', 'open', 'take', 'talk', 'read']; let vAll = 0, vSpec = 0;
          hm.forEach(hs => { if (hs.exit) return; VM.forEach(v => { if (v === 'talk' && !hs.npc) return; vAll++; if (hs[v] !== undefined) vSpec++; }); });
          let lookN = 0, lookS = 0; hm.forEach(hs => { if (hs.exit) return; lookN++; if (hs.look !== undefined) lookS++; });
          let glookN = 0, glookS = 0; hg.forEach(hs => { if (hs.exit) return; glookN++; const g = hs.g || {}; if (g.look !== undefined || hs.glook !== undefined) glookS++; });
          // Mala: ansehen/spüren/lauschen
          let gAll = 0, gSpec = 0, gSense = 0, gSenseSpec = 0;
          hg.forEach(hs => { if (hs.exit && !hs.g) return; const g = hs.g || {}; ['look', 'sense', 'listen'].forEach(v => { if (v === 'listen' && !hs.npc) return; gAll++; const has = v === 'look' ? (g.look !== undefined || hs.glook !== undefined) : g[v] !== undefined; if (has) gSpec++; if (v === 'sense') { gSense++; if (has) gSenseSpec++; } }); });
          // Notizbuch: sichtbare Notizen, Paare, jetzt mögliche Schlüsse
          const nb = M.E.nbOpen ? M.E.nbOpen(false) : []; let ded = 0; const dedL = [];
          for (let i = 0; i < nb.length; i++) for (let j = i + 1; j < nb.length; j++) { const dd = M.DEDUCE[nb[i] + '+' + nb[j]] || M.DEDUCE[nb[j] + '+' + nb[i]]; if (!dd) continue; if (typeof dd === 'function') { ded++; continue; } if (dd.if && !dd.if(GS)) continue; if (GS.notes.indexOf(dd.to) >= 0) continue; ded++; dedL.push(dd.to); }
          const hints = M.hintsOpen(GS).map(h => h.id);
          return { dedL, nbIds: nb, lookN, lookS, glookN, glookS, phase: GS.phase, room: room.id, inv: inv.length, hsM: hm.length, pairs, spec, npcPairs, npcSpec, vAll, vSpec, gAll, gSpec, gSense, gSenseSpec, nb: nb.length, nbPairs: nb.length * (nb.length - 1) / 2, ded, hints, specList: specList.slice(0, 40) };
        } catch (e) { return { err: String(e && e.message || e) }; }
      }, d);
      r.step = d.step; r.label = d.label; rows.push(r);
    }
    out['k' + ch] = rows;
  }
  fs.writeFileSync(path.join(DUMPS, 'messung.json'), JSON.stringify({ out, errs }, null, 1));
  console.log('fertig', Object.keys(out).map(k => k + ':' + out[k].length).join(' '), 'Fehler:', errs.length);
  await b.close();
})();
