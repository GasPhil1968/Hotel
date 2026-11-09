'use strict';
/* ===== qa/hints/stufe4.js — welche Handlung meint Stufe 4 eines Hinweisthemas? (für qa/hints/hintprobe.js, Vorschlag P12) =====
   Je Thema eine Funktion (t, G, P) → Schritt | [Schritte] | P.skip('Grund').  t = Stufe-4-Satz (Markos Fassung) im geprüften Stand,
   G = der Stand (notes, inv, flags, phase, rooms, active) – nur um mehrteilige Sätze an der richtigen Stelle zu beginnen.
   Zugeordnet wird die erste Handlung, die der Satz nennt, mit den Namen aus dem Satz (Figur, Gegenstand, Stelle, Ort, Notiztitel).
   Verzweigt der Satz je nach Stand, verzweigt die Zuordnung am Satz selbst (/…/.test(t)): geprüft wird, was dasteht.
   Schritte:
     P.talk(figur, /option/…)   Gespräch; die genannten Optionen der Reihe nach, danach jede weitere und jede Notizfrage
     P.ask(figur, notiz)        im Gespräch nach einer Notiz fragen
     P.give(figur, gegenstand)  Gegenstand auf eine Figur ziehen (geben, zeigen); figur '_mala' = Mala
     P.use(stelle, gegenstand)  Gegenstand auf eine Stelle ziehen
     P.act(verb, stelle, /option/…)   Verb an einer Stelle (look, take, open, use, push, read, walk; Mala: sense, listen, draw, pass)
     P.nact(verb, figur)        Verb an einer Figur (Mala: cross = Hinüberbringen, sense)
     P.item(verb, gegenstand, anderer)  im Inventar (read, open, use … mit …)
     P.combine(titelA, titelB)  im Notizbuch verbinden; ohne Titel: irgendein gültiger Schluss
     P.go(ort)                  Stadtplan: der Ort muss offen sein; danach geht es dort weiter (Ankunft wie über den Plan)
     P.travel(ort)              echte Reise über den Stadtplan vom aktuellen Raum aus (wer mitkommt, kommt mit)
     P.room(raum)               in einen Raum desselben Orts stellen (beide Figuren), etwa auf die Brücke in Skela
     P.mala() / P.marko()       Figur wechseln
     P.walk(x, y, raum)         an eine Stelle im Raum gehen (für Orte ohne eigene Stelle, etwa das Molenende)
     P.wait(ms)                 Zeit vergehen lassen
   Gewünschte Auswahl (nach dem Schritt): RegExp = Gesprächsoption, P.note(titel) = Notiz, die das Notizbuch zur Wahl stellt.
   Namen: Zeichenkette = Teil des angezeigten Namens (Groß-/Kleinschreibung egal) oder genaue Kennung; RegExp = Muster auf den Namen.
   Ein Name in Anführung des Satzes (Figur, Gegenstand, Ort) muss im Satz vorkommen, sonst meldet die Probe PRÜFEN. */

const st = (o) => o;
const P = {
  talk: (npc, ...want) => st({ k: 'talk', npc, want }),
  ask: (npc, note) => st({ k: 'ask', npc, note }),
  give: (npc, item, ...want) => st({ k: 'give', npc, item, want }),
  use: (hs, item, ...want) => st({ k: 'use', hs, item, want }),
  act: (verb, hs, ...want) => st({ k: 'act', verb, hs, want }),
  nact: (verb, npc, ...want) => st({ k: 'nact', verb, npc, want }),
  item: (verb, item, other, ...want) => st({ k: 'item', verb, item, other, want }),
  walk: (x, y, room, ...want) => st({ k: 'walk', x, y, room, want }),
  note: (title) => ({ note: title }),
  combine: (a, b) => st({ k: 'combine', a, b }),
  go: (loc, ...want) => st({ k: 'go', loc, want }),
  travel: (loc, ...want) => st({ k: 'travel', loc, want }),
  room: (id) => st({ k: 'room', id }),
  mala: () => st({ k: 'mala' }),
  marko: () => st({ k: 'marko' }),
  wait: (ms) => st({ k: 'wait', ms }),
  skip: (why) => ({ skip: why })
};
function normalize(x) {
  if (!x) return { skip: 'keine Zuordnung für diesen Satz' };
  if (x.skip) return x;
  if (Array.isArray(x)) return { steps: x };
  if (x.steps) return x;
  return { steps: [x] };
}
// Namen, die im Satz stehen müssen: angezeigte Namen (mit Großbuchstaben oder Sonderzeichen), keine Kennungen und Muster
function mentions(probe) {
  const out = [];
  (probe.steps || []).forEach((s) => { ['npc', 'item', 'hs', 'loc'].forEach((k) => { const v = s[k]; if (typeof v === 'string' && v[0] !== '_' && /[A-ZÄÖÜŠČĆŽĐ]/.test(v[0])) out.push(v); }); });
  return out;
}
const fold = (s) => String(s).toLowerCase().replace(/[čć]/g, 'c').replace(/š/g, 's').replace(/ž/g, 'z').replace(/đ/g, 'd');
function inText(name, t) { const n = fold(name), x = fold(t); if (x.indexOf(n) >= 0) return true; return n.length > 5 && x.indexOf(n.slice(0, n.length - 2)) >= 0; }

// Themen, die nach dem Schließen planmäßig wieder öffnen (mit Begründung)
// Sätze, die selbst sagen, dass der Schritt erst später geht (abends/nachts ist der Ort zu): geprüft wird dann nicht
const LATER = /^(Morgen|Ab morgen)\b/;
const REOPEN_OK = {
  k1_gate: 'nach jedem Fall: durch das Tor zurück aus der Zwischenwelt (Ivka, Luka, Bruno)'
};
// Themen, die zu keinem Strang ihrer Kennung gehören (wiederkehrende Themen)
const STRAND_OF = { k1_gate: 'tor', k3_back: 'tor' };
// Durchgehende Stränge: vom ersten bis zum letzten Thema soll immer eines offen sein (Prüfung D)
const STRANDS = {
  m1: 'Kapitel 2, Malas Spur: von Jakobs Foto bis „Lana Delić?“ läuft sie neben den Fällen her'
};

const SPECS = {
  // ================================================================ Kapitel 1: Split (15_hints_k1.js)
  k1_coffee: () => P.act('take', 'Džezva'),
  k1_msg: () => P.act('use', 'Anrufbeantworter'),
  k1_meet: () => P.act('walk', /Wohnungstür|Tür/),
  k1_read: () => P.give('_mala', /Brief/),
  k1_steam: () => [P.act('take', 'Džezva'), P.use('Spüle', 'dzezva'), P.use('Herd', 'dzezvaW'), P.use('Herd', 'letter_t')],
  k1_bench: () => [P.act('use', 'Bank'), P.talk('_mala')],
  k1_morning: () => P.act('use', 'Markos Tisch'),
  k1_sanja: () => P.act('use', 'Markos Tisch', /fest/i),
  k1_verify: () => P.talk('Sanja', /Montag/),
  k1_key: () => P.talk('Zdenka', /Wohnung/),
  k1_enter: () => P.act('open', 'Ivkas Tür'),
  k1_list: () => P.act('read', 'Nähkorb'),
  k1_knot: (t) => /Schuhkarton öffnen/.test(t) ? P.act('open', 'Schuhkarton') : [P.act('take', 'Nähkorb'), P.use('Schuhkarton', 'needle')],
  k1_people: () => P.combine('Laut Stadt', 'Strickheft'),
  k1_p31a: () => P.act('use', 'Laptop', /Seite 31/),
  k1_article: () => P.act('use', 'Laptop'),
  k1_bed: () => P.act('use', 'Bett'),
  k1_mole: () => P.act('walk', /Mole/),
  k1_dizzy: () => [P.go('Riva'), P.walk(600, 116, 'riva')],
  k1_gate: () => P.act('walk', /Tor/),
  k3_back: () => P.act('walk', /Tor/),
  e_ticket: () => P.act('use', 'ticket_counter'),
  k1_ivka1: () => P.talk('Ivka'),
  k1_archive: () => [P.mala(), P.act('sense', /1948/)],
  k1_log: () => P.talk('Mladen', /1948/),
  k1_came: () => P.combine('Boot um sieben', 'Fähre fiel aus'),
  k1_dinko1: () => P.give('Dinko', /Foto/),
  k1_dinko2: () => P.talk('Dinko', /Tonći im Wasser/, /Ivka wartet/),
  k1_ivka2: () => P.give('Ivka', /Brief/, P.note('c1_ferry'), P.note('c1_came'), /Brief vorlesen/, /Handschuhe/),
  k1_cross1: () => [P.mala(), P.nact('cross', 'Ivka')],
  k2_sanja: () => P.talk('Sanja'),
  k2_shop: () => [P.go('Altstadt'), P.talk('Nina')],
  k2_brick: (t) => /Spachtel am lockeren Ziegel/.test(t) ? P.use(/Ziegel/, 'Spachtel') : /Okvir|Spachtel/.test(t) ? P.talk('Nina', /Spachtel/) : P.talk('Sanja'),
  k2_case: () => [P.mala(), P.act('sense', /Schutt/)],
  k2_cross: () => [P.mala(), P.nact('cross', 'Luka')],
  k2_fence: (t) => [P.mala(), P.act('look', /am Zaun/.test(t) ? 'crates' : /^Fischkisten$/)],   // zwei Stellen heißen so (am Boot, am Zaun): geprüft wird die, die der Satz nennt
  k2_i2: () => P.talk('_mala'),
  k2_luka: () => [P.mala(), P.talk('luka')],
  k2_luka2: () => P.talk('Luka'),
  k2_news: () => [P.talk('Sanja'), P.talk('Stipe')],
  k2_nina2: () => P.talk('Nina'),
  k2_radio1: (t) => /Zeitung geben/.test(t) ? P.give('Zdenka', 'newspaper') : P.act('take', 'Zeitung'),
  k2_radio2: (t) => /in den Rekorder legen\.$/.test(t) && !/kaufen/.test(t) ? P.item('use', 'Batterien', 'Rekorder') : /Mira/.test(t) ? P.talk('Mira', /Batterien/) : P.talk('Sanja', /Hafen/),
  k2_radio3: () => P.item('use', 'Kassette', 'Rekorder'),
  k2_ramp: () => P.give('Nina', 'radioT'),
  k2_ticket: () => P.give('Nina', /Ticket/),
  k3_bell: () => [P.mala(), P.act('sense', /loge/i)],
  k3_bruno1: () => P.talk('Bruno', /Schlüssel/),
  k3_cross: () => [P.mala(), P.nact('cross', 'Bruno')],
  k3_ins: (t) => /Klavierschule zeigen/.test(t) ? P.give('Bruno', 'Klavierschule') : /Klavierschule nehmen|Tuch/.test(t) ? P.act('take', /Tuch|Flügel/)
    : /Tanzfoto zeigen/.test(t) && !/nehmen/.test(t) ? P.give('Bruno', 'Tanzfoto') : /Tanzfoto/.test(t) ? P.act('take', 'Tanzfoto')
    : /Umschlag aus Zagreb zeigen/.test(t) ? P.give('Bruno', 'Umschlag') : /Klavierhocker/.test(t) ? P.use(/Klavierhocker/, 'Schlüsselring')
    : /Treppe zum Salon/.test(t) ? P.act('walk', 'stairs') : /Mantel an Haken 13/.test(t) ? P.act('use', 'coat13') : P.act('use', /Grammofon/),
  k3_ljerka: () => P.talk('Ljerka'),
  k3_salon: () => P.act('walk', /Treppe/),
  k3_wake: () => P.act('use', /PRIVAT|Ljerka/),
  // ================================================================ Kapitel 2: Sarajevo (15_hints_k2.js)
  p1: () => P.talk('Fikret', /Was ist das für ein Brief/),
  p1b: () => [P.talk('senada', /Fahrschein/), P.act('use', 'tram_stop'), P.use('validator', 'tramkarta')],
  p2: () => P.give('malaBench', 'tramkarta_v'),
  p3: (t) => /Rade/.test(t) ? P.talk('Rade', /Kovači|Pension/) : [P.go('Kovači'), P.talk('Hajra')],
  p3b: (t) => /Herberge/.test(t) ? [P.go('Herberge'), P.talk('Maja')] : P.act('use', 'Bett'),   // Kennung in Kapitel 2 und 3
  p4: () => P.talk('tomaz'),
  p4b: () => P.act('use', 'Bett'), s1j: () => P.act('use', 'Bett'), i2: () => P.act('use', 'Bett'), s3i: () => P.act('use', 'Bett'),
  s1a: (t) => /verbinden/.test(t) ? P.combine('s1_note', 's1_alaturka') : /Tomaž .*ansehen/.test(t) ? [P.mala(), P.nact('look', 'tomaz')] : P.talk('Lejla', /Uhr/),
  s1b: (t) => /Tomaž spüren/.test(t) ? [P.mala(), P.nact('sense', 'tomaz')] : /Werkbank lesen/.test(t) ? P.act('read', 'workbench') : /Buch von 1972 zu holen/.test(t) ? P.talk('Nedžad', /Holen Sie das Buch/) : /^Nedžad|^Mit dem Datum aus Nedžads Auftragsbuch/.test(t) ? P.talk('Nedžad', /Armband/, /Ich helfe Ihnen/) : /Takvim/.test(t) && /Jakob/.test(t) ? [P.talk('Jakob', /Takvim/), P.act('read', /Takvim/)] : P.combine('s1_twosevens', 's1_sunset'),
  s1c: (t) => /Tomaž spüren/.test(t) ? [P.mala(), P.nact('sense', 'tomaz')] : /Werkbank lesen/.test(t) ? P.act('read', 'workbench') : /Buch von 1972 zu holen/.test(t) ? P.talk('Nedžad', /Holen Sie das Buch/) : P.talk('Nedžad', /Armband/, /Ich helfe Ihnen/),
  s1d: (t) => /^Šaćir erinnert sich erst/.test(t) ? (/Tomaž spüren/.test(t) ? [P.mala(), P.nact('sense', 'tomaz')] : /Werkbank lesen/.test(t) ? P.act('read', 'workbench') : /Buch von 1972 zu holen/.test(t) ? P.talk('Nedžad', /Holen Sie das Buch/) : P.talk('Nedžad', /Armband/, /Ich helfe Ihnen/)) : /^Šaćir/.test(t) ? [P.talk('Šaćir', /Soldaten/), P.combine('s1_closed', 's1_curfew')]
    : /^Tomaž nach/.test(t) ? [P.talk('tomaz'), P.combine('s1_closed', 's1_curfew')] : /verbinden/.test(t) && !/^Šaćir/.test(t) ? P.combine('s1_closed', 's1_curfew') : P.talk('Šaćir'),
  s1e: (t) => /^Erst Emina/.test(t) ? [P.talk('Emina', /November/), P.mala(), P.nact('listen', 'Emina')] : [P.mala(), P.nact('listen', 'Emina')],
  s1k: () => P.ask('Emina', 'Elf Minuten'),
  s1f: (t) => /verlassen und wieder hineingehen/.test(t) ? [P.go('Baščaršija'), P.act('walk', 'kafana_door')] : /Tür der Kammer/.test(t) ? [P.mala(), P.act('pass', 'ostava_door')]
    : /^In die Kammer/.test(t) ? [P.room('kafana'), P.act('walk', 'ostava_door'), P.use('frame', 'chisel')] : /^Nedžad um sein Stemmeisen/.test(t) ? P.talk('Nedžad', /etwas Schmales/) : P.talk('Lejla'),
  s1g: (t, G) => G.pos && G.pos.marko && G.pos.marko.room === 'ostava' ? [P.act('walk', 'door'), P.talk('Emina', /verpasst/)] : P.talk('Emina', /verpasst/),   // aus der Kammer zurück: Emina kommt wieder
  s1h: () => P.talk('tomaz', /Kaserne/),
  s1i: () => [P.mala(), P.nact('cross', 'tomaz')],
  m1a: () => P.give('Rade', /Foto/),
  m1b: (t) => /^Rade nach/.test(t) ? P.ask('Rade', 'm2_f_clock') : P.combine('m2_f_clock', 'm2_clocktower'),
  m1b2: () => [P.go('Alipašino'), P.mala(), P.talk('alija')],
  m1d: (t) => /^Rade fragen/.test(t) ? P.talk('Rade', /November/) : P.combine('m2_ticket', 'm2_notrams'),
  m1e: () => P.combine(),
  m1f: () => P.talk('_mala'),
  m1c: () => P.talk('_mala', /Dose/),
  s2a: () => [P.mala(), P.act('look', /Vitrine/)],
  s2b: () => [P.talk('Jakob'), P.act('read', /Ankaufbuch/)],
  s2c: (t) => /^Jakob nach/.test(t) ? P.talk('Jakob', /Nationalbibliothek/) : P.combine('s2_due', 's2_fire'),
  s2d: () => [P.act('use', /Telefon/, /Petar/), P.talk('Milka'), P.combine()],
  s2e: (t) => /^Bei Jakob/.test(t) ? P.talk('Jakob', /Kurrent/) : /Ich lese Kurrent/.test(t) ? P.talk('amra', /Ich lese Kurrent/) : P.talk('amra', /Was machen Sie/),
  s2f: (t) => /^Jakob/.test(t) ? P.talk('Jakob', /gehört der Bibliothek/) : /^Mit dem Passierschein/.test(t) ? P.skip('erst mit dem Passierschein (Thema „In die Vijećnica“ ist dafür offen)') : /^Den Kugelschreiber/.test(t) ? P.use(/Ausleihtheke/, /Kugelschreiber/) : P.use(/Ausleihtheke/, 'rilke'),
  s2g: () => [P.mala(), P.nact('cross', 'ivan')],
  i1: () => [P.act('use', 'Bank'), P.talk('_mala')],
  s3z: () => P.act('use', /Telefon/, /Sanja/),
  s3a: (t) => /Hausbuch lesen/.test(t) ? P.act('read', 'Hausbuch') : P.combine('m2_split_register', 'm2_housebook'),
  s3b: (t, G) => /lauschen/.test(t) ? [P.mala(), P.act('listen', /Šehić/)] : P.talk('Šehić', /Schlüssel/, { ask: true }, P.note('s3_hanka')),
  s3b2: () => P.use(/Stahltür/, 'key_shelter'),
  s3c: () => P.skip('Zusammenspiel in zwei Räumen (Mala unten, Marko oben an der Klingel)'),
  s3d: (t) => /^Mirza/.test(t) ? P.talk('Mirza', /Zeugnisse/) : /Pult/.test(t) ? P.use(/Pult/, 'pecat') : P.item('use', 'Stempel', 'svjedocanstva'),
  s3e: (t) => /^Mirza/.test(t) ? P.ask('Mirza', 's3_guilt') : /^Selma/.test(t) ? P.talk('Selma', /helfen/) : /^Damir seine Zeichnung/.test(t) ? P.give('Damir', 'Zeichnung') : /^Damir/.test(t) ? P.talk('Damir', /Klassenbuch/) : null,
  s3g: () => P.use(/Pult/, /Klassenbuch/),
  s3h: () => [P.mala(), P.nact('cross', 'Zora')],
  f1: (t) => /Paketschalter/.test(t) ? P.talk('fadila', /Paket/) : [P.use(/Steckdose/, 'mobitel'), P.act('walk', /Tür/)],
  f1b: () => P.item('open', /Karton/),
  f2: () => P.give('_mala', 'ticket_m'),
  f3: (t) => /Lanas Zimmer/.test(t) ? [P.talk('Nada', /Lanas Zimmer/), P.act('read', /Postkarte/)] : P.give('Nada', /Foto/),
  f4: (t) => /^Hajra/.test(t) ? P.talk('Hajra') : /Kohleherd oder das Wärmefach spüren/.test(t) ? [P.mala(), P.act('sense', /Herd|Wärmefach/)] : /Nachricht vom Roten Kreuz lesen/.test(t) ? P.item('read', 'rcm')
    : /mit Nada besprechen/.test(t) ? P.talk('Nada', /Roten Kreuz/) : /Wärmefach mit dem Stemmeisen/.test(t) ? P.use(/Wärmefach/, 'chisel') : P.talk('Nedžad'),
  f5: () => P.combine(),
  f6: (t) => /Bank/.test(t) ? [P.room('carsija'), P.act('use', 'bench')] : /^An der Haltestelle/.test(t) ? [P.act('use', 'tram_stop'), P.use('validator', 'ticket_m'), P.use('validator', 'ticket_l')] : [P.talk('_mala', /Fahrschein/), P.act('use', 'tram_stop'), P.use('validator', 'ticket_m'), P.use('validator', 'ticket_l')],
  f7: () => P.talk('_mala'),
  e1: () => P.give('Nada', 'rcm'),
  e2: () => [P.talk('Fadila'), P.act('use', /Bus/)],

  // ================================================================ Kapitel 3: Mostar (15_hints_k3.js)
  p3a: () => P.act('use', 'Kiosk'),
  p3c: () => [P.go(/Alte Brücke|Brücke/), P.talk('_mala')],
  p3d: () => P.act('look', /Widerlager/),
  p3e: () => P.combine(), d1h: () => P.combine(), d2a: () => P.combine(), d2d: () => P.combine(), d3g: () => P.combine(), d3h: () => P.combine(), d3j: () => P.combine(), d3n: () => P.combine(),
  p3f: () => P.talk('_mala'), p3h: () => P.talk('_mala'),
  p3g: () => P.act('use', 'steps'),
  p3i: () => P.act('use', 'Bett'), n1b: () => P.act('use', 'Bett'),
  d1a: () => P.skip('Peilung auf der Karte (eigenes Rätselfeld)'),
  d1b: (t) => /^Mit der Karte/.test(t) ? P.act('walk', 'minaret_door') : [P.talk('kasir', /Karte fürs Minarett/), P.act('walk', 'minaret_door')],
  d1c: () => P.combine('Erste Messung', 'Zweite Messung'),
  d1d: () => P.skip('geführte Überquerung der Straßenbrücke'),
  d1e: () => P.skip('Peilung auf dem Partisanenfriedhof (eigenes Rätselfeld)'),
  d1f: () => P.combine('Zu flach geschnitten', 'Dritte Messung'),
  d1g: () => P.act('look', 'oldmap'),
  d1i: (t) => /ruft zurück, sobald/.test(t) ? P.skip('Ljerkas Rückruf kommt nach zwei Ortswechseln von selbst; der Satz sagt es') : P.item('use2', 'mobitel', null, /Sanja/),
  d1j: () => P.talk(/Taxi/, /Vlado/),
  d1o: (t) => /^Im Vulkanizer/.test(t) ? P.talk('Vlado', /Januar/) : [P.go('Bulevar'), P.act('walk', 'to_vulk')],
  d1k: () => [P.mala(), P.act('sense', /Führerhaus|Lastwagen/)],
  d1l: (t) => /Plane/.test(t) ? P.talk('Kata', /Was steht da hinten/, /Übersetzer/) : P.talk('Kata', /E-Mail/),
  d1m: (t) => /unterste/.test(t) ? P.talk('Kata', /Die Schublade/, /unterste/) : [P.mala(), P.act('look', 'drawer3')],
  d2b: () => P.go('Tepa'),
  d2c: () => P.talk('zlata', /Mala/),
  d2f: () => P.talk('Vlado', /Schlüssel/),
  d2g: () => P.go('Westbusbahnhof'),
  d2h: () => [P.go('Haus Zelenika'), P.talk('Jela')],
  n2a: () => P.go('Skela'),
  n2b: () => [P.mala(), P.act('look', /Ufer/)],
  n2c: () => [P.mala(), P.act('sense', /Hütte/)],
  n2d: () => P.talk('bato'),
  n2f: () => [P.room('skela_most'), P.act('walk', 'exit_d')],
  d3a: () => P.talk('zlata'),
  d3c: () => [P.use('house', 'mobitel', /Dachfenster/), P.mala(), P.act('look', 'far_house')],
  d3d: () => [P.mala(), P.act('sense', /Glocke/)],
  d3f: (t, G) => P.ask('Bato', /Licht in Batos Kammer/.test(t) ? 'a3_lightroom' : (G.notes.indexOf('a3_lightseq') >= 0 ? 'a3_lightseq' : 'a3_roof')),
  d3i0: () => P.act('walk', 'to_bridge'),   // Zlata gibt die Decke, wenn Marko zur Brücke geht
  d3i: () => P.give('_mala', /Decke/),
  d3k: () => P.ask('Zlata', 'l3_survived'),
  d3l: () => P.talk('Bato'),
  d3m: () => P.talk('Vlado'),
  d3o: () => [P.room('vhof'), P.talk('_mala', /weggeschickt/, /Ich frage dich/)],
  d3p: () => P.talk('Vlado'),
  d3q: (t) => /verbinden/.test(t) ? P.combine('b3_letters', 'b3_kidsroom') : /Kinderzimmer ansehen/.test(t) ? P.act('use', 'stairs') : P.talk('Davor', /Briefe/),
  d3q2: () => P.talk('Davor', /Kad ćete/),
  d3s: () => P.talk('Lena'),
  d3t: () => P.talk('Lena', /Tor|Hand/),
  d3u: () => P.talk('Jela'),
  d3v: () => P.act('take', /Schlüssel|Astgabel/),
  d3w: (t) => /Hinüberbringen/.test(t) ? [P.mala(), P.nact('cross', 'mate')] : P.talk('_mala', /hinüber/),
  d3w2: () => P.act('walk', /Tor/), f3f: () => P.act('walk', /Tor/),
  d3x: () => P.skip('Sammelthema „Bis elf“; die Einzelthemen d3q–d3w2 nennen die Handlung'),
  d3y: (t) => /Zlata .*Bato wach/.test(t) || /^Bei Zlata/.test(t) ? P.talk('zlata', /Bato wach war/, /Mala fragen/) : P.talk('_mala', /Zlata/),
  f3a: () => P.act('use', /Glocke/),
  f3b: () => [P.mala(), P.act('look', 'landing', /Einsteigen/)],
  f3b2: () => [P.room('skela_most'), P.act('walk', 'exit_l')],
  f3c2: () => P.talk('Zlata', /wach/),
  f3d: () => P.talk('_mala'),
  f3e: () => P.act('take', /Seil/),
  e3b: () => [P.go(/Alte Brücke|Brücke/), P.act('use', 'crest')],
  e3d: (t) => /^Nada das Skizzenbuch/.test(t) ? P.give('Nada', 'skizzenbuch') : /^Nada Zlatas Brief/.test(t) ? [P.give('Nada', 'brief1996'), P.give('Nada', 'skizzenbuch')]
    : [P.go('Skela'), P.act('walk', 'to_bridge'), P.act('walk', 'exit_l'), P.act('walk', 'house_door'), P.act('open', 'drawer'), P.give('Nada', 'brief1996'), P.give('Nada', 'skizzenbuch')],
  e3e: () => [P.go('Vermisstenstelle'), P.talk('Kolar')],
  e3f: () => P.skip('Freitext im Formular'),
  e3g: () => P.talk('Kolar'),
  e3h: (t) => /telefonieren/.test(t) ? P.talk('Kolar', /telefonieren/) : P.item('use2', 'mobitel', null, /Mama|Mutter/),
  e3i: () => [P.go('Ostbusbahnhof'), P.act('use', 'bus')],
  x3day: () => P.wait(75000),
  // ================================================================ Kapitel 4: München (15_hints_k4.js)
  h4a: () => [P.mala(), P.act('look', /Pfeiler/)],
  h4b: (t) => /Hansi kannte/.test(t) ? P.talk('wastl', /Kannten Sie/, /Würden Sie/) : /Mann am Pfeiler reden/.test(t) ? P.talk('hansi', /Worauf warten/) : P.talk('wastl', /Feierabend/),
  h4c: () => [P.act('use', 'huber_door'), P.talk('Huber')],
  h4d: (t) => /Herd/.test(t) ? P.act('use', 'Herd') : P.act('use', 'Džezva'),
  h4e: () => P.talk('Mama'),
  p4a: () => P.act('use', 'Tisch'), f4a: () => P.act('use', 'Tisch'),
  d4a: () => [P.go('Theresienwiese'), P.talk('Ana')],
  d4b: (t) => /^An Gleis 11 mit dem Mann/.test(t) ? P.talk('sepp', /Wie heißen Sie weiter/) : /^Als Marko/.test(t) ? P.go('Hauptbahnhof') : [P.mala(), P.go('Hauptbahnhof')],
  d4c: () => P.act('take', 'Tisch'),
  d4d: () => P.give('Mama', /Brotdose/),
  d4e: () => [P.mala(), P.act('look', /Bank/)],
  n4a: () => P.talk('Mama'),
  n4b: () => [P.mala(), P.act('look', 'box')],
  n4c: () => P.act('use', /Couch/),
  s4a: () => [P.talk('Wimmer'), P.talk(/Kiosk/)],
  s4b: () => P.combine('A Urmünchner', 'Italienisch geflucht'),
  s4c: () => P.talk('Obermaier', /Akte/),
  s4d: () => P.combine(), s4h: () => P.combine(), g4d: () => P.combine(),
  s4e: (t) => /verbinden/.test(t) && !/Luke/.test(t) ? P.combine('s4_derselbe', 's4_bunker') : [P.mala(), P.act('pass', /Luke/)],
  s4f: () => P.talk(/Sepp|Peppino|Mann/, /Name|Giuseppe|Peppino|Ruggiero/),
  s4g: (t) => /^Als Mala/.test(t) ? [P.mala(), P.act('sense', 'suitcase')] : /Carmela an/.test(t) ? P.talk('sepp', /Carmela/) : /^Frau Wimmer/.test(t) ? P.talk('Wimmer', /Koffer/) : P.combine('s4_brief79', 's4_carmela_hall'),   // „Morgen: …“ überspringt die Probe (siehe LATER)
  s4i: () => [P.mala(), P.nact('cross', /Peppino|Sepp/)],
  s4j: (t, G) => (G.pos && G.pos.marko && G.pos.marko.room === 'jwohnung') ? [P.act('walk', 'door'), P.act('walk', 'exit'), P.travel('hbf'), P.act('walk', 'mission', /Mit seinem Namen/, /Neben sie/)] : [P.travel('hbf'), P.act('walk', 'mission', /Mit seinem Namen/, /Neben sie/)],
  g4a: () => P.act('use', 'clock', /Bis drei warten/),
  g4b: (t) => /^Bis drei warten/.test(t) ? P.act('use', 'clock', /Bis drei warten/) : /^An einem neuen Nachmittag/.test(t) ? [P.act('use', 'clock', /Später wiederkommen/), P.talk('Kraus', /Gong abstellen/, /erschrickt/), P.act('use', 'clock', /Bis drei warten/)]
    : [P.talk('Kraus', /Gong abstellen/, /erschrickt/), P.act('use', 'clock', /Bis drei warten/)],
  g4c: (t, G) => /^Nach drei, wenn Herr Lechner/.test(t) ? [P.mala(), P.act('sense', 'depot_photo')] : /^In Zimmer 214/.test(t) ? P.act('look', 'depot_photo') : /^Bis drei warten/.test(t) ? P.act('use', 'clock', /Bis drei warten/)
    : (G.flags['k4.g.pmPhase'] === G.phase && (G.flags['k4.g.pmUsed'] || G.flags['k4.g.pmBlunt'])) ? [P.act('use', 'clock', /Später wiederkommen/), P.mala(), P.talk('Gerda', /draußen gewartet|Depot/)] : [P.mala(), P.talk('Gerda', /draußen gewartet|Depot/)],
  g4e: (t) => /^Nach drei/.test(t) ? [P.mala(), P.act('sense', 'depot_photo')] : P.act('look', 'depot_photo'),
  g4g: () => [P.mala(), P.talk('Gerda')],
  g4h: (t) => /Zwischenwelt/.test(t) ? P.talk('ghost_gd', /Was sehen Sie im Licht/, /Stufe hinaufhelfen/) : P.act('use', 'clock', /Bis drei warten/, /Endstation/, /Ihre Hand nehmen/),
  g4i: () => P.give('alois', /Kanne/),
  z4c: () => P.talk('Ana'),
  z4d: (t) => /Ich kann lesen/.test(t) ? P.combine('z4_lesart', 'z4_antrag') : P.combine('z4_vermisst', 'z4_tot'),
  f4b: () => [P.mala(), P.act('walk', 'door')],
  f4c: () => P.go(/Bavariapark|Heim/),
  f4d: () => P.act('walk', /214/),
  e4a: () => P.talk('Mama', /Nada wartet/),
  x4fight: () => P.wait(75000), x4bridge: () => P.wait(75000),

  // ================================================================ Kapitel 5: Sarajevo (15_hints_k5.js)
  h5a: () => P.act('use', 'taxi', /Kovači/),
  h5b: () => [P.mala(), P.act('sense', 'garden'), P.marko(), P.act('use', 'garden')],
  h5c: (t, G) => P.act('walk', (G.rooms && G.rooms.stiege5) ? 'up' : 'stairs'),
  h5d: () => P.talk('Nedžad', /Tafel/),
  h5e: () => [P.go('Brauerei'), P.mala(), P.act('sense', 'tap')],
  h5f: () => P.act('use', /Fenster/), h5p: () => P.act('use', /Fenster/),
  h5g: () => [P.go('Brauerei'), P.use('tap', 'kanister')],
  h5g2: () => P.act('use', 'Bett'),
  h5f0: () => P.act('walk', 'door', /Gute Nacht/),
  h5h: () => P.go('Gerichtsmedizin'),
  h5i: (t) => /^Als Mala das Brett/.test(t) ? [P.mala(), P.act('sense', 'board')] : /^Als Mala die Mappe/.test(t) ? [P.mala(), P.act('sense', 'lana_desk')] : P.combine('s5_nh_brett', 's5_nh_mappe'),
  h5j: (t) => /gravieren/.test(t) ? P.talk('Nedžad', /Wir haben den Text/) : /verbinden/.test(t) ? P.combine('s5_beide', 's5_brett') : /Vlado/.test(t) ? P.talk('Vlado') : [P.talk('Nada'), P.talk('Zlata')],
  h5k: (t) => /^Als Mala/.test(t) ? [P.mala(), P.act('sense', 'tap'), P.act('sense', 'middle'), P.act('sense', 'bridge')] : /Kolar/.test(t) ? P.give('Kolar', /Liste/)
    : /gefunden/.test(t) ? [P.talk('Hamdija', /gefunden/), P.mala(), P.nact('cross', 'hamdija')] : /Blechkasten/.test(t) ? P.act('open', 'box') : /hinüberbringen/.test(t) ? [P.mala(), P.nact('cross', 'hamdija')] : P.talk('Hamdija', /beide Kanister gefüllt/, /Rechenschieber/, /Ich warte/),
  h5fun: () => P.skip('Wahl in einer laufenden Szene am Grab'),
  h5l: () => P.combine('Nicht Nada', 'Mama kann nicht hinauf'),
  h5l2: () => [P.talk('Mama'), P.talk('Nada')],
  h5l4: () => P.skip('Antwort in einer laufenden Szene'),
  h5l3: () => P.act('use', /Bank/),
  h5m: () => P.skip('geführte Samstagsszene im siebten Stock (Mama geht mit)'),
  h5n: (t) => /^Als Mala/.test(t) ? [P.mala(), P.act('draw', 'balcony')] : P.act('use', 'balcony'),
  h5q: () => P.act('use', 'lane_kula'),
  h5r: () => P.talk('Mama'),
  h5o: (t) => /Kanister mit dem Hahn/.test(t) ? P.use('tap', 'kanister') : [P.go('Vratnik'), P.act('walk', 'ruza_gate')],
  x5day: () => P.wait(75000)
};



module.exports = { SPECS, P, normalize, mentions, inText, REOPEN_OK, STRANDS, STRAND_OF, LATER };
