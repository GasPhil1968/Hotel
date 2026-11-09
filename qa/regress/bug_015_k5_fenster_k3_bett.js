// BUG-015 (ANALYSE_GILBERT.md K5-B07, K3-B07, K5-B08; Soll-Liste P13, P18):
// (1) K5, Nacht in der Pension: Malas Zeichnen am Fenster ging nur sechs Sekunden nach Markos Hauchen, kürzer als seine Sätze.
//     Jetzt hält der Beschlag bis zur nächsten Handlung, auch wenn man lange wartet.
// (2) Nach einer anderen Handlung ist der Beschlag weg; „Zeichnen“ gibt es erst nach der Atem-Szene.
// (3) K3, Sonntag: Das Bett nennt, was noch fehlt (Spur nach Person oder Frage, ohne Ort).
// (4) K5, Freitag: Nach „Du bist ein Mann.“ weist Mala auf den Tag hin.
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib');
const drawOffered = (D) => D.ev(() => { const h = M.ROOMS.pansion5.hotspots.find(x => x.id === 'window'); return !!(h.g && h.g.drawIf(M.RS('pansion5'), M.GS)); });
module.exports = { id: 'BUG-015', title: 'K5: Zeichnen am Fenster ohne Zeitdruck; K3: Sonntagsbett nennt offene Spuren; K5: Malas Wink am Freitag', async run(html) {
  const D = await open({ seed: 15, html }); const out = [];
  // (1) nach der Atem-Szene: Marko haucht, alle Sätze laufen aus, zwölf Sekunden vergehen, dann zeichnet Mala
  await FX.load(D, 'k5_025_nach_atem.json', { pos: 'pansion5' }); await D.settle();
  const off1 = await drawOffered(D);
  await D.act('use', 'window'); await D.drain(); await D.page.waitForTimeout(12000);
  await D.switchTo('mala'); await D.ev(() => { M.__speechLog = []; }); await D.act('draw', 'window'); await D.drain();
  const t1 = await FX.said(D), three = await D.ev(() => !!M.GS.flags['k5.n1.three']);
  const ok1 = off1 && /Ich ziehe eine Drei/.test(t1) && three; out.push('nach langem Warten gezeichnet=' + ok1 + (ok1 ? '' : ' („' + t1 + '“)'));
  // (2a) eine andere Handlung dazwischen: der Beschlag ist weg
  await D.switchTo('marko'); await D.act('use', 'window'); await D.drain(); await D.act('look', 'stove'); await D.drain();
  await D.switchTo('mala'); await D.ev(() => { M.__speechLog = []; }); await D.act('draw', 'window'); await D.drain(); const t2 = await FX.said(D);
  const ok2a = /Er muss erst hauchen/.test(t2); out.push('nach anderer Handlung weg=' + ok2a);
  // (2b) vor der Atem-Szene bietet das Fenster Mala kein „Zeichnen“ an
  await FX.load(D, 'k5_025_nach_atem.json', { pos: 'pansion5', delFlags: ['k5.n1.atem'] }); await D.settle();
  const ok2b = !(await drawOffered(D)); out.push('kein Zeichnen vor der Atem-Szene=' + ok2b);
  // (3) Sonntag früh in Kapitel 3: das Bett
  await FX.load(D, 'k3_064_sonntag.json', { pos: 'zimmer' }); await D.settle(); await D.ev(() => { M.__speechLog = []; });
  await D.act('use', 'bed'); await D.drain(); const t3 = await FX.said(D);
  const ok3 = /Heute nicht\. Lanas Nacht ist noch offen/.test(t3); out.push('Sonntagsbett nennt die offene Spur=' + ok3 + (ok3 ? '' : ' („' + t3 + '“)'));
  // (4) Freitag an der Brauerei, Mala dabei: „Ich bin der Junge.“
  await FX.load(D, 'k5_030_freitag.json', { pos: 'pivara' }); await D.settle(); await D.ev(() => { M.__speechLog = []; });
  await D.act('talk', 'hamdija'); await D.choose('Ich bin der Junge'); await D.drain(); await FX.closeMenu(D); await D.drain(); const t4 = await FX.said(D);
  const ok4 = /Du bist ein Mann/.test(t4) && /Der Tag weiß es/.test(t4); out.push('Malas Wink am Freitag=' + ok4);
  return { ok: ok1 && ok2a && ok2b && ok3 && ok4, detail: out.join('; ') };
} };
