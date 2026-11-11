// Szenen für den Trailer: jede Szene lädt einen echten Spielstand (aus den Musterlösungen, MALA_DUMPALL) und spielt dann mit
// Maus und Tastatur, während aufgenommen wird. Die Marken (R.mark) landen neben der Aufnahme in <name>.marks.json.
//   node design/trailer/record.js <szene> <ausgabeordner>
'use strict';
const R = require('./rec_lib');
const D = process.env.TRAILER_DUMPS || '/tmp/trailer_dumps';   // Ordner mit k1/, k2/, k3/, k4/, k5/ aus MALA_DUMPALL=… node game/tools/walkthroughN.js
const dump = (k, n) => D + '/k' + k + '/' + String(n).padStart(2, '0') + '.json';
const dump3 = (n) => D + '/k3/' + String(n).padStart(3, '0') + '.json';

const S = {};
// 1 · Nacht in Split: im Fenster ein Mädchen, „Marko.“, dann die Wahl (Kapitel 1, Prolog, Dienstagnacht)
S.night = { src: () => dump(1, 14), async run(p) {
  await R.mouseTo(p, 200, 60, 10); await p.waitForTimeout(900); await R.mark(p, 'Abend in der Wohnung');
  await R.clickHs(p, 'bed', 700); await p.waitForTimeout(300);
  if (await p.evaluate(() => !!M.E.pop)) await R.clickPop(p, /Benutz|Schlaf|Hinleg/, 400);
  await R.waitSpeech(p, /Nachts\. Irgendwann/, 30000); await R.mark(p, 'Nachts');
  await R.waitSpeech(p, /In der dunklen Scheibe/, 40000); await R.mark(p, 'Spiegelbild');
  await R.waitSpeech(p, /^Marko\.$/, 20000); await R.mark(p, 'Mala: Marko.');
  await R.waitDlg(p, 20000); await R.mark(p, 'Wahl'); await p.waitForTimeout(900);
  await R.clickOpt(p, /Wer ist da/, 700); await R.mark(p, 'Wer ist da?');
  await R.waitSpeech(p, /^Niemand\.$/, 20000); await R.mark(p, 'Niemand.'); await R.waitNoSpeech(p); await p.waitForTimeout(800);
} };
// 2 · Mittwoch, die erste Begegnung: „Durch die Tür.“ – „Die Tür ist zu.“ – „Ja.“; Marko prüft die Tür (Kapitel 1)
S.meet = { src: () => dump(1, 16), async run(p) {
  await R.mouseTo(p, 160, 70, 10); await p.waitForTimeout(700); await R.mark(p, 'Wohnung am Morgen');
  await R.clickHs(p, 'door', 700); await R.mark(p, 'zur Tür');
  await R.waitSpeech(p, /Vor dem Bücherregal/, 30000); await R.mark(p, 'Mala erscheint');
  await R.waitSpeech(p, /^Wer bist du/, 20000); await R.mark(p, 'Wer bist du?');
  await R.waitSpeech(p, /^Durch die Tür\.$/, 20000); await R.mark(p, 'Durch die Tür.');
  await R.waitSpeech(p, /^Die Tür ist zu\.$/, 20000); await R.mark(p, 'Die Tür ist zu.');
  await R.waitSpeech(p, /^Ja\.$/, 20000); await R.mark(p, 'Ja.'); await R.waitNoSpeech(p); await R.idle(p, 30000); await p.waitForTimeout(600);
  await R.clickHs(p, 'door', 700); await R.mark(p, 'Tür prüfen');
  await R.waitSpeech(p, /Ich sage doch: durch die Tür/, 30000); await R.mark(p, 'Ich sage doch'); await R.waitNoSpeech(p);
  await R.waitSpeech(p, /Willst du/, 30000); await R.mark(p, 'Wasser?'); await R.waitNoSpeech(p); await R.idle(p, 30000); await p.waitForTimeout(500);
} };
// 3 · das Glas Wasser: die Finger gehen hindurch (Kapitel 1, direkt nach 2; startet aus dem Stand nach „Willst du … ein Glas Wasser?“)
S.glass = { src: () => dump(1, 16), pre: async (p) => { await S.meet.run(p, true); }, async run(p) {
  await R.mark(p, 'Glas holen'); await R.clickHs(p, 'glasses', 700); await p.waitForTimeout(250);
  if (await p.evaluate(() => !!M.E.pop)) await R.clickPop(p, /Nimm|Nehm/, 400);
  await R.waitNoSpeech(p, 20000); await R.idle(p, 20000); await R.mark(p, 'Glas genommen');
  await useItemOn(p, 'glass', 'sink'); await R.waitNoSpeech(p, 20000); await R.idle(p, 20000); await R.mark(p, 'gefüllt');
  await useItemOnMala(p, /glass/); await R.mark(p, 'Mala das Glas geben');
  await R.waitSpeech(p, /Die Finger gehen durch das Glas/, 30000); await R.mark(p, 'Finger hindurch');
  await R.waitSpeech(p, /Entschuldige/, 20000); await R.mark(p, 'Entschuldige'); await R.waitNoSpeech(p);
  await R.waitSpeech(p, /Der Boden steht still/, 30000); await R.mark(p, 'Boden steht still');
  await R.waitSpeech(p, /^Du siehst mich/, 30000); await R.mark(p, 'Du siehst mich'); await R.waitNoSpeech(p); await p.waitForTimeout(500);
} };
// 4 · Riva am Mittwochabend: am Ende der Mole Ivka; Mala: „Du siehst sie also auch.“ (Kapitel 1, Fall 1)
S.ivka = { src: () => dump(1, 18), async run(p) {
  await R.mouseTo(p, 250, 100, 10); await p.waitForTimeout(600); await R.mark(p, 'Riva');
  await walkTo(p, 300, 116); await R.clickHs(p, 'mole', 500); await R.mark(p, 'auf der Mole');   // die Mole ist ein eigenes Ziel: Klick → Marko geht hinaus
  await R.waitSpeech(p, /Am Ende der Mole steht eine alte Frau/, 60000); await R.mark(p, 'alte Frau');
  await p.waitForFunction(() => !!M.GS.flags['found.ivka'], null, { timeout: 30000 }); await R.mark(p, 'Ivka erscheint');
  await R.waitSpeech(p, /Du siehst sie also auch/, 30000); await R.mark(p, 'Du siehst sie also auch');
  await R.waitDlg(p, 20000); await p.waitForTimeout(700); await R.clickOpt(p, /Sie friert nur nicht/, 600); await R.mark(p, 'friert nicht');
  await R.waitSpeech(p, /weil ihr nicht mehr kalt sein kann/, 20000); await R.mark(p, 'nicht mehr kalt');
  await R.waitSpeech(p, /dass sie es nicht mehr muss/, 30000); await R.mark(p, 'nicht mehr muss'); await R.waitNoSpeech(p); await p.waitForTimeout(800);
} };
// 5 · Hafenamt: Marko fragt, der Band 1984 fehlt; Mala: „Ich kann nachsehen.“ – „Dann sieh nach.“; Wechsel; Mala im Archiv spürt den
//     Ordner; zurück; „Schauen Sie mal im Regal bei 1948“; „Zufall.“ (Kapitel 1, der erste gemeinsame Praxistest)
S.coop = { src: () => dump(1, 19), pre: async (p) => {
  await p.evaluate(() => { M.TURBO = 8; }); await talkTo(p, 'ivka', 100); for (const re of [/Welches Boot/, /Welcher Tag/, /Das Boot ist spät/, /Ich gehe ein Stück/]) { await R.clickOpt(p, re, 80); }
  await R.idle(p, 60000); await p.evaluate(() => { M.TURBO = 1; }); await p.waitForTimeout(400);
}, async run(p) {
  await R.mark(p, 'zum Hafenamt'); await toView(p, 'office_door'); await R.clickHs(p, 'office_door', 700);
  await p.waitForFunction(() => M.E.room.id === 'office' && !M.E.transitioning, null, { timeout: 30000 }); await R.idle(p, 20000); await R.mark(p, 'Hafenamt');
  await talkTo(p, 'mladen', 700); await R.waitDlg(p, 20000); await R.mark(p, 'Gespräch');
  await R.clickOpt(p, /Frage zu einer Fähre/, 600); await R.waitDlg(p, 60000); await R.mark(p, 'Fähre');
  await R.clickOpt(p, /Für einen Text/, 600); await R.mark(p, 'Für einen Text');
  await R.waitSpeech(p, /Da drin ist es immer kalt/, 60000); await R.mark(p, 'immer kalt');
  await R.waitSpeech(p, /Ich kann nachsehen/, 60000); await R.mark(p, 'Mala: Ich kann nachsehen'); await R.waitDlg(p, 30000);
  await R.clickOpt(p, /Dann sieh nach/, 700); await R.mark(p, 'Dann sieh nach'); await R.waitDlg(p, 30000);
  await R.clickOpt(p, /Danke\. Laku/, 600); await R.idle(p, 30000); await R.mark(p, 'Wechsel frei'); await p.waitForTimeout(500);
  await R.clickSwitch(p, 700); await R.mark(p, 'Wechsel zu Mala'); await p.waitForTimeout(600);
  await R.clickHs(p, 'archive_door', 700); await p.waitForFunction(() => M.E.room.id === 'archive' && !M.E.transitioning, null, { timeout: 30000 }); await R.idle(p, 20000); await R.mark(p, 'Archiv (durch die Tür)');
  await R.clickHs(p, 'binder_1948', 700); await p.waitForTimeout(250); if (await p.evaluate(() => !!M.E.pop)) await R.clickPop(p, /Anseh|Schau/, 400);
  await R.waitNoSpeech(p, 20000); await R.idle(p, 20000); await R.mark(p, 'nichts zu lesen');
  await R.clickHs(p, 'binder_1948', 700); await p.waitForTimeout(250); await R.clickPop(p, /Spür/, 400); await R.mark(p, 'spüren');
  await R.waitSpeech(p, /^Eins\. Neun\. Acht\. Vier/, 30000); await R.mark(p, '1984 Ziffern');
  await R.waitNoSpeech(p, 30000); await R.idle(p, 30000); await R.mark(p, '1984 gelesen'); await p.waitForTimeout(400);
  await R.clickHs(p, 'door', 700); await p.waitForFunction(() => M.E.room.id === 'office' && !M.E.transitioning, null, { timeout: 30000 }); await R.idle(p, 20000); await R.mark(p, 'zurück');
  await R.clickSwitch(p, 700); await R.mark(p, 'Wechsel zu Marko'); await p.waitForTimeout(500);
  await talkTo(p, 'mladen', 700); await R.waitDlg(p, 20000); await R.clickOpt(p, /Schauen Sie mal/, 700); await R.mark(p, 'Schauen Sie mal');
  await R.waitSpeech(p, /^Tatsächlich/, 60000); await R.mark(p, 'Tatsächlich');
  await speechOrOverlay(p, /^Zufall\.?$/, 90000); await R.mark(p, 'Zufall.'); await R.waitNoSpeech(p); await p.waitForTimeout(700);
} };
// 6 · Ivkas Wohnung: Schuhkarton mit Knoten, Stricknadel aus dem Nähkorb, Nadel am Knoten, Karton auf (Kapitel 1, Prolog)
S.box = { src: () => dump(1, 8), pre: async (p) => {
  await R.clickHs(p, 'ivka_door', 100); await p.waitForTimeout(200); if (await p.evaluate(() => !!M.E.pop)) await R.clickPop(p, /Öffne|Geh|Betret/, 100);
  await p.waitForFunction(() => M.E.room.id === 'ivka' && !M.E.transitioning, null, { timeout: 30000 }); await R.settle(p, 30000); await p.waitForTimeout(300);
}, async run(p) {
  await R.mouseTo(p, 150, 70, 10); await p.waitForTimeout(500); await R.mark(p, 'Ivkas Wohnung');
  await R.clickHs(p, 'shoebox', 700); await p.waitForTimeout(250); await R.clickPop(p, /Öffne/, 400); await R.mark(p, 'Karton: Knoten');
  await R.waitNoSpeech(p, 30000); await R.idle(p, 30000);
  await R.clickHs(p, 'basket', 700); await p.waitForTimeout(250); await R.clickPop(p, /Nimm|Nehm/, 400); await R.mark(p, 'Nadel nehmen');
  await R.waitNoSpeech(p, 30000); await R.idle(p, 30000);
  await useItemOn(p, 'needle', 'shoebox'); await R.mark(p, 'Nadel am Knoten'); await R.waitNoSpeech(p, 30000); await R.idle(p, 30000);
  await R.clickHs(p, 'shoebox', 700); await p.waitForTimeout(250); await R.clickPop(p, /Öffne/, 400); await R.mark(p, 'Karton auf');
  await idleClosingDocs(p, 3200); await R.mark(p, 'Postkarte'); await p.waitForTimeout(600);
} };
// 7 · Notizbuch: „Laut Stadt: keine Kontakte“ + „Ivkas Strickheft“ → „Keine Familie heißt nicht: niemand.“ (Kapitel 1, Prolog)
S.notes = { src: () => dump(1, 11), async run(p) {
  await R.mouseTo(p, 160, 80, 10); await p.waitForTimeout(600); await R.mark(p, 'Varoš');
  await R.click(p, 19, 151, 700); await p.waitForFunction(() => !!M.E.overlay, null, { timeout: 10000 }); await p.waitForTimeout(700); await R.mark(p, 'Notizbuch offen');
  let a = await notePoint(p, 'pro_noone'); for (let pg = 0; !a && pg < 4; pg++) { await R.key(p, 'ArrowRight'); await p.waitForTimeout(300); a = await notePoint(p, 'pro_noone'); }
  if (!a) throw new Error('Notiz pro_noone nicht gefunden'); await R.click(p, a[0], a[1], 700); await R.mark(p, 'erste Notiz'); await p.waitForTimeout(700);
  let b = await notePoint(p, 'pro_list'); for (let pg = 0; !b && pg < 4; pg++) { await R.key(p, 'ArrowRight'); await p.waitForTimeout(300); b = await notePoint(p, 'pro_list'); }
  if (!b) throw new Error('Notiz pro_list nicht gefunden'); await R.click(p, b[0], b[1], 700); await R.mark(p, 'zweite Notiz');
  await p.waitForFunction(() => M.GS.notes.indexOf('pro_people') >= 0, null, { timeout: 20000 }); await R.mark(p, 'Schluss: Keine Familie heißt nicht: niemand');
  await p.waitForTimeout(3500); await R.mark(p, 'Ende');
} };
async function notePoint(p, id) { return p.evaluate((id) => { const pts = []; for (let y = 0; y < 200; y += 2) for (let x = 0; x < 320; x += 2) { if (M.uiHit(x, y) === 'n:' + id) pts.push([x, y]); } if (!pts.length) return null; pts.sort((a, b) => a[1] - b[1] || a[0] - b[0]); const q = pts[Math.floor(pts.length / 2)]; return [q[0], q[1]]; }, id); }
// auf einen Satz warten; ein Dokument, das dazwischen aufgeht, bleibt 2,5 s stehen und wird dann per Klick geschlossen (wie ein Spieler)
async function speechOrOverlay(p, re, ms) { const t0 = Date.now(); while (Date.now() - t0 < (ms || 60000)) {
  const st = await p.evaluate((src) => ({ hit: !!M.E.speech && new RegExp(src).test(M.E.speech.src || M.E.speech.text), ov: M.E.overlay && M.E.overlay.kind }), re.source || re);
  if (st.hit) return; if (st.ov) { await R.mark(p, 'Dokument: ' + st.ov); await p.waitForTimeout(2500); await R.click(p, 160, 72, 400); await p.waitForTimeout(400); continue; } await p.waitForTimeout(80); }
  throw new Error('Satz nicht erschienen: ' + re); }
// bis das Spiel ruhig ist; Dokumente bleiben holdMs stehen und werden dann per Klick geschlossen
async function idleClosingDocs(p, holdMs, ms) { const t0 = Date.now(); while (Date.now() - t0 < (ms || 90000)) {
  const st = await p.evaluate(() => { const E = M.E; return { ov: E.overlay && E.overlay.kind, idle: E.screen === 'game' && !E.busy && !E.speech && !E.dlg && !E.overlay && !E.transitioning }; });
  if (st.idle) return; if (st.ov) { await R.mark(p, 'Dokument: ' + st.ov); await p.waitForTimeout(holdMs || 2500); await R.click(p, 160, 72, 400); await p.waitForTimeout(400); continue; } await p.waitForTimeout(80); }
  throw new Error('Spiel wird nicht ruhig'); }
async function talkTo(p, id, ms) { await R.clickHs(p, id, ms); await p.waitForTimeout(250); if (await p.evaluate(() => !!M.E.pop)) await R.clickPop(p, /Rede|Sprich/, 400); }
// Hotspot ins Bild holen: in seine Richtung gehen, bis er auf dem Schirm ist
async function toView(p, id) { for (let i = 0; i < 12; i++) { if (await R.hsPoint(p, id)) return; const dir = await p.evaluate((id) => { const E = M.E, h = E.room.byId[id], r = E.hsRect(h), cam = E.camX; return (r[0] + r[2] / 2) < cam + 160 ? -1 : 1; }, id);
  const y = await p.evaluate(() => Math.round(M.E.ACT[M.GS.active].y)); await walkTo(p, dir < 0 ? 40 : 280, y); } }
// freie Bodenstelle (kein Hotspot, begehbar) nahe (gx, gy) im Bild suchen
async function floorPoint(p, gx, gy) { return p.evaluate(([gx, gy]) => { const E = M.E, R0 = E.room, cam = Math.round(E.camX); let best = null, bd = 1e9;
  for (let y = 108; y < 143; y += 2) for (let x = 6; x < 314; x += 3) { const wx = x + cam; if (!R0.walk || !R0.walk(wx, y)) continue; if (E.hotspotAt(wx, y)) continue; const d = Math.abs(x - gx) * 1 + Math.abs(y - gy) * 2; if (d < bd) { bd = d; best = [x, y]; } }
  return best; }, [gx, gy]); }
async function walkTo(p, gx, gy) { await R.idle(p, 60000); const fp = await floorPoint(p, gx, gy) || [gx, gy]; await R.click(p, fp[0], fp[1], 600); await p.waitForTimeout(300); for (let i = 0; i < 300; i++) { const w = await p.evaluate(() => { const a = M.E.ACT[M.GS.active]; return !!(a && a.mode === 'walk'); }); if (!w) break; await p.waitForTimeout(60); } }
// 8 · Mostar, Ankunft im Regen: Marko tritt unter dem Vordach hervor, der Schirm geht auf (Kapitel 3, Prolog)
S.mostar = { src: () => 'qa/regress/fixtures/k3x_ankunft.json', patch: "G.pos.marko={room:'ostbus',x:150,y:116,f:'R'}; G.pos.mala={room:'ostbus',x:128,y:114,f:'R'};", async run(p) {
  await R.mouseTo(p, 230, 80, 10); await p.waitForTimeout(1200); await R.mark(p, 'unter dem Vordach');
  await walkTo(p, 226, 134); await R.mark(p, 'im Regen, Schirm offen'); await p.waitForTimeout(800);
  await walkTo(p, 290, 128); await R.mark(p, 'weiter'); await p.waitForTimeout(1500);
} };
// 9 · Alte Brücke im Regen mit Schirm (Kapitel 3, Prolog, nach dem Eintragen)
S.bridge = { src: () => dump3(7),
  async run(p) { await R.mouseTo(p, 200, 70, 10); await p.waitForTimeout(1000); await R.mark(p, 'Brücke im Regen'); await walkTo(p, 210, 126); await R.mark(p, 'geht'); await p.waitForTimeout(2200); } };
// 10 · Stadtplan: „Karte“, Orte, ein Tipp, Marko geht hin (Kapitel 3, Freitag)
S.map = { src: () => dump3(20), async run(p) {
  await R.mouseTo(p, 160, 80, 10); await p.waitForTimeout(800); await R.mark(p, 'Alte Brücke, Freitag');
  await R.click(p, 229, 151, 700); await p.waitForFunction(() => M.E.overlay && M.E.overlay.kind === 'map', null, { timeout: 10000 }); await R.mark(p, 'Stadtplan offen'); await p.waitForTimeout(900);
  for (const loc of ['herberge', 'kujundziluk']) { const q = await mapPoint(p, loc); if (q) { await R.mouseTo(p, q[0], q[1], 600); await p.waitForTimeout(500); } }
  const st = await mapPoint(p, 'koski'); if (!st) throw new Error('Koski nicht auf dem Plan'); await R.click(p, st[0], st[1], 600); await R.mark(p, 'Koski-Moschee');
  await p.waitForFunction(() => M.E.room.id === 'koski' && !M.E.transitioning, null, { timeout: 60000 }); await R.mark(p, 'angekommen'); await p.waitForTimeout(1800);
} };
async function mapPoint(p, id) { return p.evaluate((id) => { const pts = []; for (let y = 0; y < 200; y += 2) for (let x = 0; x < 320; x += 2) { const u = M.uiHit(x, y); if (u === 'o:' + id || u === 'o:loc_' + id) pts.push([x, y]); } if (!pts.length) return null; pts.sort((a, b) => a[1] - b[1] || a[0] - b[0]); return pts[Math.floor(pts.length / 2)]; }, id); }
// 11 · Hinweise in vier Stufen: Menü → „Hinweise …“ → Thema → erste und zweite Stufe (Kapitel 3, Ankunft: harmloses Thema „Ankommen“)
S.hints = { src: () => 'qa/regress/fixtures/k3x_ankunft.json', patch: "G.pos.marko={room:'ostbus',x:150,y:116,f:'R'}; G.pos.mala={room:'ostbus',x:128,y:114,f:'R'};", async run(p) {
  await R.mouseTo(p, 200, 80, 10); await p.waitForTimeout(800); await R.mark(p, 'Busbahnhof');
  await R.click(p, 305, 151, 700); await p.waitForTimeout(700); await R.mark(p, 'Menü (HTML)');
  await p.click('text=Hinweise …'); await R.mark(p, 'Hinweise'); await R.waitDlg(p, 20000); await p.waitForTimeout(1200);
  await R.clickOpt(p, /Ankommen/, 700); await R.mark(p, 'Thema Ankommen'); await R.waitSpeech(p, /Mostar, Regen, kein Plan/, 20000); await R.mark(p, 'Stufe 1'); await R.waitNoSpeech(p);
  await R.waitDlg(p, 20000); await p.waitForTimeout(700); const opt = await p.evaluate(() => M.E.dlg.opts.map(o => o.t)); await R.mark(p, 'Optionen: ' + opt.join(' | '));
  await R.clickOpt(p, /Noch|weiter|Mehr|zweite|Richtung/, 700); await R.mark(p, 'Stufe 2'); await R.waitNoSpeech(p, 20000); await p.waitForTimeout(400); await R.waitDlg(p, 20000); await p.waitForTimeout(900);
} };
// 12 · „Zeigen“ markiert alles, was man anfassen kann (Kapitel 3, Werkstatt)
S.zeigen = { src: () => dump3(40), async run(p) {
  await R.mouseTo(p, 150, 80, 10); await p.waitForTimeout(900); await R.mark(p, 'Werkstatt');
  await R.click(p, 268, 151, 700); await R.mark(p, 'Zeigen'); await p.waitForTimeout(2600);
} };
// 13 · Doppelklick auf einen Ausgang: sofort draußen (Kapitel 1, Wohnung → Stadtplan von Split)
S.exitdbl = { src: () => dump(1, 22), dblTip: true, async run(p) {
  await R.mouseTo(p, 150, 80, 10); await p.waitForTimeout(800); await R.mark(p, 'Raum');
  const ex = await p.evaluate(() => { const R0 = M.E.room; const h = R0.hotspots.find(x => x.exit && M.E.hsRect(x)); return h ? h.id : null; }); if (!ex) throw new Error('kein Ausgang');
  const q = await R.hsPoint(p, ex); if (!q) throw new Error('Ausgang nicht im Bild: ' + ex); await R.mark(p, 'Ausgang ' + ex);
  await R.dblclick(p, q[0], q[1], 700); await R.mark(p, 'Doppelklick'); await p.waitForTimeout(2200);
} };
// 14 · Städte: kurze Gänge in Sarajevo (Regen), München (Schnee, Gleis 11) und Sarajevo im März
S.sarajevo = { src: () => 'qa/regress/fixtures/k2_34_versprechen.json', async run(p) { await R.mouseTo(p, 200, 70, 10); await p.waitForTimeout(1200); await R.mark(p, 'Baščaršija im Regen'); await walkTo(p, 220, 128); await p.waitForTimeout(2500); } };
S.muenchen = { src: () => dump(4, '021').replace('/21.json', '/021.json'), async run(p) { await R.mouseTo(p, 200, 70, 10); await p.waitForTimeout(1200); await R.mark(p, 'Gleis 11'); await walkTo(p, 200, 128); await p.waitForTimeout(2500); } };
S.sarajevo5 = { src: () => dump(5, '005').replace('/05.json', '/005.json'), async run(p) { await R.mouseTo(p, 200, 70, 10); await p.waitForTimeout(1200); await R.mark(p, 'Vratnik im März'); await walkTo(p, 200, 128); await p.waitForTimeout(2500); } };
// 15 · die Australier spielen an der Brücke (Kapitel 3, Samstag; mit Musik der Szene)
S.song = { src: () => 'qa/regress/fixtures/k3x_samstag.json', music: true,
  patch: "Object.assign(G.flags,{'k3.rules':2,'k3.z.mala':true,'k3.v.part1':true,'k3.b.arrived':true,'k3.b.jela':true,'k3.s.trip':true,'k3.s.photoTrip':true,'k3.s.photo':true,'k3.s.spot':true,'k3.s.initials':true,'k3.s.dinoOk':true,'k3.x.vaga':true,'k3.ready.k3_d2':true,'k3.s.words':true}); ['b3_photo65','b3_initials','b3_lenaphoto','s3_words'].forEach(function(n){ if (G.notes.indexOf(n)<0) G.notes.push(n); }); G.pos.marko={room:'starimost',x:286,y:124,f:'R'}; G.pos.mala={room:'starimost',x:262,y:128,f:'R'}; G.active='marko'; G.malaOn=true;",
  pre: async (p) => { await p.evaluate(() => { M.music('k3_mostar'); }); await talkTo(p, 'aussie3_b', 100); await p.waitForFunction(() => M.E.dlg && M.E.dlg.opts.some(o => /Play it/.test(o.t)), null, { timeout: 60000 }); },
  async run(p) { await p.waitForTimeout(600); await R.clickOpt(p, /Play it/, 600); await R.mark(p, 'Play it');
    await R.waitSpeech(p, /^Kad ja pođoh/, 90000); await R.mark(p, 'Zeile 1');
    await R.waitSpeech(p, /^ja povedoh/, 60000); await R.mark(p, 'Zeile 2');
    await R.waitSpeech(p, /^Sve djevojke/, 60000); await R.mark(p, 'Zeile 3');
    await R.waitSpeech(p, /^samo moja mila draga/, 60000); await R.mark(p, 'Zeile 4 (Fenster)'); await p.waitForTimeout(1500); } };
// Gegenstand aus der Leiste auf einen Hotspot ziehen
async function invSlot(p, idRe) { return p.evaluate((src) => { const re = new RegExp(src), inv = M.GS.inv; const i = inv.findIndex(x => re.test(x)); if (i < 0) return null;
  const k = i - (M.E.invTop || 0) * 6; return k >= 0 && k < 6 ? [71 + k * 40, 179] : null; }, idRe.source || idRe); }
async function drag(p, a, b) { await R.mouseTo(p, a[0], a[1], 450); await p.mouse.down(); await p.waitForTimeout(120); await R.mouseTo(p, b[0], b[1], 650); await p.waitForTimeout(150); await p.mouse.up(); }
async function useItemOn(p, item, hs) { const a = await invSlot(p, new RegExp('^' + item)); if (!a) throw new Error('Gegenstand nicht in der Leiste: ' + item); const b = await R.hsPoint(p, hs); if (!b) throw new Error('Ziel nicht im Bild: ' + hs); await drag(p, a, b); }
async function useItemOnMala(p, re) { const a = await invSlot(p, re); if (!a) throw new Error('Gegenstand nicht in der Leiste: ' + re); const m = await p.evaluate(() => { const g = M.E.ACT.mala; return [Math.round(g.x - M.E.camX), Math.round(g.y - 24)]; }); await drag(p, a, m); }
module.exports = { S, dump, dump3, invSlot, drag, useItemOn, useItemOnMala, notePoint, walkTo, talkTo, toView, idleClosingDocs, speechOrOverlay, floorPoint };
