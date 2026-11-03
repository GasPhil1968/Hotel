/* ===== portraits/damir.js — Damir Kovač (34), Straßenbahnfahrer
   Kantiges Gesicht (q-Hautrampe), kurz geschorenes dunkles Haar, dunkler Stoppelbart, schmale müde Augen unter geraden
   Brauen, ein Mundwinkel schief gezogen (zynisch); eine Zigarette hinter dem Ohr; dunkelblaue Fahrerjacke mit
   Stehkragen und Reißverschluss, hellblauer Hemdkragen, kleines Abzeichen auf der Brusttasche.
   Varianten: EYES (Lid zu) und MOUTH (Lippen geöffnet, Zähne) werden über das Grundbild gelegt.
   Legende: 1 2 3 4 5 6 l m Haut · a b c d j 9 Haar, Brauen, Augen · A B C D E Jacke · o e f g n Hemd ·
   i 7 8 h Zigarette · p q s r Abzeichen und Reißverschluss · k Kontur */
(function(M){
'use strict';
var P=M.P;
// Pixelkarten 56 × 64: jedes Zeichen ist ein Pixel, "." bleibt durchsichtig. In den Flicken (Varianten) heißt " " unverändert.
var L={"1":P.q0, "2":P.q1, "3":P.q2, "4":P.q3, "5":P.q4, "6":P.p4, "7":P.s6, "8":P.y3, "9":P.s4, "A":P.n0, "a":P.h0, "B":P.n1, "b":P.h1, "C":P.n2, "c":P.h2, "D":P.n3, "d":P.h3, "E":P.n4, "e":P.b2, "f":P.b3, "g":P.b4, "h":P.w4, "i":P.s5, "j":P.w1, "k":P.k1, "l":P.p2, "m":P.p3, "n":P.b5, "o":P.b1, "p":P.r3, "q":P.m2, "r":P.m4, "s":P.m3};
var BASE=[
"........................................................",
"........................................................",
"........................................................",
"........................................................",
".......................kkkkkkkkkkkk.....................",
"....................kkkdddd22ddddcck....................",
"...................k3d3dddd3dddccccdkk..................",
"..................k2333dddd2223dcdcccbk.................",
".................k3ddd3dd3dd33ddcddcddck................",
"................k3d3dd2d22ddd3dcccdcdcbbk...............",
"................k22d3dd2dd3d3dd3cdddcd444k..............",
"...............kd233ddd3325626252525242333k.............",
"...............kdddd3ddd352666655555444333k.............",
"...............kdddd323d556666555554444333k.............",
"...............kd22233dd525665555544444333k.............",
"...............k2dd222dd455555555444444433k.............",
"...............kd33dddd2255555554444444433k.............",
"..............k6d2d32dcc445555544444444433k.............",
"..............k6d3dcd778245555444444443333k.............",
"...............kccd7799h4455bbbbbbc443bbc33k............",
"...............kc77995554454c3333cb3433c332k............",
"...............ki9935654444332222234432223k.............",
"...............kccc4643544433aaaaa3443aaa3k.............",
"...............kcdc4632545433397aj34549ja3k.............",
"...............kcbc453254554434333445543333k............",
"................kbb4543545665554444565544433k...........",
"................kbb5554545666554444456554433k...........",
".................kbb4455344554333444456655433k..........",
".................kbc454533444333444334555432k...........",
"..................k5b5553344433444323332123k............",
"..................k53545232434244313342323k.............",
"...................k4554323444444323434233k.............",
"...................k1445232334343312lll323k.............",
"...................k234322324343421111113k..............",
"...................k2224132324343424mm332k..............",
"...................k2223213233434342323344k.............",
"..................k22223122334343434455544k.............",
"..................k33322112233434343545443k.............",
"..................k3332221122334343434342k..............",
"..................k333222211223243434332k...............",
"..................k33322222211132323231k................",
"..................kCEEEE2222221112222kk.................",
".................kCCCCCDgn22222222gfkCBk................",
"................kkCCCCCCDgn222222ffgBBCCk...............",
"..........kkkkkkCCCCCCCCCDgnffffffffBBBBkkkkk...........",
".......kkkDDCCCCCCBCCCCCCDggnffffff3BBBBCBBBCkk.........",
".....kkDDDCCCCCCCCCBCCCCCCDggneffffBBBBBCBBBBCCkk.......",
"...kkDDCCCCCCCCCCCCCBBCCCCCDgfefffoBBBBACBBBBBBCCk......",
"..kDDCCCCCCCCCCCCCCCCCBCCCCCffeffoBBBBACCBBBBBBBBkk.....",
".kDCCCCCCCCCCCCCCCCCCCCBCCCCffefffBBBACCCBBBBBBBBBBk....",
"kCCCCCCCCCCCCiiCCCCCCCCCCCCCCfeffBBBACCCCBBBBBBBBBBBk...",
"kCCCCCCCCCCCipeiCCCCCCCCCCCCCfefBBBACCCCCBBBBBBBBBBBk...",
"CCCCCCCCCCCCiepiCCCCCCCCCCCCCfefBBCCCCCCCBBBABBBBBBBBk..",
"CCCCCCCCCCCCCiiCCCCCCCCCCCCCCCeCCCCCCCCCCBBBABBBBBBBBk..",
"CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCAqCCCCCCCCCBBBABBBBBBBBBk.",
"CCCCCCCCCAAAAAAAAACCCCCCCCCCCCAqCCCCCCCCCBBBBABBBBBBBBk.",
"CCCCCBCCCCCCCCCCCCCCACCCCCCCCCArCCCCCCCCCBBBBABBBBBBBBk.",
"CCCCCBCCCCCCCCCCCCCCACCCCCCCCCAsCCCCCCCCCBBBBABBBBBBBBBk",
"CCCCCBCCCCCCCCCCCCCCACCCCCCCCCAqCCCCCCCCCBBBBABBBBBBBBBk",
"CCCCCBCCCCCCCCCCCCCCACCCCCCCCCAqCCCCCCCCCBBBBABBBBBBBBBk",
"CCCCCCBCCCCCCCCCCCCCCACCCCCCCCAqCCCCCCCCCBBBBABBBBBBBBBk",
"CCCCCCBCCCCCCCCCCCCCCACCCCCCCCAqCCCCCCCCCBBBBBABBBBBBBBk",
"CCCCCCBCCCCCCCCCCCCCCACCCCCCCCAqCCCCCCCCCBBBBBABBBBBBBBk",
"CCCCCCBCCCCCCCCCCCCCCACCCCCCCCAqCCCCCCCCCBBBBBABBBBBBBBk"];
var EYES={x:29,y:22,rows:[
"33333    333",
" aa a    aa"]};
var MOUTH={x:35,y:33,rows:[
" ii",
"111",
"3mm4"]};
function put(b,lg,rows,x0,y0){ for (var j=0;j<rows.length;j++){ var r=rows[j]; for (var i=0;i<r.length;i++){ var ch=r[i]; if (ch===' '||ch==='.') continue; var c=lg[ch]; if (c===undefined) throw new Error('Porträt-Legende ohne '+ch); b.px(x0+i,y0+j,c); } } }
function patch(b,lg,p){ if (p) put(b,lg,p.rows,p.x,p.y); }
M.definePortrait('damir',{ paint:function(b,v){
  put(b,L,BASE,0,0);
  if (v.mouth){ patch(b,L,MOUTH); }
  if (v.eyes){ patch(b,L,EYES); }
} });
})(M);
