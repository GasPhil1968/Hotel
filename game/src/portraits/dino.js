/* ===== portraits/dino.js — Dino (23), Brückenspringer an der Alten Brücke (Kapitel 3, Mostar)
   Drahtig: schmales, kantiges junges Gesicht, kurz rasiertes dunkles Haar (die Kopfform scheint durch), Dreitagebart,
   lebhafte braune Augen, die ferne Braue keck gehoben, ein schiefes halbes Lächeln. Rote Trainingsjacke mit weißer
   Paspel, Reißverschluss offen, darunter ein weißes Shirt. Frech und warm.
   Legende HEAD: Ziffern Haut (1–6 p0–p5) · h Haarfläche (Stoppelschnitt, Textur in Code) · x y Brauen (h0 h1) ·
   w W Augenweiß · L Glanz · i Iris · k Pupille · z Wimpern.
   Haar- und Barttextur, Jacke und Shirt in Code; Kontur mit M.outline. Varianten: MOUTH und EYES als Flicken. */
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
".......................hhhhhhhh.........................", // 5
"....................hhhhhhhhhhhhhh......................", // 6
"...................hhhhhhhhhhhhhhhhh....................", // 7
"..................hhhhhhhhhhhhhhhhhhhh..................", // 8
".................hhhhhhhhhhhhhhhhhhhhhh.................", // 9
"................hhhhhhhhhhhhhhhhhhhhhhhh................", // 10
"................hhhhhhhhhhhhhhhhhhhhhhhhh...............", // 11
"...............hhhhhhhhhhhhhhhhhhhh45554................", // 12
"...............hhhhhhhhhhhhhhhh4566665544...............", // 13
"...............hhhhhhhhhhhhhhh45666665543...............", // 14
"...............hhhhhhhhhhhhhh456666665543...............", // 15
"...............hhhhhhhhhhhhh456666666.yy43..............", // 16
"...............hhhhhhhhhhhh456666665yxxxy3..............", // 17
"...............hhhhhhhhhhhh5yxxxxy455444443.............", // 18
"...............hhhhh454hhh444yyyy4454444443.............", // 19
"...............hhhh45543hh43zzzzz4564zzzz43.............", // 20
"...............hhhh54332h443WwLki3563WLk343.............", // 21
"...............hhhh53142544454iii45645ii443.............", // 22
"...............hhhh5314355545555555665554443............", // 23
"...............hhhh5323355566665555665555443............", // 24
"................hhh4432355666655555665555443............", // 25
"................hhh354334555555554456665543.............", // 26
".................hh445434455555444345566543.............", // 27
".................hh444433445555444334554433.............", // 28
"..................h443343445555543432234434.............", // 29
"...................433344455555553434444433.............", // 30
"....................33344455555554323333443.............", // 31
".....................334455555555444222213..............", // 32
"......................33445555555544466543..............", // 33
"......................33344555555544333343..............", // 34
".......................333445555555566543...............", // 35
".......................33334445555555543................", // 36
"........................333334444444343.................", // 37
"........................33333333333333..................", // 38
"........................33333222222222..................", // 39
"........................33433333222.....................", // 40
"........................33433333322.....................", // 41
"........................334433333322....................", // 42
"........................3344333333223...................", // 43
"........................33444333333223.................."  // 44
];
var LEG={ '1':P.p0, '2':P.p1, '3':P.p2, '4':P.p3, '5':P.p4, '6':P.p5, h:P.h2, x:P.h0, y:P.h1,
  w:P.s6, W:P.s5, L:P.l1, i:P.w2, k:P.h0, z:P.h0, '7':P.l0 };
function stamp(b,rows,leg){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch==='.'||ch===' '||ch==='_') continue; var c=leg[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x,y,c); } } }
function putList(b,list){ for (var i=0;i<list.length;i++) b.px(list[i][0],list[i][1],LEG[list[i][2]]||P[list[i][2]]); }
// Stoppelschnitt: dunkle, feine Körnung über dem Schädel; oben links fällt Licht darauf, an den Rändern scheint Haut durch
var HAIRMASK=null;
function hair(b){
  if (!HAIRMASK){ HAIRMASK=[]; for (var y=0;y<HEAD.length;y++) for (var x=0;x<HEAD[y].length;x++) if (HEAD[y][x]==='h') HAIRMASK.push([x,y]); }
  var TONE=[P.h0,P.h1,P.h2,P.h3,P.w1];
  HAIRMASK.forEach(function(q){ var x=q[0], y=q[1];
    var nx=(x+0.5-28)/13, ny=(y+0.5-18)/13, d=1-nx*nx-ny*ny, nz=d>0?Math.sqrt(d):0, l=-0.5*nx-0.66*ny+0.56*nz;
    var v=0.9+l*1.8+(M.hash(x*1.9+5,y*2.3+7)-0.5)*0.7; var c=TONE[Math.max(0,Math.min(4,Math.round(v)))];
    // Haaransatz: einzelne Hautpixel scheinen durch
    var edge=(b.get(x+1,y)!==P.h2&&HEAD[y][x+1]!=='h'&&HEAD[y][x+1]!=='.')||(HEAD[y+1]&&HEAD[y+1][x]!=='h'&&HEAD[y+1][x]!=='.'&&HEAD[y+1][x]!==undefined);
    if (edge && M.hash(x*3.1,y*1.7)<0.5) c=P.p2;
    b.px(x,y,c); });
}
// Dreitagebart: im Bartbereich wird die Haut eine Stufe dunkler und kühler (Kern voll, Rand im Schachbrett),
// dazu eine sparsame dunkle Körnung; die Lippen bleiben frei
var BEARD=[[24.2,21],[25.6,25],[29.4,28.2],[33,29.2],[36,29.4],[41,29.2],[42.4,31],[41.8,35],[39.8,38.6],[35,39.8],[30,39.2],[26.6,36.6],[24,33],[22.8,28],[23.2,21]];
var TINT={}, GRAIN={};
TINT[P.p5]=P.q4; TINT[P.p4]=P.q3; TINT[P.p3]=P.q2; TINT[P.p2]=P.q1; TINT[P.p1]=P.q0;
GRAIN[P.p5]=P.q2; GRAIN[P.p4]=P.q1; GRAIN[P.p3]=P.h3; GRAIN[P.p2]=P.h2; GRAIN[P.p1]=P.h1;
var BMASK=null;
function stubble(b){
  if (!BMASK){ BMASK=new M.Buf(56,64,M.T); BMASK.poly(BEARD,1); }
  var inB=function(x,y){ return BMASK.get(x,y)===1; };
  for (var y=0;y<64;y++) for (var x=0;x<56;x++){ if (!inB(x,y)) continue; var c=b.get(x,y); if (TINT[c]===undefined) continue;
    if (y>=31&&y<=33&&x>=35&&x<=39) continue;
    var edge=!inB(x-1,y)||!inB(x+1,y)||!inB(x,y-1)||!inB(x,y+1)||!inB(x-2,y)||!inB(x,y-2);
    if (edge && ((x+y)&1)) continue;
    b.px(x,y,(M.hash(x*1.37+11,y*2.41+5)<0.09)?GRAIN[c]:TINT[c]); }
}
// rote Trainingsjacke, offen: Stehkragen umgeschlagen, weiße Paspel an Kragen und Reißverschlusskanten, weißes Shirt
function jacket(b){
  b.poly([[1,64],[1.4,56],[3.6,51],[8,47.6],[15,45.4],[22,44.2],[37,44.2],[43,45.4],[48,47.8],[51.4,51.6],[53.2,57],[54,64]],P.r2);
  b.poly([[1,58],[1.4,56],[3.6,51],[8,47.6],[13,46],[9,48.6],[5,52],[2.6,57]],P.r3);
  b.poly([[4,64],[5,58],[8,54],[13,51.6],[17,51.8],[16,58],[14,64]],P.r3);
  b.line(2,55,5,51,P.r4); b.line(6,50,10,47.6,P.r4);
  b.poly([[43,46],[48,47.8],[51.4,51.6],[53.2,57],[54,64],[45,64],[44,55]],P.r1);
  b.line(10,53,11,63,P.r1); b.line(17,55,18,63,P.r2); b.line(46,50,47,57,P.r0);
  // weißes Shirt zwischen den offenen Kanten
  b.poly([[24,44.6],[29,46],[34,46],[37,44.6],[36,64],[26,64]],function(x,y){ return (x>32)?P.s4:P.s5; });
  b.line(26,47,30,48,P.s3); b.line(30,48,35,47,P.s3);
  // Kragen: links umgeschlagen im Licht, rechts im Schatten
  b.poly([[19,44.4],[23,42],[26,43],[28.4,48],[27,51],[24,49]],P.r3); b.line(23,42,26,43,P.s5); b.line(26,43,28,48,P.s5);
  b.poly([[37,42.4],[40.6,44.4],[38.6,49],[36,50.6],[35.6,47]],P.r1); b.line(37,43,36,47,P.s4);
  // Vorderkanten mit Paspel und Zähnchen
  b.line(27,51,26,63,P.s5); b.line(28,51,27,63,P.m3); b.line(36,51,36,63,P.s4); b.line(35,51,35,63,P.m2);
  // Paspel auf der Schulternaht
  b.line(3,52,8,48,P.s5); b.line(8,48,14,46,P.s5); b.line(44,46,49,48.4,P.s3);
}
var MOUTH_O=[];
var EYES_B=[];
function paint(b,v){
  jacket(b);
  stamp(b,HEAD,LEG); hair(b); stubble(b);
  if (v.mouth) putList(b,MOUTH_O);
  if (v.eyes) putList(b,EYES_B);
  M.outline(b,P.k1);
}
M.definePortrait('dino',{ paint:paint });
})(M);
