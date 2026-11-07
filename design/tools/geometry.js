// Wertet die von capture.js gemessenen Trefferflächen aus: je Gerät und Bedienelement Größe in Spielpixeln und CSS-Pixeln,
// Vergleich mit WCAG 2.2 SC 2.5.8 (mind. 24×24 CSS-px) und der Empfehlung 44×44 (Apple HIG) bzw. 48×48 dp (Material).
//   node design/tools/geometry.js  → design/evidence/geometry.md + geometry.json
'use strict';
const fs = require('fs'), path = require('path');
const EV = path.join(__dirname, '..', 'evidence');
const GROUPS = [
  ['Titel: Hauptmenüzeile', /^t:\d+$/, (st) => st.scr === 'title' && st.title && st.title.length > 5 && !/^Platz|^Ja|^Zurück/.test(st.title[0])],
  ['Titel: Platz-/Bestätigungszeile', /^t:\d+$/, (st) => st.scr === 'title' && st.title && /^(Platz|Ja|Split|Sarajevo)/.test(st.title[0])],
  ['Pausenmenü: Zeile', /^m:\d+$/, () => true],
  ['HUD: „Notizen“', /^notes$/, () => true], ['HUD: „Karte“', /^map$/, () => true], ['HUD: „Zeigen“', /^reveal$/, () => true], ['HUD: „Menü“', /^menu$/, () => true],
  ['HUD: Inventarfeld', /^i:\d+$/, () => true], ['HUD: Blätterpfeil Inventar', /^(up|dn)$/, () => true], ['HUD: Figurenwechsel (Porträt)', /^sw$/, () => true],
  ['Verb-Popup: Zeile', /^p:\d+$/, () => true],
  ['Dialog: Antwortzeile', /^c:\d+$/, () => true], ['Dialog: Schließen „X“', /^cx$/, () => true], ['Dialog: Blättern ▲/▼', /^(cu|cd)$/, () => true],
  ['Notizbuch: Zeile', /^n:/, () => true], ['Notizbuch: Schließen „X“', /^nx$/, () => true],
  ['Rätsel: Zeile', /^z:\d+$/, () => true], ['Rätsel: „Vorlesen“', /^zgo$/, () => true], ['Rätsel: „Zurück“', /^zx$/, () => true],
  ['Karte/Overlay: Element', /^o:/, (st) => st.ov === 'map']
];
const out = { devices: {} }; const md = ['# Trefferflächen je Gerät (gemessen im Browser)', '', 'Gemessen mit `design/tools/capture.js`: für jeden Bildschirmzustand alle 320×200 Spielpixel über `M.uiHit` abgefragt, Umrissrechteck je Bedienelement, umgerechnet mit dem tatsächlichen Canvas-Maßstab. „Kleinste Seite“ ist die kürzere Kante des Rechtecks. Richtwerte: WCAG 2.2 SC 2.5.8 mindestens 24×24 CSS-px; Apple HIG 44×44 pt, Material 48×48 dp.', ''];
for (const dev of ['desktop', 'tablet', 'phone', 'phonePortrait']) {
  const f = path.join(EV, dev, 'capture.json'); if (!fs.existsSync(f)) continue; const cap = JSON.parse(fs.readFileSync(f, 'utf8'));
  const res = {}; let scaleInfo = null;
  for (const [file, g] of Object.entries(cap.geometry)) {
    const r = g.rect; const s = r.rot ? r.height / 320 : r.width / 320; if (!scaleInfo) scaleInfo = { scale: +s.toFixed(3), canvas: [Math.round(r.rot ? r.height : r.width), Math.round(r.rot ? r.width : r.height)], viewport: [r.vw, r.vh], dpr: r.dpr, rotated: r.rot };
    for (const [code, b] of Object.entries(g.boxes)) {
      const grp = GROUPS.find(([, re, ok]) => re.test(code) && ok(g.st || {})); if (!grp) continue;
      const w = b.x1 - b.x0 + 1, h = b.y1 - b.y0 + 1; const cw = w * s, ch = h * s; const e = res[grp[0]] || (res[grp[0]] = { n: 0, minSide: 1e9, ex: null, wMin: 1e9, hMin: 1e9 });
      e.n++; const side = Math.min(cw, ch); if (side < e.minSide) { e.minSide = side; e.ex = { file, code, logical: [w, h], css: [+cw.toFixed(1), +ch.toFixed(1)] }; } e.wMin = Math.min(e.wMin, cw); e.hMin = Math.min(e.hMin, ch);
    }
  }
  out.devices[dev] = { scaleInfo, controls: res, engine: cap.engine, version: cap.version };
  const si = scaleInfo; const fontCap = 7 * si.scale; const used = (si.canvas[0] * si.canvas[1]) / (si.viewport[0] * si.viewport[1]);
  md.push('## ' + { desktop: 'Desktop 1280×800 (Chromium, Maus)', tablet: 'Tablet quer – iPad gen 7 (Chromium-Emulation, Touch)', phone: 'Smartphone quer – iPhone 13 (WebKit-Emulation, Touch)', phonePortrait: 'Smartphone hochkant – iPhone 13 (WebKit-Emulation, Bild gedreht)' }[dev], '');
  md.push(`- Maßstab ${si.scale} CSS-px je Spielpixel (${si.dpr}× Gerätepixel), Canvas ${si.canvas[0]}×${si.canvas[1]} CSS-px in ${si.viewport[0]}×${si.viewport[1]}${si.rotated ? ' (gedreht)' : ''} → ${(used * 100).toFixed(0)} % der Fläche genutzt; Szene ${Math.round(320 * si.scale)}×${Math.round(144 * si.scale)} CSS-px`);
  md.push(`- Schrift: Versalhöhe 7 Spielpixel = ${fontCap.toFixed(1)} CSS-px (entspricht etwa ${(fontCap / 0.7).toFixed(0)} px Schriftgröße), Zeilenabstand 10 → ${(10 * si.scale).toFixed(1)} CSS-px`, '');
  md.push('| Bedienelement | gemessen in | kleinste Seite (CSS-px) | Beispiel (Spielpx → CSS-px) | ≥ 24 | ≥ 44 |', '|---|---|---|---|---|---|');
  for (const [name, e] of Object.entries(res)) md.push(`| ${name} | ${e.n} Zuständen | ${e.minSide.toFixed(1)} | ${e.ex.logical.join('×')} → ${e.ex.css.join('×')} (\`${e.ex.code}\`, ${e.ex.file}) | ${e.minSide >= 24 ? 'ja' : '**nein**'} | ${e.minSide >= 44 ? 'ja' : 'nein'} |`);
  md.push('');
}
fs.writeFileSync(path.join(EV, 'geometry.json'), JSON.stringify(out, null, 1)); fs.writeFileSync(path.join(EV, 'geometry.md'), md.join('\n') + '\n');
console.log(md.join('\n'));
