/* ===== portraits/zlata.js — Zlata Brkić (74), Bäuerin in Skela (Kapitel 3, Mostar)
   Klein und kräftig: rundes, faltiges Gesicht mit geröteten Wangen (Krähenfüße, Tränensäcke, tiefe Nasolabialfalten,
   schmaler, streng zusammengezogener Mund mit Fältchen), wache dunkle Augen; ein einfaches dunkelblaues Kopftuch,
   im Nacken gebunden, darunter an der Schläfe ein wenig graues Haar. Graue Strickjacke über einem karierten Kleid.
   Aufbau: Kopftuch prozedural (Kugel-Licht von links oben, Falten zum Knoten), Gesicht als Pixelkarte FACE,
   Saum des Tuchs darüber, Knoten, Kleidung, Kontur mit M.outline.
   Legende FACE: Ziffern Haut (p-Rampe 1–6 = p0–p5) · T Wangenröte (t5) · h H graues Haar (s4 s5) · S s Brauen (s2 s3) ·
   w W Augenweiß · i Iris · I Wimpern und Pupille · r Unterlippe. Varianten: MOUTH und EYES als Flicken. */
(function(M){
'use strict';
var P=M.P;
var FACE=[
//          1111111111222222222233333333334444444444555555
//01234567890123456789012345678901234567890123456789012345
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
"........................................................", // 14
"...........................h455555555554433.............", // 15
"..........................Hh455444445555443.............", // 16
"..........................h4555554455554443.............", // 17
".........................445SsssS555SssS4443............", // 18
".........................4443444444544444443............", // 19
".........................433IIII3454III34443............", // 20
".........................443WiIw3453WiI34443............", // 21
".........................4344334455443344443............", // 22
".........................45434555565544554433...........", // 23
".........................455TT555566554TT4443...........", // 24
".........................4TTT55545566654TT443...........", // 25
".........................4TT55543445556544443...........", // 26
".........................44555434332234334443...........", // 27
".........................44555553443444433443...........", // 28
".........................44455553444444443443...........", // 29
".........................4444554343343343343............", // 30
".........................3444454332222223343............", // 31
".........................3444444323rrr433443............", // 32
".........................334444344333334443.............", // 33
".........................334443455555544443.............", // 34
".........................13344345565544443..............", // 35
"........................12333444455554443...............", // 36
"......................111222222444442222................", // 37
"....................1111222222222222222.................", // 38
"....................1122222222211111112.................", // 39
"....................112222222221111112..................", // 40
"....................11222222222111112...................", // 41
"....................1122222222221111...................."  // 42
];
var LEG={ '1':P.p1,'2':P.p2,'3':P.p3,'4':P.p4,'5':P.p5,'6':P.l0, T:P.t5, h:P.s4, H:P.s5, S:P.s2, s:P.s3,
  w:P.s5, W:P.s4, i:P.w1, I:P.h1, r:P.d4 };
function stamp(b,rows,leg){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch==='.'||ch===' ') continue; var c=leg[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x,y,c); } } }
function putList(b,list){ for (var i=0;i<list.length;i++) b.px(list[i][0],list[i][1],LEG[list[i][2]]); }
// ---- Kopftuch: dunkelblau, Licht wie auf einer Kugel (links oben), Falten laufen zum Knoten im Nacken
var SC=[P.n0,P.n1,P.n2,P.n3,P.n4];
var OUT=[[42.6,15.2],[42.2,12],[40.6,9],[37.6,6.6],[33,5.4],[27,5.2],[21,6],[16.8,8.2],[14,11.4],[12.6,15.4],[12.2,20],[12.8,25],[14,29.5],[15.6,33.2],[18,36],[21,37.2],[23.6,36.4],[25.4,34.6],[26.4,31.5],[25.4,28],[24.8,24],[25,20],[25.8,17.4],[27.4,15.8],[30,15],[36,14.8]];
function tone(x,y){ var nx=(x+0.5-28)/16, ny=(y+0.5-18)/16, d=1-nx*nx-ny*ny, nz=d>0?Math.sqrt(d):0; return 1.25+(-0.5*nx-0.66*ny+0.56*nz)*2.1; }
function fold(b,x0,y0,x1,y1,w){ var dx=x1-x0, dy=y1-y0, L=Math.sqrt(dx*dx+dy*dy), nx=-dy/L*w/2, ny=dx/L*w/2;
  b.poly([[x0+nx,y0+ny],[x1,y1],[x0-nx,y0-ny]],function(x,y){ return M.DN[b.get(x,y)]; });
  b.line(Math.round(x0+nx*1.6),Math.round(y0+ny*1.6),Math.round(x1+nx*0.8),Math.round(y1+ny*0.8),function(x,y){ var c=b.get(x,y); return (c===M.T||c===P.n4)?c:M.UP[c]; }); }
function scarf(b){
  b.poly(OUT,function(x,y){ return SC[Math.max(0,Math.min(4,Math.round(tone(x,y))))]; });
  // Falten: oben glatt, vom Knoten laufen breite Schattenbahnen nach oben und vorn
  fold(b,16,34,15.6,17,2.6); fold(b,18,35.6,25,9.5,3.2); fold(b,20.6,36.4,34,9,2.6); fold(b,23,36.2,30,22,2);
}
// Saum um das Gesicht: umgeschlagene Kante, tief in der Stirn; darunter ein Hauch graues Haar
function hem(b){
  b.line(31,14,41,14,P.n3); b.line(29,15,30,15,P.n3); b.px(28,15,P.n2); b.line(27,16,26,17,P.n3); b.line(26,18,25,19,P.n2); b.line(25,20,25,25,P.n2); b.line(25,26,25,31,P.n1);
  b.line(32,13,40,13,P.n4); b.px(42,14,P.n2); b.px(41,13,P.n3);
}
// Knoten im Nacken; darunter hängt die dritte Ecke des gefalteten Tuchs über den Rücken
function knot(b){
  b.poly([[10.6,39],[14,38],[19,39.6],[18.4,43.6],[15.6,47.6],[13,46.6],[11,43]],function(x,y){ return (x<14)?P.n2:P.n1; });
  b.line(14,40,15,46,P.n0); b.line(12,41,13,45,P.n3);
  b.poly([[11.6,36.6],[14,35.2],[15.6,37.4],[14.4,39.6],[11.8,39.6]],P.n2); b.px(12,37,P.n3); b.px(13,36,P.n3);
  b.ellipse(16.6,37.2,2.9,2.4,function(x,y){ return (x+y<53)?P.n3:P.n1; }); b.px(15,36,P.n4); b.line(17,39,19,37,P.n0);
}
// ---- Kleidung: kariertes Kleid (Kragen im Ausschnitt), graue Strickjacke mit V-Ausschnitt und Knöpfen
function dress(x,y){ var h=(y%3===0), v=(x%3===0); if (h&&v) return P.w1; if (h||v) return P.w3; return P.s4; }
var KN=[P.s0,P.s1,P.s2,P.s3];
function cardigan(b){
  var knit=function(lo){ return function(x,y){ var v=lo+((x&1)?0:1); if (x<12 && y<53) v++; if (x>42) v=Math.min(v,lo); return KN[Math.max(0,Math.min(3,v))]; }; };
  b.poly([[2,64],[2.4,55],[4.6,50],[8.6,46.4],[14,44],[20,42.6],[34,42.6],[41,44],[47,46.4],[51,50],[53.4,55],[54,64]],function(x,y){ return dress(x,y); });
  b.poly([[2,64],[2.4,55],[4.6,50],[8.6,46.4],[14,44],[20,42.6],[24,44],[27.6,50],[30,57],[30.4,64]],knit(1));
  b.poly([[31.6,64],[31.8,57],[34,50],[36.6,43],[41,44],[47,46.4],[51,50],[53.4,55],[54,64]],knit(0));
  b.line(8,49,7,63,P.s0); b.line(47,50,48,63,P.s0);
  b.line(24,44,30,57,P.s4); b.line(36,44,32,56,P.s1); b.line(30,58,30,64,P.s3);
  [[31,59],[31,63]].forEach(function(q){ b.px(q[0],q[1],P.m4); b.px(q[0],q[1]-1,P.s6); });
  // Kleidkragen: runder Ausschnitt mit Paspel
  b.line(25,44,29,45,P.w2); b.line(30,45,35,44,P.w2);
}
var MOUTH_O=[];
var EYES_B=[];
function paint(b,v){
  cardigan(b); knot(b);
  scarf(b);
  stamp(b,FACE,LEG);
  if (v.mouth) putList(b,MOUTH_O);
  if (v.eyes) putList(b,EYES_B);
  hem(b);
  M.outline(b,P.k1);
}
M.definePortrait('zlata',{ paint:paint });
})(M);
