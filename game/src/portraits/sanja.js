/* ===== portraits/sanja.js — Sanja Lozić (32), Wirtin der Bar „Bura“ =====
   Kurzes schwarzes Haar mit seitlichem Pony, schwarzes Shirt, dunkelrote Schürze mit Trägern; wach, beschützend. */
(function(M){
'use strict';
var P=M.P;
// Legende: ein Zeichen je Palettenfarbe ('.' = durchsichtig)
var C={'a':P.k1,'b':P.k2,'c':P.n0,'d':P.s3,'e':P.s4,'f':P.s5,'g':P.w1,'h':P.w2,'i':P.d4,'j':P.r0,'k':P.r1,'l':P.r2,'m':P.r3,'n':P.r4,'o':P.m0,'p':P.m1,'q':P.m2,'r':P.m3,'s':P.m4,'t':P.p1,'u':P.p2,'v':P.p3,'w':P.p4,'x':P.p5,'y':P.q4,'z':P.c1,'A':P.h0,'B':P.h1,'C':P.l1};
// Pixelkarte 56 × 64, ruhige Fassung
var MAP=[
"........................................................",
"........................................................",
"........................................................",
"........................................................",
"....................pooppppooo..........................",
".................pppppoooooooobb........................",
"...............ppppppooooboooobbbba.....................",
".............pppppoAAbooooobbbbbaaaA....................",
"............opoopooAAoooobbbbbbbbaaa....................",
"............ooopooboAAbbbbbbbbbaaaaaA...................",
"............ooooobbobAaabbbbbbbbaaaAAA..................",
"............oooobbaobaAAAaaabbaaaaaAbb..................",
"...........oooobbaoobAAvywwAAaaaAaAAAb..................",
"...........oooobaoboabAvywxxxxAabAAAAb..................",
"...........bbobaAbbbabAywwxxxxxwAwAAAb..................",
"...........bbbbabbabAbAywwxxxxwwwwyAbb..................",
"...........bbbbabbbaAbAywwbbxwwwwwybvu..................",
"............bbaAbabAAbAybBBBBBwxwBBBbu..................",
"............bbaAbAaAAaAywwwwwwbwwwwwvvu.................",
"............bbaAaA....vwBwxxxwywyyyyvBu.................",
".............aAAaAvyvuvwtAAAAtvwvtAAAt..................",
".............aAAavyvuvvwyefCAevwxeCAeu..................",
".............AAAayvutvvwyvehgevwxehgvu..................",
".............AAAAyvutvvvyyvvvyywwxvvvvu.................",
"..............AAAyvuuvvvxxxxxwwwwywxxy..................",
"..............AAAvyvuvvvxwxwwwwvwyuvyu..................",
"................Auvyvvvvwwwwwwyyvuuvvu..................",
"..................vyvvvvwyywwwyyywywyu..................",
"...................svvuvyyyywyyyywywyu..................",
".....................vtuvywwwyyvumuuvu..................",
".....................vtuvyyyyyvulllluu..................",
".....................vvtuvyyyyvviwiivu..................",
".....................vvttuvyyyyvvuuvu...................",
".....................vvuttuvywwwxwyvu...................",
".....................vvuuttuvywxwwyvu...................",
".....................vvuuutttuvywyvu....................",
".....................vvuuuuttttuvvu.....................",
".....................vvuuuuuutt.........................",
".....................vvvuuuuuuu.........................",
".....................vvuvuuuuuu.........................",
".....................vvuvuuuuuu.........................",
"..................pppvvuuvuuuuuoooo.....................",
"...............ppppppvvuuvuuuuuooolooo..................",
".............pppppppvvvuuuvuuuuoollljooo................",
"...........ppppppqqppmmmuuvuuuuuuolljooooo..............",
".........ppppppqqpppmmmvkuuuuuuoobllljooooo.............",
"........ppbqqqqpppppmmmpkvuuuoobbollljoooobbz...........",
".......ppqqppppppppnmmmkbppoobboooollkjoobbbbz..........",
"......pqqpbppppppoommmokobbbboooooollkjobbbbbazz........",
".....oqpppbpppppoonmmmkooooooooooooolkjbbbbbbabbz.......",
"....ooppppbppppooonmmmkooooooooooooolkkjbbbbbabbbz......",
"....oopppbppppoooommmokooooooooooooolkkjbbbbbbabbbz.....",
"....oopppbpppoooonmmmkooooooooooooobbkkkjbbbbbabbbz.....",
"...ooopppbppooooonmmmkoooooooooooobnnnrqjnbbbbabbbbz....",
"...ooopppbpooooonmmmkmmnnnnnnnnnnnnlllllllbbbbabbbb.c...",
"...ooopppboobooonnsrknnlllllllllllllkkkkkbbbbbabbbbbc...",
"...oobpppboobooolllllllmllllllllllllkkkkkbbbababbbbbc...",
"...ooobooboooboommmmmmmmllllllklllllkkkkkbbbababbbbbc...",
"...ooobooboooboommmmmmmmllllllklllllkkkkkkbbbaabbbbac...",
"...oooobbooooobmmmmmmmmmllllllklllllkkkkkkbbbababbaac...",
"...oooobbooooobmmmmmmmmmllllllklllllkkkkkkbbbababaaac...",
"...ooooobooooobmmmmmmmmmllllllklllllkkkkkkbbbabaaaaac...",
"...oooooboooooommmmmmmmmllllllklllllkkkkkkbbbbaaaaaac...",
"...ooooobbooooommmmmmmmmllllllklllllkkkkkkbbbaaaaaaac..."];
// Flicken [x, y, Zeilen] für „spricht“ (Mund offen) und „blinzelt“ (Augen zu); '.' = bleibt
var MUND=[32,30,[
  ".dd.",
  "llll",
  "iwii",
  "vuu."]];
var LID=[24,19,[
  "w............v",
  "vywwwy...yyyvu",
  "ttwwwt...tvvt.",
  ".yAAAy...vAA..",
  "..www.....yy.."]];
function put(b,rows,x0,y0){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var c=C[r.charAt(x)]; if (c!==undefined) b.px(x0+x,y0+y,c); } } }
M.definePortrait('sanja',{ paint:function(b,v){
  put(b,MAP,0,0);
  if (v.mouth && MUND) put(b,MUND[2],MUND[0],MUND[1]);
  if (v.eyes && LID) put(b,LID[2],LID[0],LID[1]);
  M.outline(b,P.k1);
} });
})(M);
