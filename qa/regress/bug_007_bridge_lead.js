// BUG-007: Kapitel 3, Straßenbrücke: „Man führt Mala bis ans Westende“ – das Geländer überdeckt den ganzen Gehweg; jeder Tipp auf den Weg
// wurde „Schau an: Geländer“ an derselben Stelle (Mitte), die Kamera rückte nicht nach. Nur ein Tipp auf die Laterne half weiter.
// Test: als Mala nur auf den Gehweg am rechten Bildrand tippen (Zeigerereignisse) – Mala muss das Westende erreichen.
const { open } = require('../vmdriver'); const C = require('../lib/common');
module.exports = { id: 'BUG-007', title: 'Straßenbrücke: Mala lässt sich durch Tippen auf den Weg bis ans Westende führen', async run(html) {
  const D = await open({ seed: 3, html }); await D.ev(() => { window.__QA_CHAINED = true; M.__speechLog = []; }); await C.tapTitle(D, 'Kapitel 3: Mostar'); await C.tapTitle(D, 'Platz 1');
  let res = null;
  await C.runPath('walkthrough3', D, {}, null, { afterStep: async (l) => { if (res || !/^Straßenbrücke/.test(l)) return; await D.settle(); const xs = [];
      for (let k = 0; k < 8; k++) { const st = await D.ev(() => ({ crossed: !!M.GS.flags['k3.mala.crossed'], x: Math.round(M.ACT.mala.x) })); xs.push(st.x); if (st.crossed) break;
        const hit = await D.ev(() => { const h = M.E.hotspotAt(290 + Math.round(M.E.camX), 126); M.pointerDown(290, 126, true); M.pointerUp(290, 126, true); return h ? h.id : 'Boden'; }); xs.push('[' + hit + ']'); await D.page.waitForTimeout(2500); await D.settle(60000).catch(() => {}); }
      res = { crossed: await D.ev(() => !!M.GS.flags['k3.mala.crossed']), xs }; throw Object.assign(new Error('fertig'), { kind: 'qa-stop' }); } });
  if (!res) return { ok: false, detail: 'Brücke nicht erreicht' };
  return { ok: res.crossed, detail: 'Tipps auf den Gehweg (x=290, links der Laterne): Mala-Positionen ' + res.xs.join(' → ') + '; drüben=' + res.crossed };
} };
