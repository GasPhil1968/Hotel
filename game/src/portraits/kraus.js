/* ===== portraits/kraus.js — Herr Kraus (61), Hausmeister im Haus am Bavariapark (Kapitel 4, München)
   Untersetzt: breites, volles Gesicht mit schweren Wangen und Doppelkinn, grauer Stoppelbart über Kinn, Wangen und Oberlippe,
   buschige graue Brauen, tief gezogen, eine Zornesfalte dazwischen, die Mundwinkel hängen; kurzes graues Haar mit Geheimratsecken,
   die Lesebrille auf die Stirn geschoben. Graublauer Hausmeisterkittel mit Kragen und Brusttasche (Bleistift, Zollstock),
   darunter ein kariertes Hemd. Brummig.
   Gesicht nach der Grundform von portraits/zdravko.js (breiter Kopf), Haar, Brille und Stoppeln in Code.
   Legende HEAD: Ziffern Haut (1 p0 … 6 p5, 7 l0) · r Röte (t5) · h Haarfläche (Textur in Code) · u v y x Brauen (m4 m3 m2 m1) ·
   w W Augenweiß · i Iris · k Pupille · z Wimpern. Varianten: MOUTH und EYES als Flicken. */
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
 "........................hhhhhhhh........................", // 5
 "......................hhhhhhhhhhhh......................", // 6
 "....................hhhhhhhhhhhhhhhh....................", // 7
 "...................hhhhhhhhhhhhhhhhhh...................", // 8
 "..................hhhhhhhhhhhhhhhhhhhh..................", // 9
 ".................hhhhhhhhhhhhhhhhhhhhhh.................", // 10
 "................hhhhhhhhhhhhhhhhhhhhhhhh................", // 11
 "................hhhhhhhhhhhhhhh55554444hh...............", // 12
 "...............hhhhhhhhhhhhhh5555555444hh...............", // 13
 "...............hhhhhhhhhhhhh5444445544433...............", // 14
 "...............hhhhhhhhhhhhh5555555544433...............", // 15
 "..............hhhhhhhhh6666666666556555443..............", // 16
 "..............hhhhhhhhh5555555555555uvvu43..............", // 17
 "..............hhhhhhhh555555uvuvuy45yxxxy3..............", // 18
 "..............hhhhhhhh55554vyxxxxy354yy443..............", // 19
 "..............hhhh5455435554455544364455443.............", // 20
 "..............hhhh4543325543zzzzz3564zzzz33.............", // 21
 "..............hhh54531425553Wwikw3563Wik333.............", // 22
 "..............hhh545314355544555445644554443............", // 23
 "..............hhh555323355455444555655445443............", // 24
 "..............hhh554432356666666555665554443............", // 25
 "...............hh5435433566rr666544556665443............", // 26
 "...............hh5444543556rr665543455666543............", // 27
 "...............hh444444355566655443345555443............", // 28
 "................h434433455555554434322333443............", // 29
 ".................333445555555555434455544433............", // 30
 "..................33445555555555434555554433............", // 31
 "...................3345555555555442333334443............", // 32
 "...................334555555555544422222343.............", // 33
 "...................324555555555544245665343.............", // 34
 "....................32455555555543443334443.............", // 35
 "....................3324555555555555665543..............", // 36
 "....................333245555555556666543...............", // 37
 "....................33332344555555555543................", // 38
 "....................3333322344444444443.................", // 39
 "....................333333323333333333..................", // 40
 "....................333333333444444443..................", // 41
 "....................333333333334444333..................", // 42
 "....................334333333332223.....................", // 43
 "....................3443333333222233....................", // 44
 "....................34433333332222333...................", // 45
];
var LEG={ '1':P.p0, '2':P.p1, '3':P.p2, '4':P.p3, '5':P.p4, '6':P.p5, '7':P.l0, r:P.p4, h:P.m3,
  u:P.m4, v:P.m3, y:P.m2, x:P.m1, w:P.s5, W:P.s4, i:P.w2, k:P.h0, z:P.h1 };
function stamp(b,rows,leg){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch==='.'||ch===' ') continue; var c=leg[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x,y,c); } } }
function putList(b,list){ for (var i=0;i<list.length;i++) b.px(list[i][0],list[i][1],LEG[list[i][2]]); }
// kurzes graues Haar: feine Körnung, Licht von links oben, am Haaransatz schimmert die Haut durch
function hair(b){ var TONE=[P.m1,P.m2,P.m3,P.m4,P.s4];
  for (var y=0;y<HEAD.length;y++) for (var x=0;x<HEAD[y].length;x++){ if (HEAD[y][x]!=='h') continue;
    var nx=(x+0.5-27)/13, ny=(y+0.5-16)/13, d=1-nx*nx-ny*ny, nz=d>0?Math.sqrt(d):0, l=-0.5*nx-0.66*ny+0.56*nz;
    var v=1.5+l*1.6+(M.hash(x*1.7+3,y*2.1+9)-0.5)*1.0, c=TONE[Math.max(0,Math.min(4,Math.round(v)))];
    var nb=HEAD[y][x+1], dn=HEAD[y+1]&&HEAD[y+1][x]; if (((nb>='1'&&nb<='7')||(dn>='1'&&dn<='7')) && M.hash(x*2.9,y*1.3)<0.45) c=P.p3;
    b.px(x,y,c); } }
// grauer Stoppelbart: Körnung auf der Haut von Wangen, Kinn und Oberlippe (nicht auf Lippen und Nase)
var STUB={}; STUB[P.p5]=P.s4; STUB[P.l0]=P.s4; STUB[P.p4]=P.m4; STUB[P.p3]=P.m3; STUB[P.p2]=P.m2; STUB[P.p1]=P.m1; STUB[P.p0]=P.m1;
function stubble(b){ for (var y=28;y<=40;y++) for (var x=16;x<=44;x++){ var ch=HEAD[y]&&HEAD[y][x]; if (!(ch>='1'&&ch<='7')) continue;
    if (y<31 && x>=31) continue; if (y<30 && x<=21) continue; if (y>=32 && y<=35 && x>=34 && x<=40) continue;
    var c=b.get(x,y), st=STUB[c]; if (st===undefined) continue;
    if (((x+2*y)%3)===0 || (y>=36 && ((x+y)&1))) b.px(x,y,st); }
  for (var x2=34;x2<=41;x2++){ if ((x2&1)===0) b.px(x2,31,STUB[b.get(x2,31)]||b.get(x2,31)); } }
// Lesebrille auf der Stirn: zwei Gläser über den Brauen, Steg, Bügel nach hinten ins Haar
function glasses(b){ var F=P.k2, L=P.b4, G=P.l1;
  b.line(27,12,32,12,F); b.line(27,15,32,15,F); b.vl(26,13,14,F); b.vl(33,13,14,F); b.line(27,13,32,13,L); b.line(27,14,32,14,P.b3); b.px(28,13,G); b.px(29,13,G);
  b.line(35,12,39,12,F); b.line(35,15,39,15,F); b.vl(34,13,14,F); b.vl(40,13,14,F); b.line(35,13,39,13,L); b.line(35,14,39,14,P.b3); b.px(36,13,G);
  b.line(19,15,25,13,F); b.px(18,15,P.m1); }
// Hausmeisterkittel (graublau) mit Kragen und Knöpfen, breite runde Schultern; darunter ein kariertes Hemd
function check(x,y){ var h=(y%3===0), v=(x%3===1); if (h&&v) return P.n1; if (h||v) return P.m1; return P.m2; }
function coat(b){
  b.poly([[0,64],[0,56],[2,51.5],[7,48],[14,45.6],[21,44.4],[38,44.4],[45,45.8],[50,48.6],[53.5,52.5],[55.5,58],[55.5,64]],P.c3);
  b.poly([[0,58],[0,56],[2,51.5],[7,48],[12,46.2],[10,48.6],[5,52.5],[2,58]],P.c4);
  b.poly([[46,47.6],[50,48.6],[53.5,52.5],[55.5,58],[55.5,64],[48,64]],P.c2);
  b.line(2,58,3,63,P.c2); b.line(51,53,52,63,P.c1); b.line(12,50,11,63,P.c2);
  // Hemd im Ausschnitt
  b.poly([[22,44.6],[28,44.6],[34,44.6],[39,45],[35,52],[31,57],[27,52]],function(x,y){ return check(x,y); });
  // Kragen des Kittels (Revers), Knopfleiste
  b.poly([[13,47],[20,44.4],[24,45],[28,52],[31,58],[31,64],[26,64],[22,55],[17,50]],P.c3);
  b.line(20,45,24,46,P.c4); b.line(24,46,28,53,P.c4); b.line(28,53,30,58,P.c4); b.line(17,50,22,55,P.c2);
  b.poly([[38,45],[43,45.4],[46,48],[42,54],[36,60],[32,62],[32,58],[35,52]],P.c2);
  b.line(39,46,35,52,P.c3); b.line(44,48,40,54,P.c1);
  b.line(31,58,31,64,P.c1); [[33,60],[33,63]].forEach(function(q){ b.px(q[0],q[1],P.c1); b.px(q[0],q[1]-1,P.c4); });
  // Brusttasche mit Bleistift und Zollstock (nahe Seite)
  b.line(9,56,16,56,P.c2); b.line(9,57,16,57,P.c4); b.vl(12,51,55,P.y3); b.vl(13,52,55,P.y2); b.px(12,50,P.p3); b.px(13,51,P.k2);
}
var MOUTH_O=[[35,33,'1'],[36,33,'1'],[37,33,'w'],[38,33,'1'],[39,33,'2'],[35,34,'2'],[36,34,'1'],[37,34,'1'],[38,34,'1'],[36,35,'4'],[37,35,'5'],[38,35,'5']];
var EYES_B=[[28,21,'4'],[29,21,'4'],[30,21,'4'],[31,21,'4'],[32,21,'4'],[28,22,'3'],[29,22,'z'],[30,22,'z'],[31,22,'z'],[32,22,'z'],[28,23,'5'],[29,23,'5'],[30,23,'5'],[31,23,'5'],[32,23,'5'],[37,21,'4'],[38,21,'4'],[39,21,'4'],[40,21,'4'],[37,22,'z'],[38,22,'z'],[39,22,'z'],[40,22,'3'],[37,23,'4'],[38,23,'5'],[39,23,'5'],[40,23,'4']];
function paint(b,v){
  coat(b);
  stamp(b,HEAD,LEG); hair(b); stubble(b);
  if (v.mouth) putList(b,MOUTH_O);
  if (v.eyes) putList(b,EYES_B);
  glasses(b);
  M.outline(b,P.k1);
}
M.definePortrait('kraus',{ paint:paint });
})(M);
