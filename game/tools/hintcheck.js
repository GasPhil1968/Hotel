// Hinweise gegen echte Spielstände prüfen (statisch, ohne Spielablauf):
//   node game/tools/hintcheck.js <dumps Kapitel 1> <dumps Kapitel 2> [<dumps Kapitel 3>] [<dumps Kapitel 4>]
// Die Ordner stammen aus MALA_DUMPALL=… node game/tools/walkthrough.js, walkthrough2.js bzw. walkthrough3.js (ein Stand nach jedem Schritt).
// Geprüft wird je Stand:
//  1. Abdeckung: mindestens ein offenes Hinweisthema, solange das Kapitel läuft.
//  2. Jeder Stufentext ist für Mala und Marko ein nichtleerer Satz.
//  3. Kein offenes Thema nennt einen Ort, den Marko noch nicht kennt (weder freigeschaltet noch bekannt).
//  4. Kein offenes Thema gehört zu einem anderen Kapitel.
//  5. Hinweis auf verbrauchte Gegenstände: genannt wird ein Gegenstand, den Marko schon hatte und nicht mehr hat (Warnung, wird einzeln gesichtet).
const { open } = require('./driver');
const fs = require('fs'), path = require('path');
(async () => {
  const dirs = process.argv.slice(2); if (!dirs.length) { console.log('Aufruf: node hintcheck.js <ordner> [<ordner>]'); process.exit(2); }
  const D = await open();
  let fails = 0, warns = 0, states = 0, topicsSeen = new Set(), chapters = new Set();
  for (const dir of dirs) {
    const files = fs.readdirSync(dir).filter(f => /^\d+\.json$/.test(f)).sort();
    let ever = new Set();
    for (const f of files) {
      const d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); states++;
      const r = await D.ev((dump) => {
        const base = M.freshGame(); Object.keys(base).forEach(k => { if (dump.GS[k] !== undefined) base[k] = dump.GS[k]; });
        const G = JSON.parse(JSON.stringify(base)); M.migrateAll(G);
        const ch = M.chapterOf(G), openT = M.hintsOpen(G), out = { ch, phase: G.phase, ended: !!G.ended, open: [], bad: [], places: [], inv: G.inv.slice() };
        // Ortsnamen und Kurzformen, die in Hinweisen vorkommen können
        const PLACES = { flat: ['Markos Wohnung'], varos: ['Veli Varoš', 'Varoš'], riva: ['Riva'], matejuska: ['Matejuška'], sustipan: ['Sustipan'], bar: ['Bar „Bura“', 'Bar'], oldtown: ['Altstadt', 'Peristil'], terminal: ['Fährhafen', 'Fährterminal'], palma: ['Palma'],
          neboder: ['Alipašino'], stanica: ['Busbahnhof'], ferhadija: ['Ferhadija'], obala: ['Obala', 'Miljacka'], carsija: ['Baščaršija', 'Čaršija'], pansion: ['Kovači', 'Pension'], vratnik: ['Vratnik'],
          // Kapitel 3 (Mostar)
          ostbus: ['Ostbusbahnhof'], herberge: ['Herberge'], kujundziluk: ['Kujundžiluk'], starimost: ['Alte Brücke', 'Alten Brücke'], koski: ['Koski', 'Minarett'], tepa: ['Tepa'],
          strassenbr: ['Straßenbrücke'], bulevar: ['Bulevar', 'Vulkanizer'], partizan: ['Partisanenfriedhof', 'Westhang'], westbus: ['Westbusbahnhof', 'Zdravko'], zelenika: ['Haus Zelenika'], vermisst: ['Vermisstenstelle'], skela: ['Skela'],
          // Kapitel 4 (München)
          zob: ['ZOB'], westend: ['Westend'], giesing: ['Giesing'], wiesn: ['Theresienwiese'], heim: ['Bavariapark'], hbf: ['Hauptbahnhof'], bhfviertel: ['Bahnhofsviertel', 'Bar Sport'],
          friedhof: ['Städtische Friedhöfe', 'Friedhofsverwaltung'], moosach: ['Moosach'], konsulat: ['Generalkonsulat', 'Konsulat'] };
        const locs = M.mapLocs(G).map(l => l.id);
        openT.forEach(h => {
          const texts = []; for (let i = 0; i < 4; i++) ['mala', 'marko'].forEach(w => { const t = M.hintText(h, i, G, w); texts.push(t); if (typeof t !== 'string' || t.trim().length < 4) out.bad.push(h.id + ' Stufe ' + (i + 1) + ' (' + w + ') leer'); });
          if (!h.s || h.s.length !== 4) out.bad.push(h.id + ': nicht genau vier Stufen');
          const all = texts.join(' ') + ' ' + h.t;
          locs.forEach(id => { const known = (G.map && G.map[id]) || (G.mapKnown && G.mapKnown[id]); if (known) return; (PLACES[id] || []).forEach(n => { if (new RegExp('(^|[^A-Za-zÀ-ž])' + n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^A-Za-zÀ-ž]|$)').test(all)) out.places.push(h.id + ' nennt „' + n + '“ (' + id + ' unbekannt)'); }); });
          out.open.push({ id: h.id, t: h.t, all });
        });
        if ((ch === 2) !== (M.HINTS_K2 === M.hintTopics(G))) out.bad.push('falsches Kapitel');
        if ((ch === 3) !== (M.HINTS_K3 === M.hintTopics(G))) out.bad.push('falsches Kapitel (Mostar)');
        if ((ch === 4) !== (M.HINTS_K4 === M.hintTopics(G))) out.bad.push('falsches Kapitel (München)');
        out.items = Object.keys(M.ITEMS).map(id => ({ id, n: M.ITEMS[id].name }));
        return out;
      }, d);
      r.open.forEach(o => topicsSeen.add(o.id)); chapters.add(r.ch);
      const label = `${path.basename(dir)}/${f} „${d.label}“ (${r.phase})`;
      const isEnd = r.ended || /ENDE|Abspann/.test(d.label);
      if (!r.open.length && !isEnd) { fails++; console.log('LÜCKE  ' + label + ': kein offenes Hinweisthema'); }
      r.bad.forEach(b => { fails++; console.log('FEHLER ' + label + ': ' + b); });
      r.places.forEach(b => { fails++; console.log('ORT    ' + label + ': ' + b); });
      // verbrauchte Gegenstände
      r.inv.forEach(i => ever.add(i));
      r.open.forEach(o => r.items.forEach(it => { if (ever.has(it.id) && r.inv.indexOf(it.id) < 0 && it.n && it.n.length > 3 && o.all.indexOf(it.n) >= 0) { warns++; console.log('PRÜFEN ' + label + ': ' + o.id + ' nennt „' + it.n + '“, das Marko nicht mehr hat'); } }));
      if (process.env.VERBOSE) console.log(label + ': ' + r.open.map(o => o.id).join(', '));
    }
  }
  // Themen der geprüften Kapitel (ohne Mostar-Stände wie bisher: Split und Sarajevo)
  // Themen der Kapitel, deren Stände geprüft wurden
  const all = await D.ev((chs) => { let L = []; if (chs.indexOf(1) >= 0 || chs.indexOf(2) >= 0) L = L.concat(M.HINTS_K1 || [], M.HINTS_K2 || []); if (chs.indexOf(3) >= 0) L = L.concat(M.HINTS_K3 || []); if (chs.indexOf(4) >= 0) L = L.concat(M.HINTS_K4 || []); return L.map(h => h.id); }, Array.from(chapters));
  const never = all.filter(id => !topicsSeen.has(id));
  console.log(`\n${states} Spielstände geprüft, ${all.length} Hinweisthemen, ${topicsSeen.size} davon in den Durchläufen offen gewesen.`);
  if (never.length) console.log('Nie offen (Nebenwege, alte Spielstände oder Fehler in open): ' + never.join(', '));
  console.log(fails ? `HINWEISPRÜFUNG: ${fails} Fehler, ${warns} zu sichten` : `HINWEISPRÜFUNG OK (${warns} zu sichten)`);
  console.log(D.errors.length ? 'JS-FEHLER:\n' + D.errors.slice(0, 5).join('\n') : 'keine JS-Fehler');
  await D.close2(); process.exit(fails ? 1 : 0);
})();
