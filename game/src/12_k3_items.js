/* ===== 12_k3_items.js — Kapitel 3: Gegenstände (Icons max. 32×24). IDs fest, siehe game/K3_SPEC.md §9 ===== */
(function(M){
'use strict';
var P=M.P;
function paper(w,x,y,ww,hh,c,lines){ w.rect(x,y,ww,hh,c||P.s5); w.hl(x,x+ww-1,y,P.s6); w.vl(x+ww-1,y,y+hh-1,P.s3); for (var i=0;i<(lines||0);i++) w.hl(x+2,x+ww-4-((i*3)%5),y+3+i*2,P.s2); }
function ph(G){ return G.phase; }
M.defineItems({
  rueckfahrt:{name:'Rückfahrkarte',icon:function(w){ w.rect(4,7,24,11,P.s5); w.hl(4,27,7,P.s6); w.rect(5,8,5,9,P.b2); w.hl(12,25,10,P.s2); w.hl(12,22,12,P.s2); w.hl(12,24,14,P.s2); M.microText(w.buf||w,'SA',13,9,P.k1); w.px(26,16,P.r2); w.px(25,16,P.r2); },
    look:function(A){ return A.m(A.G.phase==='k3_epi_d'?'Das Zurück. Sarajevo, Montag. Nada sitzt am Fenster.':'Rückfahrkarte Mostar–Sarajevo, gültig einen Monat. Ich habe sie am Donnerstag gekauft, für zwei, aus Gewohnheit. Der Schaffner hat nicht gefragt.'); },
    mala:'Hin und zurück. Ich bin nur hin.'},
  plan:{name:'Stadtplan Mostar',icon:function(w){ w.rect(4,5,24,15,P.s6); w.vl(12,5,19,P.s4); w.vl(20,5,19,P.s4); for (var y=7;y<19;y++){ var x=15+Math.round(Math.sin(y*0.6)*2); w.px(x,y,P.b3); w.px(x+1,y,P.b3); } w.rect(6,8,3,2,P.r2); w.rect(22,13,3,2,P.r2); w.hl(5,10,15,P.m2); w.hl(21,27,9,P.m2); },
    look:function(A){ var G=A.G, n=['k3.peil.bridgehead','k3.peil.minaret','k3.peil.partizan'].filter(function(k){ return G.flags[k]; }).length;
      if (!n) return A.m('Ein Stadtplan vom Kiosk, Maßstab eins zu zehntausend. Mostar von der Nordeinfahrt bis zum Südrand. Wo die Stadt aufhört, hört auch der Plan auf.');
      return A.m(n===1?'Auf dem Plan ein Bleistiftfächer vom Brückenkopf nach Süden.':(n===2?'Zwei Fächer, fast parallel. Ein langer Streifen bis über den Rand.':'Drei Fächer. Wo sie sich schneiden, ist der Plan zu Ende.')); },
    use:function(A){ return M.openMap?M.openMap():A.m('Der Plan.'); },
    mala:'Für mich ist nichts weit. Ich weiß nicht, wie man so ein Blatt liest. Ich weiß nur, wohin es zieht.'},
  ulaznica:{name:'Eintrittskarte Minarett',icon:function(w){ w.rect(8,6,16,12,P.s5); w.hl(8,23,6,P.s6); w.vl(13,6,17,P.s3); w.rect(17,8,2,8,P.m3); w.px(18,7,P.m4); w.hl(15,21,15,P.m2); },
    look:'Ein Abriss vom Ticketblock. „Minaret – 1 osoba“. Der Kassierer hat mir viel Glück gewünscht. Wobei, hat er nicht gesagt.',
    mala:'Ich brauche keine Karte. Ich brauche keine Stufen.'},
  deka:{name:'Graue Decke',icon:function(w){ for (var y=6;y<20;y++) for (var x=4;x<28;x++){ var c=((x+y)%5===0)?P.m2:P.m3; if (y===12||y===13) c=P.k1; w.px(x,y,c); } w.hl(4,27,6,P.m4); w.vl(27,6,19,P.m1); w.hl(5,26,19,P.m1); },
    look:'Zlatas Decke. Graue Armeewolle mit einem schwarzen Streifen, an den Rändern ausgefranst. Sie riecht nach Holzrauch. Und darunter nach etwas anderem.',
    mala:function(A){ return M.k3DekaMala?M.k3DekaMala(A):A.g('Die riecht nach Diesel.'); }},
  // Ausbau (design/K3_AUSBAU.md)
  vaga:{name:'Zlatas Waage',icon:function(w){ w.rect(14,3,4,3,P.s3); w.vl(16,6,9,P.s2); w.rect(10,9,12,3,P.s4); w.hl(10,21,9,P.s5); w.vl(16,12,18,P.s2); w.rect(8,18,16,4,P.s3); w.hl(8,23,18,P.s5); w.px(12,20,P.k1); w.px(16,20,P.k1); w.px(20,20,P.k1); },
    look:'Zlatas Federwaage vom Markt: ein Messingzeiger, eine Blechschale, am Haken ein Stück Schnur. Sie hat sie am Stand gelassen, als sie ging.',
    mala:'Ihre Waage. Sie hat damit Eier gewogen, als ich noch … Sie wiegt alles, was sie in die Hand nimmt. Mich hat sie nicht gewogen.'},
  pismo:{name:'Veras Brief',icon:function(w){ w.rect(5,6,22,13,P.s6); w.hl(5,26,6,P.s5); w.vl(26,6,18,P.s3); for (var i=0;i<4;i++) w.hl(8,20-i*2,9+i*2,P.k2); w.px(23,16,P.r3); },
    look:'Vier Sätze auf einem Blatt vom Kohlblock, in meiner Schrift und Veras Worten. „Komm es holen.“ Keine Unterschrift.',
    mala:'Vier Sätze. Ich habe in siebzehn Jahren weniger gesagt.'},
  mapa_mate:{name:'Mates Mappe',icon:function(w){ w.rect(4,5,24,15,P.m3); w.hl(4,27,5,P.m4); w.vl(27,5,19,P.m1); w.rect(6,8,20,10,P.s6); w.hl(8,22,11,P.b3); w.hl(8,18,13,P.k2); w.hl(8,20,15,P.k2); },
    look:'Mates Mappe aus Zdravkos Schublade. Darin ein blauer Fahrschein, Mostar–München, und ein Brief, der nach zwei Zeilen aufhört.',
    read:function(A){ return M.K3X&&M.K3X.folderDoc?M.K3X.folderDoc(A):A.m('Die Mappe.'); },open:function(A){ return M.K3X&&M.K3X.folderDoc?M.K3X.folderDoc(A):A.m('Die Mappe.'); },
    mala:'Eine Fahrkarte für einen, der nicht mehr fährt. Ich hatte auch so eine. Zwei.'},
  olovka_mala:{name:'Malas Bleistift',icon:function(w){ for (var x=6;x<24;x++){ w.px(x,11,P.y4); w.px(x,12,P.y3); w.px(x,13,P.y2); } w.rect(24,11,3,3,P.s4); w.px(27,12,P.k1); w.rect(6,10,3,5,P.r2); w.px(9,10,P.k2); w.px(11,14,P.k2); w.px(14,10,P.k2); },
    look:'Ein kurzer Bleistift, angekaut, die Farbe abgeblättert. Bato hat ihn an der Glocke gefunden. Zlata hat ihn siebzehn Jahre in der Schublade gehabt.',
    mala:function(A){ return M.K3X&&M.K3X.pencilMala?M.K3X.pencilMala(A):A.g('Meiner.'); }},
  kljuc_mate:{name:'Mates Hausschlüssel',icon:function(w){ w.rect(5,10,8,6,P.y2); w.rect(7,12,4,2,P.k1); w.rect(13,12,13,2,P.y3); w.rect(22,14,2,3,P.y2); w.rect(25,14,1,2,P.y2); w.hl(13,25,12,P.y4); },
    look:'Ein schwerer alter Haustürschlüssel, warm, als hätte ihn jemand lange in der Hand gehalten. Er lag in der Astgabel.',
    mala:'Er hat ihn jahrelang gehalten. Für den Kleinsten.'},
  vizitka:{name:'Davors Karte',icon:function(w){ paper(w,6,7,20,12,P.s6,3); w.rect(8,9,3,3,P.b2); },
    look:'Davor Zelenika, Dipl.-Ing., eine Adresse in München-Moosach, zwei Telefonnummern. „Falls Sie mal in München sind.“',
    mala:'München. Da fährst du hin. Ich weiß es, bevor du es weißt.'},
  brief1996:{name:'Brief von 1996',icon:function(w){ paper(w,5,6,22,14,P.s5,4); w.rect(20,7,5,5,P.r3); w.hl(7,24,17,P.r2); M.microText(w.buf||w,'?',21,7,P.s6); },
    look:'Ein Umschlag, vergilbt, mit zittriger Schrift: „An die Familie eines Mädchens, das sich Mala nannte. MZ Alipašino Polje, Sarajevo.“ Darauf ein Stempel: „Adresa nedovoljna.“ Adresse unzureichend.',
    mala:'Sie hat geschrieben. Und keiner hat ihn gekriegt.'},
  skizzenbuch:{name:'Lanas Skizzenbuch',icon:function(w){ w.rect(6,5,20,15,P.d2); w.rect(7,6,18,13,P.s5); w.vl(16,6,18,P.s3); w.hl(8,14,9,P.m2); w.hl(9,13,11,P.m2); w.hl(18,23,10,P.m2); w.px(20,13,P.m2); w.px(21,12,P.m2); w.hl(6,25,5,P.d3); },
    look:'Ein kleines Skizzenbuch mit gewelltem Karton. Zlata hat es auf dem Herd getrocknet. Die Seiten sind wellig wie Wasser.',
    mala:'Meins. Ich habe es nicht vergessen. Ich habe nur vergessen, dass es noch da ist.'},
  formular:{name:'Formular',icon:function(w){ paper(w,6,4,20,17,P.s6,5); w.rect(8,6,6,2,P.b2); w.rect(20,16,4,3,P.r2); },
    look:'Ein Formular des Instituts: „Prijava nestale osobe / Meldung einer vermissten Person“. Name, Geburtsdatum, zuletzt gesehen, Beziehung zur vermissten Person.',
    mala:'„Zuletzt gesehen.“ Das warst nicht du. Das war Zlata.'}
});
})(M);
