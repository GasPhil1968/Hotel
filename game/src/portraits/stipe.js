/* ===== portraits/stipe.js — Stipe (70+), Kartenspieler in der Bar „Bura“ =====
   Schiebermütze (Khaki-Tweed), wettergegerbtes, faltiges Gesicht mit grauen Stoppeln, alte Jacke in Khaki/Grau über hellem Hemd. */
(function(M){
'use strict';
var P=M.P;
// Legende: ein Zeichen je Palettenfarbe ('.' = durchsichtig)
var C={'a':P.s0,'b':P.s1,'c':P.s2,'d':P.s3,'e':P.s4,'f':P.s5,'g':P.w1,'h':P.w2,'i':P.p2,'j':P.p3,'k':P.p4,'l':P.q0,'m':P.q1,'n':P.q2,'o':P.q3,'p':P.q4,'q':P.e0,'r':P.e1,'s':P.e2,'t':P.e3,'u':P.e4,'v':P.h0};
// Pixelkarte 56 × 64, ruhige Fassung
var MAP=[
"........................................................",
"........................................................",
"........................................................",
"........................................................",
"..................ttuuuuuttts...........................",
"...............sttuuuuttttsrsssrr.......................",
"..............sttttttttsrsssrsrsrrrr....................",
".............rstttttttsrstssssstsrrrrq..................",
".............rsrttttstsssssssssssrrrrrq.................",
".............rsrstttstssssstsssssrrrrrqq................",
".............rrssssssssssssrsrssrrrrrrqq................",
".............rrstssssssssssrrrrqqqqqqqqqq...............",
".............rrrrrrrrrrrrtttttuuuuuuttttss..............",
".............qqqqqqqqqqqqsssssssssssssssrr..............",
".............qqqqqqqqqqqqnnnnqqqqqqqqqqqq...............",
".............eedbededbcnoooooooooooonm..................",
"............bedcfececdcojjjjjjjjjjoonn..................",
"............eecbedaeadbocddeddcojcdddc..................",
"............ddcaecbcbdbooccdcoojoocconn.................",
"............bdcbdaopodaonjjjjjopojjjoon.................",
"............bdcbcopjnonoonmllmopomllmn..................",
".............dbbbpjnmonnoeffveopjehvnn..................",
".............cbb.ponmjoononnnoopkonnon..................",
".............cbb.ponmjojonnnoojppknnoon.................",
".............cbb.joonoopjpkkpjppppkjoon.................",
"..............bb.jpnnooppkkpppjjppkkjonn................",
"..............bbbojoooopppppppjojppjkjjo................",
"..............bbb.ojjooppppppponjonojjon................",
"..................ojo.oppoppppnoonmmnnn.................",
"...................onooppoppknjonnnnnn..................",
"....................ooopooppnjcnniiinn..................",
"....................ooooonpononmllllmn..................",
"....................oomncncocomojkjjnn..................",
"....................oomnoonooononnnoon..................",
"....................oocmbocncpdpdpdjcn..................",
"....................ooommnonoppkppjon...................",
"....................oocnmmmncodpdjcob...................",
"....................ooonnmmmmnooooon....................",
"....................oooonnnmmmmm........................",
"....................oooonnmnnmmm........................",
"....................oooonnmnnmnn........................",
".................dddccononmnnmccd.......................",
"..............dddddddccnonnmnccdddbbb...................",
"............dddddddceddconnmccddddbbbac.................",
"..........dddddddddcceddcnnccddddbbbbaacc...............",
".........dddddddcdddcceeddnddddedbbbaaaaccc.............",
".......dddddddddddadccceedfddddedbbbaaaaccccc...........",
"......ddbdddddddddcadccceffddededbbbaaacccccccb.........",
".....dddbcdddddddccadcccbffffededbbabacccccccbba........",
"....cdddbdddddddccccadcccbfffedebbbabaccccccbbbab.......",
"...cccddbdbbdddccccccacccbfffecebbbabcccccbbbbbaba......",
"..cccddbddddbbddcccccadcccbffedebbabbccccccccbbaaaa.....",
"..cccddbdcdddcbbccccccacccbffedebbabcccccaaaabbaaaaa....",
"..cccddbddddcccccccccccaccbffedebbacccaaabbbbbbaaaaaa...",
".ccccddbcddcccccccccccccaccbfedebabccccbbbbbbbbaaaaaa...",
".ccccddbddccccbcccccccccaccbfecbbaccccbbbbbaabbaaaaaa...",
".ccccddbdccccccbcccccccccaccbedbbacccbbbbbbabbbaaaaaaa..",
".ccccddbcccccccbccccccccccacbedbaccccbbbbbbabbbaaaaaaa..",
".ccccddbccccccccbcccccccccaccbdbaccbbbbbbbbabbbaaaaaaa..",
".ccccdbcccccccccbccccccccccacbccccbbbbabbbabbbbaaaaaaa..",
".cccccbccccccccccbccccccccccccaccbbbbbbbbbabbbbaaaaaaa..",
".cccccbccccccccccbcccccccbccccghbbbbbabbbbabbbbaaaaaaaa.",
".cccccbccbccccccccbcccccccccccbbbbbbbbbbbbabbbbaaaaaaaa.",
".cccccbcccccccccccbcccccccccccbbbbbbbbbbbbabbbbaaaaaaaa."];
// Flicken [x, y, Zeilen] für „spricht“ (Mund offen) und „blinzelt“ (Augen zu); '.' = bleibt
var MUND=[32,32,[
  "leelm",
  "jkjjn"]];
var LID=[25,20,[
  "ojjjo...ojjo",
  "nmllm...nllm"]];
function put(b,rows,x0,y0){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var c=C[r.charAt(x)]; if (c!==undefined) b.px(x0+x,y0+y,c); } } }
M.definePortrait('stipe',{ paint:function(b,v){
  put(b,MAP,0,0);
  if (v.mouth && MUND) put(b,MUND[2],MUND[0],MUND[1]);
  if (v.eyes && LID) put(b,LID[2],LID[0],LID[1]);
  M.outline(b,P.k1);
} });
})(M);
