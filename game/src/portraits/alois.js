/* ===== portraits/alois.js — Alois Lechner (89), Bewohner im Haus am Bavariapark, früher Trambahnfahrer (Kapitel 4, München)
   Groß, hager, gebeugt: langes, eingefallenes Gesicht mit tiefen Furchen (Stirn, Wangen, Mundwinkel), hohe Stirn mit Querfalten,
   große Ohren, weißes Haar glatt nach hinten gekämmt, buschige weiße Brauen, glatt rasiert, lange Nase, wässrige hellblaue Augen
   mit nassem Glanz; dünner Hals im zu weit gewordenen Hemdkragen, kariertes Hemd, beige Strickjacke mit Knöpfen. Freundlich, verloren.
   Gesicht nach der Grundform von portraits/mate.js (hager, großes Ohr), ohne Hut und Schnurrbart, eine Zeile länger; Stirn und Haar neu.
   Legende HEAD: Ziffern Haut (1 p1 … 5 p5, 6 l0) · q Q kühle Schatten (q3 q2) · h H j Haar und Brauen (s4 s5 s6) · W w Augenweiß ·
   i Iris (hellblau) · I Wimpern und Pupille · m Mundspalt · l Unterlippe. Kleidung in Code, Kontur mit M.outline. */
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
 "........................................................", // 5
 "........................hhjHHh..........................", // 6
 ".....................hhhjHHhhjHH........................", // 7
 "...................hhhhjHHhhjHHhhj......................", // 8
 "..................hhhjHHhhjHHhhjHHhh....................", // 9
 ".................hhjjHHhjjHHhjjHHhjjH...................", // 10
 "................hhjHHhhjHHhhjHHhhhh563..................", // 11
 "................hhHhhjHHhhjHHhhh55665543................", // 12
 "................hhhhjHHhhjhh5556566555443...............", // 13
 "................hhjHHhhhh55533655335354444..............", // 14
 "................hhHHhjhh444446566565554443..............", // 15
 "................hhhhjhh44453336533355544444.............", // 16
 "................hhjHhh444445555555555554443.............", // 17
 "................hhHHhh4444445555555555554443............", // 18
 "................hhhhh44444455555555555554443............", // 19
 ".................QHHhjHHHh343HjjH3443HjH3443............", // 20
 ".................QHhhH455434334333454333443.............", // 21
 ".................QhHhh53323434IIII354III33..............", // 22
 ".................QhhQh5212343IWiIw354WiI33..............", // 23
 ".................QQhQ2511234343i34454334433.............", // 24
 ".................2Q2Q3521234453334454433443.............", // 25
 "..................22234322345554344454444443............", // 26
 "..................22334432344544334445443443............", // 27
 "..................12234542344443334444554343............", // 28
 "...................1234552334433334444455433............", // 29
 "...................1222452334433334423321233............", // 30
 "....................12245233443333424433444.............", // 31
 "......................233323444333323444443.............", // 32
 "......................234432344433333mmmm3..............", // 33
 "......................234443234444333lll3...............", // 34
 ".......................234443234444555443...............", // 35
 ".......................234443323444555432...............", // 36
 ".......................234443322344455432...............", // 37
 ".......................23444333223344332................", // 38
 ".......................2344433322222221.................", // 39
 ".......................23444333221......................", // 40
 ".......................23444334322......................", // 41
 ".......................2344433332.......................", // 42
 ".......................2344433322.......................", // 43
 ".......................2344433322.......................", // 44
 ".......................2344433322.......................", // 45
 ".......................2344433322.......................", // 46
 ".......................2344433322.......................", // 47
 ".......................2344433322.......................", // 48
 "........................................................", // 49
];
var LEG={ '1':P.p1, '2':P.p2, '3':P.p3, '4':P.p4, '5':P.p5, '6':P.l0, q:P.q3, Q:P.q2,
  h:P.s4, H:P.s5, j:P.s6, W:P.s4, w:P.s5, i:P.b2, I:P.h1, m:P.q1, l:P.p3 };
function stamp(b,rows,leg){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch==='.'||ch===' ') continue; var c=leg[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x,y,c); } } }
function putList(b,list){ for (var i=0;i<list.length;i++) b.px(list[i][0],list[i][1],LEG[list[i][2]]); }
// Haar: Schatten im Nacken und über dem Ohr, ein Glanzstreif auf dem Scheitel
function hairShade(b){ var HR=[P.s4,P.s5,P.s6];
  for (var y=6;y<=25;y++) for (var x=15;x<=22;x++){ var c=b.get(x,y); if (HR.indexOf(c)<0) continue; if (x<=16 && y>=13) b.px(x,y,P.m4); else if (x<=17 && y>=17 && c!==P.s4) b.px(x,y,P.s4); }
  b.line(22,8,30,7,P.l1); b.px(31,8,P.s6); }
// große Ohren: die nahe Ohrmuschel steht über dem Haar vor (Rand hell, Muschel dunkel, langes Ohrläppchen)
var EAR=["..454..",".45553.","4554321","4532121","4521121","4532121","4453221",".44532.",".44443.","..4443.","...44.."];
function ear(b){ for (var j=0;j<EAR.length;j++) for (var i=0;i<EAR[j].length;i++){ var c=EAR[j][i]; if (c==='.') continue; b.px(17+i,20+j,LEG[c]); } }
// wässrige Augen: nasser Glanz, das Unterlid leicht gerötet
function wetEyes(b){ b.px(32,23,P.l1); b.px(39,23,P.l1); b.px(30,25,P.d5); b.px(31,25,P.d5); b.px(38,24,P.d5); }
// gebeugt: die nahe Schulter steht höher, der Rücken rund; beige Strickjacke (Rippen), darunter das Karohemd mit zu weitem Kragen
var KN=[P.s1,P.s2,P.s3,P.s4];
function knit(lo){ return function(x,y){ var v=lo+((x%3===0)?-1:0); if (x<12 && y<56) v++; if (x>44) v=Math.min(v,lo-1); return KN[Math.max(0,Math.min(3,v))]; }; }
function check(x,y){ var h=(y%3===0), v=(x%3===1); if (h&&v) return P.b2; if (h||v) return P.b3; return P.s5; }
function back(b){
  b.poly([[3,64],[3,57],[4.5,52],[7.5,47],[11.5,43.5],[16,41.4],[20.5,40.8],[24,42.2],[36,44.6],[42,46.6],[47,50],[50.5,54.5],[52,59],[52.5,64]],knit(2));
  b.poly([[41.5,48],[47,50.5],[50.5,55],[52,59],[52.5,64],[44,64],[43,56]],knit(1));
  b.line(10,54,11,63,P.s1); b.line(44,52,45,63,P.s1);
  // Hemdkragen hinten am runden Rücken
  b.poly([[16.5,42],[21,40.6],[25,41.6],[25.5,44.5],[19,44.6]],function(x,y){ return check(x,y); });
}
function front(b){
  // Karohemd im Ausschnitt, der Kragen zu weit um den dünnen Hals
  b.poly([[24,43],[28,44.6],[33,44.8],[36.5,44],[38,45.5],[35,53],[32,60],[28,53]],function(x,y){ return check(x,y); });
  b.poly([[23,42.6],[26,43.4],[30,47.5],[27.5,50],[24.5,47.5],[22,45.5]],function(x,y){ return (x+y)%2?P.s5:P.s6; }); b.line(23,45,27,49,P.b2);
  b.poly([[37.5,43.4],[38.6,45.6],[35.2,49.4],[33.4,47.2]],P.s4); b.line(37,46,35,48,P.b1);
  // Strickjacke: V-Ausschnitt, Knopfleiste mit Knöpfen
  b.poly([[11,49],[18,44.6],[24,44.4],[28.5,52],[31.5,59.5],[31.5,64],[25.5,64],[21,57],[15,51.5]],knit(3));
  b.line(19,45,24,45,P.s5); b.line(24,46,28,53,P.s5); b.line(28,54,31,60,P.s5); b.line(14,51,21,57,P.s2);
  b.poly([[37,45.2],[42,45.6],[45,49],[40.5,55.5],[35,62],[32.5,63.5],[32.5,59.5],[35.5,52]],knit(1));
  b.line(38,46,36,52,P.s3); b.line(44,50,40,55,P.s1);
  b.line(32,60,32,64,P.s1); [[33,61],[29,57]].forEach(function(q){ b.px(q[0],q[1],P.w2); b.px(q[0],q[1]-1,P.w3); });
}
var MOUTH_O=[[37,33,'1'],[38,33,'w'],[39,33,'1'],[40,33,'1'],[37,34,'1'],[38,34,'1'],[39,34,'2'],[37,35,'l'],[38,35,'l'],[39,35,'3']];
var EYES_B=[[30,22,'4'],[31,22,'4'],[32,22,'4'],[33,22,'3'],[29,23,'I'],[30,23,'I'],[31,23,'I'],[32,23,'I'],[33,23,'3'],[31,24,'3'],
  [37,22,'4'],[38,22,'4'],[39,22,'3'],[37,23,'I'],[38,23,'I'],[39,23,'3']];
function paint(b,v){
  back(b);
  stamp(b,HEAD,LEG); hairShade(b); ear(b);
  if (v.mouth) putList(b,MOUTH_O);
  if (v.eyes) putList(b,EYES_B); else wetEyes(b);
  front(b);
  M.outline(b,P.k1);
}
M.definePortrait('alois',{ paint:paint });
})(M);
