/* ===== rooms/k5_neu.js — Kapitel 5: die neuen Orte. An der Brauerei (pivara, Hamdija am Hahn), die Gerichtsmedizin (institut,
   Frau Kolars Büro; Bild der Vermisstenstelle aus Kapitel 2), der Friedhof Bare (bare). ===== */
(function(M){
'use strict';
function F(A,k){ return !!A.flag(k); }
function f(G,k){ return !!G.flags[k]; }
function ph(G){ return G.phase; }
function has(G,id){ return G.notes.indexOf(id)>=0; }
function inv(G,id){ return G.inv.indexOf(id)>=0; }
if (M.ART.vermisst && !M.ART.institut) M.ART.institut=M.ART.vermisst;

// ================================================================ An der Brauerei
function hamdijaHere(G){ var p=ph(G); if (!f(G,'k5.b.met') || f(G,'k5.b.gone') || f(G,'k5.b.away')) return false; return p==='k5_n1'||p==='k5_d2'; }
var HS_PV=[
 {id:'exit',name:'Zum Stadtplan',exit:{to:'map'},canExit:async function(A){ return M.k5PivaraExit?await M.k5PivaraExit(A):true; },look:'Die Brücke über die Miljacka, zurück in die Stadt.',g:{look:'Über die Brücke. Da kam er her, mit zwei Kanistern.'}},
 {id:'tap',name:'Hahn',look:function(A){ return A.m(ph(A.G)==='k5_epi'?'Der Messinghahn in der Nische. Keiner steht an. Das Wasser läuft, wenn man will.':'Ein Messinghahn in einer Nische der Mauer, darunter ein steinerner Trog. Leute füllen Plastikflaschen. Das beste Wasser der Stadt, sagt Hajra.'); },
   use:function(A){ return M.k5Tap?M.k5Tap(A):A.m('Wasser.'); },with:{ kanister:function(A){ return M.k5TapCan?M.k5TapCan(A):A.m('Wasser.'); } },
   g:{look:'Der Hahn. Hier haben alle gestanden.',sense:function(A){ return M.k5SenseTap?M.k5SenseTap(A):A.g('Wasser.'); },listen:function(A){ return A.g(f(A.G,'k5.b.gone')?'Es plätschert. Sonst nichts.':'Kanister. Viele. Und einer, der ruft.'); }}},
 {id:'trough',name:'Trog',look:'Der Trog aus Stein, ausgewaschen in der Mitte. Darin liegt eine Münze. Wer sie geworfen hat, will wiederkommen oder hat sich vertan.',g:{look:'Eine Münze. Die liegt seit Jahren da.'}},
 {id:'box',name:'Blechkasten',look:function(A){ return A.m(F(A,'k5.b.opened')?'Der Blechkasten neben dem Hahn, offen. Leer.':'Ein grauer Blechkasten neben dem Hahn, mit Klappe und einem verrosteten Vorhängeschloss. Vielleicht ein Zähler. Vielleicht nicht.'); },
   open:function(A){ return M.k5Box?M.k5Box(A):A.m('Zu.'); },use:function(A){ return M.k5Box?M.k5Box(A):A.m('Zu.'); },
   g:{look:function(A){ return M.k5BoxG?M.k5BoxG(A):A.g('Blech.'); },sense:function(A){ return M.k5BoxG?M.k5BoxG(A):A.g('Blech.'); }}},
 {id:'wall',name:'Mauer',look:'Die Mauer aus Bruchstein, lang, unter einer Linde. Dahinter lagen 1993 sieben Gräber. Jetzt ist da Rasen.',
   g:{look:'Hinter der Mauer. Da war es weich.',sense:'Sieben. Er hat sie hingelegt, einen nach dem anderen. Mit den Händen, die nass waren.'}},
 {id:'linden',name:'Linde',look:'Eine alte Linde über der Mauer. Im März kahl, mit einem Schimmer von Grün an den Spitzen.',g:{look:'Unter der Linde. Ispod lipe.'}},
 {id:'building',name:'Brauerei',look:'Die Brauerei, gelber Backstein, hohe Bogenfenster, ein Schornstein. Es riecht nach Malz. Warm und süß, wie Brot, das man zu lange gebacken hat.',
   g:{look:'Malz. So hat sein Ärmel gerochen.',sense:'Im Krieg hat sie Wasser gegeben, als die Stadt keins hatte. Die Leute haben Schlange gestanden, über die Brücke hinaus.'}},
 {id:'bridge',name:'Brückenkopf',look:'Der Kopf der Brücke über die Miljacka. Bis hierher stand die Schlange damals. Bis hierher und weiter.',
   with:{ kanister:function(A){ return M.k5QueueCan?M.k5QueueCan(A):A.m('Hier stand man an.'); } },   // Analyse K5-B06 (P16): hinten anstellen, wo die Schlange stand
   g:{look:'Hier stand der Junge. Hinten. Mit zwei blauen Kanistern.',sense:function(A){ return M.k5SenseBridge?M.k5SenseBridge(A):A.g('Wasser. Unten.'); }}},
 {id:'middle',name:'Mitte der Gasse',look:'Die Mitte der Gasse, zwischen Brücke und Hahn. Kopfsteinpflaster, frisch verlegt. Nur ein Fleck ist anders, heller.',
   use:function(A){ return M.k5QueueCan?M.k5QueueCan(A):A.m('Hier stand man an.'); },with:{ kanister:function(A){ return M.k5QueueCan?M.k5QueueCan(A):A.m('Hier stand man an.'); } },
   g:{look:'Da will ich nicht hin.',sense:function(A){ return M.k5SenseMiddle?M.k5SenseMiddle(A):A.g('Nein.'); }}},
 {id:'bench',name:'Bank',look:'Eine Bank an der Mauer. Darauf ein alter Mann mit zwei Fünfliterflaschen, der wartet, bis die Touristen fertig sind.',g:{look:'Er wartet. Er hat Zeit.'}},
 {id:'lamp',name:'Laterne',look:'Eine Laterne. Abends wirft sie einen gelben Kreis auf das Pflaster, genau bis zum Hahn.',g:{look:'Licht bis zum Hahn. Nicht weiter.'}},
 {id:'hamdija',npc:'hamdija',name:'Hamdija',uname:'Leere Stelle am Hahn',talk:function(A){ return M.k5TalkHamdija?M.k5TalkHamdija(A):A.m('…'); },
   look:'Ein Mann um die fünfzig in brauner Gummischürze, die Ärmel nass bis zum Ellbogen. Schnurrbart, Gummistiefel. Er sieht auf die Kanister, nicht auf die Gesichter.',
   give:{ kanister:function(A){ return M.k5TalkHamdija?M.k5TalkHamdija(A):A.m('…'); }, liste:function(A){ return A.npc('hamdija').say('Moja lista. Meine Liste. Bring sie hin, wo sie hingehört.'); },
     dose_lana:function(A){ return A.npc('hamdija').say('Eine Dose. Da passt kein Wasser rein.'); } },
   g:{look:'Er ist nass. Seit neunzehn Jahren ist er nass.',talk:function(A){ return M.k5HamdijaG?M.k5HamdijaG(A):A.g('Er hört mich nicht. Er hört nur Kanister.'); }}}
];
M.room('pivara',{ name:'An der Brauerei', scape:'k5_pivara', music:function(G){ return ph(G)==='k5_epi'?'k4_epi':(ph(G)==='k5_n1'?'k2_duh':'k2_istraga'); },
  state:function(G){ return {flow:f(G,'k5.e.flow'),boxOpen:f(G,'k5.b.opened')}; },
  load:function(A){ var r=M.ROOMS['pivara']; if (r && r.state) Object.assign(A.S,r.state(A.G)); },
  actors:function(S,G){ if (!hamdijaHere(G)) return []; var p=M.apos('pivara','hamdija',[214,118,'L']); return [{id:'hamdija',ch:'hamdija',x:p[0],y:p[1],f:p[2]||'L',name:'Hamdija',ghost:true,reveal:true,speechY:46,routine:false}]; },
  hotspots:HS_PV,
  enter:async function(A,from){ if (M.k5PivaraEnter) await M.k5PivaraEnter(A,from); }
});

// ================================================================ Gerichtsmedizin, Frau Kolars Büro
var HS_IN=[
 {id:'door',name:'Tür',exit:{to:'map'},canExit:async function(A){ return M.k5InstExit?await M.k5InstExit(A):true; },look:'Die Tür zum Gang. Draußen riecht es nach Desinfektionsmittel und Kaffee aus dem Automaten.',g:{look:'Draußen ist ein langer, heller Gang.'}},
 {id:'desk',name:'Schreibtisch',look:'Frau Kolars Schreibtisch: Akten in drei Stapeln, ein Telefon, eine Tasse mit „Najbolja baka“. Beste Oma. Sie hat keine Enkel, sagt sie. Die Tasse war im Sonderangebot.',
   g:{look:'Lauter Mappen. In jeder ist einer, den man sucht.'}},
 {id:'form',name:'Formular',look:'Ein Formular: „Zapisnik o identifikaciji“. Protokoll der Identifizierung. Unten zwei Linien für Unterschriften.',read:'„Zapisnik o identifikaciji, br. 2012/0217“. Unten Mamas Unterschrift, groß und schief. Sie hat zweimal angesetzt.',
   g:{look:'Eine Nummer. Hinter jeder Nummer ein Name. Endlich.'}},
 {id:'wall',name:'Wand',look:'An der Wand eine Karte von Bosnien mit Stecknadeln. Rote, gelbe, grüne. Grün heißt: Name gefunden.',g:{look:'Grün. Ich bin grün. Seit Januar.'}},
 {id:'poster',name:'Plakat',look:'„Svaki uzorak može vratiti ime.“ Jede Probe kann einen Namen zurückgeben. Dasselbe Plakat wie in Mostar und München. Es folgt mir.',g:{look:'Der Tropfen. Er folgt dir.'}},
 {id:'cabinet',name:'Aktenschrank',look:'Ein Aktenschrank mit Schubladen bis zur Decke. Auf einer steht: „Pivara, Bistrik, 2003“.',g:{look:'Pivara. Da drin liegt das Grab an der Mauer. In Papier.'}},
 {id:'chairs',name:'Stühle',look:'Zwei Stühle vor dem Schreibtisch. Auf einem hat Mama gesessen und die Hände nicht stillhalten können.',g:{look:'Hier hat Mama gesessen. Seine Mama. Ich auch einmal, im Januar, unsichtbar.'}},
 {id:'window',name:'Fenster',look:'Das Fenster. Unten ein Parkplatz, ein Krankenwagen ohne Eile, und ein Baum, an dem einer ein Vogelhaus aufgehängt hat.',g:{look:'Ein Vogelhaus. Gut, dass einer an Vögel denkt.'}},
 {id:'kolar',npc:'kolar',name:'Frau Kolar',talk:function(A){ return M.k5TalkKolar?M.k5TalkKolar(A):A.m('Frau Kolar.'); },look:'Frau Kolar, Lesebrille an einer Kette, grauer Pullover. Sie sieht aus wie jemand, der seit dreißig Jahren Leute anruft und gelernt hat, wann man schweigt.',
   give:{ liste:function(A){ return M.k5GiveListe?M.k5GiveListe(A):A.m('…'); }, dose_lana:function(A){ return A.npc('kolar').say('Das ist kein Fall für mich. Das ist etwas, das man behält.'); } },
   g:{look:'Sie hat mich gefunden. Mit einer Probe und einem Brett.'}},
 {id:'jasna',npc:'jasna',name:'Mama',talk:function(A){ return M.k5TalkJasna?M.k5TalkJasna(A):A.m('Mama.'); },look:'Mama auf dem Stuhl vor dem Schreibtisch. Auf ihrem Schoß ein Beutel mit einem Rechenschieber.',
   g:{look:'Sie hält den Rechenschieber wie einen Vogel.'}}
];
M.room('institut',{ name:'Gerichtsmedizin', scape:'k3_vermisst', music:'k3_epi',
  state:function(G){ return {}; },
  load:function(A){ var r=M.ROOMS['institut']; if (r && r.state) Object.assign(A.S,r.state(A.G)); },
  actors:function(S,G){ var L=[], p=ph(G); if (p==='k5_d2'||p==='k5_fun'||p==='k5_d2_n'){ var k=M.apos('vermisst','kolar',[196,118,'L']); L.push({id:'kolar',ch:'kolar',x:k[0],y:k[1],f:k[2]||'L',name:'Frau Kolar',idle:'sit',talk:'sitTalk',speechY:36}); }
    if (p==='k5_d2' && f(G,'k5.d2.instIn') && !f(G,'k5.d2.inst')){ var n=M.apos('vermisst','nada',[120,120,'R']); L.push({id:'jasna',ch:'jasnaC',x:n[0],y:n[1],f:n[2]||'R',name:'Mama',idle:'sit',talk:'sitTalk',speechY:36}); }
    return L; },
  hotspots:HS_IN,
  enter:async function(A,from){ if (M.k5InstEnter) await M.k5InstEnter(A,from); }
});

// ================================================================ Friedhof Bare
function funCast(G){ var p=ph(G);
  if (p==='k5_fun' && !f(G,'k5.fun.done')){ var L=['nada','zlata','jasna','ana','mia','niko','hajra','kolar','vlado','dragica','sehic']; if (f(G,'k5.d2.damir')) L.push('damir'); return L; }
  if (p==='k5_epi' && f(G,'k5.e.funeral') && !f(G,'k5.e.zoranDone')) return ['jasna2','ana2','nada2','mia2','niko2','fra','hajra2','sehic2','kolar2'];
  return []; }
var BCH={ nada:'nada', zlata:'zlata', jasna:'jasnaC', ana:'anaC', mia:'miaC', niko:'nikoC', hajra:'hajra', kolar:'kolar', vlado:'vlado', dragica:'dragica', sehic:'sehic', damir:'damir', fra:'fra' };
function bch(k){ return BCH[k.replace('2','')]; }
var BNAME={ nada:'Nada', zlata:'Zlata', jasna:'Mama', ana:'Ana', mia:'Mia', niko:'Niko', hajra:'Hajra', kolar:'Frau Kolar', vlado:'Vlado', dragica:'Dragica', sehic:'Herr Šehić', damir:'Damir', fra:'Fra Ivo' };
var HS_BA=[
 {id:'exit',name:'Zum Stadtplan',exit:{to:'map'},canExit:async function(A){ if (ph(A.G)==='k5_fun'){ await A.m('Ich bleibe. Bis zum Ende.'); return false; } return true; },look:'Der Weg hinunter zum Tor.',g:{look:'Da unten ist das Tor.'}},
 {id:'grave',name:'Lanas Grab',look:function(A){ return A.m(F(A,'k5.fun.earth')||ph(A.G)==='k5_epi'?'Lanas Grab. Frische Erde, ein Eichenpfosten, oben die Messingtafel, darunter Zlatas Brett. Daneben der Quittenableger, gerade.':'Lanas Grab. Der Pfosten steht. Die Erde liegt daneben, unter einer grünen Matte.'); },
   use:function(A){ return M.k5GraveUse?M.k5GraveUse(A):A.m('…'); },g:{look:'Mein Grab. Mit beiden Namen.'}},
 {id:'plate',name:'Messingtafel',look:'Die Messingtafel: LANA DELIĆ · 3. 3. 1976. Nedžad hat sie poliert, bis man sich darin spiegelt.',read:'LANA DELIĆ · 3. 3. 1976. Keine dritte Zeile.',g:{look:'So hat Mama mich gerufen.'}},
 {id:'board',name:'Brett',look:'Darunter das Brett aus Skela: MALA · 15.1.1994. Batos Messer, achtzehn Jahre alt.',read:'MALA · 15.1.1994.',g:{look:'So habe ich mich genannt. Am Ende.'}},
 {id:'quince',name:'Quittenableger',look:'Ein Quittenableger aus Skela, kaum ein Meter, an einen Stab gebunden. Zlata hat ihn gesetzt.',g:{look:'Vom Baum in Skela. Darunter habe ich achtzehn Jahre gelegen.'}},
 {id:'grave2',name:function(S,G){ return G.phase==='k5_epi'?'Zorans Grab':'Feld daneben'; },look:function(A){ return A.m(ph(A.G)==='k5_epi'?'Papas Grab, ein Doppelgrab. Ein Holzkreuz mit einer weißen Tafel: ZORAN VUKOVIĆ · 1951 – 1993. Kränze mit Schleifen, rote Grablichter. Daneben ist Platz. Im Sommer kommt der Stein.':'Ein freies Feld, zwei Reihen weiter, abgesteckt mit Holzpflöcken. Am Montag wird hier Papa begraben.'); },
   read:function(A){ return A.m(ph(A.G)==='k5_epi'?'Auf der Tafel am Kreuz: ZORAN VUKOVIĆ · 1951 – 1993. Auf den Stein kommt im Sommer: poginuo 19. 4. 1993. Ružas Wort.':'Kein Name. Noch nicht.'); },g:{look:function(A){ return A.g(ph(A.G)==='k5_epi'?'Sein Papa. Mit einem Kreuz, wie bei Baka.':'Hier kommt sein Papa hin. Am Montag.'); }}},
 {id:'stones',name:'Gräber',look:'Der katholische Teil von Bare: Kreuze aus Stein und Holz, dunkle Grabsteine mit einem eingemeißelten Kreuz, davor rote Grablichter. Lanas Pfosten steht dazwischen, ohne Kreuz, wie Nada und Zlata es wollten.',g:{look:'Viele. Fast alle sind gegangen. Gut.'}},
 {id:'cypress',name:'Zypresse',look:'Eine Zypresse, schwarzgrün, gerade wie ein Strich.',g:{look:'Sie zeigt nach oben. Wie alle Zypressen. Übertrieben.'}},
 {id:'city',name:'Stadt',look:'Unten die Stadt im Dunst. Die Brauerei, die Baščaršija, ganz hinten die Hochhäuser von Alipašino Polje.',g:{look:'Von hier sieht man den Weg der Drei. Fast ganz.'}},
 {id:'bench',name:'Bank',look:'Eine Bank am Weg. Darauf liegt ein vergessener Handschuh, schwarz, für die linke Hand.',g:{look:'Einer hat einen Handschuh vergessen. Er kommt wieder.'}},
 {id:'path',name:'Weg',look:'Der Kiesweg zwischen den Reihen. Er knirscht. Alle gehen leise, und er knirscht trotzdem.',g:{look:'Kies. Er verrät jeden. Mich nicht.'}}
].concat(Object.keys(BNAME).map(function(id){ return {id:id,npc:id,name:BNAME[id],talk:function(A){ return M.k5BareTalk?M.k5BareTalk(A,id):A.m('…'); },look:function(A){ return M.k5BareLook?M.k5BareLook(A,id):A.m(BNAME[id]+'.'); },g:{look:'…'}}; }))
 .concat(['jasna2','ana2','nada2','mia2','niko2','hajra2','sehic2','kolar2'].map(function(k){ var id=k.replace('2',''); return {id:k,npc:k,name:BNAME[id],talk:function(A){ return M.k5BareTalk?M.k5BareTalk(A,id):A.m('…'); },look:function(A){ return M.k5BareLook?M.k5BareLook(A,id):A.m(BNAME[id]+'.'); },g:{look:'…'}}; }));
M.room('bare',{ name:'Friedhof Bare', scape:'k5_bare', music:'k3_grob',
  state:function(G){ return {post:true,quince:f(G,'k5.fun.quince')||ph(G)==='k5_epi',grave2:ph(G)==='k5_epi'}; },
  load:function(A){ var r=M.ROOMS['bare']; if (r && r.state) Object.assign(A.S,r.state(A.G)); },
  actors:function(S,G){ var A0=M.ART.bare&&M.ART.bare.actorPos||{}; return funCast(G).map(function(k){ var p=A0[k]||[160,124,'R'], id=k; var small=/^(mia|niko)/.test(k);
    return {id:id,ch:bch(k),x:p[0],y:p[1],f:p[2],name:BNAME[k.replace('2','')],speechY:small?30:46}; }); },
  hotspots:HS_BA,
  enter:async function(A,from){ if (M.k5BareEnter) await M.k5BareEnter(A,from); }
});

// ---------------------------------------------------------------- Klangräume der neuen Orte
if (M.defineScape){
  M.defineScape('k5_pivara',function(o){ var n=o.tod==='night'; return { beds:['river','cityFar'], step:'stone', ev:n?[['drip',2,5,0.5,0.2,0.4],['dog',40,90,0.2,-0.8,-0.4]]:[['drip',2,5,0.5,0.2,0.4],['steps',10,25,0.3,-1,1],['coo',20,45,0.3,-0.6,0.6],['ezanFar',150,300,0.3,0.6,1]] }; });
  M.defineScape('k5_bare',function(o){ return { beds:['cityFar'], step:'gravel', ev:[['coo',25,60,0.25,-0.8,0.8],['ezanFar',160,320,0.3,-0.6,0.6],['steps',30,60,0.2,-1,1]] }; });
}
})(M);
