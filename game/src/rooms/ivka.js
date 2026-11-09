/* ===== rooms/ivka.js — Ivkas Wohnung (Prolog): zwei Tassen, ein Stuhl am Fenster, ein Radio, das sich selbst einschaltet ===== */
(function(M){
'use strict';
var P=M.P;
async function radioScene(A,self){ A.set('radioOn',true); A.sfx('radioOn'); await A.wait(500);
  await A.voice('„…upozorenje za pomorce … bura, olujni udari do devet bofora … Splitski kanal …“',P.m4);
  await A.m(self?'…Ich habe es nicht angefasst.':'Eine Wetterwarnung. Bura, Sturmböen bis neun Beaufort, Kanal von Split.'); A.set('radioOn',false); A.sfx('click');
  if (!self){ await A.m('Ich schalte es aus. Draußen ist Jugo, nicht Bura. Der Sender muss alt sein. Oder ich.'); A.S.radioT=A.gt+16000; }
  else { A.headache(3500); await A.m('Kontaktfehler. Sicher. Ein alter Stecker in einer alten Wand.'); A.note('c1_radio'); } }
var HS=[
 {id:'door',name:'Tür',exit:{to:'varos'},
   canExit:async function(A){ var a=A.has('postcard'), b=A.has('photo1'), c=A.hasNote('pro_list')||!!A.flag('split.intro.legacy'); if (a&&b&&c) return true;
     if (!a&&!b){ await A.m('Ich habe noch nichts, worüber ich schreiben könnte. Fünfundachtzig Jahre, und ich stehe hier wie ein Möbelpacker.'); return false; }
     if (a&&b){ await A.m('Bis jetzt erzählt hier alles vom Warten. Sie hat auch gelebt. Irgendwo muss das stehen.'); return false; }
     // Analyse K1-B03 (P16): je fehlendem Stück ein eigener Satz (vorher zeigte der Satz aufs Strickheft, auch wenn Foto oder Karte fehlten)
     if (!a){ await A.m('Ein Foto habe ich. Aber nichts von dem, was er ihr geschrieben hat.'); return false; }
     if (!b){ await A.m('Seine Karte habe ich. Aber noch kein Bild von ihm, das ich mitnehmen darf.'); return false; }
     await A.m('Noch etwas. Irgendetwas, das von ihr erzählt. Nicht nur von ihrem Warten.'); return false; },
   look:'Die Tür zur Gasse.',g:{look:'…'}},
 {id:'window',name:'Fenster',look:'Durch die Läden sieht man tief unten die Dächer, dahinter die Riva und die Mole. Das Ende der Mole. Sie konnte es von hier aus sehen.',open:'Ich lasse es, wie sie es gelassen hat.'},
 {id:'chair',name:'Stuhl am Fenster',look:'Ein Stuhl, zum Fenster gedreht, darauf eine Decke, ordentlich gefaltet. Von hier sieht man die Mole.',use:'Ich setze mich nicht auf ihren Platz.',take:'Nein.'},
 {id:'cupboard',name:'Kredenz',look:'Eine Anrichte mit Häkeldeckchen. Darauf zwei Fotos und ein Radio. Mehr hat sie nicht ausgestellt.',open:'Teller, Tassen, ein Satz Gläser für Gäste. Die Gläser haben Staub. Gäste kamen keine.'},
 {id:'photo_tonci',name:'Foto: junger Mann',look:'Ein junger Mann im Matrosenpullover, lachend. Hinter ihm ein Hafen. Am Rahmen klebt ein Zettel: „Tonći, 1983.“',take:'Das bleibt hier. Das hat sie jeden Tag angesehen.'},
 {id:'photo_boat',name:'Foto: zwei Männer im Boot',vis:function(S){ return !S.photoTaken; },look:'Zwei junge Männer auf einem weißen Fischerboot, nass vom Spritzwasser. Am Bug steht ANKICA.',
   take:async function(A){ await A.reach(function(){ A.set('photoTaken',true); A.give('photo1'); }); A.note('c1_ankica'); await A.m('Auf der Rückseite: „Ja i Dinko, Supetar, ljeto ’84.“ Ich und Dinko, Supetar, Sommer ’84.'); await A.m('Das nehme ich mit. Für den Text. Ich bringe es zurück.'); }},
 {id:'radio',name:'Radio',look:'Ein Radiorekorder aus den Achtzigern. Kassettenfach, Teleskopantenne. Ein Sender ist mit Klebeband markiert: „Seewetter“. Der Stecker steckt in der Wand.',
   use:function(A){ return radioScene(A,false); }, take:'Den lasse ich hier. Das ist ihr Radio, nicht meins.'},
 {id:'table',name:'Tisch',look:'Ein Tisch mit Wachstuch, Zitronenmuster. Darauf zwei Tassen und ein Schuhkarton mit einem Band darum.'},
 {id:'cups',name:'Zwei Tassen',look:'Zwei Tassen. Eine mit einem braunen Rand vom Kaffee. Die andere so sauber, als würde sie jeden Tag gespült, ohne je benutzt zu werden.',take:'Nein. Die gehören zusammen.'},
 {id:'shoebox',name:'Schuhkarton',look:function(A){ return A.m(A.S.boxOpen?'Briefe, in Bündeln, nach Jahren sortiert. 1982, 1983, 1984.':'Ein Schuhkarton, mit einem roten Band verschnürt. „Tonći“ steht darauf, in alter Schrift.'); },
   open:async function(A){ if (A.has('postcard')) return A.m('Ich habe, was ich brauche. Der Rest gehört ihr.');
     if (!A.S.knotOpen){ await A.reach(); return A.m(A.cycle('knot',['Das rote Band ist zu einem kleinen, harten Knoten gezogen. Mit den Fingern bekomme ich ihn nicht auf.','Zerschneiden will ich es nicht. Sie hat es so gebunden.'])); }
     await A.reach(function(){ A.set('boxOpen',true); A.sfx('paper'); });
     await A.m('Briefe von Brač. Jeden Freitag einer, drei Jahre lang. Ganz oben eine Postkarte, die nicht zu den anderen gebündelt ist.'); A.give('postcard'); return M.readPostcard(A); },
   take:'Den ganzen Karton? Nein. Er gehört hierher.',
   with:{ needle:async function(A){ if (A.S.knotOpen) return A.m('Der Knoten ist schon auf.'); await A.reach(); A.sfx('click'); A.set('knotOpen',true); A.take('needle'); await A.m('Mit der Spitze der Nadel lockere ich den Knoten, Schlinge für Schlinge. Das Band bleibt ganz.'); await A.m('Die Nadel lege ich zurück in den Korb.'); } }},
 {id:'calendar',name:'Kalender',look:'Ein Kalender der Apotheke, 2011. An jedem Tag ein kleiner Strich und eine Sieben. Bis zum zehnten November.',take:'Den nimmt am Freitag die Stadt mit. Oder niemand.'},
 {id:'icon',name:'Heiligenbild',look:'Der heilige Nikolaus mit einem Schiff in der Hand. Davor ein leeres Kerzenglas.'},
 {id:'basket',name:'Nähkorb',look:function(A){ return A.m(A.flag('split.intro.legacy')?'Stricknadeln, graue Wolle und ein halber Pullover in Männergröße. Die Wolle ist alt. Die Nadeln nicht.':'Stricknadeln, graue Wolle und ein halber Pullover in Männergröße. Darunter ein Schulheft, die Ecken weich vom Umblättern.'); },
   take:async function(A){ if (A.has('needle')||A.S.knotOpen){ if (!A.flag('split.intro.legacy')) return knitList(A); return A.m(A.has('needle')?'Eine reicht.':'Ich brauche nichts mehr daraus.'); } await A.reach(function(){ A.give('needle'); }); await A.m('Eine Stricknadel. Ich leihe sie mir. Nur kurz.'); },
   read:function(A){ return knitList(A); }, open:function(A){ return knitList(A); }},
 {id:'bed',name:'Bett',look:'Ordentlich gemacht, die Häkeldecke glattgestrichen. Als hätte sie gewusst, dass jemand kommt.'},
 {id:'coat',name:'Schwarzer Mantel',look:'Ein schwarzer Wollmantel am Haken. In den Taschen ein Taschentuch und ein Rosenkranz. Der Stoff ist an den Taschen dünn, von Händen, die sich wärmen wollten.',take:'Den lasse ich hängen.'},
 {id:'clock',name:'Wanduhr',look:'Eine Wanduhr. Sie geht noch. Jemand hat sie vor Kurzem aufgezogen. Zdenka, nehme ich an.'},
 {id:'stove',name:'Kochecke',look:async function(A){ await A.m('Eine kleine Kochstelle. Daneben ein Topf für Fritule, blank gescheuert.');
     if (!A.flag('split.intro.legacy') && A.first('frituleSmell')){ A.headache(3200); await A.wait(600); await A.anim('nausea'); await A.m('Für einen Moment riecht es nach Fritule. Nach heißem Öl und Zitronenschale. In einer Wohnung, in der seit einer Woche niemand gekocht hat.'); await A.m('Mir wird schlecht. Das ist der Lavendel. Oder der Geruch, den es nicht gibt.'); } },
   use:'Hier koche ich nichts.'}
];
M.room('ivka',{ name:'Ivkas Wohnung', scape:'ivka', music:'silence', noMala:true,
  hotspots:HS,
  enter:async function(A,from){ if (!A.first('ivkaIn')) return; A.headache(4200); A.ambient('whisper',-0.4,1.2); await A.wait(600);
    await A.m('…'); A.ambient('whisper',0.5,1); await A.m('Hier ist niemand. Natürlich ist hier niemand.'); await A.m('Es riecht nach Lavendel und nach einem Ofen, der lange nicht an war.'); },
  tick:function(A){ if (A.S.radioT && A.gt>A.S.radioT && !A.isBusy && !A.S.radioSelf){ A.S.radioSelf=1; A.S.radioT=0; A.busy(true); radioScene(A,true).then(function(){ A.busy(false); }); } }
});
M.defineScape('ivka',{beds:['rainIn','room'],step:'wood',ev:[['whisper',14,30,0.8,-0.8,0.8],['creak',20,40,0.5,-0.6,0.6],['tv',25,50,0.3,-1,-0.6]],fixed:[['tick',1,0.8,0.5]]});
// Ivkas Strickheft: wer ihr nahestand, steht nicht im Melderegister, sondern hier (nach dem Lesen kommt es zurück in den Korb)
async function knitList(A){ if (A.flag('split.intro.legacy')) return A.m('Stricknadeln, Wolle. Und ein Heft, das mich nichts angeht.');
  await A.reach(); A.sfx('paper');
  await A.doc({style:'letter',title:'Za Božić 2011.',w:232,lines:['Ante (kat ispod) – kapa, plava  ✓','Zdenkine unuke – čarape, 30 i 32  ✓','gđa Marija, pekara – šal','don Petar – čarape za siromašne, 10 pari (6 ✓)','Mrki – dekica za košaru, od ostataka  ✓','zbor sv. Nikole – 4 šala']});
  await A.m('„Für Weihnachten 2011.“ Ante, ein Stockwerk tiefer: eine blaue Mütze. Zdenkas Enkelinnen: Socken, Größe dreißig und zweiunddreißig.');
  await A.m('Frau Marija von der Bäckerei: ein Schal. Don Petar: zehn Paar Socken für die Armen, sechs sind fertig. Eine Decke für Mrki, aus Resten. Vier Schals für den Chor.');
  if (A.first('knitRead')){ await A.wait(500); await A.m('Sie hat für dieses Weihnachten gestrickt. Für eines, das sie nicht mehr erlebt.'); await A.m('Ich schreibe die Namen ab. Das Heft lege ich zurück unter die Wolle, wo sie es hingelegt hat.'); }
  A.note('pro_list'); }
// Die Postkarte (vorlesen)
M.readPostcard=async function(A){ await A.doc({style:'postcard',title:'Supetar, 18.12.1984',w:240,lines:['Draga mama,','dolazim 22. s brodom u sedam.','Dinko ide sa mnom.','Napravi fritule. Donosim ti nešto.','Tvoj Tonći']});
  await A.m('„Liebe Mama, ich komme am 22. mit dem Boot um sieben. Dinko kommt mit. Mach Fritule. Ich bringe dir etwas mit. Dein Tonći.“');
  A.note('c1_boat7'); A.note('c1_dinko',true); A.note('c1_gift',true); if (A.first('!pcRead')) await A.m('Abgestempelt am achtzehnten Dezember vierundachtzig. Vier Tage vor dem Boot um sieben.'); };
})(M);
