/* ===== portraits/luka.js — Luka Radić (Geist, 20), Gitarrist, August 1999 =====
   Strubbeliges Haar, offenes Flanellhemd über weißem T-Shirt, junges Gesicht, Vorfreude in den Augen.
   In natürlichen Farben gemalt; das Spiel setzt Geister selbst in ihre Geisterfarbe um (M.ghostLut). */
(function(M){
'use strict';
var P=M.P;
// Legende: ein Zeichen je Palettenfarbe ('.' = durchsichtig)
var C={'a':P.s2,'b':P.s3,'c':P.s4,'d':P.s5,'e':P.s6,'f':P.w2,'g':P.w3,'h':P.r0,'i':P.r1,'j':P.r2,'k':P.r3,'l':P.r4,'m':P.p2,'n':P.p3,'o':P.p4,'p':P.q0,'q':P.q1,'r':P.q2,'s':P.q3,'t':P.q4,'u':P.h0,'v':P.h1,'w':P.h2,'x':P.h3,'y':P.l1};
// Pixelkarte 56 × 64, ruhige Fassung
var MAP=[
"........................................................",
"........................................................",
"........................................................",
"........................................................",
"..................x........x............................",
"..................xxu.xx.fxu.....xwu....................",
"...................xxxxxxxxxvvvxwvu.....................",
".............ffffffxwwxxxxxxxxxwwuv.....................",
"............fxxxxxfuxxwxxxwwwwwwwwwvvv..................",
"...........xvuuuvvguxxwwwwwwvvwwwvvvvvv.................",
"..........x.vfxxgfwxuwwwvwwwwuvvvvvuuuu.................",
"............fxxgxwwxxuwwwuvvwwtuuuvu....................",
"............xxgxwxwxwwuuwttuvvttntuur...................",
"...........xwgxvxwvxwwusntooovvtttnuu...................",
"...........wxfwxwwwxwwunttoooovtttnsu...................",
"...........wxxuxfwwxvwunttoooottttnssr..................",
"...........vwxxwxwvwuwunttoootttttnssr..................",
"...........wwwwfwwxwuvunttwwwttottwwsr..................",
"...........wvuwxwvxuvvunwvvvvvwttvvvvws.................",
"...........wuwvwvuvu.vutttoootntnnnnssr.................",
"...........vuvxwvusnsrsttqvvvqstsqvvvr..................",
"...........vuvwvusnsrsstncdyucstocyucr..................",
"...........vuwwuunsrqsstnncgfnstosgfsr..................",
"............vvuuunsrqsssnntttnnttonnssr.................",
"............vuuuunsmrsssoooootttttonssr.................",
"............vuuuusnsmssstoootttntttootns................",
"...........vuuuuursnssssttttttnnsntttnsr................",
"...........uuuuuu.snssssttttttnsnsqrsmr.................",
"...........u..uuu..rsssstnnnttnnsrqrrr..................",
"...........u..uuu....srsnnnnttnnntntnr..................",
"...............uu....srsnnttnnqrmmmmrr..................",
"...............u.u...sqrsnnnnnsqppppqr..................",
".................u...sqrssttttssnonnsr..................",
".....................ssqrssnnnnssrrsr...................",
".....................ssqqrssnnttottnr...................",
".....................ssrqqrssntootnsr...................",
".....................ssrrqqqrsntttnsr...................",
".....................ssrrrqqqqrssssr....................",
".....................ssrrrrrqqqq........................",
".....................ssrrrrrrrqq........................",
".................jjjjssrrsrrrrrr.iiii...................",
".................kkkkssrrrsrrrrrkjjjji..................",
"..............jkklkkkrsrrrrsrrrrkkjjjji.................",
"............kjjkkilkkcrrrrrsrrrrqkkjjjikk...............",
".........kkkkjjkkkilkdcrrrrrsrqqbkkkjjikjjj.............",
".......kkkkkkjjkkkillkdccrrqqqbbcjjkjjijjjjjj...........",
"......ijhjjjjiijjjjilkkddcccbbccddikjjiiiiiiihh.........",
".....iijhjjjjiijjjjjilkkjdddccdddccikjiiiiiiihhh........",
"....kjjkikkkkjjkkkkkkilkjeeeeedddcccjiijjjjjjiihi.......",
"...kkjjkikkkkjjkkkkkkjilkjedcddddcccjhijjjjjjiihii......",
"..kkkjjkikkkkjjkkkkkkjjikjeddcdddcbcjaijjjjjjiihiii.....",
"..kkkjjikkkkkjjkkkkkkjjkijeddcdddcbcjaijjjjjjiijhiii....",
"..kkkjjikkkkkjjkkkkkkjjkkhbddccddcbccaijjjjjjiijhiiii...",
".kkkjjjikkkkkjjkkkkkkjjkkebddccddcbccaijjjjjjiijhiiii...",
".jiiiiihjjjjjihjjjjjjiijjebdddcccccbcahiiiihihhihhhhh...",
".iiiiiihjjjjjihjjjjjjiijjebdddcccccbcahiiiihihhihhhhhh..",
".jjjjjjikkkkkjjikkkkkjjkkebdddcccccbciajjjjhjiijhiiiih..",
".jjjjjjikkkkkjjikkkkkjjkjebdddcccccbciajjjjhjiijhiiiih..",
".jjjjjjikkkkkjjkikkkkjijjjdbdddccccbciajjjjhjiijhiiiih..",
".jjjjjhkkkkkkjjkikkkkiijjjdbdddcccccciajjjhjjiijihiiih..",
".jjjjjhkkkkkkjjkkikkjiijjjdbdddccccccbaijjhjjiijihiiih..",
".jjjjjhkkkkkkjjkkikjjiijjjdbdddccccccbaijjhjjiijihiiihh.",
".iiiiihjjjjjjiijjihiihhiiidbdddccccccbahiihiihhihhhhhhh.",
".iiiiihjjjjjjiijiihiihhiiidbdddccccccbahiihiihhhhhhhhhh."];
// Flicken [x, y, Zeilen] für „spricht“ (Mund offen) und „blinzelt“ (Augen zu); '.' = bleibt
var MUND=[31,31,[
  "..bb.",
  ".qppq",
  ".nonn",
  "srrrs"]];
var LID=[25,20,[
  "ntttn...nnns",
  "qtttq...qssq",
  ".vvv.....vv."]];
function put(b,rows,x0,y0){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var c=C[r.charAt(x)]; if (c!==undefined) b.px(x0+x,y0+y,c); } } }
M.definePortrait('luka',{ paint:function(b,v){
  put(b,MAP,0,0);
  if (v.mouth && MUND) put(b,MUND[2],MUND[0],MUND[1]);
  if (v.eyes && LID) put(b,LID[2],LID[0],LID[1]);
  M.outline(b,P.k1);
} });
})(M);
