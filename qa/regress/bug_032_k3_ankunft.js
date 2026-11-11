// BUG-032 (Wünsche des Autors zur Ankunft in Mostar): (1) Erst die Herberge, dann die Brücke: Der Stadtplan vom Kiosk zeigt nur die
//     Herberge; Kujundžiluk und Alte Brücke kommen erst auf den Plan, wenn Marko sich bei Maja eingetragen hat (sie nimmt die Tasche und sagt
//     den Weg). Der Hinweis zur Brücke (p3c) öffnet erst danach. (2) Es regnet, Marko trägt einen Schirm: offen im Regen (Busbahnhof vor dem
//     Vordach, Terrasse der Herberge, Kujundžiluk, Brücke), weggesteckt unter dem Vordach, an der Rezeption und im Zimmer; er geht in Stufen auf,
//     wenn Marko vom Trockenen in den Regen läuft; beim Raumwechsel sofort im richtigen Zustand. Kein Schirm bei Bura, nicht im Regen von
//     Kapitel 1, nie für Mala. (3) Die Kioskfrau verabschiedet ihn am Donnerstag mit dem Schirm statt mit „Zeitung gegen den Regen“.
const { open } = require('../vmdriver'); const FX = require('./fixtures/lib'); const { play } = require('../../game/tools/k3play');
module.exports = { id: 'BUG-032', title: 'K3: erst die Herberge, dann die Brücke; Markos Regenschirm bei der Ankunft', async run(html) {
  const D = await open({ seed: 32, html, turbo: 25 }); const P = play(D, {}); const out = []; let ok = true;
  const ck = (c, m) => { if (!c) ok = false; out.push((c ? '' : 'FEHL ') + m); };
  const settle = async () => { await D.page.waitForTimeout(300); await P.calm(); };
  const map = () => D.ev(() => Object.keys(M.GS.map || {}).filter(k => M.GS.map[k]).sort().join(','));
  const hints = () => D.ev(() => M.hintsOpen(M.GS).map(h => h.id).filter(id => /^p3/.test(id)).join(','));
  const um = () => D.ev(() => { const a = M.E.ACT.marko; return { st: M.E.umbrellaStage(a), pose: M.E.actorPose(a).um || 0 }; });
  const settleUm = async () => { for (let i = 0; i < 20; i++) { await D.page.waitForTimeout(60); await um(); } return um(); };
  // (1) Ankunft ohne Plan
  await FX.load(D, 'k3x_ankunft.json', {}); await settle();
  ck(await map() === 'ostbus', 'Ankunft: nur der Busbahnhof (' + await map() + ')');
  ck(await hints() === 'p3a', 'Hinweis: nur „Ankommen“ (' + await hints() + ')');
  await D.ev(() => { M.__speechLog = []; }); await P.act('talk', 'kioskm'); await P.choose('Einen Stadtplan'); await P.calm();
  ck(await map() === 'herberge,ostbus', 'Stadtplan vom Kiosk: nur die Herberge (' + await map() + ')');
  ck(/Erst die Herberge/.test(await FX.said(D)), 'Marko: „Erst die Herberge. … Dann die Brücke.“');
  ck(await hints() === 'p3b', 'Hinweis: „Ein Bett“, die Brücke noch nicht (' + await hints() + ')');
  if ((await D.st()).dlg) await P.bye('Danke'); await P.calm();
  await D.ev(() => { M.__speechLog = []; }); await P.act('talk', 'kioskm'); await P.bye('Danke'); await P.calm();
  let t = await FX.said(D); ck(/Schirm/.test(t) && !/Gegen den Regen/.test(t), 'Kioskfrau am Donnerstag: der Schirm, nicht „Zeitung gegen den Regen“ (' + t.slice(-90) + ')');
  // (2) Schirm am Busbahnhof: unter dem Vordach weggesteckt, davor offen, dazwischen geht er auf
  await D.ev(() => { const a = M.E.ACT.marko; a.x = 120; a.y = 118; }); let u = await settleUm();
  ck(u.st === 1 && u.pose === 0, 'unter dem Vordach: Schirm weggesteckt ' + JSON.stringify(u));
  const turbo = await D.ev(() => { const t0 = M.TURBO; M.TURBO = 1; const a = M.E.ACT.marko; a.x = 200; a.y = 132; return t0; });   // in Echtzeit, sonst sind die Stufen zu schnell
  const seen = []; for (let i = 0; i < 60; i++) { const v = await um(); seen.push(v.pose); if (v.pose === 5 && i > 2) break; await D.page.waitForTimeout(15); }
  await D.ev((t0) => { M.TURBO = t0; }, turbo);
  ck(seen[seen.length - 1] === 5 && seen.some(v => v >= 2 && v <= 4), 'vor dem Vordach im Regen: er geht auf (' + seen.join('') + ')');
  // Zeichnung: mit Schirm Pixel über dem Kopf, ohne keine
  const drawn = await D.ev(() => { const q = M.poseS({}); const n = (p) => { const b = M.poseBuf(p, 'marko', 0); let k = 0; for (let y = 0; y < M.SPR.OY - 51; y++) for (let x = 0; x < b.w; x++) if (b.d[y * b.w + x] !== M.T) k++; return k; };
    return { without: n(q), with: n(Object.assign({}, q, { um: 5 })), F: n(Object.assign({}, M.poseF({}), { um: 5 })), B: n(Object.assign({}, M.poseF({}, 'B'), { um: 5 })) }; });
  ck(drawn.without === 0 && drawn.with > 60 && drawn.F > 60 && drawn.B > 60, 'gezeichnet: Schirm über dem Kopf (Seite, vorn, hinten) ' + JSON.stringify(drawn));
  // (1) Herberge: eintragen → Weg zur Brücke
  await P.travel('herberge'); await P.calm();
  u = await settleUm(); ck(u.st === 1 && u.pose === 0, 'Rezeption: Schirm weggesteckt ' + JSON.stringify(u));
  await D.ev(() => { M.__speechLog = []; }); await P.act('talk', 'maja'); await P.choose('Ich möchte mich eintragen'); await P.choose('(Bei Abreise „28.11.'); await P.calm();
  t = await FX.said(D); ck(/Kann die Tasche hierbleiben/.test(t) && /durch den Kujundžiluk/.test(t), 'Maja nimmt die Tasche und sagt den Weg zur Brücke');
  if ((await D.st()).dlg) await P.bye('Danke, Maja'); await P.calm();
  ck(await map() === 'herberge,kujundziluk,ostbus,starimost', 'nach dem Eintragen: Kujundžiluk und Alte Brücke auf dem Plan (' + await map() + ')');
  ck(await hints() === 'p3c', 'Hinweis: jetzt „Die Brücke, die alle kennen“ (' + await hints() + ')');
  await D.ev(() => { const a = M.E.ACT.marko; a.x = 250; a.y = 124; }); u = await settleUm(); ck(u.pose === 5, 'Terrasse der Herberge im Regen: Schirm offen ' + JSON.stringify(u));
  await D.ev(() => { const a = M.E.ACT.marko; a.x = 110; a.y = 120; }); u = await settleUm(); ck(u.st === 1 && u.pose === 0, 'zurück an der Rezeption: wieder zu ' + JSON.stringify(u));
  await P.exit('stairs'); await P.calm(); u = await um(); ck((await D.st()).room === 'zimmer' && u.st === 0 && u.pose === 0, 'im Zimmer: kein Schirm ' + JSON.stringify(u));
  await P.exit('door'); await P.calm();
  // Raumwechsel: im Regen sofort offen
  await P.travel('kujundziluk'); await P.calm(); u = await um(); ck(u.pose === 5, 'Kujundžiluk: sofort offen ' + JSON.stringify(u));
  await P.travel('starimost'); await P.calm(); u = await um(); ck(u.pose === 5, 'Alte Brücke: offen ' + JSON.stringify(u));
  const mala = await D.ev(() => M.E.ACT.mala ? M.E.umbrellaStage(M.E.ACT.mala) : 0); ck(mala === 0, 'Mala trägt keinen Schirm');
  // gespeichert und geladen: der Schirm hängt nur am Wetter und am Ort
  ck(await D.ev(() => { const a = M.API.save(); return a && M.E.loadKey('mala.save.' + M.E.slot()); }), 'gespeichert und geladen'); await settle();
  u = await um(); ck(u.pose === 5 && (await D.st()).room === 'starimost', 'nach dem Laden an der Brücke: offen ' + JSON.stringify(u));
  // kein Schirm bei Bura (Freitag) und nicht im Regen von Kapitel 1
  await FX.load(D, 'k3_021_ljerka.json', { pos: 'starimost' }); await settle(); u = await um(); ck(u.st === 0 && u.pose === 0, 'Freitag, Bura: kein Schirm ' + JSON.stringify(u));
  await FX.load(D, 'k1_02_uebersetzung.json', {}); await settle(); u = await um();
  ck(await D.ev(() => M.scn.weather(M.GS)) === 'rain' && u.st === 0, 'Kapitel 1 im Regen (Split): unverändert ohne Schirm ' + JSON.stringify(u));
  const jsErr = (D.events || []).filter(e => e[0] === 'error').length; ck(jsErr === 0, 'keine JS-Fehler (' + jsErr + ')');
  return { ok, detail: out.join('; ') };
} };
