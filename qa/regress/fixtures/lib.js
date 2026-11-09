// Spielstände für Regressionstests laden (aus den Durchläufen abgelegt, siehe "quelle" je Datei) und gezielt verändern.
// spec: { addNotes, delNotes, setFlags, delFlags, addInv, delInv, pos: '<raum>' (beide, Marko aktiv), malaPos: '<raum>' (nur Mala), active: 'marko'|'mala' }
const fs = require('fs'), path = require('path');
async function load(D, name, spec) {
  const d = JSON.parse(fs.readFileSync(path.join(__dirname, name), 'utf8'));
  return D.ev((a) => {
    const base = M.freshGame(); Object.keys(base).forEach(k => { if (a.GS[k] !== undefined) base[k] = a.GS[k]; });
    const G = JSON.parse(JSON.stringify(base)); M.migrateAll(G); const s = a.spec || {};
    (s.addNotes || []).forEach(n => { if (G.notes.indexOf(n) < 0) G.notes.push(n); }); G.notes = G.notes.filter(n => (s.delNotes || []).indexOf(n) < 0);
    Object.keys(s.setFlags || {}).forEach(k => { G.flags[k] = s.setFlags[k]; }); (s.delFlags || []).forEach(k => { delete G.flags[k]; });
    (s.addInv || []).forEach(i => { if (G.inv.indexOf(i) < 0) G.inv.push(i); }); G.inv = G.inv.filter(i => (s.delInv || []).indexOf(i) < 0);
    if (s.pos) { const st = M.ROOMS[s.pos].start || [160, 120, 'R']; G.pos.marko = { room: s.pos, x: st[0], y: st[1], f: st[2] || 'R' }; G.pos.mala = { room: s.pos, x: st[0] - 14, y: st[1] - 2, f: st[2] || 'R' }; G.active = 'marko'; }
    if (s.malaPos) { const st = M.ROOMS[s.malaPos].start || [160, 120, 'R']; G.pos.mala = { room: s.malaPos, x: st[0], y: st[1], f: st[2] || 'R' }; }
    if (s.active) G.active = s.active;
    localStorage.setItem('mala.qafx', JSON.stringify({ sv: 2, kind: 'auto', GS: G, at: Date.now() })); M.__speechLog = []; return M.E.loadKey('mala.qafx');
  }, { GS: d.GS, spec: spec || {} });
}
const said = (D) => D.ev(() => (M.__speechLog || []).map(x => x[1]).join(' | '));
const closeMenu = (D) => D.ev(() => { if (!M.E.dlg) return false; const i = M.E.dlg.opts.findIndex(o => o.bye); M.E.chooseDone(i >= 0 ? i : M.E.dlg.opts.length - 1); return true; });
module.exports = { load, said, closeMenu };
