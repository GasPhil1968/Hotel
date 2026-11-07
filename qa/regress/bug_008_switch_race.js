// BUG-008: Figurenwechsel (laufende Überblendung) und Ende des Zugehens zu einer Person fallen in denselben Mikrotask-Durchlauf →
// doVerb0 liest player().x einer Figur, die nicht mehr im Raum ist: „UNHANDLED TypeError … reading 'x' at doVerb0“.
// Der Wettlauf ist zeitkritisch; als Regressionstest dient die deterministische Wiederholung des Erstlauf-Laufs E-0159 (Stress über
// echte Zeigerereignisse in Kapitel 4: switchWhileWalk/switchSpam/repeatTap auf Personen). Auf der Originalfassung tritt der Fehler auf.
const sim = require('../sim');
module.exports = { id: 'BUG-008', title: 'Figurenwechsel während des Zudrehens zu einer Person wirft keinen TypeError (Wiederholung E-0159)', async run(html) {
  const r = await sim.runOne(sim.makeSpec('E', 159, 'erstlauf'), { html });
  const bad = (r.errors || []).filter(e => /doVerb0|reading 'x'/.test(e));
  return { ok: bad.length === 0 && r.result === 'pass', detail: 'E-0159 (Salz erstlauf): Ergebnis ' + r.result + (r.reason ? ' – ' + String(r.reason).slice(0, 120) : '') + '; doVerb0-Fehler: ' + bad.length + '; Kapitel ' + r.chapters.map(c => c.ch + (c.ok ? '✓' : '✗')).join(' ') };
} };
