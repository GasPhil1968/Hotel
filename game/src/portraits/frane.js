/* ===== portraits/frane.js — Frane (70+), Kartenspieler in der Bar „Bura“ =====
   Glatze (Hautfarbe mit Glanzlicht) und weißer Haarkranz, buschige weiße Brauen, kurzer weißer Bart wie bei der Spielfigur,
   graue Strickjacke über hellem Hemd. */
(function(M){
'use strict';
var P=M.P;
// Legende: ein Zeichen je Palettenfarbe ('.' = durchsichtig)
var C={'a':P.n0,'b':P.s2,'c':P.s3,'d':P.s4,'e':P.s5,'f':P.s6,'g':P.b1,'h':P.b2,'i':P.d4,'j':P.m0,'k':P.m1,'l':P.m2,'m':P.m3,'n':P.p0,'o':P.p1,'p':P.p2,'q':P.p3,'r':P.p4,'s':P.p5,'t':P.q4,'u':P.l0,'v':P.l1};
// Pixelkarte 56 × 64, ruhige Fassung
var MAP=[
"........................................................",
"........................................................",
"........................................................",
"........................................................",
"........................................................",
".....................rrrrttt............................",
"..................rsrrrrttttqqq.........................",
"................srsrrrrtrttttqqqp.......................",
"...............srsrrssrrttttqqqqpp......................",
"..............srsrrsuusttttqqqqpppp.....................",
"..............rrrrrrssttttttqqqqpppp....................",
".............rrrqrrrrttttttqqqqppppp....................",
".............rrrrrtrtttttrrqqqppppppp...................",
".............trtrtrttttttqqqqtppppppp...................",
"............ebtfbtffttttqrrqpppppppppp..................",
"...........eeddedeedbttqqqtqqqqtpppppp..................",
"...........eedeedfectrrqqcdeeddpppdepp..................",
"...........eddeecedbqtrqcdeffeedcdeedc..................",
"...........dcdedbeccqqttbcddcbrrtbccrqp.................",
"...........ddcedbcqrqqpqptttttqrqtttqqp.................",
"...........ddcdccqrtpqpqqponnoqrqonnop..................",
"............dcdccrtpoqppqdevadqrtdvapp..................",
"............dcdb.rqpotqqpqdhgqqrsqhgqp..................",
"............cccb.rqpotqtqpppqqtrrsppqqp.................",
".............cbc.tqqpqqrtrssrtrrrrstqqp.................",
".............cbc.trppqqrrssrrrttrrsstqpp................",
"..............cc.qtqqqqrrrrrrrtqtrrtsttq................",
"..............cc..qttqqrrrrrrrqptqpqtiqp................",
"..................qtq.qrrqrrrrpqqpooppp.................",
"...................qpffrrqrrspcdeeedcp..................",
"....................qfeedqrrpbcdeeeedc..................",
"....................qdeedeeqpqbonnnnob..................",
"....................qqqdeedddqopqiqppp..................",
"....................qqqeeeddcddddddddc..................",
"....................qqqpdddeddddddbcbc..................",
"....................qqqppddccddddccbb...................",
"....................qqqppppddcccccccc...................",
"....................qqqppppppccccccc....................",
"....................qqqppppppdccccc.....................",
"....................qqqqpppppppbc.......................",
"....................qqqqppoppopp........................",
".................mlmbbqpqpoppobbc.......................",
"..............mlmmlmcbbpqppopbbcccll....................",
"............lmmlmmlmeccbqppobbcccclkjll.................",
"..........mmlmmlmmlmmeccbppbbccccclkjllll...............",
".........lmmlmmlmmlkmmeeccpccccdcclkjllllll.............",
".......mmlmmlmmlmmlmkmleececccddclkjlllllllll...........",
"......lmjlmmlmmlmmlmklmleeeccdddclkjlllllllllll.........",
".....mlmjlmmlmmlmmlmmkmleeeeddddclkjlllllllllllj........",
"....mmlmjlmmlmmlmmlmmkmmleeeddddclkjllllllllllljk.......",
"...lmmlmjlmmlmmlmmlmmlkmleeeddddckjlllllllllllljkk......",
"..mlmmljmlmmlmmlmmlmmlkmmleeddddckjlllllllllllljkkk.....",
"..mlmmljmlmmlmmlmmlmmlmkmdbeddddckjllllllllllllkjkkk....",
"..mlmmljmlmmlmmlmmlmmlmmkmleddddlkjllllllllllllkjkkkk...",
".mmlmmljmlmmlmmlmmlmmlmlkmleddddlkjllllllllllllkjkkkk...",
".mmlmmljmlmmlmmlmmlmmllllkmlddddkjlllllllllllllkjkkkj...",
".mmllmljmlmmlmmlmmlmmllllkmdbdddkjllllllllllllkkjkkjjj..",
".mmllmljmlmmlmmlmmlmmlllllkmldddkjllllllllllllkkjkjjjj..",
".mlllmljmlmmlmmlmmlmllllllkmlddlkjlllllllllllkkkjkjjjj..",
".llllmjmmlmmlmmlmmlllllllllkmldkjlllllllllllkkkkjjjjjj..",
".llllmjmmlmmlmmlmmlllllllllkmdbkjllllllllllkkkkkjjjjjj..",
".llllmjmmlmmlmmlmlllllllllllkmlkjlllllllllkkkkkjjjjjjjj.",
".llllmjmmlmmlmmllllllllllllllllllllllllllkkkkkkjjjjjjjj.",
".llllmjmmlmmlmmllllllllllllllkkkllllllllkkkkkkkjjjjjjjj."];
// Flicken [x, y, Zeilen] für „spricht“ (Mund offen) und „blinzelt“ (Augen zu); '.' = bleibt
var MUND=[31,31,[
  "..dd..",
  "onnnno",
  "pqiqp."]];
var LID=[25,20,[
  "qtttq...qttq",
  "ponno...pnno",
  ".ppp.....pp."]];
function put(b,rows,x0,y0){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var c=C[r.charAt(x)]; if (c!==undefined) b.px(x0+x,y0+y,c); } } }
M.definePortrait('frane',{ paint:function(b,v){
  put(b,MAP,0,0);
  if (v.mouth && MUND) put(b,MUND[2],MUND[0],MUND[1]);
  if (v.eyes && LID) put(b,LID[2],LID[0],LID[1]);
  M.outline(b,P.k1);
} });
})(M);
