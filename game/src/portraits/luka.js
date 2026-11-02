/* ===== portraits/luka.js — Luka Radić (Geist, 20), Gitarrist, August 1999 =====
   Strubbeliges Haar, offenes Flanellhemd über weißem T-Shirt, junges Gesicht, Vorfreude in den Augen.
   In natürlichen Farben gemalt; das Spiel färbt Geister selbst ein (M.TINT.spiritP). */
(function(M){
'use strict';
var P=M.P;
// Legende: ein Zeichen je Palettenfarbe ('.' = durchsichtig)
var C={'a':P.s2,'b':P.s3,'c':P.s4,'d':P.s5,'e':P.s6,'f':P.w2,'g':P.w3,'h':P.r0,'i':P.r1,'j':P.r2,'k':P.r3,'l':P.r4,'m':P.p2,'n':P.p3,'o':P.p4,'p':P.q0,'q':P.q1,'r':P.q2,'s':P.q3,'t':P.q4,'u':P.h0,'v':P.h1,'w':P.h2,'x':P.h3,'y':P.l1};
// Pixelkarte 56 × 64, ruhige Fassung
var MAP=[
"........................................................",
"........................................................",
".....................w......w...........................",
"...................wxxw....wxw...w......................",
"................wwxgfxwwwxxwwwxwwwww....................",
"..............wwxffwwvwxgfxwwwxxwwwwww..................",
".............wwxxwwwwxwwwvwxgfxwwwxwwww.................",
"............wwxwwwwxxwwwwwwwwvwxffwwxwww................",
"............wwwwwxwwwvwwxxwwwwwvwwxxwwww................",
"...........wwxwwwvwwwwwwvwwxxxwwwwwwwxxww...............",
"...........wwwwvwwwwwwwwwwwwwvvwxxwwvwwww...............",
"...........wwwwwwwwwwwwwsssssswwwvwwwwww................",
"...........wwwvwwwwwwwwsswwwtwwww.wwwww.................",
"...........wwwwwwwwwwwwsttwtoowwts.www..................",
"...........wwwwwvwwwwwstttooottwtttsww..................",
"...........wwwwwwwwwwwrtttooootttttsrw..................",
"...........vvvwwwwvwwwstttooootttttssr..................",
"...........vvvwwwwwwwwstttwwwtttttwwsr..................",
"...........vvvvwwwwwwwstwvvvvvwttvvvvwr.................",
"...........vvvvwuuwwwwwtttttttstssssssr.................",
"...........vvvvvuu.ss.vssrvvvqrtsqvvvr..................",
"...........vvvvvwustsrvttcdyucstocyucr..................",
"...........vvvvvwwtrqssttscffcstorffrr..................",
"...........vvvvvwwtrqssttttttttttossssr.................",
"...........vvvvvwwtsqrstoooootttttosssr.................",
"............vvvvwwssrrsttttttttstttootsr................",
"............vvvvvustrsstttttttsssttttsrr................",
"............vvvvvuusssstttttttsrsrqrsrq.................",
".............vvvvvuur.ssttttttsssrqqrr..................",
".............vvvvvuussrstttttttsststsr..................",
"..............vvvvvwwsrsssssssqrmmmmrr..................",
"...............vvvvvwsqrsssssssqppppqr..................",
"................vvvvwsqrssssssssnonnrr..................",
".................vvwsssqrsssssssrrrsr...................",
"....................ssssqrrssstttttsr...................",
"....................sssssqrrssttottsr...................",
"....................sssssqqqrrsttttsr...................",
"....................sssrssqqqqrrsssr....................",
"....................sssrrssrqqqq........................",
"....................sssrrrsrrrqq........................",
".................jj.sssrrrssrrrr.jjj....................",
".................jjjsssrrrrssrrrjjjjj...................",
"..............klkjjjsrsrrrrrsrrrdqjjjjk.................",
"............kkklkkjjscrrrrrrssrrqbjjjjkjj...............",
".........ijjjjjjjillldcrrrrrrsqqbccjjjiiiii.............",
".......jiijjjjjjjilllldccrrqqqbbcccjjjiiiiiih...........",
"......kkhjkkkklkkjjlllkddcccbbccccccjjiijkjjiij.........",
".....lkkhjkkkklkkjjklllkedddccddcccccjiijkjjiijh........",
"....lkkjhkkkklkkjjkkkllkeeddddddcccccjiikjjiijjhi.......",
"...klkkhjkkkklkkjjkkklilkeddddddccccchijkjjiijjhii......",
"..kklkkhjkkkklkkjjkkkklikdddddddccccajhjkjjiijjihii.....",
"..kklkkhjkkkklkkjjkkkklilddddddcccccajjhkjjiijjihiii....",
"..klkkjhkkkklkkjjkkkklkkikdddddcccccajjkjjiijjjihiihh...",
".jjjjjihjjjjjhjiijjjjjjjilbddddcccccaiiiiihhhiihhhhhh...",
".jjiijihjjjjjhjiijjjjjjjeiiddddcccccaiiiiihhhiihhhhhh...",
".kjkjkhjkkkklkijjkkkklkkjdbddddcccccajjkjjiihjjiihihhi..",
".jkjjjhkkkklkkhjkkkklkkjidbddddcccccabkjjiijhjjiihhhii..",
".jkjjjhkkkklkkjhkkkklkkiidbdddcccccccakjjiijhjjiihhhii..",
".jkjjjhkkkklkkjhkkkklkjiiddbddccccccbakjjiihjjjiihhhii..",
".jkjjjhkkkklkkjhkkkkljjiiddbddccccccbakjjiihjjjiihhhii..",
".kjjijikkklkkjjkikkljjiijddbddccccccbajjiijhjjkiihhiii..",
".kjjihkkkklkkjjkikjkjjiijjdbddccccccbajjiijhjjkiihhiiii.",
".iiihhjjjjjjjiijjhiiiihhiidbdcccccccbaiihhihiiihhhhhhhh.",
".iiihhjjjjjjjiijihiiiihhiidbdccccccbbaiihhihiiihhhhhhhh."];
// Flicken [x, y, Zeilen] für „spricht“ (Mund offen) und „blinzelt“ (Augen zu); '.' = bleibt
var MUND=[32,32,[
  "peppq",
  "nonn."]];
var LID=[25,20,[
  "sssss...ssss",
  "stttt...ssss",
  "rvvvq...qvv."]];
function put(b,rows,x0,y0){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var c=C[r.charAt(x)]; if (c!==undefined) b.px(x0+x,y0+y,c); } } }
M.definePortrait('luka',{ paint:function(b,v){
  put(b,MAP,0,0);
  if (v.mouth && MUND) put(b,MUND[2],MUND[0],MUND[1]);
  if (v.eyes && LID) put(b,LID[2],LID[0],LID[1]);
  M.outline(b,P.k1);
} });
})(M);
