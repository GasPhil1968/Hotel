// BUG-010 (ANALYSE_GILBERT.md, K2-B01): Kapitel 2, Finale. Die Rotkreuz-Nachricht lag nach dem Aufbrechen des Wärmefachs ungelesen im
// Inventar. Gab man sie so Nada, nahm sie sie (Epilog-Szene vorgezogen); die Notiz f2_rcm war nicht mehr zu bekommen, „Sie kam mich holen“
// nicht mehr zu ziehen, die letzte Nacht wurde nie angeboten → Kapitel nicht abschließbar.
// Geprüft: (1) nach dem Aufbrechen ist die Nachricht gelesen; (2) im Finale lehnt Nada sie ab, sie bleibt im Inventar;
// (3) ein älterer Stand, in dem Nada sie schon hat und Marko sie nie las, kommt über Nada wieder heraus; (4) das Kapitel endet regulär.
const { open } = require('../vmdriver'); const C = require('../lib/common');
module.exports = { id: 'BUG-010', title: 'K2-Finale: Rotkreuz-Nachricht wird beim Fund gelesen; Nada nimmt sie erst im Epilog; alte Stände kommen wieder heraus', async run(html) {
  const D = await open({ seed: 4, html }); await D.ev(() => { window.__QA_CHAINED = true; M.__speechLog = []; }); await C.tapTitle(D, 'Kapitel 2: Sarajevo'); await C.tapTitle(D, 'Platz 1');
  // Stand in Nadas Wohnung laden (wie ein Spielstand); mut: Zustand eines älteren Spielstands nachbilden (Nada hat die Nachricht, ungelesen)
  const toNada = (mut) => D.ev((m) => { const G = JSON.parse(JSON.stringify(M.GS)); const st = M.ROOMS.stan.start || [160, 120, 'R'];
    G.pos.marko = { room: 'stan', x: st[0], y: st[1], f: 'R' }; G.pos.mala = { room: 'stan', x: st[0] - 14, y: st[1] - 2, f: 'R' }; G.active = 'marko';
    if (m) { G.inv = G.inv.filter(i => i !== 'rcm'); G.notes = G.notes.filter(n => ['f2_rcm', 'f2_cameback', 'f2_whyabreise'].indexOf(n) < 0); G.flags['k2.epi.nada'] = true; delete G.flags['k2.f2.rcmRead']; }
    localStorage.setItem('mala.qa10', JSON.stringify({ sv: 2, kind: 'auto', GS: G, at: Date.now() })); M.__speechLog = []; return M.E.loadKey('mala.qa10'); }, mut);
  const snap = () => D.ev(() => ({ inv: M.GS.inv.indexOf('rcm') >= 0, note: M.GS.notes.indexOf('f2_rcm') >= 0, epiNada: !!M.GS.flags['k2.epi.nada'], phase: M.GS.phase, room: M.API.room && M.API.room.id, said: (M.__speechLog || []).map(x => x[1]).join(' | ') }));
  let res = null; const i0 = D.item;
  D.item = async (verb, id, other) => {
    if (!res && verb === 'read' && id === 'rcm') {
      res = {}; res.auto = await snap();
      await D.ev(() => { localStorage.setItem('mala.qa10b', JSON.stringify({ sv: 2, kind: 'auto', GS: JSON.parse(JSON.stringify(M.GS)), at: Date.now() })); });
      // (2) im Finale: Nachricht an Nada → abgelehnt
      await toNada(false); await D.settle(); await D.act('use', 'nada', 'rcm'); await D.drain(); res.give = await snap();
      // (3) älterer Stand: Nada hat sie, ungelesen → über Nada zurück und gelesen
      await toNada(true); await D.settle(); await D.act('talk', 'nada'); await D.choose('Die Nachricht vom Roten Kreuz'); await D.drain();
      const s = await D.st(); if (s.dlg) { await D.choose('Danke, Frau Delić'); await D.drain(); }
      res.rescue = await snap();
      // zurück an die Stelle des Durchlaufs
      await D.ev(() => M.E.loadKey('mala.qa10b')); await D.settle();
    }
    return i0(verb, id, other);
  };
  const r = await C.runPath('walkthrough2', D, {});
  if (!res) return { ok: false, detail: 'Stelle nicht erreicht: ' + r.err };
  const ok1 = res.auto.note && res.auto.inv, ok2 = res.give.inv && !res.give.epiNada && /Nicht jetzt, Mali/.test(res.give.said), ok3 = res.rescue.inv && res.rescue.note && !res.rescue.epiNada;
  return { ok: ok1 && ok2 && ok3 && r.ok, detail: 'nach dem Aufbrechen gelesen=' + ok1 + '; Nada im Finale lehnt ab, Nachricht bleibt=' + ok2 + '; alter Stand über Nada gerettet=' + ok3 + '; Kapitel ' + (r.ok ? 'bis zum Ende gespielt' : 'abgebrochen: ' + r.err) };
} };
