/* ===== portraits/jela.js — Jela (78), Nachbarin der Zelenikas in Mostar (Kapitel 3)
   Gedrungen und sehr alt: breites, gefurchtes Gesicht, schwere Lider über kleinen, wachen Augen, die weißen Brauen gesenkt und
   zusammengezogen (eine Falte dazwischen), breite Nase, schmaler, fest geschlossener Mund mit hängenden Winkeln, kräftiges Kinn;
   weißes Haar schaut unter einem einfachen braunen Kopftuch hervor, das unter dem Kinn geknotet ist; dunkle Strickweste über
   einer dunkelblauen, weiß getupften Bluse. Direkt und vorwurfsvoll.
   Aufbau: Kopftuch (prozedural: Kugel-Licht von links oben, Falten zum Knoten), Gesicht als Pixelkarte HEAD, Saum des Tuchs
   darüber, Knoten und Zipfel, Kleidung; Kontur mit M.outline.
   Legende HEAD: Ziffern Haut (1–4 q1–q4, 5 p4, 6 p5) · r Wangenröte (p3) · h H j weißes Haar (s4 s5 s6) · x y Brauen (m2 m3) ·
   w W Augenweiß · i Iris · I Wimpern · m Mundspalt · l Unterlippe. Varianten: MOUTH und EYES als Flicken. */
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
 "........................................................", // 6
 "........................................................", // 7
 "........................................................", // 8
 "........................................................", // 9
 "........................................................", // 10
 "........................................................", // 11
 "........................................................", // 12
 "........................................................", // 13
 "..........................hH4Hh44444444443..............", // 14
 "..........................h445556555554443..............", // 15
 "..........................h445444544454433..............", // 16
 "..........................3455565534555443..............", // 17
 "..........................34yxx5553554xxy43.............", // 18
 "..........................34444xxx34xx44443.............", // 19
 "..........................3443333444333443..............", // 20
 "..........................34IIIIII44IIII43..............", // 21
 "..........................343WwiIW44wiI343..............", // 22
 "..........................34443i34544344433.............", // 23
 "..........................34654334554334443.............", // 24
 "..........................34555544455444443.............", // 25
 "..........................3455r5444456544433............", // 26
 "..........................3455544444456rr443............", // 27
 "..........................3444444444324rr343............", // 28
 "..........................34444444433321233.............", // 29
 "..........................3444444434443443..............", // 30
 "..........................3444444344444433..............", // 31
 "..........................33444432mmmmmm33..............", // 32
 "..........................334444323llll323..............", // 33
 "..........................3344444344554433..............", // 34
 "...........................334444345654433..............", // 35
 "............................2333334454432...............", // 36
 "..............................2233333321................", // 37
 "........................................................", // 38
 "........................................................", // 39
 "........................................................", // 40
 "........................................................", // 41
 "........................................................", // 42
 "........................................................", // 43
 "........................................................", // 44
 "........................................................", // 45
 "........................................................", // 46
];
var LEG={ '1':P.q1, '2':P.q2, '3':P.q3, '4':P.q4, '5':P.p4, '6':P.p5, r:P.p3, h:P.s4, H:P.s5, j:P.s6, x:P.m2, y:P.m3,
  w:P.s4, W:P.s3, i:P.w1, I:P.h1, m:P.q1, l:P.p3 };
function stamp(b,rows,leg){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch==='.'||ch===' ') continue; var c=leg[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x,y,c); } } }
function putList(b,list){ for (var i=0;i<list.length;i++) b.px(list[i][0],list[i][1],LEG[list[i][2]]); }
// ---- Kopftuch (braun, Baumwolle): Licht wie auf einer Kugel (links oben), Zugfalten laufen zum Knoten unter dem Kinn;
// hinten fällt es locker über Nacken und Schultern
var SC=[P.w0,P.w1,P.w2,P.w3,P.w4];
var OUT=[[41.5,13],[42,10],[40.5,7.5],[37,5.6],[32,4.5],[26,4.5],[20,5.6],[16,8.2],[13.2,12],[11.6,17],[11,23],[11.4,29],[12.2,34],[12.6,38.5],[11.6,42.5],[12,46.5],[15,47.6],
  [19,46],[23,43.6],[26.5,41.8],[30,40.4],[33,40],[37,39.6],[40.5,37.6],[43,34],[44.6,28],[45,22],[44.4,16.5],[43,13.6]];
function tone(x,y){ var nx=(x+0.5-27)/17, ny=(y+0.5-18)/19, d=1-nx*nx-ny*ny, nz=d>0?Math.sqrt(d):0; return 0.25+(-0.55*nx-0.6*ny+0.58*nz)*2.7; }
function fold(b,x0,y0,x1,y1,w){ var dx=x1-x0, dy=y1-y0, L=Math.sqrt(dx*dx+dy*dy), nx=-dy/L*w/2, ny=dx/L*w/2;
  b.poly([[x0+nx,y0+ny],[x1,y1],[x0-nx,y0-ny]],function(x,y){ var c=b.get(x,y); return SC.indexOf(c)>=0?M.DN[c]:c; });
  b.line(Math.round(x0+nx*1.6),Math.round(y0+ny*1.6),Math.round(x1+nx*0.8),Math.round(y1+ny*0.8),function(x,y){ var c=b.get(x,y); return (SC.indexOf(c)<0||c===P.w4)?c:M.UP[c]; }); }
function scarf(b){
  b.poly(OUT,function(x,y){ return SC[Math.max(0,Math.min(4,Math.round(tone(x,y))))]; });
  fold(b,30,39,17,8.5,2.6); fold(b,28,39.5,12.5,21,2.4); fold(b,33,39,27,6,1.8); fold(b,25,41.5,12.5,35,2.2); fold(b,22,43.5,13,45,1.6);
}
// Saum um das Gesicht: das Tuch steht über der Stirn etwas vor (Schatten darunter), nur auf der Lichtseite eine helle Kante
function hem(b){
  b.line(28,13,40,13,P.w2); b.line(29,12,34,12,P.w3); b.px(27,13,P.w1); b.px(41,13,P.w1);
  b.line(25,14,25,31,P.w2); b.line(24,15,24,24,P.w3); b.px(25,13,P.w1);
  b.line(26,32,27,34,P.w1); b.line(28,35,29,36,P.w1);
  b.line(42,15,42,24,P.w0); b.line(42,29,42,32,P.w0);
}
// Knoten unter dem Kinn und die zwei kurzen, breiten Zipfel
function knot(b){
  b.poly([[29.5,40.5],[32.6,40],[32.8,43.5],[30.6,46],[28.6,44.4]],P.w2); b.line(30,42,30,45,P.w3); b.px(29,44,P.w1);
  b.poly([[35,40.2],[38,40],[40,43.6],[38.6,46.2],[36.5,44]],P.w1); b.line(37,41,39,44,P.w2);
  b.ellipse(34.3,39.6,3.3,2.3,function(x,y){ return (x<34&&y<40)?P.w3:(x>36?P.w1:P.w2); }); b.px(32,38,P.w3); b.px(33,38,P.w3); b.line(34,41,36,40,P.w0); b.px(34,39,P.w1);
}
// Zipfel hinten im Nacken (über der Weste)
function tail(b){
  b.poly([[11.6,40],[17,40.5],[22,43.5],[17.5,51],[13.5,48],[11.5,44]],function(x,y){ return x<15?P.w2:P.w1; }); b.line(15,43,16,49,P.w0); b.line(13,42,14,47,P.w3);
}
// ---- Kleidung: dunkelblaue, weiß getupfte Bluse mit rundem Kragen; dunkle Strickweste mit V-Ausschnitt
function dot(x,y){ var k=((x*7+y*5)%13+13)%13; return k===0?P.s5:(k===6?P.n3:P.n1); }
function blouse(b){
  b.poly([[2,64],[2.5,56],[5,50.5],[9,47],[15,44.5],[22,43],[34,43],[41,44.5],[47,47],[51,51],[53.5,56],[54,64]],function(x,y){ var c=dot(x,y); return (x>44&&c===P.n1)?P.n0:c; });
}
var KN=[P.k2,P.m0,P.m1,P.m2];
function vest(b){
  var knit=function(lo){ return function(x,y){ var v=lo+((x&1)?0:1); if (x<12 && y<54) v++; if (x>41) v=Math.min(v,lo); return KN[Math.max(0,Math.min(3,v))]; }; };
  b.poly([[2.5,64],[3,56],[5.5,50.5],[9.5,47],[15,44.5],[20,43.6],[24,47],[28.5,55],[29.5,64]],knit(1));
  b.poly([[31.5,64],[32,55],[35,48],[38.5,44],[42,45],[47,47.5],[51,51.5],[53.5,56.5],[54,64]],knit(0));
  b.line(6,52,5,63,P.k2); b.line(48,50,49,63,P.k2);
  b.line(20,44,28,55,P.m2); b.line(38,45,33,54,P.m0);
}
function collar(b){
  b.poly([[24,44],[27,43],[30,46],[28,48.5],[25,47]],P.n2); b.line(25,44,27,44,P.n3);
  b.poly([[38,43.2],[40,44.4],[38.5,47],[36.5,46]],P.n1);
}
var MOUTH_O=[[34,32,'1'],[35,32,'1'],[36,32,'W'],[37,32,'1'],[38,32,'2'],[34,33,'2'],[35,33,'1'],[36,33,'1'],[37,33,'2'],[35,34,'l'],[36,34,'l'],[37,34,'3']];
var EYES_B=[[29,21,'3'],[30,21,'3'],[31,21,'3'],[32,21,'3'],[33,21,'3'],[29,22,'I'],[30,22,'I'],[31,22,'I'],[32,22,'I'],[33,22,'2'],
  [36,21,'3'],[37,21,'3'],[38,21,'3'],[36,22,'I'],[37,22,'I'],[38,22,'2']];
function paint(b,v){
  blouse(b); vest(b); collar(b); tail(b);
  scarf(b);
  stamp(b,HEAD,LEG);
  if (v.mouth) putList(b,MOUTH_O);
  if (v.eyes) putList(b,EYES_B);
  hem(b); knot(b);
  M.outline(b,P.k1);
}
M.definePortrait('jela',{ paint:paint });
})(M);
