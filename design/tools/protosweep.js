// Gesamtprüfung des Prototyps: alle Bildschirme × Geräte × Entwurf/Ist (+ Umschalter), Skriptfehler, fehlende Bilder, leere Bühne,
// Bedienelemente außerhalb des virtuellen Bildschirms (Elemente in Scrollbereichen gelten als erreichbar).   node design/tools/protosweep.js [verzeichnis]
const pw = require('playwright'), path = require('path');
(async () => {
  const dir = process.argv[2] || path.join(__dirname, '..', 'prototype'); const b = await pw.chromium.launch(); const errs = []; const probs = []; const scr = []; let n = 0;
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  p.on('pageerror', e => errs.push(e.message)); p.on('requestfailed', r => errs.push('Anfrage fehlgeschlagen: ' + r.url()));
  await p.goto('file://' + dir + '/index.html'); await p.waitForTimeout(500);
  const screens = await p.evaluate(() => ORDER.map(id => ({ id, force: S[id].forceDev || null })));
  for (const sc of screens) for (const dev of ['desktop', 'tablet', 'phone', 'portrait']) {
    if (sc.force && dev !== sc.force) continue; if (sc.id === 'hochformat' && dev !== 'portrait') continue;
    for (const mode of ['neu', 'ist']) {
      const variants = sc.id === 'breitbild' ? ['marko', 'mala', 'gespraech'] : sc.id === 'spiel' ? ['neu', 'alt', 'aus'] : sc.id === 'mala' ? [false, true] : [null];
      for (const v of variants) {
        const r = await p.evaluate(async ([id, dev, mode, v]) => {
          st.screen = id; st.dev = dev; st.mode = mode; if (id === 'breitbild' && v) st.wide = v; if (id === 'spiel' && v) st.zeigen = v; if (id === 'mala' && v !== null) st.mala = v;
          render(); await new Promise(r => setTimeout(r, 120));
          const vp = document.getElementById('vp'); const imgs = [...vp.querySelectorAll('img')]; await Promise.all(imgs.map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
          const broken = imgs.filter(i => !i.naturalWidth).map(i => i.getAttribute('src'));
          const bg = [...vp.querySelectorAll('[style*="background-image"]')].map(e => (e.style.backgroundImage.match(/url\("?([^")]+)/) || [])[1]).filter(Boolean);
          const W = parseFloat(vp.style.width), H = parseFloat(vp.style.height), k = vp.getBoundingClientRect().width / W, R0 = vp.getBoundingClientRect();
          const scrollAnc = (e) => { for (let a = e.parentElement; a && a !== vp; a = a.parentElement) { const cs = getComputedStyle(a); if (/(auto|scroll)/.test(cs.overflowY + cs.overflowX) && (a.scrollHeight > a.clientHeight + 1 || a.scrollWidth > a.clientWidth + 1)) { const ar = a.getBoundingClientRect(); if ((ar.bottom - R0.top) / k <= H + 1 && (ar.right - R0.left) / k <= W + 1 && ar.top >= R0.top - 1 && ar.left >= R0.left - 1) return true; } } return false; };
          const outside = [...vp.querySelectorAll('button, [data-act], [data-go], .mi, .btn, .wb, .wslot, .wport, .hb')].filter(e => { const r = e.getBoundingClientRect(); if (!r.width) return false; const x0 = (r.left - R0.left) / k, y0 = (r.top - R0.top) / k, x1 = (r.right - R0.left) / k, y1 = (r.bottom - R0.top) / k; return x0 < -1 || y0 < -1 || x1 > W + 1 || y1 > H + 1; });
          const out = outside.filter(e => !scrollAnc(e)).map(e => (e.textContent || e.className).trim().slice(0, 30)), scrolled = outside.length - out.length;
          return { empty: vp.children.length === 0, broken, bg, out, scrolled, mode: st.mode, dev: st.dev };
        }, [sc.id, dev, mode, v]);
        n++;
        const tag = sc.id + '/' + dev + '/' + mode + (v !== null ? '/' + v : '');
        if (r.empty) probs.push(tag + ': leer'); if (r.broken.length) probs.push(tag + ': fehlende Bilder ' + r.broken.join(', ')); if (r.out.length) probs.push(tag + ': außerhalb und nicht erreichbar ' + r.out.join(' | ')); if (r.scrolled) scr.push(tag + ' (' + r.scrolled + ')');
        for (const u of r.bg) { const ok = await p.evaluate(async (u) => { const i = new Image(); i.src = u; try { await i.decode(); return i.naturalWidth > 0; } catch (e) { return false; } }, u); if (!ok) probs.push(tag + ': Hintergrundbild fehlt ' + u); }
      }
    }
  }
  console.log(n + ' Zustände geprüft'); console.log(errs.length ? 'Fehler:\n  ' + [...new Set(errs)].join('\n  ') : 'keine Skriptfehler, keine fehlgeschlagenen Anfragen');
  console.log('Erst nach Scrollen sichtbar (Scrollbereich im Bild): ' + (scr.length ? scr.join(', ') : 'nichts'));
  console.log(probs.length ? 'Auffällig:\n  ' + probs.join('\n  ') : 'keine fehlenden Bilder, keine leeren Bühnen, keine Bedienelemente außerhalb'); await b.close();
})().catch(e => { console.error(e); process.exit(1); });
