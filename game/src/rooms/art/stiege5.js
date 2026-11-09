/* ===== rooms/art/stiege5.js — Haus 7, Treppenhaus im siebten Stock (320 px) =====
   Ein Podest aus Terrazzo mit Messingleisten, die Wände unten hellgrün geölt, oben weiß gekalkt, darüber eine nackte Glühbirne.
   Links das hohe Treppenhausfenster mit Drahtglas und dem Blick auf die Nachbartürme im Dunst; darunter der Abgang nach unten.
   Links der Mitte die gepolsterte Wohnungstür „7 links“, braunes Kunstleder mit Polsternägeln, Spion, Klingel, ein leeres
   Namensschild: die Wohnung der Vukovićs, seit 2011 leer. In der Mitte der Aufzug mit „VAN FUNKCIJE“. Rechts die Tür des
   Nachbarn mit Fußabtreter und Plastikblume, ganz rechts die Treppe hinauf, mit grünem Handlauf. An der Wand eine große, mit
   Schablone gemalte 7. Zustände: S.lit (Licht an, Zeitschaltung), S.open7 (die alte Tür steht offen: Samstag, Šehić hat aufgesperrt). */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=320, H=144, FL=112;
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
var WIN={x0:18,x1:62,y0:16,y1:84}, D7={x0:88,x1:124,y0:44,y1:FL}, LIFT={x0:146,x1:184,y0:46,y1:FL}, D7B={x0:202,x1:236,y0:44,y1:FL}, ST={x0:250};
var REG=new Uint8Array(W*H), RG={none:0,wall:1,floor:2,win:3,door:4,lift:5,stair:6,view:7};
function RW(b,id){ var o={w:W,h:H};
  o.px=function(x,y,c){ x|=0; y|=0; if (x<0||y<0||x>=W||y>=H||c===undefined||c===T) return; b.d[y*W+x]=c; REG[y*W+x]=id; };
  o.rect=function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) o.px(i,j,c); };
  o.hl=function(x0,x1,y,c){ if (x0>x1){ var t=x0; x0=x1; x1=t; } for (var i=x0;i<=x1;i++) o.px(i,y,c); };
  o.vl=function(x,y0,y1,c){ if (y0>y1){ var t=y0; y0=y1; y1=t; } for (var j=y0;j<=y1;j++) o.px(x,j,c); };
  ['line','poly','ellipse','fn'].forEach(function(k){ o[k]=function(){ return M.Buf.prototype[k].apply(o,arguments); }; });
  return o; }
function paintWall(b){ var w=RW(b,RG.wall), x, y;
  for (y=0;y<FL;y++) for (x=0;x<W;x++){ var c;
    if (y<6) c=y<2?P.s3:P.s4;                                               // Decke, Kante
    else if (y<62) c=ra(R('s4 s5 s5 s6'),0.55+(hash(x>>2,y>>2)-0.5)*0.12-(y<10?0.1:0),x,y);   // weiß gekalkt, fleckig
    else if (y===62) c=P.g5; else if (y===63) c=P.g3;                      // Trennlinie des Ölsockels
    else c=ra(R('g3 g4 g4 g5'),0.5+(hash(x>>1,y>>1)-0.5)*0.15+(y>FL-4?-0.2:0),x,y);           // hellgrün geölt
    if (y>64 && hash(x*7,y*3)<0.006) c=P.g2; if (y>8 && y<60 && hash(x*3,y*11)<0.004) c=P.s3;  // Kratzer, Flecken
    w.px(x,y,c); }
  // die gemalte Sieben (Schablone) zwischen Tür und Aufzug
  var sx=130, sy=24; for (var i=0;i<9;i++){ w.px(sx+i,sy,P.g1); w.px(sx+i,sy+1,P.g1); } for (var k=0;k<16;k++){ var px=sx+8-Math.round(k*0.4); w.px(px,sy+2+k,P.g1); w.px(px+1,sy+2+k,P.g1); }
  // Lichtschalter mit Lämpchen, Sicherungskasten
  w.rect(138,72,5,7,P.s5); w.hl(138,142,72,P.s6); w.vl(142,72,78,P.s3); w.px(140,74,P.t4);
  w.rect(240,14,8,12,P.m3); w.hl(240,247,14,P.m4); w.vl(247,14,25,P.m1); w.px(243,19,P.k1); }
function paintFloor(b){ var w=RW(b,RG.floor), x, y;
  for (y=FL;y<H;y++) for (x=0;x<W;x++){ var v=0.52+(hash(x,y)-0.5)*0.25+((y-FL)/(H-FL))*0.12, c=ra(R('m2 s2 m3 s3 s4'),v,x,y); if (hash(x*5,y*7)<0.05) c=P.s4; if (hash(x*3,y*13)<0.03) c=P.t2; if (y===FL||y===FL+1) c=y===FL?P.m1:P.y2; if ((x+((y-FL)>>1))%64===0) c=P.y2; w.px(x,y,c); } }
function paintWindow(b,tod){ var v=RW(b,RG.view), w=RW(b,RG.win), x, y;
  for (y=WIN.y0;y<WIN.y1;y++) for (x=WIN.x0;x<WIN.x1;x++){ var c;
    if (tod==='night') c=ra(R('k1 n0 n1'),0.3+(WIN.y1-y)/80*0.3,x,y); else c=ra(R('n4 b3 b4 b5 s6'),0.35+(WIN.y1-y)/(WIN.y1-WIN.y0)*0.4,x,y);
    // Nachbartürme im Dunst
    var tw=[[22,36],[40,48],[50,60]], hit=false; for (var t=0;t<tw.length;t++){ if (x>=tw[t][0] && x<tw[t][1] && y>WIN.y0+12+t*6){ hit=true; c=tod==='night'?((x+y)%5===0&&hash(x,y)<0.5?P.y3:P.k2):(((y-WIN.y0)%5===0)?P.m2:((x%4===0)?P.m2:P.m3)); } }
    if (!hit && y>WIN.y1-10) c=tod==='night'?P.k2:P.m4; v.px(x,y,c); }
  // Rahmen, Sprossen, Drahtglas
  for (x=WIN.x0-2;x<WIN.x1+2;x++){ w.px(x,WIN.y0-2,P.s6); w.px(x,WIN.y0-1,P.s4); w.px(x,WIN.y1,P.s3); w.px(x,WIN.y1+1,P.s5); w.px(x,WIN.y1+2,P.s2); }
  for (y=WIN.y0-2;y<WIN.y1+2;y++){ w.px(WIN.x0-2,y,P.s5); w.px(WIN.x0-1,y,P.s3); w.px(WIN.x1,y,P.s3); w.px(WIN.x1+1,y,P.s5); }
  var mx=(WIN.x0+WIN.x1)>>1, my=(WIN.y0+WIN.y1)>>1; for (y=WIN.y0;y<WIN.y1;y++){ w.px(mx,y,P.s4); } for (x=WIN.x0;x<WIN.x1;x++) w.px(x,my,P.s4);
  for (y=WIN.y0;y<WIN.y1;y+=4) for (x=WIN.x0+(y%8?0:2);x<WIN.x1;x+=4) if (bayer(x,y)<0.5) w.px(x,y,M.UP[b.get(x,y)]); }
function door(b,D,padded,open){ var w=RW(b,RG.door), x, y, dw=D.x1-D.x0;
  // Zarge
  for (y=D.y0-3;y<D.y1;y++){ w.px(D.x0-3,y,P.s3); w.px(D.x0-2,y,P.s5); w.px(D.x1+1,y,P.s5); w.px(D.x1+2,y,P.s3); } for (x=D.x0-3;x<=D.x1+2;x++){ w.px(x,D.y0-3,P.s5); w.px(x,D.y0-2,P.s3); }
  if (open){ // die Tür steht offen: dahinter der leere Flur der Wohnung, Tageslicht, ein heller Fleck, wo ein Bild hing
    for (y=D.y0;y<D.y1;y++) for (x=D.x0;x<D.x1;x++){ var c=ra(R('s3 s4 s5'),0.45+(x-D.x0)/dw*0.3,x,y); if (y>D.y1-14) c=ra(R('w2 w3 w4'),0.5+hash(x,y)*0.2,x,y); if (x>D.x0+10&&x<D.x0+20&&y>D.y0+12&&y<D.y0+24) c=P.s6; w.px(x,y,c); }
    for (y=D.y0;y<D.y1;y++){ w.px(D.x0,y,P.w1); w.px(D.x0+1,y,P.w2); w.px(D.x0+2,y,P.w1); } return; }
  for (y=D.y0;y<D.y1;y++) for (x=D.x0;x<D.x1;x++){ var c2;
    if (padded){ var cx=(x-D.x0)%8, cy=(y-D.y0)%8, q=(cx===4&&cy===4); c2=q?P.y3:ra(R('w1 w2 w3 w2'),0.5+(Math.abs(cx-4)+Math.abs(cy-4))*-0.04+(hash(x,y)-0.5)*0.1,x,y); if (cx===0||cy===0) c2=P.w1; }
    else c2=ra(R('w2 w3 w4'),0.5+((x-D.x0)%6===0?-0.2:0)+(hash(x>>1,y)-0.5)*0.1,x,y);
    w.px(x,y,c2); }
  // Klinke, Schloss, Spion, Namensschild
  w.rect(D.x1-7,D.y0+34,4,2,P.y3); w.px(D.x1-7,D.y0+34,P.y4); w.px(D.x1-6,D.y0+38,P.k1); w.px(D.x0+dw/2|0,D.y0+16,P.k1); w.px((D.x0+dw/2|0)+1,D.y0+16,P.m3);
  w.rect(D.x0+dw/2-6|0,D.y0+8,12,4,padded?P.s5:P.y3); w.hl(D.x0+dw/2-6|0,D.x0+dw/2+5|0,D.y0+8,P.s6); }
function paintDoors(b,S){ door(b,D7,true,!!S.open7); door(b,D7B,false,false);
  var w=RW(b,RG.door); w.rect(D7.x1+5,D7.y0+30,3,4,P.s5); w.px(D7.x1+6,D7.y0+31,P.k1);                                  // Klingel
  w.rect(D7B.x0-4,FL-3,D7B.x1-D7B.x0+8,3,P.e2); w.hl(D7B.x0-4,D7B.x1+3,FL-3,P.e3);                                     // Fußabtreter
  w.rect(D7.x0-4,FL-3,D7.x1-D7.x0+8,3,P.m1); w.hl(D7.x0-4,D7.x1+3,FL-3,P.m2);
  w.px(D7B.x1-3,D7B.y0+18,P.r3); w.px(D7B.x1-4,D7B.y0+17,P.r4); w.px(D7B.x1-3,D7B.y0+19,P.g3); }
function paintLift(b){ var w=RW(b,RG.lift), x, y;
  for (y=LIFT.y0-6;y<LIFT.y1;y++) for (x=LIFT.x0-4;x<LIFT.x1+4;x++){ var inner=x>=LIFT.x0&&x<LIFT.x1&&y>=LIFT.y0, c;
    if (!inner) c=(y<LIFT.y0-3)?P.m4:P.m2; else c=ra(R('m2 m3 m4'),0.5+((x-LIFT.x0)%3===0?0.15:0)-((x===(LIFT.x0+LIFT.x1)>>1)?0.4:0),x,y);
    w.px(x,y,c); }
  // Schild VAN FUNKCIJE, Knopf, Stockwerksanzeige ohne Licht
  w.rect(LIFT.x0+4,LIFT.y0+18,LIFT.x1-LIFT.x0-8,7,P.s6); w.hl(LIFT.x0+4,LIFT.x1-5,LIFT.y0+18,P.s5); M.microText(w,'VAN',LIFT.x0+13,LIFT.y0+19,P.r2); M.microText(w,'FUNKC.',LIFT.x0+6,LIFT.y0+22,P.r2);
  w.rect(LIFT.x1+6,LIFT.y0+30,4,6,P.m3); w.px(LIFT.x1+7,LIFT.y0+32,P.k1); w.rect(LIFT.x0+12,LIFT.y0-5,12,3,P.k2); }
function paintStairs(b){ var w=RW(b,RG.stair), x, y;
  // Treppe hinauf nach rechts: jede Stufe 6 px tief, 7 px hoch; Trittkante hell, Setzstufe grün geölt wie der Sockel
  for (x=ST.x0;x<W;x++){ var k=Math.floor((x-ST.x0)/6), top=FL-(k+1)*7, edge=(x-ST.x0)%6===0;
    for (y=Math.max(0,top);y<FL;y++){ var c, dy=y-top; if (dy<2) c=dy===0?P.s6:P.s4; else c=ra(R('g3 g4 g4'),0.5+(hash(x,y)-0.5)*0.2-(edge?0.25:0),x,y); w.px(x,y,c); } }
  // Wange unten, Handlauf mit Stäben
  for (x=ST.x0;x<W;x++){ var k2=Math.floor((x-ST.x0)/6), yb=FL-k2*7; if (yb<FL) w.px(x,yb,P.g2); }
  for (x=ST.x0-6;x<W;x++){ var yy=Math.round(FL-30-(x-ST.x0)*7/6); if (yy<0) continue; w.px(x,yy,P.g1); w.px(x,yy+1,P.g2); if ((x-ST.x0)%12===0) for (var q=yy+2;q<yy+30&&q<FL;q++) w.px(x,q,P.m1); } }
var LAST=null;
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0); REG.fill(0); if (tod!=='night') tod='day';
  paintWall(b); paintFloor(b); paintWindow(b,tod); paintDoors(b,S); paintLift(b); paintStairs(b);
  // Licht: Tageslicht aus dem Fenster links, die Glühbirne in der Mitte; nachts nur die Birne (Zeitschaltung)
  M.light(b,function(x,y){ var r=REG[y*W+x]; if (r===RG.view) return 0; var dx=(x-40)/170, d=Math.sqrt(dx*dx)*0.35, lb=Math.max(0,1-Math.hypot(x-160,y-30)/170)*0.25; return (tod==='night'?-0.35+lb*1.4:0.08-d+lb)-(y>FL?((y-FL)/40)*0.1:0); });
  // die Glühbirne
  b.vl(160,0,6,P.k2); b.rect(158,7,5,4,tod==='night'?P.y5:P.s6); b.px(160,11,P.y4);
  LAST=M.finishTOD(b,tod,{ sky:function(x,y){ return REG[y*W+x]===RG.view; } }); return LAST; }
function dynamic(fb,v,S,GS){ if (S.blink){ var on=Math.floor(v.t*2)%2; if (on) fb.px(140,74,P.y4); } }
M.defineArt('stiege5',{
  width:W, paint:paint, dynamic:dynamic,
  walk:function(x,y,S,GS){ return y>=116 && y<=138 && x>=6 && x<=300; }, walkG:function(){ return false; },
  spots:{ door7:[D7.x0-3,D7.y0-3,D7.x1-D7.x0+6,D7.y1-D7.y0+3], door7b:[D7B.x0-3,D7B.y0-3,D7B.x1-D7B.x0+6,D7B.y1-D7B.y0+3], lift:[LIFT.x0-4,LIFT.y0-6,LIFT.x1-LIFT.x0+8,LIFT.y1-LIFT.y0+6],
    window:[WIN.x0-2,WIN.y0-2,WIN.x1-WIN.x0+4,WIN.y1-WIN.y0+4], up:[ST.x0+18,26,W-ST.x0-18,FL-26], down:[0,FL,12,32], seven:[128,22,14,22], bell:[D7.x1+3,D7.y0+28,7,8], light:[136,70,9,11], mat:[D7.x0-5,FL-4,D7.x1-D7.x0+10,6] },
  stands:{ door7:[106,121,'B'], door7b:[219,121,'B'], lift:[165,121,'B'], window:[40,122,'B'], up:[262,118,'R'], down:[10,128,'L'], seven:[136,121,'B'], bell:[128,121,'B'], light:[140,121,'B'], mat:[106,123,'B'] },
  actorPos:{ jasna:[100,121,'R'], sehic:[192,121,'L'], jasna_door:[116,119,'L'] }, start:[30,126,'R'], entries:{ haustor5:[24,128,'R'], stan5:[258,119,'L'] }
});
})(M);
