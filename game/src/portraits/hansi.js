/* ===== portraits/hansi.js — Johann „Hansi“ Kirchmaier (Geist, † 1998, wirkt 63), Fahrkartenverkäufer am alten Busabfahrtsplatz (Kapitel 4, München)
   Rundes, gemütliches Gesicht mit vollen Wangen und weichem Doppelkinn, glatt rasiert; schütteres graues Haar, quer über den Scheitel
   gekämmt (die Kopfhaut scheint durch), ein grauer Haarkranz über den Ohren; dunkle Hornbrille; ein gelber Bleistift steckt hinter dem Ohr.
   Grauer Arbeitskittel mit Revers über weißem Hemd und schmaler dunkler Krawatte, Stifte in der Brusttasche. Gemütlich, stur.
   In natürlichen Farben gemalt; das Spiel färbt Geister ein (M.ghostLut mit M.GHOST_OVR.hansi aus 14_k4_cast_b.js: das Grau des Kittels
   bleibt, die Hornbrille w → e bleibt dunkel, das Hemd s5/s6 hell). Augen, Brauen und Brille trennen sich über die Helligkeit.
   Gesicht nach der Grundform von portraits/mladen.js (Halbglatze, Haarkranz, Brille), ohne Schnurrbart; Haar, Bleistift und Kittel in Code.
   Legende HEAD: Ziffern Haut (1 p0 … 6 p5, 7 l0) · a b c d Haar und Brauen (m1 m2 m3 m4) · G H Hornbrille (w1 w2) · N L Glanz (l1) ·
   x Augenweiß · i Iris · o Pupille. Varianten: MOUTH und EYES als Flicken. */
(function(M){
'use strict';
var P=M.P;
var HEAD=[
//          1111111111222222222233333333334444444444555555
//01234567890123456789012345678901234567890123456789012345
 "........................................................", // 0
 "........................................................", // 1
 "........................................................", // 2
 "........................................................", // 3
 "........................................................", // 4
 "........................655555..........................", // 5
 ".....................666655555554.......................", // 6
 "....................66666555555544......................", // 7
 "...................6667765555554443.....................", // 8
 "..................666677655555544433....................", // 9
 ".................66666665555555444333...................", // 10
 "................6666655555555544433333..................", // 11
 "................d6d6555555666555555444..................", // 12
 "...............d6d555555556644444445544.................", // 13
 "...............dddc5d554556666665555544.................", // 14
 "...............dddcdc5545554444444555444................", // 15
 "..............cddcddbcd55666665555554444b...............", // 16
 "..............cddcdcbcc55555544445555444cb..............", // 17
 "..............cdccdcccc4baaabb5545baab44ca..............", // 18
 "..............cccccccbc4a4444444544444a44b..............", // 19
 "..............cccbccbbc44dHHHHHG4GHHHHG44...............", // 20
 "..............ccc466HHH4HN43334GGGN334G44...............", // 21
 "..............cbc4535bc4GH21112G4G2112G44...............", // 22
 "..............bbc4525bb54HxLox4G5GxLo3G44...............", // 23
 "..............abc4535ab55H4ii44G5G4ii4G44...............", // 24
 "..............aab4544ab554HHHHH454HHHG444...............", // 25
 "..............aaab554aa665544455563445544...............", // 26
 "..............aaab454a5566555555556344544...............", // 27
 "..............aaaab54a5555555555456663444...............", // 28
 "...............aaab44a4555555555423443443...............", // 29
 "...............aaaabaa445555564555555443................", // 30
 "................aaaaaa445555634455554443................", // 31
 ".................aaaaa344555534333333443................", // 32
 "....................3aa44555434222222343................", // 33
 "....................33445555443455654443................", // 34
 "....................3334455544443334443.................", // 35
 "....................3334345554555665443.................", // 36
 "....................3333434455555655443.................", // 37
 ".....................33343334455555443..................", // 38
 ".....................3333433333444433...................", // 39
 ".....................3333333333333333...................", // 40
 "......................333444443333222...................", // 41
 "......................333444443333222...................", // 42
 "......................3334444443333222..................", // 43
 "......................3334444443333222..................", // 44
 "......................3334444443333222..................", // 45
 "......................3334444443333222..................", // 46
];
var LEG={ '1':P.p0, '2':P.p1, '3':P.p2, '4':P.p3, '5':P.p4, '6':P.p5, '7':P.l0, a:P.m1, b:P.m2, c:P.m3, d:P.m4, G:P.w1, H:P.w2, N:P.l1, x:P.s4, i:P.c1, o:P.k0, L:P.l1 };
function stamp(b,rows,leg){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch==='.'||ch===' ') continue; var c=leg[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x,y,c); } } }
function putList(b,list){ for (var i=0;i<list.length;i++) b.px(list[i][0],list[i][1],LEG[list[i][2]]); }
// schütteres Haar quer über den Scheitel: dünne graue Strähnen vom tiefen Seitenscheitel zur fernen Seite, dazwischen Kopfhaut
function combOver(b){ var SK=[P.p2,P.p3,P.p4,P.p5,P.l0];
  [[[16,15],[24,9],[33,7]],[[17,16],[25,10],[35,9]],[[17,14],[23,8],[30,6]],[[18,17],[27,12],[37,12]],[[19,16],[27,11],[36,10]]].forEach(function(s,k){
    for (var i=0;i<s.length-1;i++) b.line(s[i][0],s[i][1],s[i+1][0],s[i+1][1],function(x,y){ var o=b.get(x,y); return SK.indexOf(o)>=0?((k&1)?P.m4:P.m3):o; }); });
  b.px(25,9,P.s4); b.px(29,7,P.s4); }
// Bleistift hinter dem Ohr: hinten das Ende über dem Haar, vorn die angespitzte Spitze an der Schläfe; die Ohrkante liegt darüber
function pencil(b){ b.line(12,14,19,17,P.y3); b.line(12,15,19,18,P.y2); b.px(11,14,P.m4); b.px(11,15,P.d4); b.px(20,18,P.w5); b.px(20,17,P.w4); b.px(21,18,P.k2);
  b.px(14,14,P.y4); b.px(16,15,P.y4); b.px(13,15,P.k2); b.px(18,17,P.k2); }
// grauer Arbeitskittel mit Revers, weißes Hemd und schmale Krawatte, Stifte in der Brusttasche; runde, etwas hängende Schultern
function coat(b){
  b.poly([[0,64],[0,57],[2,52],[6.5,48.4],[13,46],[20,44.8],[38,44.8],[45,46],[50,48.6],[53.6,52.6],[55.5,58],[55.5,64]],P.m2);
  b.poly([[0,59],[0,57],[2,52],[6.5,48.4],[12,46.4],[9,49],[4.6,53],[2,59]],P.m3);
  b.poly([[46,47.6],[50,48.6],[53.6,52.6],[55.5,58],[55.5,64],[48,64]],P.m1);
  b.line(2,59,3,63,P.m1); b.line(51,53,52,63,P.m0); b.line(11,51,10,63,P.m1);
  // Hemd und Krawatte
  b.poly([[23,44.6],[28,45.4],[33,45.4],[38,44.8],[35,52],[31,59],[27,52]],P.s5); b.poly([[31.5,46],[38,44.8],[35,52],[31.5,57]],P.s4);
  b.poly([[29.6,45.8],[32.4,45.8],[32,48],[30,48]],P.n1); b.poly([[30,48],[32,48],[33,55],[31,58],[29.4,55]],function(x,y){ return x<31?P.n2:P.n1; });
  b.poly([[22,43.6],[26,44.6],[30.6,48],[28,50.4],[24.5,47.6],[21.4,45.6]],P.s6); b.line(23,46,28,50,P.s4);
  b.poly([[38.6,43.8],[39.6,46],[35.2,49.6],[33.2,48]],P.s5); b.line(38,46,35,49,P.s3);
  // Revers
  b.poly([[12,48],[19,45],[24,45.2],[28.6,52.4],[31,59],[31,64],[26,64],[22,56],[16.5,50.5]],P.m3);
  b.line(19,46,24,46,P.m4); b.line(24,47,28,53,P.m4); b.line(28,54,30,59,P.m4); b.line(16,51,22,56,P.m1);
  b.poly([[37.6,45.6],[42.6,46],[45.6,49],[41.6,55],[35.6,61],[32.6,63],[32.6,58.6],[35.6,52]],P.m1);
  b.line(39,47,36,52,P.m2); b.line(45,49,41,55,P.m0);
  // Brusttasche mit zwei Stiften (rot, blau)
  b.line(8,56,15,56,P.m1); b.line(8,57,15,57,P.m3); b.vl(10,52,55,P.r3); b.px(10,51,P.r4); b.vl(12,53,55,P.n2); b.px(12,52,P.n3);
}
var MOUTH_O=[[31,33,'1'],[32,33,'1'],[33,33,'x'],[34,33,'x'],[35,33,'1'],[36,33,'2'],[31,34,'2'],[32,34,'1'],[33,34,'1'],[34,34,'1'],[35,34,'2'],[32,35,'4'],[33,35,'5'],[34,35,'5']];
var EYES_B=[[26,22,'4'],[27,22,'4'],[28,22,'4'],[29,22,'4'],[30,22,'4'],[26,23,'2'],[27,23,'2'],[28,23,'2'],[29,23,'2'],[30,23,'2'],[27,24,'4'],[28,24,'4'],
  [34,22,'4'],[35,22,'4'],[36,22,'4'],[37,22,'4'],[34,23,'2'],[35,23,'2'],[36,23,'2'],[37,23,'2'],[35,24,'4'],[36,24,'4']];
function paint(b,v){
  coat(b);
  stamp(b,HEAD,LEG); combOver(b); pencil(b);
  if (v.mouth) putList(b,MOUTH_O);
  if (v.eyes) putList(b,EYES_B);
  M.outline(b,P.k1);
}
M.definePortrait('hansi',{ paint:paint });
// im Spiel ein Geist: Porträt in seiner Geisterfarbe (M.ghostLut)
if (M.PORTRAIT_GHOSTS) M.PORTRAIT_GHOSTS.hansi=true;
})(M);
