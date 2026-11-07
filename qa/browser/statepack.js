// Erzeugt regulär erspielte Spielstände für die Browser-Szenarien: verketteter VM-Durchlauf K1→K4 (Produktionsskript),
// an ausgewählten Schritten "Menü → Speichern" (echter Menütipp) und Export des localStorage. Herkunft je Stand: Kapitel, Schritt, Beschriftung.
//   node qa/browser/statepack.js [out.json]
'use strict';
const path = require('path'), fs = require('fs');
const { open } = require('../vmdriver'); const C = require('../lib/common'); const { menuTap } = require('../lib/session');
const out = process.argv[2] || path.join(__dirname, '..', 'results', 'browser', 'states.json');
// gewünschte Stellen (Teilstring der Schrittbeschriftung) → Name
const WANT = [
  [1, /^Start/, 'k1_start'], [1, /Knoten gelöst|Strickheft/, 'k1_ivka'], [1, /Brief klebt/, 'k1_brief'], [1, /Luka bittet um das Lied/, 'k1_luka'], [1, /Bruno|Nachtportier|Palma/, 'k1_bruno'],
  [2, /Prolog|Ankunft|Busbahnhof/, 'k2_start'], [2, /Rätsel|Brief|Fikret/, 'k2_fikret'], [2, /Zwischenwelt|Ivan|Barać/, 'k2_limbo'], [2, /Schutzraum|Zora|Lehrerin/, 'k2_skloniste'],
  [3, /Ankunft|Ostbus/, 'k3_start'], [3, /Peilung 1/, 'k3_peil'], [3, /Glocke|Bato/, 'k3_bato'], [3, /Zwischenwelt/, 'k3_limbo'],
  [4, /Kapitelstart|ZOB/, 'k4_start'], [4, /Mamas Wohnung/, 'k4_wohnung'], [4, /Gleis 11|Gepäckträger/, 'k4_gleis'], [4, /Heim|Gerda/, 'k4_heim'], [4, /Silvester/, 'k4_silvester']
];
(async () => {
  const D = await open({ seed: 3 }); await D.ev(() => { window.__QA_CHAINED = true; M.__speechLog = []; });
  const got = {}; const names = { 1: 'walkthrough', 2: 'walkthrough2', 3: 'walkthrough3', 4: 'walkthrough4' };
  await C.tapTitle(D, 'Kapitel 1: Split'); await C.tapTitle(D, 'Platz 1');
  for (let ch = 1; ch <= 4; ch++) { let step = 0;
    const r = await C.runPath(names[ch], D, {}, null, { afterStep: async (label) => { step++;
      for (const [c, re, name] of WANT) { if (c !== ch || got[name] || !re.test(label)) continue;
        const s = await D.settle().catch(() => null); if (!s || s.dlg || s.overlay) continue;
        const sv = await menuTap(D, 1); if (!/Gespeichert/.test(sv.msg || '')) continue;
        const info = await D.ev(() => ({ phase: M.GS.phase, room: M.E.room.id, active: M.GS.active, inv: M.GS.inv.length, notes: M.GS.notes.length }));
        got[name] = { name, ch, step, label: label.slice(0, 120), info, storage: D.exportStorage() }; } } });
    if (!r.ok) { console.error('Durchlauf K' + ch + ' abgebrochen: ' + r.err); process.exit(1); }
    await C.waitTitleNext(D); if (ch < 4) await C.tapTitle(D, 'Weiter mit Kapitel ' + (ch + 1)); }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ created: new Date().toISOString(), sha: D.sha, origin: 'VM-Durchlauf seed 3, Speichern über Menü (Esc → Speichern)', states: Object.values(got) }, null, 0));
  console.log('Stände', Object.keys(got).join(', '), '→', out);
})().catch(e => { console.error(e); process.exit(1); });
