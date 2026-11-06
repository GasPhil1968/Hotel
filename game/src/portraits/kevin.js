/* ===== portraits/kevin.js — Kevin (26), Pfleger im Haus am Bavariapark (Kapitel 4, München)
   Groß und kräftig: junges, offenes Gesicht mit festem Kinn und kräftigem Hals, glatt rasiert, wache braune Augen, gerade Brauen,
   ein freundlicher Zug um den Mund; kurzes dunkles Haar mit Gel nach vorn oben zu Spitzen gekämmt (glänzt), ein kleiner silberner
   Ohrstecker im nahen Ohrläppchen. Hellgrüner Kasack mit V-Ausschnitt und Namensschild. Freundlich, praktisch.
   Gesicht nach der Grundform von portraits/dino.js (junger Mann), ohne Bart; Haar, Ohrstecker und Kasack in Code.
   Legende HEAD: Ziffern Haut (1–6 p0–p5) · h Haarfläche (Textur in Code) · x y Brauen (h0 h1) · w W Augenweiß · L Glanz · i Iris ·
   k Pupille · z Wimpern. Varianten: MOUTH und EYES als Flicken. */
(function(M){
'use strict';
var P=M.P;
var HEAD=[
//          1111111111222222222233333333334444444444555555
//01234567890123456789012345678901234567890123456789012345
 "........................................................", // 0
 "........................................................", // 1
 ".............................h..........................", // 2
 ".......................h....hh....hh....................", // 3
 "......................hhh..hhhh..hhh..h.................", // 4
 "...................hhhhhhhhhhhhhhhhhhhh.................", // 5
 "..................hhhhhhhhhhhhhhhhhhhhhh................", // 6
 ".................h.hhhhhhhhhhhhhhhhh..hh................", // 7
 "..................hhhhhhhhhhhhhhhhhhhh..................", // 8
 ".................hhhhhhhhhhhhhhhhhhhhhh.................", // 9
 "................hhhhhhhhhhhhhhhhhhhhhhhh................", // 10
 "................hhhhhhhhhhhhhhhhhhhhhhhhh...............", // 11
 "...............hhhhhhhhhhhhhhhhhhhh45554................", // 12
 "...............hhhhhhhhhhhhhhhh4566665544...............", // 13
 "...............hhhhhhhhhhhhhhh45666665543...............", // 14
 "...............hhhhhhhhhhhhhh456666665543...............", // 15
 "...............hhhhhhhhhhhhh456666666666643.............", // 16
 "...............hhhhhhhhhhhh45666666555544443............", // 17
 "...............hhhhhhhhhhhh5yxxxxy45yxxxy43.............", // 18
 "...............hhhhh454hhh444yyyy4454444443.............", // 19
 "...............hhhh45543hh43zzzzz4564zzzz43.............", // 20
 "...............hhhh54332h443WwiLi3563wiL343.............", // 21
 "...............hhhh53142544454iki45645ik443.............", // 22
 "...............hhhh5314355545555555665554443............", // 23
 "...............hhhh5323355566665555665555443............", // 24
 "................hhh4432355666655555665555443............", // 25
 "................hhh354334555555554456665543.............", // 26
 ".................hh445434455555444345566543.............", // 27
 ".................hh444433445555444334554433.............", // 28
 "..................h443343445555543432234434.............", // 29
 "...................433344455555553434444433.............", // 30
 "....................33344455555554323333243.............", // 31
 ".....................334455555555444111133..............", // 32
 "......................33445555555544466543..............", // 33
 "......................33344555555544333343..............", // 34
 ".......................333445555555566543...............", // 35
 ".......................33334445555555543................", // 36
 "........................333334444444343.................", // 37
 "......................33333333333333333.................", // 38
 "......................33333332222222222.................", // 39
 "......................3333433333222222..................", // 40
 "......................33334333333222222.................", // 41
 "......................33334433333322.22.................", // 42
 "......................333344333333223...................", // 43
 "......................3333444333333223..................", // 44
];
var LEG={ '1':P.p0, '2':P.p1, '3':P.p2, '4':P.p3, '5':P.p4, '6':P.p5, h:P.h2, x:P.h0, y:P.h1,
  w:P.s6, W:P.s5, L:P.l1, i:P.w2, k:P.h0, z:P.h0 };
function stamp(b,rows,leg){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch==='.'||ch===' ') continue; var c=leg[ch]; if (c===undefined) throw new Error('Legende ohne '+ch); b.px(x,y,c); } } }
function putList(b,list){ for (var i=0;i<list.length;i++) b.px(list[i][0],list[i][1],LEG[list[i][2]]); }
// Haar mit Gel: dunkel, Licht von links oben, glänzende Strähnen nach vorn oben, die Spitzen heller
function hair(b){ var TONE=[P.h0,P.h1,P.h2,P.h3];
  for (var y=0;y<HEAD.length;y++) for (var x=0;x<HEAD[y].length;x++){ if (HEAD[y][x]!=='h') continue;
    var nx=(x+0.5-28)/13, ny=(y+0.5-16)/13, d=1-nx*nx-ny*ny, nz=d>0?Math.sqrt(d):0, l=-0.5*nx-0.66*ny+0.56*nz;
    var v=0.9+l*1.6+(M.hash(x*1.9+5,y*2.3+7)-0.5)*0.5, c=TONE[Math.max(0,Math.min(3,Math.round(v)))];
    var skin=function(ch){ return ch>='1'&&ch<='6'; }, edge=skin(HEAD[y][x+1])||(HEAD[y+1]&&skin(HEAD[y+1][x])); if (edge && M.hash(x*3.1,y*1.7)<0.35) c=P.h3;
    b.px(x,y,c); }
  // Glanz des Gels: kurze Strähnen schräg nach vorn oben
  [[[20,12],[24,7]],[[23,11],[28,5]],[[27,10],[31,4]],[[31,10],[35,5]],[[35,11],[38,7]],[[18,17],[21,12]]].forEach(function(s){ b.line(s[0][0],s[0][1],s[1][0],s[1][1],function(x,y){ var o=b.get(x,y); return (o===P.h1||o===P.h2||o===P.h3)?((x+y)%3===0?P.w3:P.w2):o; }); });
  b.px(29,2,P.w3); b.px(28,3,P.w2); b.px(23,3,P.w2); b.px(34,3,P.w2); }
// Ohrstecker (silbern) im nahen Ohrläppchen
function stud(b){ b.px(20,26,P.s6); b.px(21,26,P.m3); b.px(20,27,P.m2); }
// hellgrüner Kasack: breite Schultern, V-Ausschnitt mit Paspel, Namensschild, eine Falte
function kasack(b){
  var base=function(x,y){ var c=P.a6; if (x<9 && y<55 && y-44<(9-x)) c=P.b5; if (x>42) c=P.a5; return c; };
  b.poly([[0,64],[0,56],[2,51],[7,47.6],[14,45.2],[21,44],[37,44],[44,45.4],[49,48],[52.6,52],[54.6,57],[55,64]],base);
  b.poly([[44,46],[49,48],[52.6,52],[54.6,57],[55,64],[46,64],[45,55]],P.a5); b.line(47,50,48,63,P.a4);
  b.line(3,53,7,48.6,P.s6); b.line(8,48,13,46,P.s6); b.line(10,54,11,63,P.a5); b.line(19,56,20,63,P.a5);
  // V-Ausschnitt: Haut (Brustbein im Schatten), Paspel dunkler
  b.poly([[23,44],[30,45],[37,44],[33,53],[30,57],[27,53]],P.p3); b.poly([[25,44.2],[30,45.2],[35,44.2],[31.6,51],[30,53.5],[28.4,51]],P.p4);
  b.line(30,46,30,52,P.p3); b.line(26,46,28,49,P.p5);
  b.line(23,44,30,57,P.a4); b.line(37,44,30,57,P.a4); b.line(24,44,30,55,P.a5);
  // Namensschild auf der nahen Brust
  b.rect(11,52,7,3,P.s6); b.hl(11,17,55,P.s3); b.hl(12,14,53,P.k2); b.px(16,53,P.n2); b.px(15,53,P.k2);
}
var MOUTH_O=[[36,32,'1'],[37,32,'W'],[38,32,'1'],[39,32,'1'],[36,33,'2'],[37,33,'1'],[38,33,'1'],[39,33,'2'],[36,34,'4'],[37,34,'6'],[38,34,'6'],[39,34,'5']];
var EYES_B=[[28,20,'4'],[29,20,'4'],[30,20,'4'],[31,20,'4'],[32,20,'4'],[28,21,'4'],[29,21,'z'],[30,21,'z'],[31,21,'z'],[32,21,'z'],[28,22,'5'],[29,22,'5'],[30,22,'5'],[31,22,'5'],[32,22,'5'],[37,20,'4'],[38,20,'4'],[39,20,'4'],[40,20,'4'],[37,21,'z'],[38,21,'z'],[39,21,'z'],[40,21,'4'],[37,22,'5'],[38,22,'5'],[39,22,'5'],[40,22,'4']];
function paint(b,v){
  kasack(b);
  stamp(b,HEAD,LEG); hair(b); stud(b);
  if (v.mouth) putList(b,MOUTH_O);
  if (v.eyes) putList(b,EYES_B);
  M.outline(b,P.k1);
}
M.definePortrait('kevin',{ paint:paint });
})(M);
