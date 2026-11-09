'use strict';
/* ===== qa/hints/varianten.js — Stände abseits der Musterlösung für die Hinweisprobe (ANALYSE_GILBERT.md, P12) =====
   Jede Variante beginnt bei einem Spielstand aus den Durchläufen (qa/regress/fixtures) und weicht ab: anderer Weg, verpasster Schritt,
   abgebrochenes Gespräch. Aufgezeichnet werden die Stände, die dabei entstehen; geprüft werden sie wie jede andere Folge.
   Abgedeckt sind die Stellen, die die Analyse als Hinweisfehler abseits der Musterlösung beschrieben hat:
     K1-B05  Nina behält den Zettel nach einem abgebrochenen Gespräch (Thema schloss, „Briefkasten“ öffnete wieder und riet zum Spachtel)
     K2-B05  „Zwei Siebenen“ ohne Malas Spüren an Tomaž (der Hinweis schickte zu Nedžads Auftragsbuch, Nedžad hat keinen Einstieg)
     K2-B07  das Wärmefach ist leer, die Nachricht liegt ungelesen im Gepäck (älterer Spielstand; der Hinweis riet wieder zum Wärmefach)
     K5-B02  beide Sätze gesagt, „Zwei Hälften“ fehlt (der Hinweis riet zum Vorschlag, den das Spiel ablehnt)
   Kann-Liste: die Hinweisthemen, die in keinem Durchlauf offen waren (k1_p31b … x4day), siehe unten. */
const { open } = require('../vmdriver');
const FX = require('../regress/fixtures/lib');

async function build(html) {
  const D = await open({ seed: 21, html });
  const seqs = [];
  const snap = async (label) => ({ label, GS: await D.ev(() => JSON.parse(JSON.stringify(M.GS))) });
  const drain = async () => { try { await D.drain(); } catch (e) { /* weiter */ } };
  const choose = async (re) => { const s = await D.st(); if (!s.dlg) return false; const i = await D.ev((src) => { const r = new RegExp(src); return M.E.dlg ? M.E.dlg.opts.findIndex((o) => r.test(o.t)) : -1; }, re.source); if (i < 0) return false; await D.ev((k) => M.E.chooseDone(k), i); await drain(); return true; };

  // K1-B05: Gespräch mit Nina nach dem Zettel abbrechen
  {
    await FX.load(D, 'k1_47_vor_nina.json', { pos: 'shop' }); await drain();
    const st = [await snap('K1-B05 vor dem Gespräch mit Nina')];
    await D.act('talk', 'nina'); await choose(/Ich war in der Ledana/); await choose(/Ninas Zettel zeigen/);
    for (let i = 0; i < 6; i++) { const s = await D.st(); if (!s.dlg) break; if (!(await choose(/Bis später|Auf Wiedersehen|Danke|Tschüss|\(Gehen\.\)|Doviđenja/))) { await D.ev(() => { const d = M.E.dlg; if (!d) return; const k = d.opts.findIndex((o) => o.bye); M.E.chooseDone(k >= 0 ? k : d.opts.length - 1); }); await drain(); } }
    st.push(await snap('K1-B05 Gespräch nach dem Zettel abgebrochen (Nina behält ihn)'));
    seqs.push({ src: 'variante:K1-B05', states: st });
  }
  // K2-B05: Zwei Siebenen, aber Mala hat Tomaž nicht gespürt
  {
    await FX.load(D, 'k2_14_zwei_siebenen.json', { delNotes: ['s1_bracelet'] }); await drain();
    seqs.push({ src: 'variante:K2-B05', states: [await snap('K2-B05 Zwei Siebenen ohne das Armband')] });
  }
  // K2-B07 (f4): Wärmefach aufgebrochen, Nachricht ungelesen im Gepäck (Spielstand von vor P01)
  {
    await FX.load(D, 'k2_58_finale.json', { pos: 'kuca', addInv: ['rcm', 'key_kuca', 'chisel'], addNotes: ['f2_postcard', 'f2_oven'], delNotes: ['f2_rcm'], setFlags: { 'k2.f2.kuca': true }, rooms: { kuca: { msgTaken: true } } }); await drain();
    seqs.push({ src: 'variante:K2-B07', states: [await snap('K2-B07 Wärmefach leer, Nachricht ungelesen')] });
  }
  // K5-B02: beide Sätze gesagt, ohne „Zwei Hälften“
  {
    await FX.load(D, 'k5_038_zwei_namen.json', { delFlags: ['k5.s.agreed'], delNotes: ['s5_teile'] }); await drain();
    seqs.push({ src: 'variante:K5-B02', states: [await snap('K5-B02 beide Sätze gesagt, „Zwei Hälften“ fehlt')] });
  }
  // ---------------------------------------------------------------- Kann-Liste, Restpunkt: Hinweisthemen, die in keinem Durchlauf offen waren
  // Jede Variante weicht mit echten Handlungen ab (Gespräch früher verlassen, Angebot ablehnen) oder stellt einen Stand her, den es wirklich gibt:
  // einen Spielstand von vor der Soll-Liste (Peilungsschlüsse noch nicht selbst gezogen) oder eine beim Laden unterbrochene Szene.
  const bye = async () => { for (let i = 0; i < 6; i++) { const s = await D.st(); if (!s.dlg) return; await FX.closeMenu(D); await drain(); } };
  const tryAct = async (...a) => { try { await D.act(...a); } catch (e) { /* weiter */ } await drain(); };
  const vary = async (src, steps) => { const st = []; for (const f of steps) { const lbl = await f(); if (lbl) st.push(await snap(lbl)); } seqs.push({ src: 'variante:' + src, states: st }); };
  // K1 Prolog, Seite 31: nach dem ersten Lesen und nach Seite 30 das Übersetzen unterbrechen (k1_p31b, k1_p31c)
  await vary('K1-Seite31', [
    async () => { await FX.load(D, 'k1_02_uebersetzung.json', {}); await drain(); await tryAct('use', 'laptop'); await choose(/Der letzte Satz auf Seite 31/); await drain(); await choose(/Später weitermachen/); await bye(); return 'K1 Seite 31 gelesen, welche Leuchte?'; },
    async () => { await tryAct('use', 'laptop'); await choose(/Seite 30/); await drain(); await choose(/Später weitermachen/); await bye(); return 'K1 Seite 30 gelesen, Satz noch nicht übersetzt'; }]);
  // K1 Prolog, Zdenka: der Schluss über die Namen, dann gefragt, ohne den Schlüssel zurückzugeben (k1_gasse, k1_return)
  await vary('K1-Zdenka', [
    async () => { await FX.load(D, 'k1_11_zdenka.json', {}); await drain(); await D.ev(() => M.TA.combine('pro_noone', 'pro_list')); await drain(); return 'K1 Namen im Heft, Zdenka noch nicht gefragt'; },
    async () => { await tryAct('talk', 'zdenka'); await choose(/In ihrem Heft stehen Namen/); await drain(); await bye(); return 'K1 Zdenka gefragt, Schlüssel noch nicht zurück'; }]);
  // K1 Fall 1, Hafenamt: Mala nicht nachsehen lassen (k1_test)
  await vary('K1-Hafenamt', [
    async () => { await FX.load(D, 'k1_19_riva.json', { pos: 'office' }); await drain(); await tryAct('talk', 'mladen'); await choose(/Frage zu einer Fähre/); await choose(/Für einen Text/); await drain(); await choose(/Nicht hier/); await bye(); return 'K1 Band 1984 fehlt, Mala nicht nachsehen lassen'; }]);
  // K1 Fall 3: der Anruf wurde beim Laden unterbrochen, Marko ist unterwegs (k3_call)
  await vary('K1-Anruf', [async () => { await FX.load(D, 'k1_53_fall3.json', { delFlags: ['c3.call'], pos: 'riva' }); await drain(); return 'K1 Fall 3, Anruf noch nicht angenommen'; }]);
  // K2: das Versprechen geschlossen, noch nicht mit Mala gesprochen (m1f)
  await vary('K2-Versprechen', [async () => { await FX.load(D, 'k2_34_versprechen.json', { delNotes: ['m2_f_ninth'] }); await drain(); return 'K2 Ein Versprechen, Malas Splitter fehlt noch'; }]);
  // K3, Spielstände von vor der Soll-Liste: Peilungsschlüsse und „Skela“ noch nicht gezogen (d1c, d1f, d1h)
  await vary('K3-alt', [
    async () => { await FX.load(D, 'k3_029_peilung3.json', { delNotes: ['l3_flat', 'l3_m3', 'l3_area'], delFlags: ['k3.peil.partizan'] }); await drain(); return 'K3 alter Stand: zwei Peilungen, Schluss fehlt'; },
    async () => { await FX.load(D, 'k3_029_peilung3.json', { delNotes: ['l3_area'] }); await drain(); return 'K3 alter Stand: drei Peilungen, Schluss fehlt'; },
    async () => { await FX.load(D, 'k3_037_kata.json', { delNotes: ['l3_skela'] }); await drain(); return 'K3 alter Stand: alte Karte gelesen, Skela fehlt'; }]);
  // K3 Sonntag: Zlata nur nach Bato gefragt, dann gegangen (d3b)
  await vary('K3-Zlata', [async () => { await FX.load(D, 'k3_064_sonntag.json', { pos: 'skela_l' }); await drain(); await tryAct('talk', 'zlata'); await choose(/Und Ihr Mann/); await drain(); await bye(); return 'K3 Sonntag: Bato hat geschlafen, nach dem Bleistift nicht gefragt'; }]);
  // K3 Finale: nach der Landung am linken Ufer noch nicht mit Zlata gesprochen (f3c)
  await vary('K3-Ufer', [async () => { await FX.load(D, 'k3_097_eingestiegen.json', {}); await drain(); try { await D.exit('to_bridge'); } catch (e) {} await drain(); try { await D.exit('exit_l'); } catch (e) {} await drain(); return 'K3 Finale: am linken Ufer angekommen'; }]);
  // K3 Epilog: der Anruf bei Nada steht aus; Nadas Ankunft beim Laden unterbrochen (e3a, e3c)
  await vary('K3-Epilog', [
    async () => { await FX.load(D, 'k3_103_epilog.json', { delFlags: ['k3.e.call'] }); await drain(); return 'K3 Epilog: Nada noch nicht angerufen'; },
    async () => { await FX.load(D, 'k3_104_epilogtag.json', { delFlags: ['k3.e.nada'], pos: 'herberge' }); await drain(); return 'K3 Epilogtag: Nadas Ankunft unterbrochen'; }]);
  // K4: Prolog ohne Lana (h4e2); Christtag nach der Stiefel-Erinnerung auf der Wiesn (d4f), dann auf dem Heimweg (x4day)
  await vary('K4-Tage', [
    async () => { await FX.load(D, 'k4_012_kaffee.json', { setFlags: { 'k4.p.jasna': true, 'k4.p.hansi': true }, delFlags: ['k4.p.lana'] }); await drain(); return 'K4 Prolog: Mama weiß es, Lana noch nicht erzählt'; },
    async () => { await FX.load(D, 'k4_018_wiesn.json', { addNotes: ['s4_peppino', 'g4_gerda'] }); await drain(); await tryAct('talk', 'ana'); await choose(/Zeigst du mir/); await drain(); await bye(); return 'K4 Christtag: alles getan, Ana noch auf der Wiesn'; },
    async () => { await D.ev(() => { M.GS.flags['k4.d1.walk'] = true; }); return 'K4 Christtag: der Tag geht zu Ende'; }]);
  await D.close2();
  return seqs;
}
module.exports = { build };
