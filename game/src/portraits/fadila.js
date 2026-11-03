/* ===== portraits/fadila.js — Fadila (50), Paketschalter
   Kurzes braunes Haar mit Seitenscheitel und schrägem Pony (erste graue Härchen an der Schläfe), kleine Ohrstecker,
   aufmerksamer, prüfender Blick unter geraden Brauen, fester Mund; blaue Dienstbluse mit spitzem Kragen unter einer
   pflaumenfarbenen Strickweste, Namensschild, Lesebrille an einer goldenen Kette auf der Brust; gründlich.
   Varianten: EYES (Lid zu) und MOUTH (Lippen geöffnet, Zähne) werden über das Grundbild gelegt.
   Legende: 1 2 3 4 5 6 Haut · A B C D E F 7 8 Haar · h 9 g I Augen · P Q R S U j Weste und Lippen ·
   a b c d e Bluse · m l i Brillenkette und Ohrstecker · f n o p Brille, Namensschild · k Kontur */
(function(M){
'use strict';
var P=M.P;
// Pixelkarten 56 × 64: jedes Zeichen ist ein Pixel, "." bleibt durchsichtig. In den Flicken (Varianten) heißt " " unverändert.
var L={"1":P.p1, "2":P.p2, "3":P.p3, "4":P.p4, "5":P.p5, "6":P.l0, "7":P.s2, "8":P.s3, "9":P.s5, "A":P.w0, "a":P.b0, "B":P.w1, "b":P.b1, "C":P.w2, "c":P.b2, "D":P.w3, "d":P.b3, "E":P.w4, "e":P.b4, "F":P.w5, "f":P.l1, "g":P.h0, "h":P.s4, "I":P.h1, "i":P.y4, "j":P.d5, "k":P.k1, "l":P.y3, "m":P.y2, "n":P.s6, "o":P.n2, "P":P.d0, "p":P.n4, "Q":P.d1, "R":P.d2, "S":P.d3, "U":P.d4};
var BASE=[
"........................................................",
"........................................................",
"........................................................",
".........................kkkkkkkkkk.....................",
"......................kkkDEEEDDDCDDkk...................",
"....................kkFEEEEEBBBDDCCCCk..................",
"...................kDFFFEEBBECDDDEDDCCkk................",
"..................kEEFFFEDDDDECDDDDCCCCAk...............",
".................kEEEEFFFEEEEEEEDDDCCBBBk...............",
"................kEEEEEDFFEEDDEEEDDDCCBBAAk..............",
"...............kEEEEFEDEEEEEDDDEEDBBCCCABBk.............",
"...............kEEEEFFDEEDDDDDDDDDCBBBBBBBk.............",
"...............kEEEEEEEDEDDDCDEDDBBCCBAABBk.............",
"..............kDFEEEEEEDEDDDDCCCDDDBCCAABBBk............",
"..............kEEEEDDCEDEDDDDCCBBBCDCBBBBBk.............",
"..............kEEDEDDCCDEDDDD554444444433Bk.............",
"..............kEEDEDCCCDEC5555444444444333k.............",
"..............kDEDEDCC7DC55554444444444333k.............",
".............kCDDDDCCDD8D55544444444444333k.............",
".............kCCDDCDCDCB4554BAAAAB444BAAB3k.............",
".............kBCDCBCCCBB455B43333334443333k.............",
".............kBBDBBCCCBB75543I33333443333k..............",
"..............kBCBBCCCBB45443IIIII2443II2k..............",
"..............kBBAABBBAA4544339fgC3449Cg3k..............",
"..............kBBBABBBAA455443hCC34454CC3k..............",
"..............kABBBBBBAAA55554333345544433k.............",
"..............kABBBBBBAAA556554444455544433k............",
"..............kABBBBBBAAA455554444444555543k............",
"...............kBBBABBAAA444444444443334543k............",
"...............kAAAAAAAAA44444444433233212k.............",
"................kAAAB3AA44444444433443333k..............",
".................kkkk34i444444444344444333k.............",
"....................k344444444444332UU2333k.............",
"....................k33444444444432111123k..............",
"....................k23344444444443UjUU33k..............",
"....................k2233444444444433334k...............",
"....................k22233444444444445554k..............",
"....................k22223344444444445543k..............",
"....................k3322233344444444443k...............",
"....................k33222223344444433kk................",
"....................k332222222333332kk..................",
"....................k3ee222222222kkkk...................",
"....................kedde33333333kcdck..................",
"....................kdldde33333333cmddk.................",
"..............kkkkkkcdldddee33333ccmckkkkk..............",
".........kkkkkcccccRS3lddddde333cccmcccccckkk...........",
".......kkeedcccccRRRR3dlddddde3cccccmRQRRRccckk.........",
".....kkeedddcccSRRRRR33lddddd333ccccmRQRRRRcccdkk.......",
"....keedddddccSSRRRRRRUlddddcccccccamQRRRRRRcccddk......",
"...kedddddddcSSSRRRRRRSUlbdcccccccacmQRRRRRRPccccdk.....",
"..keddddddddcSSRRRRQRRRUlRbcccbdcccRmQRRRQRRPccccck.....",
".kedddddddddSSSRRRRQRRRQUlccccbdcccRmQRRRQRRPcccccck....",
"kdddddddddddS9nnnnnnRRRQUlRcccbdccRRmQRRRQRRPccccccck...",
"kdddddddddddSnooooonRRRQRUlIIIIdIIIIQQRRRQRRPccccccck...",
"dddddddddddRShhhhhhhRRRQRRUIpfIdIpfIQQRRRQRRPcccccccck..",
"dddddddddddRSSSRRRRQRRRQRRUIppIIIppIRQRRRQRRPcccccacck..",
"ddddbddddddRSSSRRRRQRRRQRRRUIIbdcIIQRQRRRQRRRPccccacck..",
"ddddbddddddSSSSRRRRQRRRQRRRUccbdcRRQRQRRRQRRRPccccaccck.",
"ddddbddddddSSSSRRRRQRRRQRRRQUcbdcRQRRQRRRQRRRPccccaccck.",
"ddddbddddddSSSSRRRRQRRRQRRRQUcbdRQQRRQRRRQRRRPcccccacck.",
"dddddbdddddSSSSRRRRQRRRQRRRQRcbdRQRRRQRRRQRRRPcccccacck.",
"dddddbdddddSSSSRRRRQRRRQRRRQRcbdRQRRRQRRRQRRRPcccccacck.",
"dddddbdddddSSSSRRRRQRRRQRRRQRRbdRQRRRQRRRQRRRPcccccacck.",
"cccccbcccccSSSSRRRRQRRRQRRRQRRbdRQRRRQRRRQRRRPcccccacck."];
var EYES={x:29,y:22,rows:[
"344443  444",
" IIII   3II",
" 4444    44"]};
var MOUTH={x:34,y:33,rows:[
"1 n",
" 1113",
" UjUU"]};
function put(b,lg,rows,x0,y0){ for (var j=0;j<rows.length;j++){ var r=rows[j]; for (var i=0;i<r.length;i++){ var ch=r[i]; if (ch===' '||ch==='.') continue; var c=lg[ch]; if (c===undefined) throw new Error('Porträt-Legende ohne '+ch); b.px(x0+i,y0+j,c); } } }
function patch(b,lg,p){ if (p) put(b,lg,p.rows,p.x,p.y); }
M.definePortrait('fadila',{ paint:function(b,v){
  put(b,L,BASE,0,0);
  if (v.mouth){ patch(b,L,MOUTH); }
  if (v.eyes){ patch(b,L,EYES); }
} });
})(M);
