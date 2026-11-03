/* ===== portraits/hajra.js — Hajra Mešić (72), Pensionswirtin in Kovači
   Rundes, weiches Gesicht mit freundlichen Falten (Krähenfüße, Lachfalten), weißes Haar unter einem locker gebundenen
   hellblauen Kopftuch, im Nacken geknotet; dunkelgrüne Strickweste über geblümter Bluse mit rundem Kragen. Warm, neugierig.
   Aufbau: Kopftuch (prozedural: Kugel-Licht von links oben, Falten zum Knoten), Gesicht als Pixelkarte FACE, Saum des Tuchs
   darüber, Kleidung (Bluse geblümt, Weste mit Rippenstrick), Kontur mit M.outline.
   Legende FACE: Ziffern Haut (p-Rampe) · T Wangenwärme (t5) · h H j weißes Haar (s4 s5 s6) · s Brauen · w W Augenweiß ·
   i Iris · I Wimpern · r Lippe · M N n Hals (q4 q3 q2). Varianten: MOUTH und EYES als Flicken. */
(function(M){
'use strict';
var P=M.P;
var FACE=[
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
".............................hHjHHjHHhHhhh..............", // 14
"............................hHh45555554443..............", // 15
"...........................Hh5556555554443..............", // 16
"...........................h45444444454433..............", // 17
"..........................Hh45ssss5554sss3..............", // 18
"..........................h4ss5555s54s555s3.............", // 19
"..........................h4455445554444443.............", // 20
".........................445532II23542I233..............", // 21
".........................44433wiIW454WiI33..............", // 22
".........................44344333455433333..............", // 23
".........................434554445555444333.............", // 24
".........................45565433455564433..............", // 25
".........................45TT5544444556443..............", // 26
".........................4TTTT4444444456543.............", // 27
".........................44TT44444434423433.............", // 28
".........................444444444443443333.............", // 29
".........................344444444434544333.............", // 30
".........................344444443233334333.............", // 31
".........................344444434422222333.............", // 32
".........................n34444443444rr433..............", // 33
"......................nnnn3344444434334433..............", // 34
"...................MNNNNNNn334444444554433..............", // 35
"...................MNNNNNNNn3344444454433...............", // 36
"...................MNNNNNNNNn33344444433................", // 37
"...................MNNNNNNNNNn333333332.................", // 38
"...................MNNNNNNNNNNNnnnnnnn..................", // 39
"...................MNNNNNNNNNNNNNNNNn...................", // 40
"...................MNNNNNNNNNNNNNNNn....................", // 41
"....................MNNNNNNNNNNNNNn....................."  // 42
];
var LEG={ '1':P.p1,'2':P.p2,'3':P.p3,'4':P.p4,'5':P.p5,'6':P.l0, T:P.t5, h:P.s4, H:P.s5, j:P.s6, s:P.s3,
  w:P.s5, W:P.s4, i:P.w2, I:P.h1, r:P.d4, M:P.q4, N:P.q3, n:P.q2 };
function stamp(b,rows,leg){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch==='.'||ch===' ') continue; var c=leg[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x,y,c); } } }
function putList(b,list){ for (var i=0;i<list.length;i++) b.px(list[i][0],list[i][1],LEG[list[i][2]]); }
// ---- Kopftuch: Licht wie auf einer Kugel (links oben), Falten laufen zum Knoten im Nacken
var SC=[P.b1,P.b2,P.b3,P.b4,P.b5];
var OUT=[[42,13.5],[41.6,11],[40,8.5],[37,6.4],[33,5.2],[27,5],[21,5.6],[17,7.6],[14,10.6],[12.2,14.5],[11.6,19],[12,24],[13,28],[14,31],[15,35.5],[18,37.2],[21,36.4],[23.5,35],[25.8,33],
  [25,30],[24.6,26],[24.8,22],[25.6,18.5],[27.2,15.6],[29.5,14.3],[35,13.7]];
function tone(x,y){ var nx=(x+0.5-28)/16, ny=(y+0.5-17)/17, d=1-nx*nx-ny*ny, nz=d>0?Math.sqrt(d):0; return 0.75+(-0.5*nx-0.66*ny+0.56*nz)*2.9; }
function fold(b,x0,y0,x1,y1,w){ var dx=x1-x0, dy=y1-y0, L=Math.sqrt(dx*dx+dy*dy), nx=-dy/L*w/2, ny=dx/L*w/2;
  b.poly([[x0+nx,y0+ny],[x1,y1],[x0-nx,y0-ny]],function(x,y){ return M.DN[b.get(x,y)]; });
  b.line(Math.round(x0+nx*1.6),Math.round(y0+ny*1.6),Math.round(x1+nx*0.8),Math.round(y1+ny*0.8),function(x,y){ var c=b.get(x,y); return (c===M.T||c===P.b5)?c:M.UP[c]; }); }
function scarf(b){
  b.poly(OUT,function(x,y){ return SC[Math.max(0,Math.min(4,Math.round(tone(x,y))))]; });
  // Falten: oben glatt, vom Knoten fächern keilförmige Schattenbahnen nach oben und vorn
  fold(b,13.5,30.5,14.5,15,2.2); fold(b,15,31.5,23,9,3.2); fold(b,17.5,32.5,30.5,7.5,3); fold(b,20.5,33.5,36,10,2.6); fold(b,22.5,33.8,26,24,2);
}
// Saum um das Gesicht: heller Umschlag, darunter ein feiner Schatten auf der Stirn
function hem(b){
  b.line(30,13,41,13,P.b4); b.line(28,14,29,14,P.b4); b.line(27,15,27,15,P.b4); b.line(26,16,26,18,P.b4); b.line(25,19,25,24,P.b3); b.line(25,25,25,32,P.b2);
  b.line(31,12,40,12,P.b5); b.line(42,13,42,13,P.b3);
  b.px(26,15,P.b3); b.px(25,18,P.b3);
}
// Knoten im Nacken und die beiden herabhängenden Enden
function knot(b){
  b.poly([[8.5,37],[11,36],[13.5,37],[14,42],[13,48],[10,49],[8,46.5]],function(x,y){ return x<10?P.b2:(y>44?P.b1:P.b2); });
  b.line(10,38,10,47,P.b3); b.line(12,38,12,46,P.b1);
  b.poly([[13,37],[15.5,36],[17.5,38],[17,45],[15,46],[14,42]],P.b1); b.line(15,37,16,43,P.b2);
  b.ellipse(13.5,34,3.6,3.1,function(x,y){ return (x+y<45)?P.b3:P.b2; }); b.px(12,32,P.b4); b.px(13,32,P.b4); b.line(14,36,16,34,P.b1);
  b.ellipse(10.5,36.3,2.4,2,P.b2); b.px(10,35,P.b3);
}
// ---- Kleidung: geblümte Bluse (runder Kragen, Ärmel an den Schultern), dunkelgrüne Strickweste mit V-Ausschnitt und Knöpfen
function flower(x,y){ var k=((x*7+y*13)%23+23)%23; if (k===0) return P.d4; if (k===11) return P.d3; if (k===5) return P.g4; if (k===17) return P.b3; return P.s5; }
function blouse(b){
  b.poly([[2,64],[2.5,55],[4.5,50],[8,46],[13,43],[19,41.2],[34,41.6],[41,43],[47,45.5],[51,49.5],[53.5,55],[54,64]],function(x,y){ var c=flower(x,y); if (c===P.s5 && (x>47 || y>58 && x<6)) return P.s4; return c; });
}
var KN=[P.g1,P.g2,P.g3,P.g4];
function vest(b){
  var knit=function(lo){ return function(x,y){ var v=lo+((x&1)?0:1); if (x<11 && y<52) v++; if (x>40) v=Math.min(v,lo); return KN[Math.max(0,Math.min(3,v))]; }; };
  b.poly([[6,64],[6.5,54],[8.5,48],[12,44.5],[17,42.6],[21,43],[25,48],[29.5,56],[30,64]],knit(1));
  b.poly([[31,64],[31,56],[33.5,50],[35.5,43.2],[40,43.5],[45,45.5],[47.5,50],[48.5,56],[49,64]],knit(0));
  b.line(8,48,7,63,P.g1); b.line(47,50,48,63,P.g1);
  b.line(21,43,29,55,P.g4); b.line(35,44,32,54,P.g2);
  b.line(30,56,30,64,P.g1); [[31,57],[31,62]].forEach(function(q){ b.px(q[0],q[1],P.y2); b.px(q[0],q[1]-1,P.y3); });
}
function collar(b){
  b.poly([[15.5,43],[16.5,38.6],[19.5,37.8],[22,39.5],[21.5,42.5]],P.s4); b.line(17,39,19,38,P.s5); b.line(20,39,21,41,P.s3);
  b.poly([[18,41],[21.5,41.6],[25,43.5],[26.5,46.5],[23,47],[19.5,45]],P.s5); b.line(19,41,24,43,P.s6); b.line(22,47,26,46,P.s3); b.px(22,44,P.d4);
  b.poly([[34.5,41.6],[37.5,42],[39,44],[37,46],[34,45.5]],P.s4); b.line(35,42,37,42,P.s5); b.line(35,45,37,45,P.s3);
}
var MOUTH_O=[[35,32,'1'],[36,32,'1'],[37,32,'w'],[38,32,'1'],[39,32,'2'],[35,33,'2'],[36,33,'1'],[37,33,'1'],[38,33,'2'],[36,34,'r'],[37,34,'r'],[38,34,'3']];
var EYES_B=[[30,22,'3'],[31,22,'2'],[32,22,'2'],[33,22,'3'],[30,21,'4'],[31,21,'4'],[32,21,'4'],[33,21,'3'],[37,22,'2'],[38,22,'2'],[39,22,'3'],[38,21,'4']];
function paint(b,v){
  blouse(b); vest(b); knot(b);
  scarf(b);
  stamp(b,FACE,LEG);
  if (v.mouth) putList(b,MOUTH_O);
  if (v.eyes) putList(b,EYES_B);
  hem(b); collar(b);
  M.outline(b,P.k1);
}
M.definePortrait('hajra',{ paint:paint });
})(M);
