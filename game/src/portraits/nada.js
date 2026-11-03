/* ===== portraits/nada.js — Nada Delić (61), Lanas Mutter (Kapitel 2, Sarajevo)
   Schmales, müdes Gesicht; graues, kinnlanges glattes Haar (Bob mit Seitenscheitel, Ohr bedeckt, ferne Seite als Streifen
   hinter Schläfe und Wange); schwere Lider, tiefe Schatten unter den Augen, schmale Lippen mit leicht hängenden Winkeln,
   dünner Hals; dunkelgrauer Pullover mit Rundkragen. Verschlossen und würdevoll.
   Augenform (Lidstrich, Augenwinkel), Brauen (innen leicht gesenkt) und die graublaue Iris sind wie bei Mala angelegt
   (portraits/mala.js), dezent: älter, grauer, mit Lidfalte und Tränensäcken.
   Legende: Ziffern Haut (p-Rampe) · t müde Schatten (q3) · w v Augenweiß · i Iris · k Pupille · L Glanz · z Wimpern ·
   x y Brauen · a–d Haar (grau) · A–E Pullover.
   Gemalt als Pixelkarte MAP (56 × 64, ein Zeichen = ein Pixel, '.' = durchsichtig) mit Farblegende LEG;
   Varianten als kleine Flicken [y, x, zeichen] ('_' = Pixel bleibt): PATCH.mouth (spricht), PATCH.eyes (blinzelt).
   Licht von links oben (warm), Schatten und kühlere Töne rechts; die dunkle Kontur setzt M.outline. */
(function(M){
'use strict';
var P=M.P, T=M.T;
var LEG={"1":P.p0, "2":P.p1, "3":P.p2, "4":P.p3, "5":P.p4, "6":P.p5, t:P.q3, w:P.s5, v:P.s4, i:P.c3, k:P.n1, L:P.l1, x:P.s0, y:P.s1, z:P.h2, a:P.m1, b:P.m2, c:P.m3, d:P.m4, A:P.m0, B:P.m1, C:P.m2, D:P.m3, E:P.m4};
//          1111111111222222222233333333334444444444555555
//01234567890123456789012345678901234567890123456789012345
var MAP=[
 "........................................................", // 0
 "........................................................", // 1
 "........................................................", // 2
 "........................................................", // 3
 "........................................................", // 4
 ".......................ccccdcdccbc......................", // 5
 ".....................dcccccdccdcccbc....................", // 6
 "...................ddcccddcddccdccdcbc..................", // 7
 "..................ddccddcdcddcccdbcccbc.................", // 8
 ".................ddccdcccdccdcccccbcccbc................", // 9
 "................dddddcccccccdcbbccbccccbb...............", // 10
 "................ddddccccccccdcbbcccbccccab..............", // 11
 "...............ddddcccccccbbdcccbccbccccba..............", // 12
 "...............ddddcccccccbbdccbbbcbb554baa.............", // 13
 "..............ddddccccccccbbdccbbb455654baa.............", // 14
 "..............ddddccccccccbbdcc455666544bba.............", // 15
 "..............dddcccccccbcbbc45566665544bbaa............", // 16
 "..............dddcccccccbcbb455556655444bbaa............", // 17
 "..............dddccccccbbcb4555566555443bbba............", // 18
 "..............dddcccbbcbbcyxxx55665yxx43bbba............", // 19
 "..............dcccccbbcbb44555xy56y44443bbba............", // 20
 "..............dcccccbbcbb444ttt4564tt443bbba............", // 21
 "..............dcccccbbcbb43xzzzx45xzzx33bbba............", // 22
 "..............dcccccbbcbb4ywLkiw45ikvx33bbba............", // 23
 "..............ddccccbbcbb54wiiiw45iiv443bbba............", // 24
 "..............ddccccbbcbb554tt4455t44443bbba............", // 25
 "..............dcccccbbcbb5554tt456t44443bbba............", // 26
 "..............dcccccbbcbb56555t555654443bbba............", // 27
 "..............ccccbbbbccb565555455664343bbaa............", // 28
 "..............ccccbbbcccb555455532334443bbaa............", // 29
 "..............ccccbbbccbbc54455455654443bbaa............", // 30
 "..............ccccbbbccbbc54554556565443bbaa............", // 31
 "..............cccbbbacbbbb55555544444433aaaa............", // 32
 "...............cbbbbabbbab54555432223433aaa.............", // 33
 "...............bbbbbabbbaba455434555433..aa.............", // 34
 "...............bbbbbabbbaba455554334443.................", // 35
 "................bbbaabbaabaa4455565543..................", // 36
 ".................baaabbaabaab44555543...................", // 37
 "....................a..aaaaa33344443....................", // 38
 "..........................443323332.....................", // 39
 "..........................443322233.....................", // 40
 ".........................4443433333.....................", // 41
 ".........................4443444433.....................", // 42
 ".......................CD4443444433CB...................", // 43
 "......................CDCD4443443CDCB...................", // 44
 "...................CCCCCDCDCDCDCDCBBBBBB................", // 45
 "..............DDCCCCCCCCCBBBBBBBBBBBBBBBCCB.............", // 46
 "............DDDCCCCCCCCCCCCCCCCCCBBBBBBBBBCCCB..........", // 47
 "..........DDDDDCCCCCCBCCCCCCCCCCCBABBBBBBBBBBCCB........", // 48
 "........DBDDDDDCCCCCCBCCCCCCCCCCCBABBBBBBBBBBBBAB.......", // 49
 "......DECBCCCCCCCCCCCCBCCCCCCCCCCABBBBBBBBBBBBBABB......", // 50
 ".....EECCBCCCCCCCCCCCCBCCCCCCCCCBABBBBBBBBBBBBBABBB.....", // 51
 "....ECCCCBCCCCCCCCCCCCCBCCCCCCCCBABBBBBBBBBBBBBBABB.....", // 52
 "...ECCCCBCCCCCCCCCCCCCCBCCCCCCCCBBBBBBBBBBBBBABBABBB....", // 53
 "..DCCCCCBCCCCCCCCCCCCCCCCCCCCCCCBBBBBBBBBBBBABBBABBB....", // 54
 "..CCCCCCBCCCCCCCCCCCCCCCCCCCCCCBBBBBBBBBBBBABBBBABBBB...", // 55
 "..CCCCCCBCCCCCCCCCCCCCCCCCCCCCCBBBBBBBBBBBBABBBBBAAAA...", // 56
 ".CCCCCCCBCBCCCCCCCCCCCCCCCCCCCCBBBBBBBBBBBABABBBBAAAA...", // 57
 ".BBCCCCCBCCBBCCCCCCCCCCCCCCCCCCBBBBBBBBBBBBABBBBBAAAA...", // 58
 ".BBCCCCCBCCCCBCCCCCCCCCCCCCCCCBBBBBBBBBBBBBABBBBBAAAAA..", // 59
 ".BBCCCCBCCCBCCBBCCCCCCCCCCCCCCBBBBBBBBBBBBABBBBBBBAAAA..", // 60
 ".BBCCCCBCCCCBCCCBCCCCCCCCCCCCCBBBBBBBBBBBABBBBBBBBAAAA..", // 61
 ".BBCCCCBCCCCCBCCCCCCCCCCCCCCCCBBBBBBBBBBBABBBBBBBBAAAA..", // 62
 ".BBCCCCBCCCCCCBCCCCCCCCCCCCCCBBBBBBBBBBBABBBBBBBBBAAAA..", // 63
];
var PATCH={
  mouth:[[33,34,"v"], [34,32,"21112"], [35,31,"4_555"], [36,32,"444"]],
  eyes:[[22,26,"44ttt4__4tt4"], [23,26,"455554__5543"], [24,26,"3xzzx4__xzx3"]]
};
function put(b,list){ list.forEach(function(r){ var y=r[0], x0=r[1], str=r[2]; for (var i=0;i<str.length;i++){ var ch=str[i]; if (ch==='_') continue;
  if (ch==='.'){ if (x0+i>=0&&x0+i<b.w) b.d[y*b.w+x0+i]=T; } else b.px(x0+i,y,LEG[ch]); } }); }
function paint(b,v){
  for (var y=0;y<MAP.length;y++){ var r=MAP[y]; for (var x=0;x<r.length;x++){ var ch=r[x]; if (ch!=='.') b.px(x,y,LEG[ch]); } }
  if (v.mouth) put(b,PATCH.mouth);
  if (v.eyes) put(b,PATCH.eyes);
  M.outline(b,P.k1);
}
M.definePortrait('nada',{ paint:paint });
})(M);
