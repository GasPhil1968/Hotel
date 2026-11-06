/* ===== portraits/gerda.js — Gerda Lechner (Geist, † 3. September 2011, wirkt 84) (Kapitel 4, München)
   Klein und aufrecht: rundes, freundliches Gesicht mit rosigen Wangen und vielen Lachfältchen, weiße Löckchen schauen unter einem
   blauen Seidenkopftuch mit weißen Tupfen hervor (gegen den Wind, unter dem Kinn geknotet, wie in den Sechzigern); kamelfarbener
   Wintermantel mit breitem Kragen; am Bildrand angeschnitten die grüne Blech-Thermoskanne mit Becherdeckel.
   Aufbau nach portraits/jela.js (Kopftuch prozedural, Gesicht als Pixelkarte, Knoten unter dem Kinn), Farben und Ausdruck neu.
   In natürlichen Farben gemalt; das Spiel färbt Geister ein (M.ghostLut mit M.GHOST_OVR.gerda: Tuch bleibt blau, Tupfen weiß,
   Mantel helles Kamel, die Kanne bleibt deutlich grün). Varianten: MOUTH und EYES als Flicken. */
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
 "..........................344444444444444443............", // 19
 "..........................3443333444333443..............", // 20
 "..........................344IIIII44III443..............", // 21
 "..........................343WwiIW44wiI343..............", // 22
 "..........................34443i34544344433.............", // 23
 "..........................34654334554334443.............", // 24
 "..........................34555544455444443.............", // 25
 "..........................345555444456544433............", // 26
 "..........................3455544444456rr443............", // 27
 "..........................3444444444324rr343............", // 28
 "..........................34444444433321233.............", // 29
 "..........................3444444434443443..............", // 30
 "..........................3444444344444433..............", // 31
 "..........................3344443m4mmmm4m3..............", // 32
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
var LEG={ '1':P.q1, '2':P.q2, '3':P.q3, '4':P.q4, '5':P.p4, '6':P.p5, r:P.d5, h:P.s4, H:P.s5, j:P.s6, x:P.s3, y:P.s4, z:P.s3,
  w:P.s4, W:P.s3, i:P.c2, I:P.h1, m:P.q1, l:P.d4 };
function stamp(b,rows,leg){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch==='.'||ch===' ') continue; var c=leg[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x,y,c); } } }
function putList(b,list){ for (var i=0;i<list.length;i++) b.px(list[i][0],list[i][1],LEG[list[i][2]]); }
// ---- Kopftuch (braun, Baumwolle): Licht wie auf einer Kugel (links oben), Zugfalten laufen zum Knoten unter dem Kinn;
// hinten fällt es locker über Nacken und Schultern
var SC=[P.b0,P.b1,P.b2,P.b3,P.b4];
var OUT=[[41.5,13],[42,10],[40.5,7.5],[37,5.6],[32,4.5],[26,4.5],[20,5.6],[16,8.2],[13.2,12],[11.6,17],[11,23],[11.4,29],[12.2,34],[12.6,38.5],[11.6,42.5],[12,46.5],[15,47.6],
  [19,46],[23,43.6],[26.5,41.8],[30,40.4],[33,40],[37,39.6],[40.5,37.6],[43,34],[44.6,28],[45,22],[44.4,16.5],[43,13.6]];
function tone(x,y){ var nx=(x+0.5-27)/17, ny=(y+0.5-18)/19, d=1-nx*nx-ny*ny, nz=d>0?Math.sqrt(d):0; return 0.25+(-0.55*nx-0.6*ny+0.58*nz)*2.7; }
function fold(b,x0,y0,x1,y1,w){ var dx=x1-x0, dy=y1-y0, L=Math.sqrt(dx*dx+dy*dy), nx=-dy/L*w/2, ny=dx/L*w/2;
  b.poly([[x0+nx,y0+ny],[x1,y1],[x0-nx,y0-ny]],function(x,y){ var c=b.get(x,y); return SC.indexOf(c)>0?M.DN[c]:c; });
  b.line(Math.round(x0+nx*1.6),Math.round(y0+ny*1.6),Math.round(x1+nx*0.8),Math.round(y1+ny*0.8),function(x,y){ var c=b.get(x,y); return (SC.indexOf(c)<0||c===P.b4)?c:M.UP[c]; }); }
function dots(b){ var D=[[19,9],[25,6],[31,6],[36,9],[16,15],[22,13],[28,10],[34,12],[39,10],[14,22],[19,19],[13,29],[18,26],[15,35],[21,40],[14,42],[17,46],[31,44],[37,44],[24,33]];
  D.forEach(function(q){ var c=b.get(q[0],q[1]); if ([P.b0,P.b1,P.b2,P.b3,P.b4].indexOf(c)<0) return; b.px(q[0],q[1],P.s6); if (c!==P.b4) b.px(q[0]+1,q[1],P.s5); }); }
function scarf(b){
  b.poly(OUT,function(x,y){ return SC[Math.max(0,Math.min(4,Math.round(tone(x,y))))]; });
  fold(b,30,39,17,8.5,2.6); fold(b,28,39.5,12.5,21,2.4); fold(b,33,39,27,6,1.8); fold(b,25,41.5,12.5,35,2.2); fold(b,22,43.5,13,45,1.6);
}
// Saum um das Gesicht: das Tuch steht über der Stirn etwas vor (Schatten darunter), nur auf der Lichtseite eine helle Kante
function hem(b){
  b.line(28,13,40,13,P.b2); b.line(29,12,34,12,P.b3); b.px(27,13,P.b1); b.px(41,13,P.b1);
  b.line(25,14,25,31,P.b2); b.line(24,15,24,24,P.b3); b.px(25,13,P.b1);
  b.line(26,32,27,34,P.b1); b.line(28,35,29,36,P.b1);
  b.line(42,15,42,24,P.b0); b.line(42,29,42,32,P.b0);
}
// Knoten unter dem Kinn und die zwei kurzen, breiten Zipfel
function knot(b){
  b.poly([[29.5,40.5],[32.6,40],[32.8,43.5],[30.6,46],[28.6,44.4]],P.b2); b.line(30,42,30,45,P.b3); b.px(29,44,P.b1);
  b.poly([[35,40.2],[38,40],[40,43.6],[38.6,46.2],[36.5,44]],P.b1); b.line(37,41,39,44,P.b2);
  b.ellipse(34.3,39.6,3.3,2.3,function(x,y){ return (x<34&&y<40)?P.b3:(x>36?P.b1:P.b2); }); b.px(32,38,P.b3); b.px(33,38,P.b3); b.line(34,41,36,40,P.b0); b.px(34,39,P.b1);
}
// Zipfel hinten im Nacken (über der Weste)
function tail(b){
  b.poly([[11.6,40],[17,40.5],[22,43.5],[17.5,51],[13.5,48],[11.5,44]],function(x,y){ return x<15?P.b2:P.b1; }); b.line(15,43,16,49,P.b0); b.line(13,42,14,47,P.b3);
}
// ---- Kleidung (Farben wie die Spielfigur): graue, klein getupfte Bluse mit rundem Kragen; dunkle Strickweste mit V-Ausschnitt
// kamelfarbener Wintermantel mit breitem Kragen; vorn rechts angeschnitten die grüne Thermoskanne
var KN=[P.w2,P.w3,P.w4,P.w5];
function coat(b){
  var cl=function(lo){ return function(x,y){ var v=lo; if (x<12 && y<54) v++; if (x>41) v=Math.min(v,lo-1); return KN[Math.max(0,Math.min(3,v))]; }; };
  b.poly([[2,64],[2.5,56],[5,50.5],[9,47],[15,44.5],[22,43],[34,43],[41,44.5],[47,47],[51,51],[53.5,56],[54,64]],cl(2));
  b.poly([[4,52],[9,46.6],[16,44],[23,46],[27,52],[25,57],[18,53],[10,55]],cl(3)); b.line(16,44,26,52,P.w2); b.line(10,55,18,53,P.w2);
  b.poly([[37,44],[44,45.5],[48,49],[42,54],[36,51]],cl(1)); b.line(37,45,40,52,P.w2);
  b.line(29,55,29,64,P.w2); b.px(31,58,P.w1); b.px(31,62,P.w1);
}
function kanne(b){ var c=function(x){ return x<45?P.g4:(x<48?P.g3:P.g2); };
  for (var y=50;y<64;y++) for (var x=42;x<=50;x++) b.px(x,y,c(x));
  b.hl(41,51,48,P.g5); b.hl(41,51,49,P.g4); b.hl(41,51,47,P.g3); b.hl(42,50,46,P.g4); b.hl(42,50,51,P.m4); b.hl(42,50,52,P.m3);
  b.vl(43,53,63,P.g5); b.px(46,57,P.g5); }
var MOUTH_O=[[34,32,'1'],[35,32,'1'],[36,32,'W'],[37,32,'1'],[38,32,'2'],[34,33,'2'],[35,33,'1'],[36,33,'1'],[37,33,'2'],[35,34,'l'],[36,34,'l'],[37,34,'3']];
var EYES_B=[[29,21,'3'],[30,21,'3'],[31,21,'3'],[32,21,'3'],[33,21,'3'],[29,22,'I'],[30,22,'I'],[31,22,'I'],[32,22,'I'],[33,22,'2'],
  [36,21,'3'],[37,21,'3'],[38,21,'3'],[36,22,'I'],[37,22,'I'],[38,22,'2']];
function paint(b,v){
  coat(b); tail(b);
  scarf(b);
  stamp(b,HEAD,LEG);
  if (v.mouth) putList(b,MOUTH_O);
  if (v.eyes) putList(b,EYES_B);
  hem(b); knot(b); dots(b); kanne(b);
  M.outline(b,P.k1);
}
M.definePortrait('gerda',{ paint:paint });
// im Spiel ein Geist: Porträt in seiner Geisterfarbe (M.ghostLut)
if (M.PORTRAIT_GHOSTS) M.PORTRAIT_GHOSTS.gerda=true;
})(M);
