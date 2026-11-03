/* Porträt: Mala (Geist, wirkt 17–18, frühe Neunziger) — dunkler lockerer Zopf über der Schulter, Strähnen im Gesicht,
   übergroße Jeansjacke mit hochgeschlagenem Kragen, handgestrickter grauer Schal, große ernste Augen.
   In natürlichen Farben gemalt; das Spiel setzt das Bild in Malas Geisterfarbe um (M.ghostLut). Deshalb sind die
   Tonstufen nach Helligkeit gewählt: Augenweiß hell, Iris mittel, Lippenspalt und Schatten weich, nie schwarz. */
(function(M){
'use strict';
var P=M.P;
var HEAD=[
"........................................................", // 0
"........................................................", // 1
"........................................................", // 2
"........................................................", // 3
"........................................................", // 4
"........................22222111........................", // 5
".....................22324301111111.....................", // 6
"...................22432431101211111....................", // 7
"..................2243223111012311111...................", // 8
".................222322311121011221111..................", // 9
"................22232131112110121121111.................", // 10
"................22321311121111012111111.................", // 11
"...............223113111211111C112211111................", // 12
"...............211113112111112DDC1121111................", // 13
"...............11113111211112DEEDDC11111................", // 14
"...............1111211211113DEEEEEDDC11.................", // 15
"...............11112112111C2EEEEEEDDC21.................", // 16
"...............0012111211C2EEEEEEEEDDC1.................", // 17
"...............0012112111D1EEEEEEEEDDC1.................", // 18
"...............001111211DE3222EEEDD322C.................", // 19
"...............0011111112EEDDD23ED2DCCC.................", // 20
"...............0011111112EDDCCCDEDDCCDC.................", // 21
"...............000111112DDC32223ED3223C.................", // 22
"...............00011DEC3DD3WLkiWEDikW3C.................", // 23
"...............0001DErC2DDDwiiiwEDiiwDC.................", // 24
"...............0001ECBD2EEDDCCDDEEDCCDD.................", // 25
"................001ECrD3EEEEEEEDEEEECCD.................", // 26
"................000DED02DEEEEEDDDDEEEDCC................", // 27
"................0000DC.C2EEDDDDDCDCBCCC.................", // 28
".................00000BC1EEDDDDDCDCCCDD.................", // 29
".................00000BC2DDDDDDCDCCrCDD.................", // 30
"..................0000BBCDDDDDDCBBBmBCC.................", // 31
".....................CBBCCDDDDDDDDCrCDC.................", // 32
".....................CCBBCCDDDDDDDCCDDC.................", // 33
".....................CCBBBCCDDEEEEDDDC..................", // 34
".....................CCCBBBCCDDEEDDDC...................", // 35
".....................CCCCCBBBCCCCCCB....................", // 36
".....................CCCCCCCBBBBBB......................", // 37
".....................CCCCCCCCBB.........................", // 38
".....................CCCCCCCCBB.........................", // 39
".....................CCCCCCCCBB........................."  // 40
];
// Legende: Haar 0–4 (h0–h3, w2) · Haut A–E (p1–p5) · Lippen r (d4), Lippenspalt m (d3) · Auge W w Weiß (s6 s5), i Iris (c3), k Pupille (n1), L Glanzlicht
// Helligkeit im Geister-Tint: Weiß ≈ hellste Stufe, Haut p4/p5 hell, Iris und Lippenspalt mittel, Wimpern/Brauen dunkel, nichts schwarz
var LEG={ '0':P.h0,'1':P.h1,'2':P.h2,'3':P.h3,'4':P.w2,
  A:P.p1,B:P.p2,C:P.p3,D:P.p4,E:P.p5, r:P.d4,m:P.d3,
  w:P.s5,W:P.s6,i:P.c3,k:P.n1,L:P.l1 };
var HAIR=[P.h0,P.h1,P.h2,P.h3,P.w2];
function stamp(b,rows,leg){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch==='.'||ch===' ') continue; var c=leg[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x,y,c); } } }
function put(b,list){ for (var i=0;i<list.length;i++) b.px(list[i][0],list[i][1],LEG[list[i][2]]); }
function lerpPath(path,y){ for (var i=0;i<path.length-1;i++){ var a=path[i], c=path[i+1]; if (y>=a[1] && y<=c[1]) return a[0]+(c[0]-a[0])*(y-a[1])/Math.max(0.001,c[1]-a[1]); } return path[path.length-1][0]; }
// Übergroße Jeansjacke: breite Schultern, Licht auf der nahen Schulter, Knopfleiste, Passe-Naht, zwei Brusttaschen
function jacket(b){
  b.poly([[0,64],[0,57],[1,53],[4,49.5],[9,47],[14,46.5],[20,47],[30,49],[38,48],[45,47],[50,49],[53,52],[55,57],[56,64]],P.c2);
  b.poly([[0,60],[0,57],[1,53],[4,49.5],[9,47],[13,46.5],[10,49],[6,52],[3,56]],P.c3);
  b.line(4,50,8,48,P.b2);
  b.poly([[40,50],[46,48],[51,50],[54,54],[56,60],[56,64],[42,64]],P.c1);
  b.line(46,48,50,49,P.c3); b.line(51,50,53,53,P.c3);
  // Knopfleiste
  b.line(31,49,31,63,P.c1); b.line(32,50,32,63,P.c3);
  // Passe-Naht (doppelt, goldgelb) über der Brust
  b.line(2,52,12,50,P.y2); b.line(41,52,52,53,P.y1);
  // Brusttaschen mit Klappe und Messingknopf (nah im Licht, fern im Schatten)
  b.poly([[3,55],[11.5,55],[11.5,58],[7.5,59.5],[3,58]],P.c3); b.line(3,55,11,55,P.b2); b.line(3,58,7,59,P.c1); b.line(8,59,11,58,P.c1);
  b.px(7,57,P.y3); b.px(7,58,P.y1);
  b.poly([[43,56],[50,56.5],[50,59],[46.5,60.5],[43,59]],P.c2); b.line(43,56,50,56,P.c3); b.line(43,59,46,60,P.c0); b.line(47,60,50,59,P.c0);
  b.px(46,58,P.y2);
}
// hochgeschlagener Kragen: ferne Hälfte hinter dem Schal, nahe Hälfte davor (unter dem Zopf)
function collarBack(b){
  b.poly([[38,46],[38.5,38],[41,35],[44,35.5],[45.5,41],[46.5,47],[42,48]],P.c2); b.line(41,35,44,35,P.c3); b.line(39,38,40,45,P.c1); b.line(45,37,46,46,P.c1);
}
function collarFront(b){
  b.poly([[9,47],[11,41],[13,35.5],[16,35],[19,35.5],[20,40],[19,46],[14,48]],P.c2);
  b.line(13,36,18,35,P.c3); b.line(12,38,10,45,P.c3); b.line(19,37,19,45,P.c1);
}
// Schal: zwei Wülste um den Hals (oben Licht, unten Schatten), Rippenmaschen als feine Längsstreifen; ein Ende hängt vorn herab
var KN=[P.m1,P.m2,P.m3,P.m4];
function scarf(b){
  b.poly([[18,36],[21,34.5],[24,36],[28,37.5],[33,37.5],[37,35.5],[40,37],[41,42],[38,45.5],[31,47],[24,46.5],[19,44.5],[17,40]],function(x,y){
    var yb=40.5+(x-18)*0.05, top=y<yb, y0=top?35:yb, h=top?(yb-35):(47-yb), f=(y-y0)/h;
    var v=f<0.22?2.4:(f<0.7?2:(f<0.88?1:0)); if (x>34) v-=1; if (x<24 && f<0.7) v+=0.6;
    var vi=Math.max(0,Math.min(3,Math.round(v))); if (vi===2 && ((x>>1)&1) && f>0.25 && f<0.7) vi=1; return KN[vi]; });
  b.poly([[33,45.5],[39,44.5],[40.5,50],[40,57],[40.5,64],[33.5,64],[34,56],[33,51]],function(x,y){ var v=2; if (x>=39) v=1; if (v===2 && ((x>>1)&1) && x>34) v=1; if (y===51||y===58) v=Math.max(0,v-1); return KN[v]; });
}
// Zopf: Rautenglieder entlang eines Pfades, Licht von links oben
function braid(b){
  var path=[[18.5,30],[16.5,35],[14.5,40],[13.5,45],[13.5,52],[14,58],[14.5,64]];
  for (var y=30;y<64;y++){ var cx=lerpPath(path,y), hw=y<45?2.6:2.2;
    for (var x=Math.floor(cx-hw);x<=Math.ceil(cx+hw);x++){ var dx=x+0.5-cx; if (Math.abs(dx)>hw) continue;
      var t=(y+(dx<0?0:1.6)-Math.abs(dx)*0.9)/3.2, f=t-Math.floor(t);
      var v=f<0.28?3:(f<0.62?2:(f<0.84?1:0)); if (dx>hw-1.1) v=Math.max(0,v-1); if (dx<-hw+1.1 && v<3) v++;
      if (v===3 && f<0.12 && dx<0) v=4; b.px(x,y,HAIR[v]); } }
}
// Varianten: Lippen leicht geöffnet mit einem Pixel Zähne (spricht), Lider zu mit weicher Wimpernlinie (Lidschlag)
var MOUTH_O=[[32,31,'B'],[33,31,'B'],[34,31,'w'],[35,31,'A'],[36,31,'B'],[32,32,'C'],[33,32,'A'],[34,32,'A'],[35,32,'A'],[36,32,'C'],[33,33,'D'],[34,33,'C'],[35,33,'r'],[36,33,'C'],[34,34,'C'],[35,34,'C']];
var EYES_B=[[26,22,'D'],[27,22,'D'],[28,22,'D'],[29,22,'D'],[30,22,'D'],[31,22,'D'],[26,23,'3'],[27,23,'2'],[28,23,'2'],[29,23,'2'],[30,23,'2'],[31,23,'3'],[26,24,'D'],[27,24,'C'],[28,24,'D'],[29,24,'D'],[30,24,'D'],[31,24,'D'],[34,22,'D'],[35,22,'D'],[36,22,'D'],[37,22,'C'],[34,23,'3'],[35,23,'2'],[36,23,'2'],[37,23,'3'],[34,24,'D'],[35,24,'D'],[36,24,'D'],[37,24,'C']];
function paint(b,v){
  jacket(b); collarBack(b);
  stamp(b,HEAD,LEG);
  if (v.mouth) put(b,MOUTH_O);
  if (v.eyes) put(b,EYES_B);
  scarf(b); collarFront(b); braid(b);
  M.outline(b,P.k1);
}
M.definePortrait('mala',{ paint:paint });
})(M);
