/* ===== portraits/jakov.js — Jakov (Geist), Totengräber des alten Friedhofs Sustipan, gestorben 1959
   Dunkle Schiebermütze (Fischgrät), wettergegerbtes Gesicht mit Lachfältchen und grauen Stoppeln, buschige weiße Brauen,
   graues Hemd mit offenem Kragen, braune Weste mit Uhrkette; freundlich. Natürliche Farben, das Spiel färbt ein (spiritP).
   Legende: Ziffern Haut (q-Rampe, p5 Licht) · s Stoppeln · w/W Augenweiß · i Iris · I Wimpern · X Z z y Y Haar/Brauen ·
   a b c d Mütze · u v Schirm · R S T U Hemd · A B C D Weste · f F Knöpfe und Uhrkette.
   Varianten: EYES (Lid zu) und MOUTH (Lippen geöffnet) werden über das Grundbild gelegt. */
(function(M){
'use strict';
var P=M.P;
// Pixelkarten 56 × 64: jedes Zeichen ist ein Pixel, "." bleibt durchsichtig. In den Flicken (Varianten) heißt " " unverändert.
var L={"2":P.q1, "3":P.q2, "4":P.q3, "5":P.q4, "6":P.p5, "k":P.k1, "s":P.m3, "w":P.s4, "W":P.s3, "i":P.w1, "I":P.h1, "X":P.m1, "Z":P.m2, "z":P.m3, "y":P.m4, "Y":P.s5, "n":P.q1, "a":P.h1, "b":P.h2, "c":P.h3, "d":P.e1, "u":P.k1, "v":P.h1, "R":P.m1, "S":P.m3, "T":P.m4, "U":P.s5, "A":P.w0, "B":P.w1, "C":P.w2, "D":P.w3, "f":P.y1, "F":P.y2};
var BASE=[
"........................................................",
"........................................................",
"........................................................",
"........................................................",
"........................................................",
"...........................kkkkkkk......................",
"......................kkkkkccccccckkkkk.................",
"...................kkkcccacbbbbbbbcbbbbkk...............",
".................kkcdcbbcbaabbbbbbaabaabbk..............",
"...............kkdccbcbbbbbbaabbbbababaaabk.............",
"..............kccbcbbbbbbbbbbbaaaabaaaaaaabk............",
"..............kbbbbbbbbbbbbbbabaaaaaaaaaaaaak...........",
".............kcbcbbbbbbbbbabbaaabaaaaaaaaaaak...........",
".............kbcbbbbbbbbbbbbababaaaaaaaaaaaak...........",
".............kcbbbbbbbbbabaaaaaauuuuuuuuuuuuuk..........",
".............kabbbbbaaaaaakkkkkkcccvvvvvvvvccck.........",
"..............kaaaaazy4555555543333cccccccckkk..........",
"..............kZZyzzyy4555444444533333333kk.............",
"..............kZZzyzzy4555555555554443333k..............",
"..............kZZzzyzy4555555YYyy5554yYy3k..............",
"..............kZZy455445555Yyyzzzyz5yzzzy4k.............",
"..............kZZz565445555z45554445445444k.............",
"..............kZZz5545455555432II23543II3k..............",
"..............kZZy544545554542WiIW454WiI3k..............",
"..............kZZz53354554554433345644334k..............",
"...............kZz532545555556655555644444k.............",
"...............kZy543545566555544555643444k.............",
"...............kZz544545566555555555565434k.............",
"................kZ5545455565554555555566543k............",
"................kZ4554455555555553455555443k............",
".................kX45445555555553454323334k.............",
"..................kX444555555553455555544k..............",
"..................k4444555555534444444344k..............",
"..................k44444555555543nnnn344k...............",
"..................k444445555555544554454k...............",
"..................k444444455555554444s54k...............",
"..................k444443455555555665544k...............",
"..................k44444434555555s565544k...............",
"..................k444444434s555555s5444k...............",
"..................k444444443344s5555444k................",
"..................k4444444444344444443k.................",
"..................k44444444444334443kk..................",
"...............kkkTDUUUU44444443333k....................",
"............kkkTDDDCTTTTUUUTTTTTTSSkk...................",
".........kkkDDDDCCCCSTTTTTTUUTTTTRSSSkk.................",
".......kkTTTDCCCCCCCCSSTTTTTTUTTTSSSSSSkkk..............",
"......kTTSSDCCCCCCCCCCDSSTTTTTUTTSRSSSSBAAkkkk..........",
".....kTSSSSDCCCCCCCCCCCDCSSTTTSRTSSRRSSBABBBATkk........",
"....kTSSSSSDCCCCCCCCCCCCDCTSSTTTRSSSSRRBABBBBATTkk......",
"...kTSSSSSSDCCCCCCCCCCCCCDCTTSTTRSSSSSSABBBBBASSSSk.....",
"..kTRSSSSSDCCCCCCCCCCCCCCCDCTTTTRSSSSSSABBBBBASSSSSk....",
"..kRRSSSSSDCCCCCCCCCCCCCCCCDCTTTRSSSSSFABBBBBASSSSRSk...",
"..kRRSSSSSDCCCCCCCCCCCCCCCCCDCTTTRSSSSfABBBBBASSSSRRSk..",
".kTRRSSSSSDCCCCCCCCCCCCCCCCCCDCTTRSSSSABBBBBBASSSSRRRk..",
".kRRRSSSSSDCCCCCCCCCCCCCCCCCCCDCTRSSSCABBBBBBASSSSRRRk..",
".kRRRSSSSDCCCCCCCCCCCCCCCCCCCCCDCSRSSFABBBBBBASSSSRRRSk.",
".kRRRSSSSDCCCCCCCCCCCCCCCCCCCCCCDCRSSfABBBBBBASSSSRRRRk.",
".kRRRSSSSDCCCCCCCCCCCCCCBBBBBBCCCDRSSABBBBBBBASSSSRRRRk.",
".kRRRSSSSDCCCCCCCCCCCCCCCCCCCFCCCfDRCABBBBBBBASSSSRRRRk.",
".kRRRSSSSDCCCCCCCCCCCCCCCCCCCCfCFCCDCFBBBBBBBASSSSRRRRk.",
".kRRRSSSSSDCCCCCCCCCCCCCCCCCCCCCCCCCCfBBBBBBBASSSSRRRRk.",
".kRRRSSSSSDCCCCCCCCCCCCCCCCCCCCCCCCCCCBBBBBBBASSSSRRRRk.",
".kRRRSSSSSDCCCCCCCCCCCCCCCCCCCCCCCCCCCBBBBBBBASSSSRRRRk.",
".kRRRSSSSSDCCCCCCCCCCCCCCCCCCCCCCCCCFCBBBBBBBASSSSRRRRk."];
var EYES={x:29,y:22,rows:[
"455554  5544",
"5433454 4334",
" 555     55 "]};
var MOUTH={x:33,y:33,rows:[
" w   ",
"3223 ",
" 55  ",
"44444"]};
function put(b,lg,rows,x0,y0){ for (var j=0;j<rows.length;j++){ var r=rows[j]; for (var i=0;i<r.length;i++){ var ch=r[i]; if (ch===' '||ch==='.') continue; var c=lg[ch]; if (c===undefined) throw new Error('Porträt-Legende ohne '+ch); b.px(x0+i,y0+j,c); } } }
function patch(b,lg,p){ if (p) put(b,lg,p.rows,p.x,p.y); }
M.definePortrait('jakov',{ paint:function(b,v){
  put(b,L,BASE,0,0);
  if (v.mouth){ patch(b,L,MOUTH); }
  if (v.eyes){ patch(b,L,EYES); }
} });
})(M);
