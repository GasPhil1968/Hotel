// Einstellungen für den Trailer. Jede Einstellung: Spielstand aus einem Durchlauf (dump), Vorbereitung außerhalb des Bildes (setup,
// über die Testschnittstelle, entspricht den Schritten des Durchlaufs), dann die Aufnahme (play) mit echten Mauseingaben.
// music:false = Musik der Engine aus (der Trailer bekommt eine durchgehende Musikspur aus derselben Engine, siehe 'music_*').
const idle = s => !s.busy && !s.speech && !s.dlg && !s.overlay && !s.acting && !s.walk && s.screen === 'game';
async function drainTA(R, max = 40000) { // Vorbereitung: Szenen ablaufen lassen wie im Testtreiber (Sprechblasen weitertippen)
  const e = Date.now() + max; while (Date.now() < e) { const s = await R.st(); if (idle(s)) return; if (s.card || s.speech) await R.ev(() => M.TA.skip()); if (s.overlay === 'memory' || s.overlay === 'doc') await R.ev(() => M.TA.closeOverlay()); await R.wait(120); } }
async function taTalk(R, id, opts) { await R.ev((id) => M.TA.act('talk', id), id);
  for (const o of opts) { for (let k = 0; k < 300; k++) { const s2 = await R.st(); if (s2.dlg) break; if (s2.speech || s2.card) await R.ev(() => M.TA.skip()); if (s2.overlay === 'memory' || s2.overlay === 'doc') await R.ev(() => M.TA.closeOverlay()); await R.wait(100); }
    await R.ev((o) => M.TA.choose(o), o); await R.wait(200); }
  await drainTA(R); }
async function taTravel(R, loc) { for (let k = 0; k < 100; k++) { const s = await R.st(); if (s.room === 'map' && idle(s)) break; await R.wait(100); } await R.ev((l) => M.TA.travel(l), loc); await R.wait(600); await drainTA(R); }
async function taExit(R, id) { await R.ev((id) => M.TA.exit(id), id); await R.wait(700); await drainTA(R); }
async function taWalk(R, x, y) { await R.ev(([x, y]) => M.E.walkPlayerTo(x, y), [x, y]); await R.wait(300); await drainTA(R); }
const readDoc = async (R, ms = 2600) => { await R.until(s => s.overlay === 'doc' || s.overlay === 'memory', 30000, 'Dokument'); await R.wait(ms); await R.click(160, 120, 300); await R.wait(400); };
module.exports = {
  // ---------------------------------------------------------------- Kooperation: Hafenamt (Kapitel 1, Fall 1, früh)
  coop: { title: 'Hafenamt: Marko fragt, Mala sieht im Archiv nach', dump: 'd1/19.json', music: false,
    async setup(R) { await taTalk(R, 'ivka', ['Welches Boot', 'Welcher Tag', 'Das Boot ist spät', 'Ich gehe ein Stück']); await taExit(R, 'office_door'); await R.hide(); await R.wait(300); },
    async play(R) {
      await R.wait(1200);
      await R.clickHs('mladen'); await R.pick('Rede');
      await R.choose('Frage zu einer Fähre'); await R.choose('Für einen Text');
      await R.choose('Dann sieh nach', 700);
      await R.until(s => !!s.dlg, 40000, 'Menü nach Test'); await R.wait(900); await R.choose('Danke. Laku');
      await R.waitIdle(); await R.wait(600);
      await R.switchFig(); await R.wait(1600);
      await R.clickHs('archive_door'); await R.pick('Hindurch');
      await R.until(s => s.room === 'archive', 15000, 'Archiv'); await R.waitIdle(); await R.wait(800);
      await R.clickHs('binder_1948'); await R.pick('Spüre');
      await R.waitIdle(30000); await R.wait(700);
      await R.clickHs('door'); await R.pick('Hindurch');
      await R.until(s => s.room === 'office', 15000, 'Büro'); await R.waitIdle(); await R.wait(700);
      await R.switchFig(); await R.wait(1200);
      await R.clickHs('mladen'); await R.pick('Rede'); await R.choose('Schauen Sie mal im Regal');
      await R.wait(9000); } },
  // ---------------------------------------------------------------- Einstieg: neues Spiel, Markos Wohnung, Übersetzung
  marko_open: { title: 'Neues Spiel: Prolog, Markos Wohnung, die Übersetzung', music: false,
    async setup(R) { await R.ev(() => { localStorage.clear(); }); await R.hide(); },
    async play(R) { await R.ev(() => { M.E.setSlot(1); M.E.newGame(); }); await R.until(s => idle(s), 60000, 'Prolog'); await R.wait(900);
      await R.clickHs('laptop'); await R.pick('Benutze');
      for (const o of ['Der letzte Satz', 'Seite 30', 'fertig übersetzen', 'rote Druckleuchte']) { try { await R.choose(o, 700); } catch (e) { R.note('Auswahl fehlt', o); break; } }
      await R.waitIdle(60000); await R.wait(1500); } },
  // ---------------------------------------------------------------- Riva: Wechsel zu Mala, Geistersicht, Ivkas Leine
  riva_hook: { title: 'Riva, Dämmerung: Wechsel zu Mala, Ivkas Leine', dump: 'd1/20.json', music: false,
    async setup(R) { await taExit(R, 'door'); await taWalk(R, 548, 118); await R.hide(); await R.wait(500); },
    async play(R) { await R.wait(1800); await R.switchFig(); await R.wait(2200);
      await R.clickHs('ivka'); await R.pick('Schau an'); await R.waitIdle(30000); await R.wait(1200);
      await R.clickHs('ivka'); await R.pick('Sprich'); await R.wait(9000); try { const s = await R.st(); if (s.dlg) await R.choose(s.dlg[0].slice(0, 12)); } catch (e) {}
      await R.wait(6000); } },
  // ---------------------------------------------------------------- Riva: Marko glaubt nicht an sie
  mala_deny: { title: 'Riva: „Du bist eine Einbildung.“', dump: 'd1/18.json', music: false,
    async setup(R) { await taWalk(R, 150, 120); await R.hide(); },
    async play(R) { await R.wait(1200); await R.clickHs('_mala'); await R.pick('Rede'); await R.choose('Du bist eine Einbildung'); await R.choose('Was willst du von mir'); await R.choose('Geh weg'); await R.waitIdle(); await R.wait(1500); } },
  // ---------------------------------------------------------------- Varoš: Zdenka (Gespräch mit Porträt und Auswahl)
  zdenka: { title: 'Veli Varoš: Gespräch mit Zdenka', dump: 'd1/07.json', music: false,
    async setup(R) { await R.hide(); },
    async play(R) { await R.wait(1500); await R.clickHs('zdenka'); await R.pick('Rede'); await R.choose('Wie war sie'); await R.choose('Hatte sie wirklich'); await R.wait(8000); } },
  // ---------------------------------------------------------------- Ivkas Wohnung: Knoten, Nadel, Inventar
  shoebox: { title: 'Ivkas Wohnung: Knoten mit der Stricknadel lösen', dump: 'd1/08.json', music: false,
    async setup(R) { await R.ev(() => M.TA.act('open', 'ivka_door')); await R.wait(800); await drainTA(R); await R.hide(); },
    async play(R) { await R.wait(1200); await R.clickHs('shoebox'); await R.pick('Öffne'); await R.waitIdle(); await R.wait(400);
      await R.clickHs('basket'); await R.pick('Nimm'); await R.waitIdle(); await R.wait(500);
      const p = await R.hsPoint('shoebox'); await R.dragItem('needle', p[0], p[1]); await R.waitIdle(); await R.wait(600);
      await R.clickHs('shoebox'); await R.pick('Öffne'); await R.wait(4000); } },
  // ---------------------------------------------------------------- Notizbuch: falsch, dann richtig verbunden
  notebook: { title: 'Notizbuch: zwei Hinweise verbinden', dump: 'd1/11.json', music: false,
    async setup(R) { await R.hide(); },
    async play(R) { await R.wait(1200); await R.btn('notes'); await R.wait(1600);
      await R.tapNote('pro_noone'); await R.wait(900); await R.tapNote('pro_knit'); await R.wait(4200);
      await R.tapNote('pro_noone'); await R.wait(900); await R.tapNote('pro_list'); await R.wait(6500); } },
  // ---------------------------------------------------------------- Sarajevo: Fikrets Brief (Übersetzungsrätsel)
  fikret: { title: 'Busbahnhof Sarajevo: Fikrets Brief übersetzen', dump: 'd2/02.json', music: false,
    async setup(R) { await R.hide(); },
    async play(R) { await R.wait(1200); await R.clickHs('fikret'); await R.pick('Rede'); await R.choose('Was ist das für ein Brief');
      await readDoc(R, 3800); await R.until(s => s.overlay === 'puzzle', 30000, 'Rätsel'); await R.wait(1800);
      const go = await R.findHit(k => k === 'zgo'); await R.click(go[0] + 8, go[1] + 4, 600); await R.wait(3200);
      const z0 = await R.findHit(k => k === 'z:0'); await R.click(z0[0] + 40, z0[1] + 3, 500); await R.wait(900);
      await R.click(go[0] + 8, go[1] + 4, 600); await R.wait(4200); } },
  // ---------------------------------------------------------------- Sarajevo: Straßenbahn, Fahrschein entwerten
  tram: { title: 'Straßenbahn: Fahrschein auf den Entwerter ziehen, Fahrt', dump: 'd2/04.json', music: false,
    async setup(R) { await taWalk(R, 420, 122); await R.hide(); },
    async play(R) { await R.wait(1000); await R.clickHs('tram_stop'); await R.pick('Benutze'); await R.until(s => s.room === 'tramvaj', 30000, 'Bahn'); await R.waitIdle(); await R.wait(800);
      const p = await R.hsPoint('validator'); await R.dragItem('tramkarta', p[0], p[1]); await R.waitIdle(30000); await R.wait(2500);
      await R.clickHs('window'); await R.pick('Schau an'); await R.waitIdle(); await R.wait(4000); } },
  // ---------------------------------------------------------------- Baščaršija: Mala auf der Bank
  carsija_bench: { title: 'Baščaršija: Mala wartet auf der Bank', dump: 'd2/06.json', music: false,
    async setup(R) { await R.hide(); },
    async play(R) { await R.wait(2500); await R.clickHs('malaBench'); await R.pick('Rede'); await R.waitIdle(40000); await R.wait(2000); } },
  // ---------------------------------------------------------------- Kula bei Nacht: Tomaž
  kula_tomaz: { title: 'Sahat-kula bei Nacht: Tomaž wartet', dump: 'd2/10.json', music: false,
    async setup(R) { await taExit(R, 'door').catch(() => {}); await taTravel(R, 'carsija'); await taExit(R, 'lane_kula'); await R.hide(); },
    async play(R) { await R.wait(2500); await R.clickHs('tomaz'); await R.pick('Rede'); await R.choose('Wie lange warten Sie schon'); await R.wait(6000); try { await R.choose('(Schweigen.)'); } catch (e) {} await R.waitIdle(40000); await R.wait(1500); } },
  // ---------------------------------------------------------------- Pension: Gespräch Marko und Mala
  pansion_mala: { title: 'Hajras Pension: „Ist es schlimm, tot zu sein?“', dump: 'd2/12.json', music: false,
    async setup(R) { await R.hide(); },
    async play(R) { await R.wait(1500); await R.clickHs('_mala'); await R.pick('Rede');
      await R.choose('Wie fühlt sich Sarajevo'); await R.choose('Ist es schlimm, tot zu sein'); await R.choose('Komm.'); await R.waitIdle(); await R.wait(1500); } },
  // ---------------------------------------------------------------- Vratnik: Blick über die Stadt bei Nacht
  vratnik: { title: 'Vratnik bei Nacht: die Stadt im Tal', dump: 'd2/42.json', music: false,
    async setup(R) { await drainTA(R); await R.hide(); },
    async play(R) { await R.wait(2500); await R.clickHs('view'); await R.pick('Schau an'); await R.waitIdle(); await R.wait(2500); } },
  // ---------------------------------------------------------------- Kazandžiluk: Kupferschmiede
  kazan: { title: 'Kazandžiluk: Nedžad hämmert', dump: 'd2/17.json', music: false,
    async setup(R) { await drainTA(R); await R.hide(); },
    async play(R) { await R.wait(4500); await R.clickAt(250, 125); await R.wait(4500); } },
  // ---------------------------------------------------------------- Ledana: Malas kalte Sicht, Luka
  ledana: { title: 'Ledana in Malas Geistersicht', dump: 'd1/39.json', music: false,
    async setup(R) { await drainTA(R); await R.hide(); },
    async play(R) { await R.wait(2500); await R.clickAt(70, 128); await R.wait(3500); await R.clickHs('stairs'); await R.pick('Schau an'); await R.waitIdle(); await R.wait(1500); } },
  // ---------------------------------------------------------------- Hotel Palma bei Nacht
  palma: { title: 'Hotel Palma bei Nacht', dump: 'd1/53.json', music: false,
    async setup(R) { await drainTA(R); await R.hide(); },
    async play(R) { await R.wait(3000); await R.clickAt(200, 126); await R.wait(4000); } },
  // ---------------------------------------------------------------- Busbahnhof Sarajevo, Ankunft im Nebel
  stanica: { title: 'Busbahnhof Sarajevo im Nebel', dump: 'd2/01.json', music: false,
    async setup(R) { await drainTA(R); await R.hide(); },
    async play(R) { await R.wait(2000); await R.clickAt(230, 126); await R.wait(4500); } },
  // ---------------------------------------------------------------- Titelbild: Kapitelwahl, Sprache
  title: { title: 'Titelbild: Kapitel 1 und 2, Sprache', music: false,
    async setup(R) { await R.ev(() => { localStorage.removeItem('mala.save.1'); M.E.toTitle && M.E.toTitle(); M.E.screen = 'title'; M.E.titleMode = 'main'; }); await R.hide(); },
    async play(R) { await R.wait(2500); const labels = await R.ev(() => M.titleLabels()); R.note('Titel', labels.join(' | '));
      const pts = []; for (let i = 0; i < labels.length; i++) { const p = await R.findHit(new Function('return k=>k==="t:' + i + '"')()); pts.push(p); }
      for (let i = 0; i < labels.length; i++) { if (!pts[i]) continue; await R.moveTo(pts[i][0] + 60, pts[i][1] + 3, 420); await R.wait(650); }
      const li = labels.findIndex(l => /Sprache|Jezik/.test(l)); if (li >= 0 && pts[li]) { await R.click(pts[li][0] + 60, pts[li][1] + 3, 400); await R.wait(2200); await R.click(pts[li][0] + 60, pts[li][1] + 3, 300); await R.wait(1500); }
      await R.wait(1000); } },
  // ---------------------------------------------------------------- „Zeigen“: alle anklickbaren Stellen (Baščaršija)
  reveal: { title: 'Zeigen: alle anklickbaren Stellen der Baščaršija', dump: 'd2/08.json', music: false,
    async setup(R) { await drainTA(R); await R.hide(); },
    async play(R) { await R.wait(1800); await R.btn('reveal'); await R.wait(3800); await R.clickAt(300, 128); await R.wait(3500); } },
  // ---------------------------------------------------------------- Menü: Speichern, Hinweise (Kapitel 2)
  menu: { title: 'Menü: Speichern und Hinweise auf Wunsch', dump: 'd2/12.json', music: false,
    async setup(R) { await R.hide(); },
    async play(R) { await R.wait(1200); await R.btn('menu'); await R.wait(1400);
      const sv = await R.findHit(k => k === 'm:1'); await R.click(sv[0] + 40, sv[1] + 3, 500); await R.wait(2200);
      const hi = await R.findHit(k => k === 'm:10'); if (hi) { await R.click(hi[0] + 40, hi[1] + 3, 600); await R.wait(2600); }
      const s = await R.st(); R.note('nach Hinweis', JSON.stringify({ ov: s.overlay, dlg: s.dlg })); if (s.dlg) { await R.choose(s.dlg[0].slice(0, 10)); await R.wait(4000); }
      await R.wait(2000); } },
};
module.exports.menu1 = { title: 'Menü in Kapitel 1: Speichern (Musik an)', dump: 'd1/36.json', music: true,
  async setup(R) { await drainTA(R); await R.ev(() => { M.setMusic(true); }); await R.hide(); },
  async play(R) { await R.wait(1500); await R.btn('menu'); await R.wait(1700);
    const sv = await R.findHit(k => k === 'm:1'); await R.click(sv[0] + 40, sv[1] + 3, 550); await R.wait(2600);
    const lo = await R.findHit(k => k === 'm:2'); if (lo) await R.moveTo(lo[0] + 40, lo[1] + 3, 450); await R.wait(1800); } };
module.exports.title_still = { title: 'Titelbild ohne Cursor (für die Endkarte)', music: false,
  async setup(R) { await R.ev(() => { localStorage.removeItem('mala.save.1'); M.E.screen = 'title'; M.E.titleMode = 'main'; }); await R.hide(); },
  async play(R) { await R.wait(14000); } };
// Musik: jedes Stück aus der Engine, Geräusche aus, etwa 100 s
for (const name of ['title', 'case1', 'ghost', 'k2_sarajevo', 'k2_mala', 'k2_istraga', 'k2_end', 'flat', 'vecer']) {
  module.exports['music_' + name] = { title: 'Musik: ' + name, dump: 'd1/02.json', music: true,
    async setup(R) { await R.ev(() => { M.setSound(false); M.setMusic(true); M.music('silence'); }); await R.wait(1200); await R.hide(); },
    async play(R) { await R.ev((n) => { M.music(n); }, name); await R.wait(100000); } };
}
