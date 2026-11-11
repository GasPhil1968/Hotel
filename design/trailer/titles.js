// Texttafeln und Endkarte des Trailers in der Schrift des Spiels (M.text, M.big aus web/index.html), als PNG mit Alphakanal.
//   node design/trailer/titles.js <ausgabeordner>
// Einblendungen: Spielschrift, Grundlinie im Spielraster, ganzzahlig vergrößert (×5 für Texte, ×6 für die Endkarte).
// Endkarte: Hintergrund aus dem Titelbild des Spiels (M.paintTitle, Wasser aus M.titleDynamic), 180 Einzelbilder für 6 s;
// die Schrift der Endkarte liegt in eigenen Ebenen darüber (eingeblendet in render.py). Das Titelbild selbst trägt im Spiel
// „DIE STILLEN“; hier entsteht eine Trailergrafik aus seiner Landschaft, kein nachgebauter Titelbildschirm.
'use strict';
const path = require('path'), fs = require('fs'), R = require('./rec_lib');
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
// Texte des Trailers (neu geschrieben, außer wo vermerkt)
const CAPS = {
  c_nachrufe: ['Marko schreibt Nachrufe.', 'Auf Menschen, die allein gestorben sind.'],   // nach „Über ‚Die Stillen‘“ im Spiel
  c_lebt: ['Marko lebt. Mala nicht.'],                                                   // Satz aus „Über ‚Die Stillen‘“
  c_waende: ['Er spricht mit den Lebenden.', 'Sie geht durch Wände.'],                   // Satz aus „Über ‚Die Stillen‘“
  c_reise: ['Fünf Kapitel, vier Städte:', 'Split · Sarajevo · Mostar · München'],
  c_hilfe: ['Hinweise in vier Stufen', 'Automatisches Speichern'],
  c_browser: ['Im Browser · Maus oder Touch', 'Offline nach dem ersten Laden'],
};
// Texte als Streifen oben über dem Spielbild (für Einstellungen, in denen die Leiste unten zu sehen sein muss)
const STRIPS = {
  c_beide_top: 'Du spielst beide. Ein Klick, und du wechselst.',
};
(async () => {
  const { b, p } = await R.launch();
  // Text → RGBA (Spielpalette), Hintergrund durchsichtig, dunkler Umriss für die Lesbarkeit
  const pngs = await p.evaluate(({ CAPS, STRIPS }) => {
    function toPng(buf, scale, bgA) { const c = document.createElement('canvas'); c.width = buf.w * scale; c.height = buf.h * scale; const g = c.getContext('2d'); const img = g.createImageData(buf.w, buf.h);
      for (let i = 0; i < buf.w * buf.h; i++) { const v = buf.d[i]; if (v === M.T) { img.data[i * 4 + 3] = bgA || 0; continue; } const rgb = M.RGB[v]; img.data[i * 4] = rgb[0]; img.data[i * 4 + 1] = rgb[1]; img.data[i * 4 + 2] = rgb[2]; img.data[i * 4 + 3] = 255; }
      const t = document.createElement('canvas'); t.width = buf.w; t.height = buf.h; t.getContext('2d').putImageData(img, 0, 0); g.imageSmoothingEnabled = false; g.drawImage(t, 0, 0, c.width, c.height); return c.toDataURL('image/png'); }
    const P = M.P, out = {};
    Object.keys(CAPS).forEach(k => { const L = CAPS[k], w = Math.max(...L.map(s => M.textWidth(s))) + 4, h = L.length * 11 + 3, buf = new M.Buf(w, h, M.T);
      L.forEach((s, i) => { const x = Math.round((w - M.textWidth(s)) / 2); M.text(buf, s, x, 2 + i * 11, P.s6, P.k0); }); out[k] = toPng(buf, 5); });
    // Streifen: volle Spielbreite (320 → 1600), halbdurchsichtig dunkel, Text in der Mitte
    Object.keys(STRIPS).forEach(k => { const s = STRIPS[k], buf = new M.Buf(320, 19, M.T); M.text(buf, s, Math.round(160 - M.textWidth(s) / 2), 5, P.s6, P.k0); out[k] = toPng(buf, 5, 150); });
    // Endkarte: Schrift in eigenen Ebenen (320 × 180, ×6 = 1920 × 1080)
    const mk = (f) => { const buf = new M.Buf(320, 180, M.T); f(buf); return toPng(buf, 6); };
    out.e_mala = mk(buf => M.big(buf, 'MALA', 160, 8, P.x5, 4, P.k0));
    out.e_stillen = mk(buf => M.big(buf, 'Die Stillen', 160, 42, P.s5, 2, P.k0));
    out.e_genre = mk(buf => { const s = 'Ein Point-and-Click-Mystery-Adventure'; M.text(buf, s, Math.round(160 - M.textWidth(s) / 2), 152, P.s5, P.k0); });
    out.e_cta = mk(buf => { const s = 'Entdecke MALA.'; M.text(buf, s, Math.round(160 - M.textWidth(s) / 2), 165, P.y4, P.k0); });
    return out; }, { CAPS, STRIPS });
  for (const k of Object.keys(pngs)) fs.writeFileSync(path.join(OUT, k + '.png'), Buffer.from(pngs[k].split(',')[1], 'base64'));
  // Hintergrund der Endkarte: Titelbild-Landschaft mit bewegtem Wasser, 180 Bilder (6 s bei 30 fps), unten dunkles Band für Gattung und Aufruf
  fs.mkdirSync(path.join(OUT, 'endbg'), { recursive: true });
  for (let f0 = 0; f0 < 180; f0 += 30) {
    const frames = await p.evaluate(({ f0 }) => { const base = M.paintTitle(), out = [];
      for (let f = f0; f < f0 + 30; f++) { const buf = new M.Buf(320, 180, M.P.k0); for (let i = 0; i < 320 * 144; i++) buf.d[i] = base.d[i]; if (M.titleDynamic) { const tmp = new M.Buf(320, 144, M.P.k0); for (let i = 0; i < 320 * 144; i++) tmp.d[i] = base.d[i]; M.titleDynamic(tmp, f / 30); for (let i = 0; i < 320 * 144; i++) buf.d[i] = tmp.d[i]; }
        const c = document.createElement('canvas'); c.width = 1920; c.height = 1080; const g = c.getContext('2d'); const img = g.createImageData(320, 180);
        for (let i = 0; i < 320 * 180; i++) { const rgb = M.RGB[buf.d[i]] || [0, 0, 0]; img.data[i * 4] = rgb[0]; img.data[i * 4 + 1] = rgb[1]; img.data[i * 4 + 2] = rgb[2]; img.data[i * 4 + 3] = 255; }
        const t = document.createElement('canvas'); t.width = 320; t.height = 180; t.getContext('2d').putImageData(img, 0, 0); g.imageSmoothingEnabled = false; g.drawImage(t, 0, 0, 1920, 1080); out.push(c.toDataURL('image/png')); }
      return out; }, { f0 });
    frames.forEach((u, i) => fs.writeFileSync(path.join(OUT, 'endbg', 'f' + String(f0 + i).padStart(3, '0') + '.png'), Buffer.from(u.split(',')[1], 'base64')));
  }
  console.log('Texte und Endkarte in', OUT, Object.keys(pngs).length, 'Ebenen, 180 Hintergrundbilder'); await b.close();
})().catch(e => { console.error(e); process.exit(1); });
