/* Porträt: Nina Barić (31), Malerin und Rahmenmacherin — kastanienbraunes Haar, rotes Tuch im Haar, senfgelber Pullover,
   Jeansschürze; müde, aufmerksam. Rotes Tupfentuch mit Knoten im Nacken, Farbflecken auf der Schürze. */
(function(M){
'use strict';
var P=M.P;
var HEAD=[
"........................................................", // 0
"........................................................", // 1
"........................................................", // 2
"........................................................", // 3
"........................................................", // 4
".......................zzzzzzzzy........................", // 5
"....................zzzzzzzzzzzzyyy.....................", // 6
"..................zzozzzozzzozzzZyyyZ...................", // 7
".................zzzzzzzzzzzzzzzyyyyyx..................", // 8
"................zzzzzzzzzzzzzzzzzzzzzzx.................", // 9
"...............zzzozZZozzzozZZoyyyyyyyz.................", // 10
"...............zzzzzyyzzzzZZzzzyyy1yyyyy................", // 11
"...............zzzzzzzyzZZzzz21111211111................", // 12
"..............zzozzzozZZoz121CDDDCC11211................", // 13
"..............zzzzzzZZzz111CDEEEDDC11111................", // 14
"..............zzzzZZzz1112CDEEEDDDDC111.................", // 15
"..............ozZZoz111111DEEEEEDDDDC11.................", // 16
".............ZZzzz2121111CDEEEEEDDDDC11.................", // 17
"............ZZzzzy2121111DEEEEEEEDDDDC1.................", // 18
"............Zzzzyy213111DE10001EEED1001C................", // 19
"............zzzyyy21DED1DEEDDDD1EED1DCCC................", // 20
".............zyyy21DEBD1DEDCCCCDEDCCCDC.................", // 21
"............zz2yy12EDCB2DDBkkkkBEDBkkBC.................", // 22
"...........zz.2yy12ECAC2DDBwLkIwEDIkwBC.................", // 23
"..........yy..yy212ECB1DDDCDIIiDEDIIDCC.................", // 24
"..........yy..xx213DECDDEDDCCCDDEECCDDD.................", // 25
"..........y..xxx2133DECDEEEDDDDDEEEDCCD.................", // 26
"..............x21313CD0DDEDDDDDDDDEEEDCC................", // 27
"..............21131300.CDDDDDDDDCDCBCCC.................", // 28
"...............2131300BCDDDDDDDDCDCCCDDC................", // 29
"...............2131200BCCDDDDDDCDCCRRCDC................", // 30
"...............1311200BBCDDDDDCBBAAABCC.................", // 31
"................311200BBCCDDDDDDCRRCDDC.................", // 32
"................311200CBBCCDDDDDDCCCDDC.................", // 33
"................200200CBBBCCDDDEEEDDDC..................", // 34
".................00200CCBBBCCDDEEDDDC...................", // 35
".................00200CCCBBBCCDDDDCCB...................", // 36
"..................0200CCCCCBBBCCCCB.....................", // 37
"..................0020CCCCCCCBBBBB......................", // 38
"...................020CCCCCCCBB.........................", // 39
"....................CCCCCCCCCBB.........................", // 40
"....................CCCCCCCCCBB........................."  // 41
];
// Legende: Haar 0–3 (t0 t1 t2, Glanz w4) · Tuch x y z Z (r1–r4), Tupfen o (s5) · Haut A–E (p1–p5), Lippen R (d4)
//          Auge w Weiß (s4), I i Iris (w3 w2), k Wimpern/Pupille (h1), L Glanzlicht
var LEG={ '0':P.t0,'1':P.t1,'2':P.t2,'3':P.w4,
  x:P.r1,y:P.r2,z:P.r3,Z:P.r4,o:P.s5,
  A:P.p1,B:P.p2,C:P.p3,D:P.p4,E:P.p5, R:P.d4,
  w:P.s4,i:P.w2,I:P.w3,k:P.h1,L:P.s6 };
function stamp(b,rows,leg){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch==='.'||ch===' ') continue; var c=leg[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x,y,c); } } }
function put(b,list){ for (var i=0;i<list.length;i++) b.px(list[i][0],list[i][1],LEG[list[i][2]]); }
// Senfgelber Pullover: Grundform, Licht auf der nahen Schulter, weiche Falten, gerippter Halsausschnitt
function sweater(b){
  b.poly([[0,64],[0,53],[2,49],[6,45.5],[12,43],[20,41],[33,42],[40,43],[46,45.5],[51,49],[54,54],[55.5,58],[56,64]],P.y2);
  b.poly([[0,57],[0,53],[2,49],[6,45.5],[12,43],[17,42],[12,45.5],[7,48.5],[3,52.5]],P.y3);
  b.line(2,49,6,46,P.y4); b.line(6,46,12,43,P.y4);
  b.poly([[43,47],[48,47.5],[52,51],[54.5,56],[56,64],[46,64],[45,55]],P.y1);
  b.line(41,44,46,46,P.y3); b.line(47,46,50,48,P.y3);
  b.poly([[49,55],[52,57],[56,64],[51,64]],P.y0);
  b.line(10,52,9,58,P.y1); b.line(9,59,10,63,P.y1); b.line(4,56,3,63,P.y1);
}
function neckband(b){
  b.poly([[19.5,40.5],[23,43],[28,44.5],[32,44],[34,42],[34.5,44],[32,46],[27,46.5],[22,45],[19,42.5]],function(x,y){ return (x&1)?P.y2:P.y3; });
  b.line(20,42,24,44,P.y4);
}
// Jeansschürze: Latz mit Trägern über den Schultern, Ziernaht, Farbflecken
function apron(b){
  b.poly([[14.5,42.5],[17.5,42.5],[25,52],[22,52]],P.c3); b.line(15,43,22,52,P.b2); b.line(17,43,24,52,P.c2);
  b.poly([[40.5,43.5],[43,44],[42,52],[39.5,52]],P.c1); b.line(41,44,40,51,P.c2);
  b.poly([[20,52],[42,52],[43,64],[19,64]],function(x,y){ var v=P.c2; if (x<24) v=P.c3; if (x>38) v=P.c1; return v; });
  b.line(20,52,42,52,P.c3); b.line(21,54,41,54,P.y2);
  b.px(30,58,P.r3); b.px(31,58,P.r4); b.px(31,59,P.r3); b.px(34,60,P.b3); b.px(35,60,P.b4); b.px(27,61,P.g4); b.px(26,61,P.g3);
}
// Varianten: Lippen leicht geöffnet mit einem Pixel Zähne (spricht), Lider zu mit Wimpernlinie (Lidschlag)
var MOUTH_O=[[32,31,'B'],[33,31,'A'],[34,31,'w'],[35,31,'A'],[36,31,'B'],[32,32,'C'],[33,32,'A'],[34,32,'A'],[35,32,'A'],[36,32,'C'],[33,33,'R'],[34,33,'R'],[35,33,'C'],[33,34,'C'],[34,34,'C'],[35,34,'C']];
var EYES_B=[[26,22,'C'],[27,22,'D'],[28,22,'D'],[29,22,'D'],[30,22,'D'],[31,22,'C'],[26,23,'B'],[27,23,'k'],[28,23,'k'],[29,23,'k'],[30,23,'k'],[31,23,'B'],[26,24,'D'],[27,24,'C'],[28,24,'D'],[29,24,'D'],[30,24,'D'],[31,24,'D'],[34,22,'C'],[35,22,'D'],[36,22,'D'],[37,22,'C'],[34,23,'B'],[35,23,'k'],[36,23,'k'],[37,23,'B'],[34,24,'D'],[35,24,'D'],[36,24,'D'],[37,24,'C']];
function paint(b,v){
  sweater(b);
  stamp(b,HEAD,LEG);
  if (v.mouth) put(b,MOUTH_O);
  if (v.eyes) put(b,EYES_B);
  neckband(b); apron(b);
  M.outline(b,P.k1);
}
M.definePortrait('nina',{ paint:paint });
})(M);
