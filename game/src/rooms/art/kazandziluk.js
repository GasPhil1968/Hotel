/* ===== rooms/art/kazandziluk.js — Kazandžiluk, die Gasse der Kupferschmiede in der Baščaršija, an einem Nebeltag.
   Eine schmale Gasse mit Kaldrma (runde Flusssteine) zwischen zweistöckigen Holzläden: weiß gekalkte Obergeschosse, die auf
   Konsolen vorkragen, Fenster mit Holzgittern, tiefe Traufen mit Sparrenköpfen. Links verliert sich die Gasse im Nebel
   (dahinter ein Minarett), davor ein Kupferladen: der hochgeklappte Laden ist das Vordach, darunter hängen Teller, Kannen,
   Laternen, Sahani und Džezve in allen Größen; vor dem Laden ein großer Kessel (Kazan). In der Mitte die offene Werkstatt von
   Nedžad: Schild „KAZANDŽIĆ · od 1912“, innen die Werkbank mit Schraubstock, der Amboss (eiserner Dorn im Holzklotz),
   Werkzeug zum Gravieren und Hämmern an der Wand, der niedrige Hocker; vorn der heruntergeklappte Laden als Auslage
   (Vordergrund-Ebene vor Nedžads Füßen). Darüber das hölzerne Obergeschoss mit der Luke zum Dachboden; die Leiter lehnt
   seitlich (S.ladderUp: an der Luke). Rechts der Nachbarladen mit gravierten Tabletts im Schaufenster. Eine kleine Laterne
   am Arm. S.bookOut: das Auftragsbuch liegt aufgeschlagen auf der Werkbank. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex, R=M.R;
var W=320, H=144, GY=110;                               // Fußlinie der Fassaden
var WS={x0:122,x1:236,top:48,floor:101};               // Nedžads Werkstatt: Öffnung und Werkstattboden
var HATCH={x:200,y:12,w:16,h:14};                      // Luke zum Dachboden
var LANT=[119,46];                                     // Laterne am Arm
var LS={x0:34,x1:118};                                 // Kupferladen links
var NEI={x0:242,x1:320};                               // Nachbarladen
var COP=R('t0 t1 t2 t3 t4 t5'), BRS=R('y0 y1 y2 y3 y4 y5'), NIC=R('m0 m1 m2 m3 m4 s6');
var GLINT=[];                                          // Kupferstücke für die wandernden Glanzlichter: [x,y,r]
var LAMPW=[WS.x0+72,WS.top+10];                        // Glühbirne in der Werkstatt
var WARM=M.tintMake(function(r,g,b){ return [r*0.98+20, g*0.84+8, b*0.62+0]; });
function rnd(v){ return Math.round(v); }
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function vn(x,y){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, a=hash(xi,yi), b=hash(xi+1,yi), c=hash(xi,yi+1), d=hash(xi+1,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y){ return vn(x,y)*0.55+vn(x*2.03+5.1,y*2.03+1.7)*0.3+vn(x*4.1+2.3,y*4.1+8.1)*0.15; }
function ladderOf(S){ return S && S.ladderUp ? {x0:226,y0:113,x1:211,y1:25} : {x0:244,y0:113,x1:239,y1:54}; }

// ---------------------------------------------------------------- Kupferwaren
var DZ=[[3,2,3,4],[4,3,3,4,5],[5,3,4,5,6,6],[6,4,4,5,6,7,7],[7,5,5,6,7,8,8,8]];
function dzezva(b,cx,by,s,col,hd){ col=col||COP; hd=hd===undefined?1:hd; var rows=DZ[s], h=rows.length, top=by-h;
  for (var j=0;j<h;j++){ var wj=rows[j], x0=cx-(wj>>1); for (var i=0;i<wj;i++){ var u=i/Math.max(1,wj-1), c=u<0.3?col[4]:(u<0.6?col[3]:(u<0.85?col[2]:col[1])); if (j===0) c=(i===0)?col[5]:col[4]; if (j===h-1) c=(i<1)?col[2]:col[1]; b.px(x0+i,top+j,c); } }
  var lw=rows[0], lx=cx-(lw>>1); b.px(hd>0?lx-1:lx+lw,top,col[4]);
  var hx=hd>0?cx-(rows[1]>>1)+rows[1]:cx-(rows[1]>>1)-1, n=s+4; for (var k=0;k<n;k++) b.px(hx+k*hd,top+1-Math.floor(k/3),k>=n-1?P.k2:(k%2?P.w2:P.w1)); }
function dzHang(b,cx,ty,s,col){ col=col||COP; var rows=DZ[s], h=rows.length; b.vl(cx+2,ty-3,ty+1,P.k2);   // am Griff aufgehängt, Schnabel nach unten
  for (var k=0;k<s+3;k++) b.px(cx+2-Math.floor(k/3),ty+1+k,P.w1);
  for (var j=0;j<h;j++){ var wj=rows[h-1-j], x0=cx-(wj>>1); for (var i=0;i<wj;i++){ var u=i/Math.max(1,wj-1), c=u<0.3?col[4]:(u<0.6?col[3]:(u<0.85?col[2]:col[1])); if (j===0) c=col[2]; if (j===h-1) c=col[5]; b.px(x0+i,ty+s+3+j,c); } }
  GLINT.push([cx,ty+s+3+(h>>1),Math.max(2,s)]); }
function plate(b,cx,cy,r,col,noNail){ col=col||COP;   // gravierter Teller, frontal
  b.ellipse(cx+1,cy+1.2,r+0.3,r+0.3,P.k2);
  b.ellipse(cx,cy,r+0.5,r+0.5,function(x,y){ var dx=x+0.5-cx, dy=y+0.5-cy, d=Math.hypot(dx,dy)/(r+0.5), a=Math.atan2(dy,dx), c=col[3];
    if (d>0.84) c=(dx+dy<-0.3*r)?col[5]:((dx+dy>0.3*r)?col[1]:col[4]); else if (d>0.74) c=col[2];
    else { var ring=Math.abs(d-0.48)<0.07; if (ring) c=col[2]; else if (d<0.48 && d>0.18 && ((Math.floor(a*6/Math.PI)+12)%2)) c=col[4]; else if (d<0.14) c=col[2]; if (!ring && (dx-dy)<-r*0.2 && (dx-dy)>-r*0.75 && bayer(x,y)<0.5) c=M.UP[c]; }
    return c; });
  b.px(rnd(cx-r*0.5),rnd(cy-r*0.5),P.l0); if (!noNail) b.px(rnd(cx),rnd(cy-r)-1,P.k1); GLINT.push([cx,cy,r]); }
function ibrik(b,cx,ty,col){ col=col||COP;   // Kanne (Ibrik): birnenförmig, langer Schnabel, Henkel, Deckel mit Knauf
  b.vl(cx,ty-3,ty,P.k2); b.px(cx,ty+1,col[4]); b.rect(cx-1,ty+2,3,2,col[3]); b.hl(cx-1,cx+1,ty+2,col[5]);
  for (var j=0;j<11;j++){ var t=j/10, hw=j<3?1.5:(1.5+Math.sin((t-0.2)/0.8*Math.PI)*2.6); for (var i=-Math.ceil(hw);i<=Math.ceil(hw);i++){ var u=(i+hw)/(2*hw+0.01), c=u<0.3?col[4]:(u<0.6?col[3]:(u<0.85?col[2]:col[1])); b.px(cx+i,ty+4+j,c); } }
  b.hl(cx-2,cx+2,ty+15,col[1]); b.hl(cx-2,cx+2,ty+16,col[2]); b.line(cx-3,ty+9,cx-7,ty+3,col[3]); b.px(cx-7,ty+2,col[4]);
  b.line(cx+3,ty+5,cx+5,ty+7,col[2]); b.line(cx+5,ty+7,cx+4,ty+11,col[2]); b.px(cx-1,ty+6,P.l0); GLINT.push([cx,ty+9,3]); }
function fenjer(b,cx,ty,lit){   // Kupferlaterne mit Glas
  b.vl(cx,ty-4,ty,P.k2); b.px(cx,ty+1,P.t4); b.poly([[cx-2,ty+2],[cx+3,ty+2],[cx+4,ty+4],[cx-3,ty+4]],P.t3); b.hl(cx-3,cx+4,ty+4,P.t5);
  b.rect(cx-3,ty+5,8,7,lit?P.y4:P.a5); b.vl(cx-3,ty+5,ty+11,P.t2); b.vl(cx+4,ty+5,ty+11,P.t2); b.vl(cx,ty+5,ty+11,P.t3); if (!lit){ b.px(cx-2,ty+6,P.s6); b.vl(cx+2,ty+6,ty+10,P.a6); } else { b.rect(cx-1,ty+7,2,3,P.y5); b.px(cx-1,ty+8,P.l1); }
  b.hl(cx-3,cx+4,ty+12,P.t2); b.poly([[cx-3,ty+13],[cx+4,ty+13],[cx+2,ty+15],[cx-1,ty+15]],P.t3); b.px(cx,ty+16,P.t4); GLINT.push([cx,ty+8,3]); }
function sahan(b,cx,ty,r){   // Sahan: Schüssel mit Haubendeckel, an einer Kette
  b.vl(cx,ty-3,ty,P.k2); b.px(cx,ty+1,P.t5); b.ellipse(cx,ty+4,r*0.8,2.6,function(x,y){ return (x<cx-1)?P.t4:(x<cx+2?P.t3:P.t2); }); b.hl(cx-r,cx+r,ty+6,P.t5);
  b.ellipse(cx,ty+8.5,r,2.4,function(x,y){ return (x<cx-2)?P.t4:(x<cx+2?P.t3:P.t1); }); b.hl(cx-r+1,cx+r-1,ty+11,P.t1); GLINT.push([cx,ty+6,r]); }
function kazan(b,cx,by,r){   // großer Kupferkessel mit Eisenhenkel
  b.ellipse(cx+0.5,by-r*0.55,r,r*0.62,function(x,y){ var u=(x-cx+r)/(2*r), c=u<0.18?P.t4:(u<0.45?P.t3:(u<0.8?P.t2:P.t1)); if (u>0.2&&u<0.3&&y<by-r*0.7) c=P.t5; return c; });
  b.ellipse(cx+0.5,by-r*1.05,r*0.95,2.2,P.t1); b.ellipse(cx+0.5,by-r*1.05,r*0.8,1.4,P.k2); b.hl(rnd(cx-r*0.95),rnd(cx+r*0.95),rnd(by-r*1.05)-2,P.t5);
  for (var a=0;a<=20;a++){ var an=Math.PI+a/20*Math.PI; b.px(rnd(cx+Math.cos(an)*r*0.7),rnd(by-r*1.05+Math.sin(an)*r*0.55),P.k1); }
  b.hl(rnd(cx-r*0.6),rnd(cx+r*0.6),by,P.k2); GLINT.push([cx-r*0.4,by-r*0.6,r*0.5]); }

// ---------------------------------------------------------------- Fassadenbausteine
function plasterPx(x,y,base){ var n=fbm(x*0.09,y*0.11), c=M.rampAt(R('s3 s4 s5 s6'),(base||0.64)+(n-0.5)*0.45+(hash(x>>2,y>>1)-0.5)*0.08,x,y); if (fbm(x*0.2+5,y*0.05)>0.68 && bayer(x,y)<0.5) c=M.DN[c]; return c; }
function woodPx(x,y,v){ var g=Math.sin(x*0.9+fbm(x*0.1,y*0.4)*6)*0.5+0.5; return M.rampAt(R('w0 w1 w2 w3'),(v||0.5)+(g-0.5)*0.3,x,y); }
function planksV(x,y,x0,pw,v){ var u=((x-x0)%pw+pw)%pw, c=woodPx(x*3,y*0.3,v); if (u===0) c=P.w0; else if (u===1) c=M.UP[c]; return c; }
// weiß gekalktes Obergeschoss (kragt vor), Eckpfosten, Rähm und Schwelle aus dunklem Holz
function upper(b,x0,x1,y0,y1){ for (var yy=y0;yy<y1;yy++) for (var xx=x0;xx<x1;xx++) b.px(xx,yy,plasterPx(xx,yy,0.66));
  b.rect(x0,y0,2,y1-y0,P.w1); b.rect(x1-2,y0,2,y1-y0,P.w0); b.rect(x0,y1-3,x1-x0,3,P.w1); b.hl(x0,x1-1,y1-3,P.w3); b.hl(x0,x1-1,y1-1,P.w0);
  for (var xx2=x0+2;xx2<x1-2;xx2++) if (bayer(xx2,y0)<0.6) b.px(xx2,y0,P.s2); }
function latticeWin(b,x,y,w,h,shut){ b.rect(x-2,y-2,w+4,h+4,P.w1); b.hl(x-2,x+w+1,y-2,P.w3); b.rect(x,y,w,h,P.k2);
  for (var yy=y;yy<y+h;yy++) for (var xx=x;xx<x+w;xx++){ if (((xx-x+yy-y)%3===0)||((xx-x-(yy-y)+60)%3===0)) b.px(xx,yy,P.w2); }
  if (shut){ for (var k=0;k<2;k++){ var sx=k?x+w+2:x-2-(w>>1); for (yy=y-1;yy<y+h+1;yy++) for (xx=sx;xx<sx+(w>>1);xx++) b.px(xx,yy,((yy-y)%3===0)?P.w1:P.w2); } }
  b.hl(x-3,x+w+2,y+h+2,P.s5); b.hl(x-3,x+w+2,y+h+3,P.s2); }
// Traufe: tiefes Vordach mit Sparrenköpfen, darüber Holzschindeln; darunter ein Schattenband an der Wand
function eave(b,x0,x1,y,depth){ var yy, xx;
  for (yy=Math.max(0,y-depth-7);yy<y-depth;yy++) for (xx=x0-2;xx<x1+2;xx++){ var row=yy>>1, cc=(((xx+(row%2)*2)>>2)&1)?P.w2:P.w1; if ((yy&1)===0) cc=P.w0; if (hash(xx>>2,row)<0.12) cc=P.m1; b.px(xx,yy,cc); }
  for (yy=y-depth;yy<y;yy++) for (xx=x0;xx<x1;xx++){ var c=(xx%5<2)?P.w0:P.k2; if (yy===y-1) c=P.w1; if (yy<y-depth+2) c=((xx>>1)&1)?P.w3:P.w2; b.px(xx,yy,c); }
  for (xx=x0+2;xx<x1;xx+=5){ b.rect(xx,y-2,2,3,P.w2); b.px(xx,y-2,P.w3); b.px(xx+1,y,P.w0); } }
function shadowBand(b,x0,x1,y,h,n){ for (var yy=y;yy<y+h;yy++) for (var xx=x0;xx<x1;xx++){ if (bayer(xx,yy)<(1-(yy-y)/h)*(n||0.8)){ var c=b.get(xx,yy); if (c!==T) b.px(xx,yy,M.DN[c]); } } }
// hochgeklappter Laden (Ćepenak) als Vordach über einer Öffnung: schräg, Unterseite sichtbar, mit Stützen
function awning(b,x0,x1,y0,h){ for (var yy=y0-h;yy<y0;yy++){ var t=(yy-(y0-h))/h, ins=Math.round((1-t)*3); for (var xx=x0-2-ins;xx<x1+2+ins;xx++){ var c=planksV(xx,yy,x0,7,0.28+t*0.22); if (yy===y0-h) c=P.w5; if (yy===y0-h+1) c=P.w3; if (yy===y0-1) c=P.k2; b.px(xx,yy,c); } }
  for (var yy2=y0;yy2<y0+5;yy2++) for (var xx2=x0;xx2<x1;xx2++){ if (bayer(xx2,yy2)<(1-(yy2-y0)/5)*0.7){ var c2=b.get(xx2,yy2); if (c2!==T) b.px(xx2,yy2,M.DN[c2]); } }
  b.line(x0-1,y0+12,x0-4,y0-h+2,P.w1); b.line(x0,y0+12,x0-3,y0-h+2,P.w0); b.line(x1,y0+12,x1+3,y0-h+2,P.w1); b.line(x1-1,y0+12,x1+2,y0-h+2,P.w0); }

// ---------------------------------------------------------------- Pflaster: Kaldrma, runde Flusssteine in Perspektive (unregelmäßige Zellen)
var HZ=36, VPX=160;
function kaldrma(x,y,wet){ var d=y-HZ, gx=(x-VPX)*14.6/d, gz=2341/d, cz0=Math.floor(gz/0.9), cx0=Math.floor(gx), b1=1e9, b2=1e9, id=0, bx=0, bz=0;
  for (var j=-1;j<=1;j++) for (var i=-1;i<=1;i++){ var cx=cx0+i, cz=cz0+j, px=cx+0.5+(hash(cx,cz)-0.5)*0.7, pz=(cz+0.5+(hash(cz,cx+7)-0.5)*0.6)*0.9, dd=Math.hypot(gx-px,(gz-pz)*1.15);
    if (dd<b1){ b2=b1; b1=dd; id=hash(cx*3+1,cz*5+2); bx=gx-px; bz=gz-pz; } else if (dd<b2) b2=dd; }
  var e=b2-b1, c;
  if (e<0.12) c=(e<0.06)?P.k2:P.s0;
  else { c=id<0.25?P.s3:(id<0.5?P.s2:(id<0.7?P.e3:(id<0.85?P.m3:P.s4))); if (bz<-0.12 && bx<0.1) c=M.UP[c]; if (bz>0.22) c=M.DN[c]; if (e<0.2) c=M.DN[c]; }
  if (wet){ c=M.DN[c]; if (e>0.25 && bz<-0.15 && bayer(x,y)<0.4) c=P.m4; }
  return c; }

// ---------------------------------------------------------------- Malen
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), weather=M.scn.weather(GS), wet=weather==='rain', night=tod!=='day', x, y, i;
  GLINT=[];
  M.scn.sky(b,0,0,W,64,tod,wet?'rain':'fog',17);
  // ---- links: die Gasse verliert sich im Nebel (Läden werden kleiner), dahinter das Minarett
  M.scn.minaret(b,10,66,64,{stone:R('s3 s4 s5 s5'),cap:R('m2 m3 m3 m4')});
  // drei Läden hintereinander, je weiter, desto kleiner und blasser (Fluchtpunkt links)
  [[22,34,30,46,104],[10,23,44,57,100],[0,11,55,65,97]].forEach(function(f,k){ var x0=f[0], x1=f[1], et=f[2], ob=f[3], fl=f[4];
    for (y=et-4;y<et;y++) for (x=x0-1;x<x1+1;x++) b.px(x,y,((x+y)%3)?P.w1:P.w0);                                   // Dach und Traufe
    for (y=et;y<ob;y++) for (x=x0;x<x1;x++) b.px(x,y,plasterPx(x,y,0.62));                                          // Obergeschoss
    if (k<2){ b.rect(x0+3,et+3,4,4,P.w1); b.px(x0+4,et+4,P.k2); }
    for (y=ob;y<fl;y++) for (x=x0;x<x1;x++){ var c=(x===x0||x===x1-1)?P.w2:(y<ob+3?P.w2:((fbm(x*0.4,y*0.3)>0.55)?P.w0:P.k2)); b.px(x,y,c); }   // offener Laden
    for (var g=0;g<4;g++){ var gx=x0+2+((g*5+k*3)%Math.max(2,x1-x0-3)), gy=ob+4+((g*7)%Math.max(2,fl-ob-8)); b.px(gx,gy,P.t3); b.px(gx+1,gy,P.t4); }   // Kupferglanz
    b.hl(x0,x1-1,fl,P.w3); });
  for (y=GY-8;y<H;y++) for (x=0;x<W;x++) b.px(x,y,kaldrma(x,y,wet));
  // ---- Kupferladen links
  var L0=LS.x0, L1=LS.x1;
  eave(b,L0-4,L1+2,8,6); upper(b,L0,L1,8,34); latticeWin(b,L0+10,14,12,12,false); latticeWin(b,L0+38,14,12,12,true); latticeWin(b,L0+66,14,10,12,false);
  shadowBand(b,L0,L1,8,5,0.9);
  for (x=L0+3;x<L1;x+=10){ b.line(x,34,x+3,39,P.w1); b.line(x+1,34,x+4,39,P.w0); }                                         // Konsolen unter dem vorkragenden Geschoss
  b.rect(L0,38,L1-L0,6,P.w1); b.hl(L0,L1-1,38,P.w3); b.hl(L0,L1-1,43,P.w0);
  for (y=44;y<GY;y++) for (x=L0;x<L1;x++){ var c0=(x<L0+4||x>=L1-4)?planksV(x,y,L0,4,0.45):((y<99)?((fbm(x*0.2,y*0.2)>0.6)?P.w0:P.k2):(y<103?P.w2:plasterPx(x,y,0.42))); b.px(x,y,c0); }
  awning(b,L0+4,L1-4,52,9);
  for (x=L0+6;x<L1-6;x++){ b.px(x,68,P.w1); b.px(x,69,P.w0); b.px(x,82,P.w1); b.px(x,83,P.w0); }                              // Regale im Laden
  for (x=L0+9;x<L1-8;x+=7) dzezva(b,x,68,(x*7>>2)%4,(x%3)?COP:BRS,1);
  for (x=L0+11;x<L1-10;x+=12) plate(b,x,77,3+(x%2),(x%4===1)?NIC:COP,true);
  for (x=L0+8;x<L1-8;x+=9){ var sz=1+((x*3)%3); b.ellipse(x,96,sz+2,2,P.t2); b.hl(x-sz-1,x+sz+1,95,P.t4); }                 // Schüsseln am Boden
  b.rect(L0+2,99,L1-L0-4,4,P.w3); b.hl(L0+2,L1-3,99,P.w4); b.hl(L0+2,L1-3,102,P.w0);                                          // heruntergeklappter Laden
  [[L0+10,6],[L0+26,4],[L0+44,7],[L0+62,5],[L0+78,4]].forEach(function(p){ plate(b,p[0],99-p[1]+1,p[1],COP,true); });         // Tabletts schräg in der Auslage
  // vor dem Laden hängen Teller, Kannen, Laternen, Sahani und Džezve in allen Größen
  b.hl(L0-2,L1+2,53,P.k2);
  [[38,'p',6],[50,'i'],[58,'d',4],[64,'d',3],[69,'d',2],[73,'d',1],[76,'d',0],[84,'f'],[95,'s',5],[107,'p',5]].forEach(function(it){ var hx=it[0], k=it[1];
    if (k==='p') plate(b,hx,62,it[2]); else if (k==='i') ibrik(b,hx,54); else if (k==='d') dzHang(b,hx,54,it[2],(hx%3)?COP:BRS); else if (k==='f') fenjer(b,hx,54,false); else sahan(b,hx,54,it[2]); });
  // ---- Nedžads Werkstatt
  var X0=WS.x0, X1=WS.x1;
  eave(b,X0-4,X1+3,7,6); upper(b,X0,X1,7,30); latticeWin(b,X0+12,12,12,12,false); latticeWin(b,X0+42,12,12,12,false);
  shadowBand(b,X0,X1,7,5,0.9);
  b.rect(HATCH.x-2,HATCH.y-2,HATCH.w+4,HATCH.h+3,P.w0); for (y=HATCH.y;y<HATCH.y+HATCH.h;y++) for (x=HATCH.x;x<HATCH.x+HATCH.w;x++) b.px(x,y,planksV(x,y,HATCH.x,4,0.5));   // Luke zum Dachboden
  b.hl(HATCH.x,HATCH.x+HATCH.w-1,HATCH.y+3,P.m1); b.hl(HATCH.x,HATCH.x+HATCH.w-1,HATCH.y+10,P.m1); b.rect(HATCH.x+HATCH.w-4,HATCH.y+6,3,2,P.m2); b.hl(HATCH.x-3,HATCH.x+HATCH.w+2,HATCH.y+HATCH.h+1,P.w3);
  b.px(HATCH.x+1,HATCH.y+3,P.m3); b.px(HATCH.x+1,HATCH.y+10,P.m3);
  for (x=X0+3;x<X1;x+=10){ b.line(x,30,x+3,35,P.w1); b.line(x+1,30,x+4,35,P.w0); }
  b.rect(X0,34,X1-X0,6,P.w1); b.hl(X0,X1-1,34,P.w3); b.hl(X0,X1-1,39,P.w0);
  var sgw=M.microWidth('KAZANDŽIĆ')+M.microWidth('OD 1912')+14, sgx=rnd((X0+X1)/2-sgw/2)-6, sgy=33;                                // Schild „KAZANDŽIĆ · od 1912“
  b.rect(sgx-1,sgy-1,sgw+2,9,P.w0); b.rect(sgx,sgy,sgw,7,P.g1); b.hl(sgx,sgx+sgw-1,sgy,P.g2); b.hl(sgx,sgx+sgw-1,sgy+6,P.k2); b.vl(sgx,sgy,sgy+6,P.y2); b.vl(sgx+sgw-1,sgy,sgy+6,P.y2);
  M.microText(b,'KAZANDŽIĆ',sgx+3,sgy+1,P.y4); var dx2=sgx+3+M.microWidth('KAZANDŽIĆ')+3; b.px(dx2,sgy+3,P.y3); M.microText(b,'OD 1912',dx2+4,sgy+1,P.s5);
  for (y=40;y<GY;y++) for (x=X0;x<X1;x++){ var c1; if (x<X0+4||x>=X1-4) c1=planksV(x,y,X0,4,0.5); else if (y<WS.top) c1=P.w1;
      else if (y<WS.floor){ var ll=Math.max(0,1-Math.hypot((x-LAMPW[0])/62,(y-LAMPW[1]-22)/44)), u2=((x-X0)%9+9)%9; c1=M.rampAt(R('k1 k2 w0 w1 w2'),0.18+ll*0.62+(fbm(x*0.12,y*0.2)-0.5)*0.12,x,y); if (u2===0) c1=M.DN[c1]; if (y>WS.floor-10) c1=M.DN[c1]; }
      else c1=(y<WS.floor+3)?P.w2:plasterPx(x,y,0.42); b.px(x,y,c1); }
  awning(b,X0+3,X1-3,WS.top+2,9);
  b.hl(X0+4,X1-5,WS.floor,P.w3);
  // an der Vorderkante des Vordachs: ein paar Stücke zum Verkauf (die Mitte bleibt frei, man sieht Nedžad)
  b.hl(X0+2,X1-2,WS.top+2,P.k2); dzHang(b,X0+8,WS.top+3,3,COP); dzHang(b,X0+15,WS.top+3,1,BRS); plate(b,X0+24,WS.top+10,4); fenjer(b,X1-26,WS.top+3,false); dzHang(b,X1-16,WS.top+3,2,COP); dzHang(b,X1-10,WS.top+3,0,BRS);
  var tb={x:X0+8,y:56,w:46,h:22}; b.rect(tb.x,tb.y,tb.w,tb.h,P.w2); b.hl(tb.x,tb.x+tb.w-1,tb.y,P.w3); b.hl(tb.x,tb.x+tb.w-1,tb.y+tb.h-1,P.w0);   // Werkzeugbrett
  for (i=0;i<10;i++){ var tx=tb.x+3+i*4, kind=i%5; b.px(tx,tb.y+2,P.m3);
    if (kind===0){ b.vl(tx,tb.y+3,tb.y+13,P.w3); b.rect(tx-2,tb.y+2,5,3,P.m2); b.px(tx-2,tb.y+2,P.m4); }                       // Hammer
    else if (kind===1){ b.vl(tx,tb.y+3,tb.y+15,P.m3); b.px(tx,tb.y+16,P.m4); }                                               // Punze
    else if (kind===2){ b.vl(tx,tb.y+3,tb.y+11,P.w4); b.vl(tx,tb.y+12,tb.y+16,P.m3); }                                       // Stichel
    else if (kind===3){ b.line(tx-1,tb.y+3,tx-2,tb.y+14,P.k2); b.line(tx+1,tb.y+3,tx+2,tb.y+14,P.k2); b.rect(tx-1,tb.y+2,3,2,P.m2); }   // Zange
    else { b.vl(tx,tb.y+3,tb.y+9,P.w3); b.ellipse(tx,tb.y+11,1.6,2,P.m3); } }                                                  // Treibhammer
  b.rect(X0+60,60,50,2,P.w3); b.rect(X0+60,74,50,2,P.w3);                                                                   // Regal mit Werkstücken
  plate(b,X0+67,55,4,COP,true); dzezva(b,X0+81,60,3,COP,1); dzezva(b,X0+91,60,1,BRS,1); ibrik(b,X0+102,43,COP); b.ellipse(X0+70,72,5,2,P.t2); b.ellipse(X0+84,72,4,1.6,P.m3); plate(b,X0+98,68,3,NIC,true);
  b.vl(LAMPW[0],WS.top+2,LAMPW[1]-3,P.k2); b.rect(LAMPW[0]-1,LAMPW[1]-3,3,1,P.m2); b.ellipse(LAMPW[0],LAMPW[1],2,2.4,P.s5);   // nackte Glühbirne
  // Hocker, Amboss (Dorn im Holzklotz), Werkbank mit Schraubstock
  var sx=WS.x0+42; b.rect(sx-6,88,12,2,P.w3); b.hl(sx-6,sx+5,88,P.w4); b.vl(sx-5,90,WS.floor,P.w1); b.vl(sx+4,90,WS.floor,P.w1); b.hl(sx-5,sx+4,95,P.w0);
  var ax=WS.x0+58; b.rect(ax-4,92,9,WS.floor-92,P.w2); b.hl(ax-4,ax+4,92,P.w4); b.vl(ax-4,92,WS.floor-1,P.w3); b.vl(ax+4,92,WS.floor-1,P.w0); b.px(ax-2,96,P.w1); b.px(ax+1,99,P.w1);
  b.rect(ax-1,84,2,8,P.m1); b.vl(ax-1,84,91,P.m3); b.rect(ax-3,82,6,2,P.m2); b.hl(ax-3,ax+2,82,P.m4); b.px(ax-3,83,P.m3);
  var bx0=WS.x0+70, bx1=WS.x1-8, bt=86; b.rect(bx0,bt,bx1-bx0,3,P.w3); b.hl(bx0,bx1-1,bt,P.w4); b.hl(bx0,bx1-1,bt+3,P.w0);
  b.vl(bx0+1,bt+3,WS.floor,P.w1); b.vl(bx1-2,bt+3,WS.floor,P.w1); b.hl(bx0+1,bx1-2,bt+9,P.w0);
  b.rect(bx0+2,bt-6,6,6,P.m2); b.hl(bx0+2,bx0+7,bt-6,P.m4); b.rect(bx0+3,bt-8,4,2,P.m1); b.line(bx0+8,bt-4,bx0+12,bt-4,P.m3); b.px(bx0+13,bt-4,P.m4);   // Schraubstock
  if (!S.bookOut){ b.ellipse(bx0+20,bt-0.5,5,1.2,P.t4); b.hl(bx0+16,bx0+24,bt-1,P.t5); } b.line(bx0+27,bt-1,bx0+31,bt-2,P.w4); b.px(bx0+32,bt-2,P.m4);   // Teller in Arbeit, Stichel
  b.rect(bx1-8,bt-4,5,4,P.m1); b.hl(bx1-8,bx1-4,bt-4,P.m3); b.px(bx1-6,bt-5,P.b3);                                                                       // Lötlampe
  if (S.bookOut){ var bkx=bx0+11; b.rect(bkx,bt-3,16,3,P.r1); b.hl(bkx,bkx+15,bt-1,P.r0); b.rect(bkx+1,bt-5,7,3,P.s5); b.rect(bkx+8,bt-5,7,3,P.s4); b.vl(bkx+8,bt-5,bt-3,P.k2);
    for (i=0;i<2;i++){ b.hl(bkx+2,bkx+6,bt-4+i,P.s2); b.hl(bkx+9,bkx+13,bt-4+i,P.s2); } for (i=0;i<7;i++) b.px(bkx+1+Math.floor(hash(i,8)*14),bt-5+((i&1)),P.e3); }
  // ---- Laterne am Arm (zwischen den Läden), großer Kessel auf der Gasse
  b.line(LANT[0]-5,LANT[1]-9,LANT[0],LANT[1]-9,P.k2); b.line(LANT[0]-5,LANT[1]-9,LANT[0]-5,LANT[1]-3,P.k2); b.line(LANT[0]-5,LANT[1]-4,LANT[0]-1,LANT[1]-9,P.k2); fenjer(b,LANT[0],LANT[1]-7,night);
  kazan(b,46,113,9);
  // ---- Nachbarladen mit gravierten Tabletts im Schaufenster
  var N0=NEI.x0, N1=NEI.x1;
  eave(b,N0-3,N1,10,6); upper(b,N0,N1,10,36); latticeWin(b,N0+12,16,12,12,true); latticeWin(b,N0+48,16,12,12,false);
  shadowBand(b,N0,N1,10,5,0.9);
  for (x=N0+3;x<N1;x+=10){ b.line(x,36,x+3,41,P.w1); b.line(x+1,36,x+4,41,P.w0); }
  b.rect(N0,40,N1-N0,6,P.w1); b.hl(N0,N1-1,40,P.w3); b.hl(N0,N1-1,45,P.w0);
  for (y=46;y<GY;y++) for (x=N0;x<N1;x++) b.px(x,y,y<102?planksV(x,y,N0,6,0.42):plasterPx(x,y,0.42));
  var vw={x:N0+5,y:52,w:46,h:40}; b.rect(vw.x-2,vw.y-2,vw.w+4,vw.h+4,P.w3); b.hl(vw.x-2,vw.x+vw.w+1,vw.y-2,P.w4); b.rect(vw.x,vw.y,vw.w,vw.h,P.k2);   // Schaufenster
  for (y=vw.y;y<vw.y+vw.h;y++) for (x=vw.x;x<vw.x+vw.w;x++) if (fbm(x*0.2,y*0.2)>0.62) b.px(x,y,P.w0);
  plate(b,vw.x+12,vw.y+13,9,COP,true); plate(b,vw.x+33,vw.y+12,8,NIC,true); plate(b,vw.x+24,vw.y+30,7,COP,true); plate(b,vw.x+8,vw.y+31,4,NIC,true); plate(b,vw.x+40,vw.y+31,4,COP,true);
  b.rect(vw.x,vw.y+vw.h-3,vw.w,3,P.w2); b.hl(vw.x,vw.x+vw.w-1,vw.y+vw.h-3,P.w4);
  for (y=vw.y;y<vw.y+vw.h-3;y++){ if (((y*5)%23)<2) b.px(vw.x+((y*3+4)%vw.w),y,P.s4); }
  b.vl(vw.x+(vw.w>>1),vw.y,vw.y+vw.h-4,P.w2);
  var nd={x:N0+56,y:54,w:20,h:48}; M.prop.door(b,nd.x,nd.y,nd.w,nd.h,{ramp:R('w0 w1 w2 w3 w4'),frame:R('w0 w1 w2 w3'),glass:true,glassCol:P.k2,knob:'L'});
  b.rect(nd.x+3,nd.y+6,14,7,P.s5); b.hl(nd.x+3,nd.x+16,nd.y+6,P.s6); M.microText(b,'BAKAR',nd.x+4,nd.y+7,P.r2);
  // ---- Leiter (lehnt seitlich oder an der Luke)
  var ld=ladderOf(S), lx0=ld.x0, ly0=ld.y0, lx1=ld.x1, ly1=ld.y1, ow=5;
  b.line(lx0,ly0,lx1,ly1,P.w1); b.line(lx0+1,ly0,lx1+1,ly1,P.w3); b.line(lx0+ow+1,ly0,lx1+ow+1,ly1,P.w1); b.line(lx0+ow+2,ly0,lx1+ow+2,ly1,P.w3);
  for (i=1;i<16;i++){ var t=i/16, yy=rnd(ly0+(ly1-ly0)*t), xx=rnd(lx0+(lx1-lx0)*t); if (yy<ly1+2) break; b.hl(xx+1,xx+ow+1,yy,P.w4); b.hl(xx+1,xx+ow+1,yy+1,P.w1); }
  b.hl(lx0,lx0+ow+3,ly0+1,P.k2);
  // ---- Schatten an den Fassadenfüßen, Nebel und Licht
  for (x=0;x<W;x++) for (y=GY-1;y<GY+5;y++) if (bayer(x,y)<0.7-(y-GY)*0.15){ var cc=b.get(x,y); b.px(x,y,M.DN[cc]); }
  M.fogBake(b,function(xx,yy){ if (xx<34 && yy<GY+4){ var a=xx<11?0.74:(xx<23?0.58:0.4); if (yy<30) a+=0.12; return wet?a*0.7:a; } if (yy<9) return wet?0.15:0.32; if (yy<44) return wet?0.04:0.12; return 0; },{col:wet?P.m3:P.s4});
  M.light(b,function(xx,yy){ if (yy>=WS.top && yy<WS.floor && xx>WS.x0+3 && xx<WS.x1-4){ var d=Math.hypot((xx-LAMPW[0])/64,(yy-LAMPW[1]-26)/44); return d>0.8?-0.5:0; }
      if (yy>=53 && yy<99 && xx>=LS.x0+4 && xx<LS.x1-4) return -0.35; if (yy>=GY+4) return 0.1-(yy-GY)/34*0.5-(wet?0.25:0); return 0; },0,0);
  // warmes Werkstattlicht
  for (y=WS.top;y<WS.floor;y++) for (x=WS.x0+4;x<WS.x1-4;x++){ var dd=Math.hypot((x-LAMPW[0])/56,(y-LAMPW[1]-20)/40), q=cl((1-dd)*3-0.4,0,1); if (dd<1 && bayer(x,y)<q) b.px(x,y,M.tintPx(WARM,b.get(x,y),x,y)); }
  if (wet){ for (i=0;i<GLINT.length;i++){ var g=GLINT[i]; if (g[1]<92) for (y=GY+8;y<H;y+=3){ var rx=rnd(g[0]+Math.sin(y*0.7+i)*1.5); if (bayer(rx,y)<0.22*(1-(y-GY)/40)) b.px(rx,y,P.t3); } } }   // Kupfer spiegelt sich im nassen Pflaster
  if (night) return M.finishTOD(b,tod,{lights:[[LANT[0],LANT[1],40,0.9,30],[LAMPW[0],LAMPW[1]+20,50,0.8,36]],sky:function(xx,yy){ return yy<8 && xx<34; },after:function(bb){ fenjer(bb,LANT[0],LANT[1]-7,true); bb.ellipse(LAMPW[0],LAMPW[1],2,2.4,P.y5); }});
  b.ellipse(LAMPW[0],LAMPW[1],2,2.4,P.y5); b.px(LAMPW[0]-1,LAMPW[1]-1,P.l1);
  return b; }

// ---------------------------------------------------------------- Ebenen: heruntergeklappter Laden der Werkstatt (vor Nedžads Füßen)
function layers(S,GS,tod){ var L=[], lay=M.layer(WS.x0-2,92,WS.x1-WS.x0+4,20,WS.floor+5), w=M.lw(lay), x, y;
  for (y=97;y<WS.floor+3;y++) for (x=WS.x0+2;x<WS.x1-2;x++){ var c=planksV(x,y,WS.x0,9,0.5); if (y===97) c=P.w4; if (y===98) c=P.w3; if (y>=WS.floor+1) c=P.w0; w.px(x,y,c); }
  [[WS.x0+12,5],[WS.x0+38,3],[WS.x0+88,6],[WS.x0+104,4]].forEach(function(p){ w.ellipse(p[0],97-p[1]*0.6,p[1]+0.5,p[1]*0.6,function(xx,yy){ return (xx<p[0]-1)?P.t4:(xx<p[0]+2?P.t3:P.t2); }); w.hl(p[0]-p[1],p[0]+p[1],97,P.t5); w.px(p[0]-1,96-p[1]*0.6|0,P.l0); });   // Teller zum Verkauf
  w.rect(WS.x0+4,WS.floor+3,3,6,P.w1); w.rect(WS.x1-7,WS.floor+3,3,6,P.w1);
  if (tod!=='day') M.tintApply(lay,M.TINT[tod]||M.TINT.night);
  L.push(lay); return L; }

// ---------------------------------------------------------------- jedes Bild: wandernde Glanzlichter auf dem Kupfer
function dyn(fb,v,S,GS){ var t=v.t, cam=v.cam||0;
  for (var i=0;i<GLINT.length;i++){ var g=GLINT[i], ph=(t*0.35+hash(i,3)*6.3), a=ph%6.283; if (Math.sin(ph*0.7+i)<0.55) continue;
    var x=rnd(g[0]+Math.cos(a)*g[2]*0.6)-cam, y=rnd(g[1]-Math.abs(Math.sin(a))*g[2]*0.5); if (x>=0&&x<fb.w&&y>=0&&y<144){ fb.px(x,y,P.l0); if (Math.sin(ph*1.3)>0.6) fb.px(x+1,y,P.t5); } } }
function front(fb,v,S,GS){ if (M.scn.weather(GS)!=='rain') return; M.rain(fb,v.t,{n:70,col:P.m3,col2:P.s5,slant:0.15});
  for (var i=0;i<6;i++){ var x=[40,74,150,196,262,300][i], ph=(v.t*0.8+i*0.37)%1, y=rnd(12+ph*104); if (ph<0.9) fb.px(x,y,P.s5); } }   // Tropfen von den Traufen

// ---------------------------------------------------------------- Geistersicht: ein kurzer Schimmer an der Werkbank
function ghost(fb,v,S,GS){ if (GS.flags['k2.s1.benchSensed']) return; var t=v.t, ph=t%4.2; if (ph>1.6) return;
  var bx0=WS.x0+70, bx1=WS.x1-8, bt=86, k=ph/1.6, sx=bx0+(bx1-bx0)*k;
  for (var x=bx0;x<bx1;x++){ var d=Math.abs(x-sx); if (d<10 && bayer(x,bt+Math.floor(t*4))<(1-d/10)*0.9){ fb.px(x,bt-1,P.x5); if (d<4) fb.px(x,bt-2,P.x6); } }
  for (var i=0;i<6;i++){ var gx=rnd(sx-6+hash(i,2)*12), gy=rnd(bt-3-hash(i,3)*10*k); fb.px(gx,gy,P.x4); } }

// ---------------------------------------------------------------- Lauffläche
function walk(x,y){ if (y<114||y>140||x<6||x>314) return false; if (Math.hypot((x-46)/13,(y-114)/3.5)<1) return false; return true; }
M.defineArt('kazandziluk',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, front:front, ghost:ghost,
  spots:{
    exit:[0,56,16,88],
    shop:[WS.x0,WS.top-8,WS.x1-WS.x0,WS.floor-WS.top+14],
    workbench:[WS.x0+68,78,WS.x1-WS.x0-74,24],
    anvil:[WS.x0+53,80,12,22],
    tools:[WS.x0+6,54,50,26],
    copper:[LS.x0,52,LS.x1-LS.x0,48],
    dzezve:[54,52,28,18],
    trays:[NEI.x0+3,50,50,44],
    ladder:[206,22,48,92],
    attic:[HATCH.x-3,HATCH.y-3,HATCH.w+6,HATCH.h+6],
    sign:[WS.x0+16,32,86,10],
    neighbor:[NEI.x0,10,78,100],
    lantern:[LANT[0]-8,LANT[1]-12,14,24]
  },
  stands:{ exit:[10,124,'L'], shop:[178,116,'B'], workbench:[206,116,'B'], anvil:[180,116,'B'], tools:[152,116,'B'], copper:[76,118,'B'], dzezve:[68,118,'B'], trays:[270,118,'B'],
    ladder:[238,118,'B'], attic:[216,116,'B'], sign:[174,118,'B'], neighbor:[292,118,'B'], lantern:[119,118,'B'] },
  actorPos:{ nedzad:[WS.x0+42,WS.floor+1,'R'] },
  start:[14,124,'R'], entries:{ carsija:[14,124,'R'] }
});
})(M);
