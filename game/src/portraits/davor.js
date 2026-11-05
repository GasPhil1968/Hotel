/* ===== portraits/davor.js — Davor Zelenika (52), Mates Sohn, lebt seit Jahrzehnten in München (Kapitel 3, Mostar)
   Müdes, etwas volles Gesicht; kurzes graues Haar mit Geheimratsecken (kleiner Stirnschopf in der Mitte), gepflegter grauer
   Kinnbart (Schnurrbart und Kinn, Wangen rasiert), rechteckige Brille mit dünnem dunklem Rand, schwere Lider und Tränensäcke,
   die Brauen innen leicht angehoben (er verteidigt sich und ist es leid); beiger Trenchcoat mit breitem Revers und
   Schulterklappe über einem marineblauen Pullover mit Rundkragen und hellblauem Hemd.
   Legende HEAD: a–e Haar, Brauen und Bart (m1 m2 m3 m4 s5) · Ziffern Haut (1–4 q1–q4, 5 p4, 6 p5) · r warme Töne (p3) ·
   w W Augenweiß · i Iris · I Wimpern · m Mundspalt · l Unterlippe. Brille, Pullover und Mantel werden in Code gemalt;
   Kontur mit M.outline. Varianten: MOUTH und EYES als Flicken. */
(function(M){
'use strict';
var P=M.P;
var HEAD=[
 "........................................................", // 0
 "........................................................", // 1
 "........................................................", // 2
 "........................................................", // 3
 "........................................................", // 4
 "........................................................", // 5
 "........................bcdddccb........................", // 6
 ".....................bccddedddccccb.....................", // 7
 "...................bccdddeddcdcdcccbb...................", // 8
 "..................bcccddedcdcdccdcccbbb.................", // 9
 ".................abccdcdcdccb565cdcccb54................", // 10
 "................abbccdcdcccb45665dcdc5544...............", // 11
 "...............abbbccdcdcccb456665dc555443..............", // 12
 "...............abbbcccdccbb345666654455443..............", // 13
 "...............abbbccdccbbb345666665555443..............", // 14
 "...............abbbbccccccb345665444554443..............", // 15
 "...............abbbbcccccbb345666665555443..............", // 16
 "...............abbbbcccccb34555cbbc55bb443..............", // 17
 "...............abbbbccccbb34cbbba45544bbba3.............", // 18
 "...............abbbcb455cb34433334554333443.............", // 19
 "...............abbbb4553cb3443IIII455III43..............", // 20
 "...............abbab4323cb344IWiIW455WiI43..............", // 21
 "...............abbbb4313bb3453Wii34554i343..............", // 22
 "...............aabbb4223b345543334554433443.............", // 23
 "...............aabab432334556655544565433443............", // 24
 "................abbb453334566555544456533443............", // 25
 "................aabb4433345555554444456533443...........", // 26
 ".................aabb4333445555444444456r5r43...........", // 27
 ".................aabb433334455444443323r1233............", // 28
 "..................ab2b33334445544443443223..............", // 29
 "...................ab23334445444433bcddccb..............", // 30
 "....................12233344444433bcdddcccb.............", // 31
 ".....................122333444433cb2mmmm2b..............", // 32
 "......................1222344433cddcllllcb..............", // 33
 "......................1122233433cddedddcb...............", // 34
 "......................112222233bcddeddccb...............", // 35
 "......................112222223bccdddccba...............", // 36
 "......................112222222abccccbba................", // 37
 "......................1122222222abbbbaa.................", // 38
 "......................122333332211222...................", // 39
 "......................34433333322221....................", // 40
 "......................34433333322221....................", // 41
 "......................34433333322221....................", // 42
 "......................34433333332221....................", // 43
 "......................34433333332221....................", // 44
 "......................34433333332221....................", // 45
 "......................34433333332221....................", // 46
];
var LEG={ a:P.m1, b:P.m2, c:P.m3, d:P.m4, e:P.s5, '1':P.q1, '2':P.q2, '3':P.q3, '4':P.q4, '5':P.p4, '6':P.p5, r:P.p3,
  w:P.s5, W:P.s4, i:P.w2, I:P.h1, m:P.p1, l:P.p3 };
function stamp(b,rows,leg){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch==='.'||ch===' ') continue; var c=leg[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x,y,c); } } }
function putList(b,list){ for (var i=0;i<list.length;i++) b.px(list[i][0],list[i][1],LEG[list[i][2]]); }
// Trenchcoat (beige): Licht von links oben, die ferne Seite im Schatten
function back(b){
  b.poly([[1,64],[1.5,58],[3.5,53],[8,49],[14,46.5],[20,45.5],[36,45.5],[43,46.5],[48,49],[51.5,53],[53.5,58],[54,64]],P.e4);
  b.poly([[1,62],[1.5,58],[3.5,53],[8,49],[14,46.5],[17,46.2],[11,50],[6,54],[3,59]],P.s4);
  b.poly([[42,47.5],[48,49.5],[51.5,53],[53.5,58],[54,64],[45,64],[44,55]],P.e3);
  b.line(10,56,11,63,P.e3); b.line(45,51,46,63,P.e2); b.line(3,60,4,63,P.e3);
  // Sturmklappe auf der nahen Brust (nur die Kante mit ihrem Schatten)
  b.line(15,54,9,57,P.e3); b.line(9,57,3,59,P.e3);
  // Schulterklappe mit Knopf, auf der nahen Schulter
  b.poly([[4.5,52.5],[13,48.2],[14.6,50],[6,54]],P.s4); b.line(5,52,12,48,P.s5); b.line(6,54,14,50,P.e3); b.line(7,55,14,51,P.e4); b.px(13,49,P.w1); b.px(12,50,P.w2);
}
function front(b){
  // Hemd (hellblau) im Rundkragen des Pullovers: Kragensteg um den Hals, die Spitzen liegen auf dem Pullover
  b.poly([[21.5,41],[36.5,41],[36,44.5],[30,46],[23,45]],P.b4); b.line(30,42,35,42,P.b3); b.line(29,43,29,45,P.b3);
  // Pullover mit Rundkragen im offenen Mantel
  b.poly([[20.5,44.5],[25,45.6],[30,46.4],[37,44.2],[37.5,46],[34.5,53],[31.5,64],[27.5,64],[24.5,53],[20.5,47]],P.n1);
  b.poly([[31.5,47],[37.5,45.5],[34.5,53],[31.5,64],[30,64],[31,55]],P.n0);
  b.line(21,45,25,46,P.n2); b.line(26,46,29,47,P.n2); b.line(31,46,36,45,P.n2); b.line(22,47,29,48,P.n0);
  // Kragenspitzen
  b.poly([[21.5,41.5],[24,42.2],[28.6,45.8],[26.5,47.4],[22.5,45.6],[21,43.5]],P.b4); b.line(22,42,24,43,P.b5); b.line(24,44,27,46,P.b5); b.line(23,46,26,47,P.b3);
  b.poly([[36.3,41.8],[37,43.6],[34.6,46],[32.2,45.6]],P.b3); b.line(35,43,33,45,P.b4);
  // Kragen hinten am Hals (steht etwas auf)
  b.poly([[16,48],[16.8,42],[20.5,40],[23,42.2],[22.5,47]],P.s4); b.line(17,42,20,40,P.s5); b.line(22,43,22,46,P.e3);
  b.poly([[36.5,43],[38,40.5],[41,41.4],[42.2,46],[39,47]],P.e3); b.line(38,41,40,41,P.e4);
  // nahes Revers mit Kragenspitze und Kerbe; fernes Revers schmal im Schatten
  b.poly([[11.5,49],[17,46],[22.5,46.3],[26.5,52],[28.5,58],[28.5,64],[25,64],[21,57.5],[15.5,52.5]],P.s4);
  b.line(17,46,22,46,P.s5); b.line(23,47,26,53,P.s5); b.line(26,53,28,59,P.s5); b.line(15,52,21,57,P.e3);
  b.poly([[14.5,49.5],[17.8,48.6],[18.6,51.2]],P.e2); b.line(12,49,16,48,P.s5);
  b.poly([[37,45.5],[41.5,46.2],[44,49.5],[40.5,55],[34.5,61.5],[32,64],[31.5,64],[31.5,58.5],[34.5,51]],P.e3);
  b.line(37,47,35,51,P.e4); b.line(43,50,40,55,P.e2); b.line(40,55,35,61,P.e2); b.poly([[41.5,49],[43.6,48.6],[43,51]],P.e2);
  // Knöpfe (zweireihig)
  [[22,60],[22,63],[37,59]].forEach(function(q){ b.px(q[0],q[1],P.w1); b.px(q[0]+1,q[1],P.w2); });
}
// Rechteckige Brille: dünner dunkler Rand, Steg auf der Nase, Bügel zum Ohr, Glanz oben links
function glasses(b){
  var F=P.m1, H=P.m3;
  b.line(28,19,33,19,F); b.line(28,24,33,24,F); b.line(27,20,27,23,F); b.line(34,20,34,23,F);
  b.line(37,19,40,19,F); b.line(37,24,40,24,F); b.line(36,20,36,23,F); b.line(41,20,41,23,F);
  b.px(35,20,F); b.line(24,20,26,20,F);
  b.line(28,19,30,19,H); b.px(27,20,H); b.px(37,19,H);
  b.px(28,20,P.l1); b.px(37,20,P.s6);
}
var MOUTH_O=[[35,32,'2'],[36,32,'1'],[37,32,'w'],[38,32,'w'],[39,32,'1'],[40,32,'2'],[36,33,'1'],[37,33,'1'],[38,33,'1'],[39,33,'2'],[36,34,'l'],[37,34,'l'],[38,34,'l'],[39,34,'c']];
var EYES_B=[[30,20,'4'],[31,20,'4'],[32,20,'4'],[33,20,'4'],[29,21,'I'],[30,21,'1'],[31,21,'I'],[32,21,'I'],[33,21,'2'],[30,22,'4'],[31,22,'4'],[32,22,'4'],[33,22,'4'],
  [37,20,'4'],[38,20,'4'],[39,20,'4'],[37,21,'I'],[38,21,'I'],[39,21,'2'],[37,22,'4'],[38,22,'4']];
function paint(b,v){
  back(b);
  stamp(b,HEAD,LEG);
  if (v.mouth) putList(b,MOUTH_O);
  if (v.eyes) putList(b,EYES_B);
  front(b); glasses(b);
  M.outline(b,P.k1);
}
M.definePortrait('davor',{ paint:paint });
})(M);
