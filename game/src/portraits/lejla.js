/* ===== portraits/lejla.js — Lejla Kadić (16), Eminas Enkelin
   Junges, glattes Gesicht, große dunkle Augen mit kräftigem Lidstrich, eine Braue etwas höher (schlagfertig), voller Mund mit
   einem Mundwinkel nach oben; langes dunkles Haar mit Seitenpony, hoch zum Pferdeschwanz gebunden, große goldene Creolen;
   weiße Kapuzenjacke (offen, Kapuze im Nacken, Kordeln) über schwarzem Shirt.
   Legende HEAD: a–f Haar (h0 h1 h2 h3 w2 w3) · Ziffern Haut (p-Rampe) · M N n Hals (q4 q3 q2) · B C Brauen · w W Augenweiß ·
   * Glanz · i Iris · I Wimpern/Pupille · L l R Lippen. Pferdeschwanz, Strähnen, Creole und Kleidung in Code, Kontur mit M.outline.
   Varianten: MOUTH und EYES als Flicken. */
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
".....................cdeeffeedddcb......................", // 6
"..................bcdeeffeeedddddcccb...................", // 7
"................bccdeeeeeddddddddcccbbb.................", // 8
"...............abccdddeeedddddcdddccbbba................", // 9
"..............abbccddddddddccdddddcccbbba...............", // 10
"..............abbcccdddddccccdccddedddccb...............", // 11
"..............aabbcccccccccccccddddeedddcb..............", // 12
"..............aabbbcccccccccccdddeefeddccb..............", // 13
"..............aabbbbcccccccccddeefedcccbba..............", // 14
"..............aabbbbbcccccccdeefedcccbb443..............", // 15
"..............aabbbbbccccccdeedccbb3445443..............", // 16
"..............aaabbbbbccccceedb345555CBBC3..............", // 17
"..............aaabbbbbcccbcdbCBBBBC5544CBC..............", // 18
"..............aaabbbbbccbbcb44554445554443..............", // 19
"..............aabbbbbcccbb3455444445544443..............", // 20
"..............aabbb34433cb45IIIIIII45IIII3..............", // 21
"..............aabbb4533344554ww*IiW45WiIw3..............", // 22
"..............aaabb45223455554Wiii4544ii43..............", // 23
"..............aaabb443234556554334555433443.............", // 24
"...............aabb343344556655555555444443.............", // 25
"...............aabb344344555555554445554443.............", // 26
"................abbb34434445555444444565543.............", // 27
"................abbbb4333444444444433234233.............", // 28
".................abbb333344444444444434333..............", // 29
".................abbNN33344444444444544433..............", // 30
"..................bbNNN334444444442LLLLL33..............", // 31
"...................bNNNN344444444431111233..............", // 32
"....................NNNNN3444444444lRRll43..............", // 33
"....................MMMNNN3444444444334443..............", // 34
"....................MMMNNNnn34444445554443..............", // 35
".....................MMMNNNNnn34445554433...............", // 36
".....................MMMNNNNNNnn344444332...............", // 37
".....................MMMNNNNNNNNnnnnnnnn................", // 38
".....................MMMNNNNNNNNNNNnn...................", // 39
".......................MMNNNNNNNnn......................", // 40
".......................MMNNNNNNNnn......................", // 41
".......................MMNNNNNNNnn......................", // 42
".......................MMNNNNNNNnn......................", // 43
".......................MMNNNNNNNnn......................", // 44
".......................MMNNNNNNNnn......................", // 45
".......................MMNNNNNNNnn......................"  // 46
];
var LEG={ a:P.h0, b:P.h1, c:P.h2, d:P.h3, e:P.w2, f:P.w3, '1':P.p1, '2':P.p2, '3':P.p3, '4':P.p4, '5':P.p5, '6':P.l0,
  M:P.q4, N:P.q3, n:P.q2, B:P.h1, C:P.h2, w:P.s6, W:P.s4, '*':P.l1, i:P.w1, I:P.h0, L:P.d4, l:P.d5, R:P.t5 };
function stamp(b,rows,leg){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch==='.'||ch===' ') continue; var c=leg[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x,y,c); } } }
function putList(b,list){ for (var i=0;i<list.length;i++) b.px(list[i][0],list[i][1],LEG[list[i][2]]); }
var HR=[P.h0,P.h1,P.h2,P.h3,P.w2,P.w3];
function lerpPath(path,y){ for (var i=0;i<path.length-1;i++){ var a=path[i], c=path[i+1]; if (y>=a[1] && y<=c[1]) return a[0]+(c[0]-a[0])*(y-a[1])/Math.max(0.001,c[1]-a[1]); } return path[path.length-1][0]; }
// Pferdeschwanz: vom Gummi am Hinterkopf in einem Bogen über den Rücken, Licht von links, Strähnen mit Glanz
function ponytail(b){
  var path=[[13,13],[9.5,17],[8,23],[8,30],[9,37],[10.5,44],[12,48]];
  for (var y=13;y<49;y++){ var cx=lerpPath(path,y), hw=y<20?3.2:(y<36?2.8:(2.8-(y-36)*0.17));
    for (var x=Math.floor(cx-hw);x<=Math.ceil(cx+hw);x++){ var dx=x+0.5-cx; if (Math.abs(dx)>hw) continue;
      var v=2-dx/hw*1.3, s=((y*0.55+dx*0.8)%2+2)%2; if (s<0.5) v-=0.8; if (dx<-hw+1.2 && y>15) v+=0.8; if (y>40) v-=0.5;
      b.px(x,y,HR[Math.max(0,Math.min(5,Math.round(v)))]); } }
  b.line(8,22,8,30,P.w3); b.line(7,25,7,29,P.h3);
}
// Strähnen: Seitenpony fällt von rechts oben nach links unten, Seitenhaar zieht zum Gummi
var STR=[[P.h3,[[26,14],[21,13],[16,12]]],[P.w2,[[25,11],[20,10],[16,11]]],[P.h3,[[25,18],[21,17],[17,15]]],[P.w2,[[24,16],[19,15],[16,14]]],[P.h0,[[24,20],[20,19],[17,17]]]];
function streaks(b){ STR.forEach(function(s){ var c=s[0], pts=s[1]; for (var i=0;i<pts.length-1;i++) b.line(pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],function(x,y){ var o=b.get(x,y); return HR.indexOf(o)>=0?c:o; }); }); }
function tie(b){ b.px(13,12,P.r2); b.px(14,12,P.r3); b.px(13,13,P.r1); b.px(14,13,P.r2); b.px(12,13,P.r2); b.px(14,11,P.r4); }
// große goldene Creole am Ohrläppchen
function hoop(b){
  for (var a=0;a<360;a+=6){ var r=a*Math.PI/180, x=Math.round(21.5+Math.cos(r)*3.1), y=Math.round(32.2+Math.sin(r)*3.3);
    var c=(Math.cos(r)<-0.2||Math.sin(r)<-0.5)?P.y4:(Math.sin(r)>0.4?P.y2:P.y3); b.px(x,y,c); }
  b.px(19,30,P.y5); b.px(21,28,P.y3);
}
// weiße Kapuzenjacke: Kapuze als Wulst im Nacken, offene Front mit schwarzem Shirt, Kordeln
function back(b){
  b.poly([[3,64],[3.5,58],[6,53],[11,49],[16,46.5],[21,45],[34,45.5],[40,46.5],[46,49],[50,53],[52,58],[52.5,64]],P.s5);
  b.poly([[3,60],[3.5,58],[6,53],[11,49],[15,47],[12,49.5],[8,53],[5,58]],P.s6);
  b.poly([[42,48],[46,49.5],[50,53],[52,58],[52.5,64],[45,64],[44,56]],P.s4);
  b.line(45,52,46,63,P.s3); b.line(10,55,11,63,P.s4);
  // Kapuze hinter dem Hals
  b.poly([[10.5,47],[12,41],[15.5,37.5],[20,36.5],[22,40],[21.5,45.5],[16,47.5]],P.s5);
  b.line(13,41,16,38,P.s6); b.line(12,43,14,40,P.s6); b.line(16,44,20,41,P.s4); b.line(15,46,21,43,P.s3);
  b.poly([[34,41.5],[37,38.5],[40,39],[41,43],[39,47],[35,46]],P.s4); b.line(37,39,39,39,P.s5); b.line(36,44,39,42,P.s3);
}
function front(b){
  // schwarzes Shirt im offenen Reißverschluss
  b.poly([[22,45],[26,46.5],[31,46.5],[34.5,45.5],[34,64],[26,64]],P.k2);
  b.line(23,45,26,46,P.m1); b.line(27,47,31,47,P.m1); b.line(32,46,34,45,P.m0);
  // Jackenkanten mit Reißverschluss
  b.poly([[17,47],[21,45],[23,46],[24.5,52],[25.5,64],[22,64],[20,53]],P.s6); b.line(24,47,25,63,P.s3); b.line(21,50,22,63,P.s5);
  b.poly([[34.5,45.8],[37,46],[37.5,52],[37,64],[34,64],[34,52]],P.s4); b.line(34,47,34,63,P.s3); b.line(36,48,36,63,P.s5);
  // Kordeln mit Metallenden
  b.line(25,47,26,57,P.s3); b.line(26,47,27,56,P.s5); b.px(26,58,P.m3); b.px(26,59,P.m1);
  b.line(33,47,33,56,P.s3); b.px(33,57,P.m3); b.px(33,58,P.m1);
}
var MOUTH_O=[[34,31,'3'],[35,32,'1'],[36,32,'w'],[37,32,'w'],[38,32,'1'],[39,32,'2'],[35,33,'1'],[36,33,'1'],[37,33,'1'],[38,33,'2'],[35,34,'l'],[36,34,'R'],[37,34,'l'],[38,34,'l'],[39,34,'4']];
var EYES_B=[[28,21,'4'],[29,21,'4'],[30,21,'4'],[31,21,'4'],[32,21,'4'],[33,21,'4'],[34,21,'4'],[28,22,'I'],[29,22,'I'],[30,22,'I'],[31,22,'I'],[32,22,'I'],[33,22,'I'],[34,22,'2'],[30,23,'5'],[31,23,'5'],[32,23,'5'],[33,23,'4'],
  [37,21,'4'],[38,21,'4'],[39,21,'4'],[40,21,'4'],[37,22,'I'],[38,22,'I'],[39,22,'I'],[40,22,'2'],[38,23,'4'],[39,23,'4']];
function paint(b,v){
  back(b); ponytail(b);
  stamp(b,HEAD,LEG); streaks(b); tie(b);
  if (v.mouth) putList(b,MOUTH_O);
  if (v.eyes) putList(b,EYES_B);
  front(b); hoop(b);
  M.outline(b,P.k1);
}
M.definePortrait('lejla',{ paint:paint });
})(M);
