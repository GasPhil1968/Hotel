/* ===== rooms/art/pivara.js — An der Brauerei (Bistrik), die Mauer mit dem Hahn (320 px) =====
   Eine Gasse mit Kopfsteinpflaster am Fuß des Hangs. Hinten der Brauereibau aus gelbem Backstein mit hohen Bogenfenstern und
   einem Schornstein, darüber die Hänge des Trebević. Davor die lange Mauer aus Bruchstein, über die eine alte Linde ragt
   (dahinter lagen 1993 die Gräber). In der Mauer eine Nische mit dem Messinghahn und einem steinernen Trog; daneben der graue
   Blechkasten mit Klappe und verrostetem Vorhängeschloss. Links der Brückenkopf über die Miljacka mit Steinbrüstung, vorn eine
   Bank und eine Laterne. Keine Firmennamen, keine Tafeln. Zustände: S.flow (Montag: das Wasser läuft in den Kanister),
   S.boxOpen (der Kasten ist offen, das Glas fort). ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=320, H=144, WT=60, WB=108;                        // Mauer: Krone, Fuß
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function vn(x,y,s,sd){ var gx=Math.floor(x/s), gy=Math.floor(y/s), fx=x/s-gx, fy=y/s-gy, o=sd*57.31;
  var a=hash(gx+o,gy), b=hash(gx+1+o,gy), c=hash(gx+o,gy+1), d=hash(gx+1+o,gy+1), ux=fx*fx*(3-2*fx), uy=fy*fy*(3-2*fy);
  return a+(b-a)*ux+(c-a)*uy+(a-b-c+d)*ux*uy; }
function fbm(x,y,s,sd){ return vn(x,y,s,sd)*0.55+vn(x,y,s/2,sd+3)*0.3+vn(x,y,s/4,sd+7)*0.15; }
var TAP={x:198,y:80}, NICHE={x0:186,x1:212,y0:68,y1:102}, TROUGH={x0:184,x1:214,y0:98,y1:108}, BOX={x0:220,x1:238,y0:76,y1:96}, LIN={cx:96,cy:36,r:34}, BR={x1:40};
var REG=new Uint8Array(W*H), RG={none:0,sky:1,hill:2,bldg:3,wall:4,tree:5,street:6,bridge:7,metal:8,water:9};
function RW(b,id){ var o={w:W,h:H};
  o.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; b.d[y*W+x]=c; REG[y*W+x]=id; };
  o.rect=function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) o.px(i,j,c); };
  o.hl=function(x0,x1,y,c){ if (x0>x1){ var t=x0; x0=x1; x1=t; } for (var i=x0;i<=x1;i++) o.px(i,y,c); };
  o.vl=function(x,y0,y1,c){ if (y0>y1){ var t=y0; y0=y1; y1=t; } for (var j=y0;j<=y1;j++) o.px(x,j,c); };
  ['line','poly','ellipse','fn'].forEach(function(k){ o[k]=function(){ return M.Buf.prototype[k].apply(o,arguments); }; });
  return o; }
function paintSky(b,tod,wea){ var w=RW(b,RG.sky), x, y;
  if (tod==='night'){ for (y=0;y<50;y++) for (x=0;x<W;x++) w.px(x,y,ra(R('k0 k1 n0 n1'),0.1+y/50*0.5,x,y)); var r=M.rng(77); for (var s=0;s<120;s++) w.px(Math.floor(r()*W),Math.floor(r()*30),r()<0.2?P.n5:P.n3); return; }
  var G=wea==='grey'; for (y=0;y<50;y++) for (x=0;x<W;x++) w.px(x,y,ra(G?R('m3 m4 s5 s6'):R('b2 b3 b4 b5'),0.2+y/50*0.75+(G?(fbm(x,y,20,3)-0.5)*0.3:0),x,y)); }
function paintHill(b,tod){ var w=RW(b,RG.hill), x, y;
  for (x=0;x<W;x++){ var top=Math.round(18+Math.sin(x*0.018+0.6)*7+Math.sin(x*0.06)*2); for (y=top;y<60;y++){ var c=ra(R('e1 g1 e2 g2 e3'),0.55-(y-top)/60+(fbm(x,y,10,5)-0.5)*0.3,x,y);
      if (hash(x>>1,y>>1)<0.05 && y>top+4) c=hash(x,y)<0.5?P.s4:P.t3;                 // Häuser am Hang
      w.px(x,y,c); } }
  if (tod!=='night') M.fogBake(b,function(x,y){ return REG[y*W+x]===RG.hill?0.35:0; },{col:P.m4}); }
// links hinter dem Brückenkopf: das andere Ufer der Miljacka, Ufermauer, kahle Bäume, ein Haus
function paintFar(b,tod){ var w=RW(b,RG.hill), x, y;
  for (y=56;y<WT+18;y++) for (x=0;x<BR.x1+4;x++){ var c; if (y<WT+8){ var f=fbm(x,y,4,21); c=f>0.55?ra(R('e1 w1 e2'),0.3+f*0.4,x,y):ra(R('s4 s5 m4'),0.5+(y-56)/40,x,y);
      if (x>=8 && x<22 && y>=WT-2){ c=(y===WT-2)?P.t2:((x%5===2&&y>WT+1&&y<WT+5)?P.k2:P.s5); } }
    else c=ra(R('s2 s3 s4'),0.4+((x+y)%6===0?-0.2:0)+hash(x>>1,y)*0.2,x,y);
    w.px(x,y,c); }
  if (tod!=='night') M.fogBake(b,function(x,y){ return (x<BR.x1+4 && y>=56 && y<WT+8)?0.3:0; },{col:P.m4}); }
function paintBuilding(b){ var w=RW(b,RG.bldg), x, y, X0=150, X1=W, TOPY=22;
  for (y=TOPY;y<WT+4;y++) for (x=X0;x<X1;x++){ var c=ra(R('y1 y2 y2 y3'),0.5+(((y+((x>>3)%2)*2)%5===0)?-0.25:0)+((x%8===0)?-0.2:0)+(hash(x,y)-0.5)*0.15,x,y); w.px(x,y,c); }
  for (x=X0;x<X1;x++){ w.px(x,TOPY,P.t1); w.px(x,TOPY+1,P.t2); w.px(x,TOPY+2,P.y1); }
  // Bogenfenster
  for (var i=0;i<5;i++){ var fx=X0+10+i*34, fy=TOPY+8; for (y=fy;y<fy+26;y++) for (x=fx;x<fx+14;x++){ var dx=x-(fx+6.5), arch=y<fy+7?Math.sqrt(Math.max(0,49-dx*dx))<(fy+7-y)-0.5:false; if (arch) continue; w.px(x,y,(x===fx||x===fx+13||y===fy+25)?P.t1:((x-fx)%5===2||(y-fy)%7===3?P.k2:ra(R('n1 n2 m2'),0.4+hash(x,y)*0.3,x,y))); } }
  // Schornstein
  for (y=0;y<TOPY+2;y++) for (x=274;x<286;x++) w.px(x,y,ra(R('t1 t2 t3'),0.5+((y%4===0)?-0.3:0)+(x===274?-0.3:0)+(hash(x,y)-0.5)*0.2,x,y));
  for (x=272;x<288;x++){ w.px(x,0,P.t1); w.px(x,1,P.t2); } }
function paintLinden(b,tod){ var w=RW(b,RG.tree), x, y;
  for (y=LIN.cy-LIN.r;y<WT+6;y++) for (x=LIN.cx-LIN.r-8;x<LIN.cx+LIN.r+8;x++){ var dx=(x-LIN.cx)/(LIN.r+6), dy=(y-LIN.cy)/(LIN.r*0.8); if (dx*dx+dy*dy>1) continue; var f=fbm(x,y,6,9); if (f<0.4) continue;
    var spring=hash(x>>1,y>>1)<0.25; w.px(x,y,ra(spring?R('g2 g3 g4 g5'):R('e1 w1 e2 w2'),0.3+f*0.6-dy*0.15,x,y)); }   // März: kahle Zweige, ein Hauch von Grün
  for (y=WT-12;y<WT+2;y++){ w.px(LIN.cx-1,y,P.w1); w.px(LIN.cx,y,P.w2); w.px(LIN.cx+1,y,P.w1); } }
function paintWall(b,S){ var w=RW(b,RG.wall), x, y;
  for (y=WT;y<WB;y++) for (x=BR.x1;x<W;x++){ var bx=Math.floor((x+((Math.floor(y/6))%2)*5)/10), by=Math.floor(y/6), stone=hash(bx,by), joint=(y%6===0)||((x+((Math.floor(y/6))%2)*5)%10===0);
    var c=joint?P.s1:ra(R('s2 s3 s3 s4 e3'),0.35+stone*0.45+(hash(x,y)-0.5)*0.1,x,y); if (y<WT+2) c=y===WT?P.s5:P.s4; if (fbm(x,y,5,4)>0.72 && y>WB-14) c=P.g2; w.px(x,y,c); }
  // Nische mit dem Hahn
  for (y=NICHE.y0;y<NICHE.y1;y++) for (x=NICHE.x0;x<NICHE.x1;x++){ var dx=x-(NICHE.x0+NICHE.x1)/2, arch=y<NICHE.y0+8 && Math.abs(dx)>Math.sqrt(Math.max(0,64-Math.pow(NICHE.y0+8-y,2)))+5; if (arch) continue; w.px(x,y,ra(R('s1 s2 s3'),0.4+(y-NICHE.y0)/40*0.3+(x===NICHE.x0||x===NICHE.x1-1?-0.3:0),x,y)); }
  var m=RW(b,RG.metal);
  m.rect(TAP.x-2,TAP.y-6,5,4,P.y2); m.hl(TAP.x-2,TAP.x+2,TAP.y-6,P.y4); m.rect(TAP.x-1,TAP.y-2,3,6,P.y2); m.vl(TAP.x-1,TAP.y-2,TAP.y+3,P.y3); m.rect(TAP.x-2,TAP.y+4,5,2,P.y1); m.px(TAP.x,TAP.y+6,P.y1);  // Messinghahn
  m.rect(TAP.x-4,TAP.y-9,9,2,P.y1); m.hl(TAP.x-4,TAP.x+4,TAP.y-9,P.y3);                                                          // Griff
  // Trog
  for (y=TROUGH.y0;y<TROUGH.y1;y++) for (x=TROUGH.x0;x<TROUGH.x1;x++) w.px(x,y,(y===TROUGH.y0)?P.s5:((y===TROUGH.y0+1&&x>TROUGH.x0+1&&x<TROUGH.x1-2)?P.a3:ra(R('s2 s3 s4'),0.5+hash(x,y)*0.2,x,y)));
  // Blechkasten mit Klappe und Schloss
  for (y=BOX.y0;y<BOX.y1;y++) for (x=BOX.x0;x<BOX.x1;x++) m.px(x,y,(x===BOX.x0||y===BOX.y0)?P.m4:((x===BOX.x1-1||y===BOX.y1-1)?P.m1:ra(R('m2 m3 t2'),0.4+hash(x>>1,y)*0.3+(fbm(x,y,3,8)>0.65?-0.3:0),x,y)));
  if (S.boxOpen){ m.rect(BOX.x0+2,BOX.y0+2,BOX.x1-BOX.x0-4,BOX.y1-BOX.y0-4,P.k2); m.hl(BOX.x0,BOX.x1-1,BOX.y0-1,P.m3); }
  else { m.hl(BOX.x0+2,BOX.x1-3,BOX.y0+3,P.m1); m.rect(BOX.x0+7,BOX.y0+9,4,4,P.t2); m.px(BOX.x0+8,BOX.y0+8,P.t1); m.px(BOX.x0+9,BOX.y0+8,P.t1); m.px(BOX.x0+8,BOX.y0+10,P.k1); } }
function paintBridge(b,tod){ var w=RW(b,RG.bridge), v=RW(b,RG.water), x, y;
  for (y=WT+18;y<WB+2;y++) for (x=0;x<BR.x1+2;x++){ var c=y<WT+21?(y===WT+18?P.s5:P.s4):ra(R('s2 s3 s4'),0.45+hash(x>>1,y>>1)*0.3,x,y); if (y>WB-8 && y<WB-2 && x<BR.x1-4) continue; w.px(x,y,c); }
  for (y=WB-8;y<WB-2;y++) for (x=0;x<BR.x1-4;x++) v.px(x,y,ra(tod==='night'?R('k1 n0 a1'):R('a2 a3 a4 a5'),0.4+Math.sin(x*0.6+y)*0.15,x,y)); }
function paintStreet(b){ var w=RW(b,RG.street), x, y;
  for (y=WB;y<H;y++) for (x=0;x<W;x++){ var row=Math.floor((y-WB)/4), off=(row%2)*3, cx=(x+off)%6, cy=(y-WB)%4, edge=cx===0||cy===0;
    var c=edge?P.m1:ra(R('m2 s2 m3 s3'),0.45+hash((x+off)>>2|0,row)*0.4+((y-WB)/36)*0.1,x,y); if (y===WB) c=P.s1; w.px(x,y,c); }
  // Rinne vor der Mauer, nass vom Trog
  for (x=TROUGH.x0-6;x<TROUGH.x1+10;x++){ w.px(x,WB+1,P.a2); if (hash(x,3)<0.5) w.px(x,WB+2,P.m1); }
  // Bank, Laterne
  for (x=118;x<152;x++){ w.px(x,112,P.w3); w.px(x,113,P.w2); w.px(x,116,P.w3); w.px(x,117,P.w1); } [120,149].forEach(function(px){ for (y=113;y<122;y++) w.px(px,y,P.m1); });
  for (y=50;y<WB+4;y++){ w.px(168,y,P.m1); w.px(169,y,P.m2); } w.rect(165,46,8,5,P.m1); w.hl(165,172,46,P.m3); w.hl(166,171,51,P.s4); }
var LAST=null, TODN='day';
function paint(S,GS,tod){ var wea=M.scn.weather(GS), b=new M.Buf(W,H,P.k0); REG.fill(0); if (tod!=='night') tod='day'; TODN=tod;
  paintSky(b,tod,wea); paintHill(b,tod); paintFar(b,tod); paintBuilding(b); paintLinden(b,tod); paintWall(b,S); paintBridge(b,tod); paintStreet(b);
  M.light(b,function(x,y){ var r=REG[y*W+x]; if (r===RG.sky) return 0; var v=0; if (r===RG.street) v+=(y-WB)/40*0.15; if (r===RG.hill) v-=0.05; if (tod==='night') v-=0.45; return v-Math.abs(x-200)/900; });
  var base=b.clone();
  LAST=M.finishTOD(b,tod,{ sky:function(x,y){ return REG[y*W+x]===RG.sky; }, after:function(o,t){ if (t==='day') return; for (var y=40;y<H;y++) for (var x=130;x<210;x++){ var d=Math.hypot(x-169,(y-60)*0.7); if (d<44 && bayer(x,y)<(1-d/44)*0.8) o.px(x,y,M.UP[o.get(x,y)]); } o.hl(166,171,51,P.y5); } });
  return LAST; }
function dynamic(fb,v,S,GS){ var t=v.t, x0=TAP.x, y0=TAP.y+7;
  if (S.flow){ for (var y=y0;y<TROUGH.y0+1;y++){ var x=x0+(Math.sin(y*0.7+t*20)>0.6?1:0); fb.px(x,y,(y+Math.floor(t*30))%3?P.a5:P.a6); } }
  else { var k=(t*1.3)%1, dy=Math.floor(k*(TROUGH.y0-y0)); if (k<0.8) fb.px(x0,y0+dy,P.a5); } }
M.defineArt('pivara',{
  width:W, paint:paint, dynamic:dynamic,
  walk:function(x,y,S,GS){ if (y<114||y>140||x<6||x>314) return false; if (x>116&&x<154&&y<120) return false; return true; }, walkG:function(){ return false; },
  spots:{ exit:[0,108,14,36], tap:[NICHE.x0,NICHE.y0,NICHE.x1-NICHE.x0,NICHE.y1-NICHE.y0-2], trough:[TROUGH.x0,TROUGH.y0-1,TROUGH.x1-TROUGH.x0,TROUGH.y1-TROUGH.y0+2], box:[BOX.x0-2,BOX.y0-2,BOX.x1-BOX.x0+4,BOX.y1-BOX.y0+4],
    wall:[240,WT,80,WB-WT], linden:[LIN.cx-LIN.r,LIN.cy-LIN.r+6,LIN.r*2,LIN.r+16], building:[150,22,170,36], bridge:[0,WT+16,BR.x1,WB-WT-14], bench:[116,108,38,14], lamp:[162,44,12,64], middle:[64,110,40,26] },
  stands:{ exit:[10,128,'L'], tap:[198,120,'B'], trough:[204,121,'B'], box:[228,120,'B'], wall:[268,120,'B'], linden:[96,120,'B'], building:[240,120,'B'], bridge:[30,124,'L'], bench:[134,124,'B'], lamp:[172,122,'B'], middle:[84,124,'B'] },
  actorPos:{ hamdija:[214,118,'L'], hamdija_back:[40,122,'R'] }, start:[24,126,'R'], entries:{ map:[16,126,'R'] }
});
})(M);
