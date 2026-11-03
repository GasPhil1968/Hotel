/* ===== portraits/amra.js — Amra Begović (31), Restauratorin
   Weißer Bauhelm mit Schirm und Mittelrippe, dunkle Locken darunter (hinten bis zur Schulter, vorn an der Schläfe),
   schmale dunkle Brille, gehobene Brauen, leichtes Lächeln; rote Funktionsjacke mit Stehkragen, Reißverschluss und
   dunkler Schulterpasse; begeistert, aber ruhig.
   Varianten: EYES (Lid zu) und MOUTH (Lippen geöffnet, Zähne) werden über das Grundbild gelegt.
   Legende: 1 2 3 4 5 Haut · a b c d e Locken · u W w U 6 Helm und Augenweiß · 8 7 9 j Brille und Schulterpasse ·
   A B C D E Jacke · h i f Lippen und Wangen · g Ohrstecker · k Kontur */
(function(M){
'use strict';
var P=M.P;
// Pixelkarten 56 × 64: jedes Zeichen ist ein Pixel, "." bleibt durchsichtig. In den Flicken (Varianten) heißt " " unverändert.
var L={"1":P.p1, "2":P.p2, "3":P.p3, "4":P.p4, "5":P.p5, "6":P.m3, "7":P.m2, "8":P.m1, "9":P.k2, "A":P.r0, "a":P.h0, "B":P.r1, "b":P.h1, "C":P.r2, "c":P.h2, "D":P.r3, "d":P.h3, "E":P.r4, "e":P.w2, "f":P.d5, "g":P.y3, "h":P.d3, "i":P.d4, "j":P.m4, "k":P.k1, "U":P.l1, "u":P.s4, "W":P.s5, "w":P.s6};
var BASE=[
"........................................................",
"........................................................",
"........................................................",
".......................kkkkkkkkkkkkk....................",
".....................kkwwUUUUUuuuuuukk..................",
"...................kkwwUUuuuuuWWWWWUuuk.................",
"..................kwUUUuuwwwwwWWWWWWuuUk................",
".................kUUUuuwwwwwwWWWWWWWuuuUk...............",
"................kUUUuUUwwwwwwWWWWWWWuuu6Uk..............",
"...............kwUUuUwwwwwwwWWWWWWWuuuu6U6k.............",
"...............kUwuwwwwwwwwWWWWWWWuuuuu66U7k............",
"..............kwUuwwwwwwwWWWWWWWWuuuuu666U7k............",
"..............kUwuwwwwwwWWWWWWWWuuuuuu6667U7k...........",
"..............kUuwwwwWWWWWWWWWWuuuuuu66667U7k...........",
".............kcWuWWWWWWWWWWWWWuuuuuu66667777kkkk........",
"............kbcWWWWWWWWWWWWWuuuuuu6666677777WWWWk.......",
"...........kdccwwwwWWWWWWWuuuuuuu6666677uuuu666k........",
"...........kbbbaaabwwwwWWWWWWWWWWWWWuuuu22kkkkk.........",
"..........kbbccabccccbcca44444444444422222k.............",
"........kkkbccdab5aaabcaa4444cbbbc4444cbc3k.............",
".......kbccdcddaa5bcbcca4455c44444c44c4443k.............",
".......kdccdbbbaa55cccaa44558888888848888k..............",
".......kcccbbccab55bbbb999998bbbbb2888bbbk..............",
".......kbcbbcccbc54b45b445448wwUae3848weak..............",
"........kkbccdbccb4453a445548Uuee348584ee2k.............",
"........kkbbabbbbb445144455447777774547777k.............",
".......kbbccbccccc4452444555554444444554433k............",
"......kdcccddcccccc444344555ff5444444455543k............",
"......kccccdacdababb4g334444444444443344543k............",
"......kcccabbbbbcbcc4433444444444443233212k.............",
".......kbdbcccbccccca33344444444443344333k..............",
"........kabccdbbcabba233444444444434444433k.............",
".......kbbccdbcccbccbb234444444442hDDDh233k.............",
"......kdcccddccccccccc1334444444431111233k..............",
".....kbcccdbbcdcaccbcc2234444444443ifi333k..............",
"......kcccbcccbbbbaaab213344444444433344k...............",
"......kbbcccddbcccaabb2223444444444455543k..............",
".......kkdcddaccccabcc2222344444444455443k..............",
".......kkbccaaaccabbcc222213444444444443k...............",
"......kbdcccabbbababbc33222123444444433k................",
"......kccccdbbccbbcbccEE2222212333332kk.................",
"......kbcccaacccccccEEE88E2222222DCCCCk.................",
".......kbbcbbccacabEEEEEE88DD222DDCCCCk.................",
"........kkcbccbbbbbEEEEEEDDDDDDADDCCCCk.................",
".........kbdcccccbcEEEEEEDDDDDDAjDCCCCkkkkkk............",
".........kccc6667777EEEEEDDDDDDA6DCCCDD88877kk..........",
".......kk666677777777DDDDDDDDDDADDCCDDD8888877kk........",
".....kk66777777777777DDDDDDDDDDADDDDDDD888888877k.......",
"....k66777777777778888DDDDDDDDDABDDDDDD8888888888k......",
"...k67777777778888DDDDDDDDDDDDDABDDDDDDDCCC8888888k.....",
"..k67777777888DDDDDDDDDDDDDDDDDABDDDDDDDCCCCCCC8888k....",
".k677777E88EEEDDDDDDDDDDDDDDDDDABDDDDDDDCCCCCCCCCC88k...",
"k77777788EEEEEDDDDDDDDDDDDDDDDDABDDDDDDDCCCCBCCCCCCC8k..",
"k777788EEEEEEEDBBDDDDDDDDDDDDDDABDDDDDDDCCCCBCCCCCCCCk..",
"k77E8EEEEEEEBBBEEDDDDDDDDDDDDDDABDDDDDDDCCCCBCCCCCCCCk..",
"7788EEEEEEBBEEEDDDDDDDDDDDDDDDABDDDDDDDDCCCCCBCCCCCCCCk.",
"E8EEEEEEBBEEEBDDDDDDDDDDDDDDDDABDDDDDDDDCCCCCBCCCCCCCCk.",
"EEEEEEEEEEEEEBDDDDDDDDDDDDDDDDABDDDDDDDDCCCCCBCCCCCCCCk.",
"EEEEEECEEEEEEBDDDDDDDDDDDDDDDDABDDDDDDDDCCCCCBCCCCCCCCk.",
"EEEEEECEEEEEEEBDDDDDDDDDDDDDDDABDDDDDDDDCCCCCBCCCCCCCCCk",
"EEEEEECEEEEEEEBDDDDDDDDDDDDDDDABDDDDDDDDCCCCCBCCCCCCCCCk",
"EEEEEEECEEEEEEBDDDDDDDDDDDDDDDABDDDDDDDDCCCCCCBCCCCCCCCk",
"EEEEEEECEEEEEEDBDDDDDDDDDDDDDDABDDDDDDDDCCCCCCBCCCCCCCCk",
"EEEEEEECEEEEEEDBDDDDDDDDDDDDDDABDDDDDDDDCCCCCCBCCCCCCCCk"];
var EYES={x:29,y:22,rows:[
"44444    444",
"2bbbb    bbb",
" 444      44"]};
var MOUTH={x:34,y:33,rows:[
" WW",
"21112",
" ifi"]};
function put(b,lg,rows,x0,y0){ for (var j=0;j<rows.length;j++){ var r=rows[j]; for (var i=0;i<r.length;i++){ var ch=r[i]; if (ch===' '||ch==='.') continue; var c=lg[ch]; if (c===undefined) throw new Error('Porträt-Legende ohne '+ch); b.px(x0+i,y0+j,c); } } }
function patch(b,lg,p){ if (p) put(b,lg,p.rows,p.x,p.y); }
M.definePortrait('amra',{ paint:function(b,v){
  put(b,L,BASE,0,0);
  if (v.mouth){ patch(b,L,MOUTH); }
  if (v.eyes){ patch(b,L,EYES); }
} });
})(M);
