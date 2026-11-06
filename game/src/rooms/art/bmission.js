/* ===== rooms/art/bmission.js — Bahnhofsmission am Gleis 11: ein heller, einfacher Aufenthaltsraum.
   Weiß-gelbe Wände über einem hellen Holzsockel, grüngrauer Linoleumboden, Leuchtstoffröhren. Links in der Seitenwand die
   Tür zum Lager (Schild „LAGER“), Garderobenhaken mit Jacken, darüber ein schmales Oberlicht zur Straße (Wetter). Hinten links
   die Pinnwand mit Zetteln (S.notice: der Aushang „Wer kannte diesen Mann?“ mit Foto), daneben ein Gummibaum. In der Mitte
   das große Fenster zum Bahnsteig: Bahnsteig 11, die Wagen des Zuges, darüber das Hallendach (Licht je nach Wetter).
   Rechts hinten die Theke mit dem großen Teekessel aus Edelstahl, Tassen, einem Korb Semmeln; Frau Wimmer dahinter.
   Rechts in der Seitenwand die Glastür zum Bahnsteig (Schrift von innen spiegelverkehrt). Links vorn ein Tisch mit
   Wachstuch (hier steht Sepps Pappkoffer, S.suitcaseOut), in der Mitte der lange Tisch, an dem die Gäste sitzen.
   S.farewell (Donnerstag): auf dem mittleren Tisch ein weißes Tuch, eine schlichte Urne aus Ton, daneben das Foto (Sepp mit
   Mütze) und eine Tasse Tee; davor Stühle im Halbkreis. Nichts Religiöses.
   Geistersicht: am Koffer ein dichter Nachhall von Briefen (fliegende Umschläge). ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=320, H=144, VP=[160,52], RECT=[44,16,276,94], F=100, FY=94;
var R3=M.room3(VP,F,FY), SPEC={vp:VP,rect:RECT};
var DOORL=[10,34,30,94];                                // Lagertür in der linken Wand
var DOORR=[8,36,26,94];                                 // Glastür zum Bahnsteig in der rechten Wand
var PIN={x0:50,x1:104,y0:28,y1:68};                     // Pinnwand
var WIN={x0:114,x1:196,y0:28,y1:66};                    // Fenster zum Bahnsteig
var CNT={X0:212,X1:274,Y0:72,Z0:14,Z1:28};              // Theke
var TA={X0:58,X1:100,Y0:79,Z0:24,Z1:40};                // Tisch links (Koffer)
var TB={X0:122,X1:188,Y0:79,Z0:30,Z1:46};               // langer Tisch Mitte (Gäste, Abschied)
var G1=[112,110], G2=[205,110];                         // Gäste sitzend (Hüfte x, Füße y)
var WIMMER=[252,98];
var ARC=[[112,54,'R'],[133,66,'B'],[155,71,'B'],[177,66,'B'],[198,54,'L']];   // Halbkreis (X,Z,Blick) vor dem Abschiedstisch
function rnd(v){ return Math.round(v); }
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function rp(p){ return [rnd(p[0]),rnd(p[1])]; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function vn(x,y){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, a=hash(xi,yi), b=hash(xi+1,yi), c=hash(xi,yi+1), d=hash(xi+1,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y){ return vn(x,y)*0.55+vn(x*2.03+5.1,y*2.03+1.7)*0.3+vn(x*4.1+2.3,y*4.1+8.1)*0.15; }
function qrect(q){ var xs=q.map(function(p){ return p[0]; }), ys=q.map(function(p){ return p[1]; }), x0=Math.floor(Math.min.apply(null,xs)), y0=Math.floor(Math.min.apply(null,ys)); return [x0,y0,Math.ceil(Math.max.apply(null,xs))-x0,Math.ceil(Math.max.apply(null,ys))-y0]; }
function wallUV(sd,x,y){ var ex=sd==='L'?RECT[0]:RECT[2], t=(ex-VP[0])/(x-VP[0]); if (t<=0) return null; var D=sd==='L'?(VP[0]-RECT[0]):(RECT[2]-VP[0]); return {u:(1/t-1)*D, v:VP[1]+(y-VP[1])*t}; }
function inUV(w,U){ return w && w.u>=U[0] && w.u<U[1] && w.v>=U[2] && w.v<U[3]; }
function wea(GS){ var w=M.scn.weather(GS); return (w==='snow'||w==='thaw'||w==='fog'||w==='sun')?w:'snowlie'; }
function mt(b,s,x,y,c){ var cx=x; for (var i=0;i<s.length;i++){ var ch=s[i], base={'Ä':'A','Ö':'O','Ü':'U'}[ch]||ch; M.microText(b,base,cx,y,c); if (base!==ch){ b.px(cx,y-2,c); b.px(cx+2,y-2,c); } cx+=M.microWidth(base)+1; } }

// ---------------------------------------------------------------- Licht: Leuchtstoffröhren, Fenster zur Halle
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var COOL=M.tintMake(function(r,g,b){ var L=lum(r,g,b); return [r*0.92+L*0.04, g*0.95+L*0.05+3, b*0.98+L*0.06+9]; });
var TF={ dusk:function(r,g,b){ var L=lum(r,g,b); return [r*0.55+L*0.10+12, g*0.40+L*0.09+5, b*0.46+L*0.08+18]; },
  night:function(r,g,b){ var L=lum(r,g,b); return [r*0.18+L*0.07, g*0.22+L*0.09, b*0.36+L*0.16+14]; },
  dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.55+L*0.12+12, g*0.52+L*0.10+8, b*0.64+L*0.12+22]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.74+L*0.3+14, g*0.72+L*0.28+14, b*0.62+L*0.28+16]; } };
var LV={};
function levels(tod){ if (LV[tod]) return LV[tod]; var a=[], n=7, A=TF[tod]||TF.night, B=TF.lamp;
  for (var i=0;i<n;i++){ (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(Math.pow(i/(n-1),1.2)); }
  return LV[tod]=a; }
function tubeAt(x,y){ var dx=(x-160)/190, dy=(y-82)/90, d=dx*dx+dy*dy; return d<1?Math.pow(1-d,0.7):0; }
var WLF=1;
function winAt(x,y){ var dx=(x-156)/120, dy=(y-92)/60, d=dx*dx+dy*dy; return d<1?Math.pow(1-d,1.5)*WLF:0; }
function vig(x,y){ var cx=(x-160)/200, cy=(y-76)/105, v=cx*cx+cy*cy; return -Math.max(0,v-0.32)*1.8; }
function shade(b,ox,oy,tod,mask){
  if (tod==='day'){ M.light(b,function(x,y){ return -0.35+tubeAt(x,y)*0.45+winAt(x,y)*0.3+vig(x,y)*1.1; },ox,oy,mask);
    for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ var k=y*b.w+x, c=b.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (mask && !mask(X,Y)) continue; if (bayer(X,Y)<tubeAt(X,Y)*0.07) b.d[k]=M.tintPx(COOL,c,X,Y); }
    return; }
  var L=levels(tod), n=L.length;
  for (var y2=0;y2<b.h;y2++) for (var x2=0;x2<b.w;x2++){ var k2=y2*b.w+x2, c2=b.d[k2]; if (c2===T) continue; var X2=x2+ox, Y2=y2+oy; if (mask && !mask(X2,Y2)) continue;
    var f=Math.min(1,tubeAt(X2,Y2)*0.95)*(n-1), i=Math.floor(f); if (f-i>bayer(X2,Y2)) i++; if (i>n-1) i=n-1; b.d[k2]=M.tintPx(L[i],c2,X2,Y2); } }

// ---------------------------------------------------------------- Texturen
function wall(u,v,x,y,dim){ var c;
  if (v>=92) c=(v===92)?P.w2:P.w1;
  else if (v>=70){ var bi=Math.floor((u+400)/7), fu=(u+400)-bi*7; c=(v===70)?P.w5:((v===71)?P.w2:(fu<1?P.w3:(hash(bi,3)<0.5?P.w4:P.w5))); }   // heller Holzsockel
  else { var f=fbm(u*0.03,v*0.05); c=(f>0.64 && bayer(x,y)<(f-0.64)*2.4)?P.s5:P.s6; if (v<RECT[1]+3) c=P.s5; if (v>=40 && v<41) c=P.s5; }
  for (var i=0;i<dim;i++) c=M.DN[c]; return c; }
function wallBack(u,v,x,y){ return wall(u+RECT[0],v+RECT[1],x,y,0); }
function wallSide(u,v,x,y,sd){ return wall(u*1.6+(sd==='L'?0:300),v+RECT[1],x,y,1); }
function floorTex(xb,d,x,y){ var f=R3.floor(x,y); if (!f) return P.k1; var X=f.X, Z=f.Z, s=18, ix=Math.floor((X+700)/s), iz=Math.floor((Z+700)/s), fx=(X+700)-ix*s, fz=(Z+700)-iz*s;
  var g=fbm(X*0.04+ix*0.3,Z*0.06), c=(g>0.55 && bayer(x,y)<(g-0.55)*1.6)?P.e4:P.s4; if (fx<0.6||fz<0.6) c=P.e3;
  var wear=Math.exp(-Math.pow((Z-62)/14,2))*Math.exp(-Math.pow((X-200)/70,2)); if (wear>0.35 && bayer(x,y)<(wear-0.35)*0.5) c=P.s5; return c; }
function ceilTex(xb,d,x,y){ var c=P.s5; if ((Math.floor(xb+600)%28)<1) c=P.s4; if ((d%9)===0) c=P.s4; return c; }

// ---------------------------------------------------------------- Blick zum Bahnsteig (Halle) und Oberlicht zur Straße
var WM=new Uint8Array(W*H);       // 1 = Fenster zur Halle, 2 = Oberlicht/Tür nach draußen
function hallAt(x,y,w,tod){ var lx=x-WIN.x0, ly=y-WIN.y0, night=tod==='night', c;
  // oben das Glasdach der Halle mit Bindern, je nach Wetter hell oder grau, Schnee darauf
  var gl={snowlie:'s4 s5 s6',sun:'s5 s6 l1',thaw:'m3 m4 s4',snow:'s3 s4 s5',fog:'s4 s4 s5'}[w]; if (night) gl='k2 n0 n1';
  c=ra(R(gl),0.3+ly/22,x,y); if ((lx+ly*2)%17<2) c=P.m2; if (ly%6===0) c=P.m1;
  if ((w==='snowlie'||w==='snow') && ((lx>>3)+(ly>>2))%3===0 && ly<10) c=P.m3;
  // Zug: graue Wagen mit rotem Band, Fensterreihe, Türen
  if (ly>=12 && ly<29){ var dy=ly-12, L=(lx+5)%40; c=(dy<1)?P.m3:((dy<2)?P.m4:P.s4); if (dy>=4 && dy<9 && (L%7)<5 && L<35) c=night?P.y3:(((L+dy)%4===0)?P.c3:P.c1); if (dy>=11 && dy<13) c=P.r2; if (dy>=15) c=P.m2; if (L>=35){ c=(dy>=3&&dy<15)?P.m2:P.s3; if (L===37) c=P.m1; } if (dy===16) c=P.k2; }
  // Bahnsteig: Platten, weiße Kante
  if (ly>=29){ c=(ly===29)?P.s6:(((lx>>3)+(ly>>1))%2?P.m3:P.s3); if (ly===30) c=P.s2; }
  // Säule der Halle
  if (lx>=56 && lx<59 && ly<30){ c=(lx===56)?P.m3:P.m1; }
  return c; }
function outsideAt(x,y,w,tod,ly){ var night=tod==='night', c, SK={snowlie:'b2 b3 b4',sun:'b3 b4 b5',thaw:'m3 m4 s4',snow:'m4 s4 s5',fog:'s4 s5 s5'}[w];
  c=ra(R(night?'k1 n0 n1':SK),0.2+ly/12,x,y);
  if (ly>6){ c=(w==='thaw')?P.m2:((ly===7)?P.s6:P.e3); if (night && hash(x,y)<0.2) c=P.y3; }    // Hausdach gegenüber mit Schnee
  return c; }

// ---------------------------------------------------------------- Pinnwand mit Zetteln, Aushang
function pinboard(b,S){ var p=PIN, x, y, r=M.rng(41);
  b.rect(p.x0-2,p.y0-2,p.x1-p.x0+4,p.y1-p.y0+4,P.w3); b.hl(p.x0-2,p.x1+1,p.y0-2,P.w4); b.hl(p.x0-2,p.x1+1,p.y1+1,P.w1);
  b.fn(p.x0,p.y0,p.x1-p.x0,p.y1-p.y0,function(xx,yy){ var h=hash(xx,yy); return h<0.2?P.e3:(h<0.8?P.e4:P.s4); });
  // Zettel: Fahrplan, Abreißzettel, Kinderzeichnung, Flugblätter
  var notes=[[52,30,14,18,P.s6,'plan'],[68,31,11,13,P.y4,'lines'],[52,51,12,15,P.s6,'tear'],[82,50,13,10,P.b4,'lines'],[66,48,13,17,P.s6,'kid'],[90,31,12,16,P.g5,'lines'],[95,50,8,12,P.r4,'lines']];
  notes.forEach(function(n){ var nx=n[0], ny=n[1], nw=n[2], nh=n[3]; b.rect(nx,ny,nw,nh,n[4]); b.vl(nx+nw,ny+1,ny+nh,P.e2); b.hl(nx+1,nx+nw,ny+nh,P.e2);
    if (n[5]==='plan'){ for (y=ny+2;y<ny+nh-1;y+=2) for (x=nx+1;x<nx+nw-1;x+=4){ b.hl(x,x+2,y,P.m3); } b.hl(nx+1,nx+nw-2,ny+1,P.b1); }
    else if (n[5]==='tear'){ for (y=ny+2;y<ny+8;y+=2) b.hl(nx+1,nx+nw-2,y,P.m3); for (x=nx;x<nx+nw;x+=2) b.vl(x,ny+10,ny+nh-1,P.m2); }
    else if (n[5]==='kid'){ b.hl(nx+1,nx+nw-2,ny+nh-3,P.g3); b.ellipse(nx+nw-4,ny+4,2,2,P.y3); b.rect(nx+3,ny+7,5,4,P.r3); b.px(nx+5,ny+6,P.r3); b.px(nx+4,ny+5,P.r2); b.px(nx+6,ny+5,P.r2); b.vl(nx+3,ny+11,ny+12,P.w2); }
    else { for (y=ny+2;y<ny+nh-1;y+=2) b.hl(nx+1,nx+nw-2-((y*3)%4),y,P.m2); }
    b.px(nx+(nw>>1),ny,[P.r3,P.b2,P.y3,P.g3][Math.floor(r()*4)]); });
  if (S && S.notice){ // Aushang: weißes Blatt, Überschrift, Foto eines alten Mannes mit Mütze
    var ax=74, ay=33, aw=26, ah=34; b.rect(ax+1,ay+1,aw,ah,P.e3); b.rect(ax,ay,aw,ah,P.s6);
    M.microText(b,'WER',ax+2,ay+2,P.k1); M.microText(b,'KANNTE',ax+1,ay+8,P.k1);
    var fx=ax+5, fy=ay+15; b.rect(fx,fy,16,14,P.m3); b.fn(fx+1,fy+1,14,12,function(xx,yy){ return ra(R('m2 m3 m4'),0.8-(yy-fy)/14,xx,yy); });
    b.rect(fx+5,fy+2,6,2,P.k1); b.hl(fx+4,fx+11,fy+4,P.k1); b.px(fx+8,fy+3,P.y3); b.rect(fx+5,fy+5,6,4,P.s3); b.hl(fx+6,fx+9,fy+7,P.m4); b.rect(fx+4,fy+9,8,4,P.c0); b.px(fx+7,fy+10,P.y3);   // Mütze mit Messingschild, Gesicht, Jacke
    b.hl(ax+3,ax+aw-4,ay+aw+4,P.m3); b.hl(ax+3,ax+aw-8,ay+aw+6,P.m3);
    b.px(ax+aw/2|0,ay-1,P.r3); b.px(ax+2,ay+1,P.b2); NOTICE=[ax-1,ay-2,aw+3,ah+3]; } }
var NOTICE=[74,31,29,37];

// ---------------------------------------------------------------- Malen
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), w=wea(GS), x, y, i;
  WLF=(tod==='night')?0.2:({snowlie:1,sun:1.1,thaw:0.6,snow:0.75,fog:0.65}[w]);
  WM.fill(0);
  M.box(b,{vp:VP,rect:RECT,back:wallBack,side:wallSide,floor:floorTex,ceil:ceilTex});
  b.hl(RECT[0],RECT[2]-1,RECT[1],P.s4);
  // Leuchtstoffröhren
  [[104,34],[216,34]].forEach(function(n){ var a=R3.p(n[0]-18,RECT[1],n[1]), c=R3.p(n[0]+18,RECT[1],n[1]), y0=rnd(a[1])+1; b.rect(rnd(a[0]),y0,rnd(c[0]-a[0]),3,P.s3); b.hl(rnd(a[0])+1,rnd(c[0])-2,y0+1,P.l1); b.hl(rnd(a[0]),rnd(c[0]),y0+3,P.m3); });
  // ---- linke Wand: Lagertür, Haken mit Jacken, Oberlicht, Feuerlöscher
  var dq=M.wallQuad(SPEC,'L',DOORL[0],DOORL[1],DOORL[2],DOORL[3]), dq2=M.wallQuad(SPEC,'L',DOORL[0]-2,DOORL[1]+2,DOORL[2]-3,DOORL[3]);
  b.poly(dq2,P.s4); b.poly(dq,function(xx,yy){ var wv=wallUV('L',xx,yy); if (!wv) return P.w3; var lu=(wv.u-DOORL[0])/(DOORL[1]-DOORL[0]); return ((xx+(yy>>3))%7===0)?P.w3:((lu>0.85)?P.w2:P.w4); });
  var ls=rp(M.wallPt(SPEC,'L',DOORL[0]+8,42)); b.rect(ls[0]-1,ls[1],13,7,P.s6); b.hl(ls[0]-1,ls[0]+11,ls[1]+6,P.m2); M.microText(b,'LAGER',ls[0],ls[1]+1,P.k1);
  var kn=rp(M.wallPt(SPEC,'L',DOORL[1]-4,64)); b.rect(kn[0]-1,kn[1],3,1,P.m4); b.px(kn[0],kn[1]+1,P.m3);
  var hk=rp(M.wallPt(SPEC,'L',DOORL[1]+6,46)); b.hl(hk[0]-2,hk[0]+16,hk[1],P.w2);
  [[0,P.r2,P.r3],[6,P.c2,P.c3],[12,P.y2,P.y3]].forEach(function(j){ var jx=hk[0]+j[0]; b.px(jx+1,hk[1]+1,P.m3); b.poly([[jx-1,hk[1]+2],[jx+3,hk[1]+2],[jx+4,hk[1]+20],[jx-2,hk[1]+21]],function(xx,yy){ return (xx<jx)?j[1]:(((xx+yy)%5===0)?j[1]:j[2]); }); });
  var fe=rp(M.wallPt(SPEC,'L',DOORL[1]+22,86)); b.rect(fe[0]-2,fe[1]-12,5,13,P.r2); b.vl(fe[0]-2,fe[1]-12,fe[1],P.r3); b.rect(fe[0]-1,fe[1]-15,3,3,P.k2); b.rect(fe[0]-1,fe[1]-8,3,3,P.s5);
  // ---- rechte Wand: Glastür zum Bahnsteig (Schrift spiegelverkehrt), Uhr
  var rq2=M.wallQuad(SPEC,'R',DOORR[0]-2,DOORR[1]+2,DOORR[2]-2,DOORR[3]);
  b.poly(rq2,P.m3); for (y=0;y<H;y++) for (x=RECT[2];x<W;x++){ var rv=wallUV('R',x,y); if (!inUV(rv,[DOORR[0],DOORR[1],DOORR[2],DOORR[3]])) continue; var lu=(rv.u-DOORR[0])/(DOORR[1]-DOORR[0]), lv=(rv.v-DOORR[2])/(DOORR[3]-DOORR[2]);
    var c=P.m2; if (lu>0.08&&lu<0.92&&lv>0.04&&lv<0.62){ c=hallAt(WIN.x0+rnd(lu*60),WIN.y0+rnd(14+lv*28),w,tod); WM[y*W+x]=1; } else if (lu>0.08&&lu<0.92&&lv>0.66&&lv<0.95) c=((x+y)%5===0)?P.s4:P.e4; b.px(x,y,c); }
  var tmp=new M.Buf(64,7,T); M.microText(tmp,'BAHNHOFSMISSION',0,0,P.s6); var tw=M.microWidth('BAHNHOFSMISSION');
  for (y=0;y<5;y++) for (x=0;x<tw;x++){ if (tmp.get(x,y)===T) continue; var mp=rp(M.wallPt(SPEC,'R',DOORR[1]-2-(x*0.44),DOORR[2]+7+y*1.1)); b.px(mp[0],mp[1],P.s6); WM[mp[1]*W+mp[0]]=0; }
  var hb=rp(M.wallPt(SPEC,'R',DOORR[0]+3,60)), hb2=rp(M.wallPt(SPEC,'R',DOORR[0]+3,68)); b.rect(hb[0],hb[1],2,hb2[1]-hb[1],P.m4);
  var ck=rp(M.wallPt(SPEC,'R',DOORR[1]+12,30)); b.ellipse(ck[0]+0.5,ck[1]+0.5,3.6,4.8,P.m1); b.ellipse(ck[0]+0.5,ck[1]+0.5,2.6,3.8,P.s6); b.vl(ck[0],ck[1]-3,ck[1],P.k1); b.px(ck[0]+1,ck[1]+1,P.k1);
  // ---- Rückwand: Pinnwand, Gummibaum, Fenster, Theke mit Wandbord
  pinboard(b,S);
  for (y=WIN.y0;y<WIN.y1;y++) for (x=WIN.x0;x<WIN.x1;x++){ b.px(x,y,hallAt(x,y,w,tod)); WM[y*W+x]=1; }
  var fa={fog:0.55,snow:0.18,thaw:0.1}[w]||0; if (fa && tod==='day') M.fogBake(b,function(xx,yy){ return WM[yy*W+xx]===1?fa*(0.7+0.3*(1-(yy-WIN.y0)/(WIN.y1-WIN.y0))):0; },{col:P.m4,x:WIN.x0,y:WIN.y0,w:WIN.x1-WIN.x0,h:WIN.y1-WIN.y0});
  b.rect(WIN.x0-3,WIN.y0-3,WIN.x1-WIN.x0+6,3,P.s4); b.rect(WIN.x0-3,WIN.y1,WIN.x1-WIN.x0+6,3,P.s4); b.rect(WIN.x0-3,WIN.y0,3,WIN.y1-WIN.y0,P.s4); b.rect(WIN.x1,WIN.y0,3,WIN.y1-WIN.y0,P.s4);
  b.hl(WIN.x0-3,WIN.x1+2,WIN.y0-3,P.s6); b.hl(WIN.x0-5,WIN.x1+4,WIN.y1+3,P.s6); b.hl(WIN.x0-5,WIN.x1+4,WIN.y1+4,P.s3);
  for (y=WIN.y0;y<WIN.y1;y++){ var mx=rnd((WIN.x0+WIN.x1)/2); b.px(mx,y,P.s4); b.px(mx+1,y,P.s3); WM[y*W+mx]=0; WM[y*W+mx+1]=0; }
  // Vorhang links und rechts (gelb, kurz gerafft)
  [[WIN.x0-6,1],[WIN.x1-3,-1]].forEach(function(q){ for (y=WIN.y0-4;y<WIN.y1+2;y++) for (var k=0;k<9;k++){ var xx=q[0]+k, sw=Math.sin((y-WIN.y0)*0.25)*0.6+(k%3===0?-1:0); if (k>6 && (y>WIN.y0+8 && y<WIN.y1-6)) continue; b.px(xx,y,(k%3===0)?P.y2:((sw>0)?P.y4:P.y3)); WM[y*W+xx]=0; } });
  b.hl(WIN.x0-8,WIN.x1+8,WIN.y0-5,P.w1);
  // Heizkörper unter dem Fenster
  for (y=WIN.y1+7;y<WIN.y1+18;y++) for (x=WIN.x0+6;x<WIN.x1-6;x++){ b.px(x,y,((x-WIN.x0)%4===0)?P.s3:P.s5); } b.hl(WIN.x0+6,WIN.x1-7,WIN.y1+7,P.s6);
  // Gummibaum hinten links
  var gp=rp(R3.p(108,FY,6)); b.rect(gp[0]-5,gp[1]-9,11,9,P.t2); b.hl(gp[0]-6,gp[0]+6,gp[1]-10,P.t4); b.vl(gp[0]+5,gp[1]-9,gp[1]-1,P.t1);
  b.line(gp[0],gp[1]-10,gp[0]-1,gp[1]-34,P.w1); var rr=M.rng(31); for (i=0;i<16;i++){ var lx=gp[0]-7+Math.floor(rr()*14), ly=gp[1]-46+Math.floor(rr()*34), dir=rr()<0.5?-1:1; for (var k=0;k<5;k++){ b.px(lx+k*dir,ly+Math.floor(k*0.4),k<2?P.g3:P.g4); b.px(lx+k*dir,ly+1+Math.floor(k*0.4),P.g2); } b.px(lx+dir,ly,P.g5); }
  // Wandbord über der Theke: Tassen, Teedosen, Schild „TEE KAFFEE“
  var sh0=rp(R3.p(CNT.X0+4,48,0)); b.hl(sh0[0],RECT[2]-4,sh0[1],P.w4); b.hl(sh0[0],RECT[2]-4,sh0[1]+1,P.w2);
  for (x=sh0[0]+2;x<RECT[2]-8;x+=5){ var col=[P.s6,P.r3,P.b3,P.s6,P.y3,P.g4][Math.floor(hash(x,9)*6)]; b.rect(x,sh0[1]-4,3,4,col); b.px(x+3,sh0[1]-3,col); }
  var stw=M.microWidth('TEE KAFFEE'); b.rect(sh0[0]+2,sh0[1]-14,stw+6,8,P.w1); b.rect(sh0[0]+3,sh0[1]-13,stw+4,6,P.k2); M.microText(b,'TEE KAFFEE',sh0[0]+5,sh0[1]-13,P.s6);
  var kal=rp(M.wallPt(SPEC,'L',DOORL[1]+6,30)); b.rect(kal[0],kal[1]-10,12,16,P.s6); b.rect(kal[0]+1,kal[1]-9,10,6,P.g4); b.hl(kal[0]+1,kal[0]+10,kal[1]-5,P.s4); for (y=kal[1]-2;y<kal[1]+5;y+=2) for (x=kal[0]+1;x<kal[0]+11;x+=2) b.px(x,y,P.m3);
  // ---- Tisch links: Stühle (hinten)
  chairL(b,TA,'back');
  // ---- Licht
  shade(b,0,0,tod,function(x,y){ return !WM[y*W+x]; });
  if (tod!=='day') M.tintApply(b,M.TINT[tod]||M.TINT.night,0,0,W,H,function(x,y){ return WM[y*W+x]===2; });
  return b; }
// Stuhl hinter einem Tisch (Lehne sichtbar über der Tischplatte)
function chairL(b,t,mode){ var X=(t.X0+t.X1)/2, p=rp(R3.p(X,FY,t.Z0-3)), sy=rnd(R3.p(0,80,t.Z0-3)[1]);
  b.rect(p[0]-5,sy-12,11,3,P.w2); b.hl(p[0]-5,p[0]+5,sy-12,P.w4); b.vl(p[0]-5,sy-12,p[1],P.w1); b.vl(p[0]+5,sy-12,p[1],P.w1); b.rect(p[0]-5,sy-2,11,2,P.w3); }

// ---------------------------------------------------------------- Möbel als Ebenen
function chairSide(w,x,fy,face){ var sy=fy-13, s=face==='R'?-1:1, bx=x+s*6;   // Holzstuhl im Profil, Lehne hinter der sitzenden Figur
  w.line(x-4,sy+2,x-5,fy,P.w1); w.line(x+4,sy+2,x+5,fy,P.w1); w.hl(x-4,x+4,sy+7,P.w0);
  w.rect(x-5,sy,11,3,P.w3); w.hl(x-5,x+5,sy,P.w4); w.hl(x-5,x+5,sy+2,P.w1);
  w.vl(bx,sy-15,sy+2,P.w2); w.vl(bx+s,sy-15,sy-1,P.w3); w.rect(bx-(s>0?0:1),sy-14,2,8,P.w3); w.px(bx,sy-16,P.w4); }
function chairBack(w,x,fy){ var sy=fy-13;   // Stuhl mit der Lehne zum Betrachter (Halbkreis)
  w.line(x-5,sy+1,x-5,fy,P.w1); w.line(x+5,sy+1,x+5,fy,P.w1); w.vl(x-3,sy+2,fy-1,P.w0); w.vl(x+3,sy+2,fy-1,P.w0);
  w.rect(x-6,sy-1,13,3,P.w3); w.hl(x-6,x+6,sy-1,P.w4);
  w.vl(x-5,sy-16,sy,P.w2); w.vl(x+5,sy-16,sy,P.w2); w.rect(x-5,sy-16,11,5,P.w3); w.hl(x-5,x+5,sy-16,P.w5); w.hl(x-4,x+4,sy-12,P.w1); w.hl(x-5,x+5,sy-8,P.w2); }
function oilcloth(t,kind){ return function(x,y){ var u=x+(kind?3:0), v=y; if (kind===2) return ((x+y)%9===0)?P.s5:P.s6;                       // weißes Tuch
  if (kind===1){ var fl=((x*3+y*7)%13); return fl<2?P.y3:(fl<3?P.g4:P.s5); }                                                                   // Wachstuch mit Blümchen
  return (((Math.floor(u/3)+Math.floor(v/2))&1)?P.b4:P.s6); }; }                                                                                // blau-weiß kariert
function tableBox(w,t,kind){ R3.box(w,t.X0,t.X1,t.Y0,t.Y0+1.6,t.Z0,t.Z1,{top:oilcloth(t,kind),front:kind===2?P.s5:((kind===1)?P.y3:P.b3),left:kind===2?P.s4:P.b2,right:kind===2?P.s4:P.b2});
  var hang=kind===2?3:2, f0=rp(R3.p(t.X0,t.Y0+1.6,t.Z1)), f1=rp(R3.p(t.X1,t.Y0+1.6,t.Z1)); w.rect(f0[0],f0[1],f1[0]-f0[0],hang,kind===2?P.s5:((kind===1)?P.y3:P.b3)); w.hl(f0[0],f1[0]-1,f0[1]+hang-1,kind===2?P.s4:P.b2);
  [[t.X0+3,t.Z1-3],[t.X1-3,t.Z1-3]].forEach(function(l){ var a=rp(R3.p(l[0],t.Y0+1.6,l[1])), z=rp(R3.p(l[0],FY,l[1])); w.rect(a[0]-1,a[1]+hang,2,z[1]-a[1]-hang,P.w1); w.vl(a[0]-1,a[1]+hang,z[1]-1,P.w2); }); }
var SUIT=[0,0,0,0], URN=[0,0,0,0], CUP=[0,0], KET=[0,0];
function layers(S,GS,tod){ var L=[], far=!!S.farewell;
  function fin(l){ shade(l,l.ox,l.oy,tod); L.push(l); return l; }
  // Theke mit Teekessel (vor Frau Wimmer)
  var cr=R3.rect(CNT.X0,CNT.X1,CNT.Y0,FY,CNT.Z0,CNT.Z1), cl0=M.layer(cr[0]-2,cr[1]-30,cr[2]+6,cr[3]+32,cr[1]+cr[3]), cw=M.lw(cl0);
  R3.box(cw,CNT.X0,CNT.X1,CNT.Y0,FY,CNT.Z0,CNT.Z1,{top:function(x,y){ return ((x+y*3)%11===0)?P.s4:P.s5; },front:function(x,y){ var by=rnd(R3.p(0,CNT.Y0,CNT.Z1)[1]), yy=y-by; if (yy<2) return P.s6; if (yy>=19) return P.w1; return ((x%9)===0)?P.w2:P.w4; },left:P.w3});
  var ct=rp(R3.p(CNT.X0,CNT.Y0,CNT.Z1)), cty=ct[1]-1;
  // großer Teekessel (Edelstahl) mit Hahn, Becherstapel, Semmelkorb, Zuckerdose, Thermoskanne
  var kx=ct[0]+6; cw.rect(kx,cty-18,12,18,P.m3); cw.vl(kx,cty-18,cty-1,P.m4); cw.vl(kx+1,cty-18,cty-1,P.s6); cw.vl(kx+10,cty-18,cty-1,P.m2); cw.vl(kx+11,cty-18,cty-1,P.m1); cw.hl(kx,kx+11,cty-18,P.m4); cw.hl(kx+1,kx+10,cty-19,P.m3); cw.rect(kx+4,cty-21,4,2,P.k2);
  cw.hl(kx,kx+11,cty-10,P.m2); cw.rect(kx+4,cty-6,4,2,P.k2); cw.px(kx+5,cty-4,P.k2); cw.rect(kx-2,cty-14,2,4,P.k2); cw.rect(kx+12,cty-14,2,4,P.k2); cw.px(kx+3,cty-16,P.l1); KET=[kx+6,cty-22];
  for (var i=0;i<3;i++){ cw.rect(kx+16,cty-3-i*3,5,3,P.s6); cw.hl(kx+16,kx+20,cty-3-i*3,P.s5); } cw.rect(kx+22,cty-3,5,3,P.r3); cw.rect(kx+22,cty-6,5,3,P.s6);
  var bk=kx+30; cw.rect(bk,cty-4,12,4,P.w2); cw.hl(bk,bk+11,cty-4,P.w4); for (var q=0;q<4;q++) cw.ellipse(bk+2+q*3,cty-5,1.6,1.2,P.e4);
  cw.rect(bk+15,cty-6,4,6,P.s5); cw.rect(bk+15,cty-8,4,2,P.m3); cw.rect(bk+21,cty-10,4,10,P.r2); cw.rect(bk+22,cty-12,2,2,P.k2);
  fin(cl0);
  // Tisch links (Koffer)
  var ta=R3.rect(TA.X0,TA.X1,TA.Y0,FY,TA.Z0,TA.Z1), al=M.layer(ta[0]-6,ta[1]-22,ta[2]+12,ta[3]+24,ta[1]+ta[3]), aw=M.lw(al);
  tableBox(aw,TA,0); var a0=rp(R3.p(TA.X0,TA.Y0,TA.Z1)), a1=rp(R3.p(TA.X1,TA.Y0,TA.Z1)), ay=a0[1]-1;
  if (S.suitcaseOut){ // Sepps Pappkoffer: braune Pappe, helle Kanten, Schnur, Griff
    var sx=rnd((a0[0]+a1[0])/2)-11; aw.rect(sx,ay-12,22,12,P.e2); aw.hl(sx,sx+21,ay-12,P.e4); aw.vl(sx,ay-12,ay-1,P.e3); aw.vl(sx+21,ay-12,ay-1,P.e1); aw.hl(sx,sx+21,ay-1,P.e1);
    aw.hl(sx+1,sx+20,ay-10,P.e3); for (var yy=ay-11;yy<ay-1;yy++){ aw.px(sx+7,yy,P.s4); aw.px(sx+15,yy,P.s4); } aw.hl(sx,sx+21,ay-6,P.s4);
    aw.rect(sx+2,ay-11,2,2,P.m3); aw.rect(sx+18,ay-11,2,2,P.m3); aw.hl(sx+8,sx+13,ay-15,P.k2); aw.px(sx+8,ay-14,P.k2); aw.px(sx+13,ay-14,P.k2); aw.px(sx+8,ay-13,P.k2); aw.px(sx+13,ay-13,P.k2);
    aw.rect(sx+3,ay-8,4,3,P.s5); aw.px(sx+4,ay-7,P.m2); SUIT=[sx-2,ay-16,26,17]; }
  else { aw.rect(a0[0]+6,ay-2,8,2,P.s6); aw.hl(a0[0]+7,a0[0]+12,ay-2,P.m3); aw.rect(a1[0]-12,ay-4,3,4,P.s6); aw.px(a1[0]-9,ay-3,P.s5); }      // Zeitung, Becher
  fin(al);
  // langer Tisch Mitte: Gäste sitzen an den Enden; am Donnerstag der Abschiedstisch
  var tb=R3.rect(TB.X0,TB.X1,TB.Y0,FY,TB.Z0,TB.Z1), bl=M.layer(tb[0]-6,tb[1]-30,tb[2]+12,tb[3]+32,tb[1]+tb[3]), bw=M.lw(bl);
  tableBox(bw,TB,far?2:1); var b0=rp(R3.p(TB.X0,TB.Y0,TB.Z1)), b1=rp(R3.p(TB.X1,TB.Y0,TB.Z1)), by=b0[1]-1, bmx=rnd((b0[0]+b1[0])/2);
  if (far){ // schlichte Tonurne, gerahmtes Foto (Sepp mit Mütze), Tasse Tee
    var ux=bmx-1; bw.rect(ux-4,by-3,10,3,P.t2); bw.ellipse(ux+0.5,by-8,5.5,5.5,function(xx,yy){ return (xx<ux-1)?P.t4:((xx>ux+2)?P.t2:P.t3); }); bw.rect(ux-3,by-15,8,3,P.t3); bw.hl(ux-3,ux+4,by-15,P.t4); bw.rect(ux-1,by-17,4,2,P.t2); bw.hl(ux-4,ux+5,by-12,P.t1);
    bw.hl(ux-4,ux+5,by-1,P.t1); URN=[ux-7,by-19,16,20];
    var px0=bmx-20; bw.rect(px0,by-14,10,13,P.w1); bw.rect(px0+1,by-13,8,10,P.m3); bw.rect(px0+3,by-12,4,2,P.c0); bw.hl(px0+2,px0+7,by-10,P.c0); bw.px(px0+5,by-11,P.y3); bw.rect(px0+3,by-9,4,3,P.s3); bw.hl(px0+4,px0+5,by-7,P.m4); bw.rect(px0+2,by-6,6,3,P.c1);
    bw.line(px0+8,by-1,px0+11,by-1,P.w1);
    var cx2=bmx+11; bw.rect(cx2,by-4,5,4,P.s6); bw.hl(cx2,cx2+4,by-4,P.e2); bw.px(cx2+5,by-3,P.s5); bw.px(cx2+5,by-2,P.s5); bw.ellipse(cx2+2.5,by,4,1,P.s5); CUP=[cx2+2,by-5];
    // Tannenzweig neben dem Foto (schlicht)
    for (var g=0;g<6;g++){ bw.px(px0-4+g,by-1-(g%2),P.g3); bw.px(px0-3+g,by-2,P.g2); } }
  else { // Teebecher, Brotteller, Zeitung, Handy
    bw.rect(b0[0]+12,by-4,4,4,P.s6); bw.px(b0[0]+16,by-3,P.s5); bw.ellipse(b0[0]+26,by,5,1.4,P.s5); bw.rect(b0[0]+23,by-2,6,2,P.e3); bw.rect(b1[0]-20,by-4,4,4,P.r3); bw.rect(b1[0]-12,by-1,6,1,P.k2); bw.poly([[bmx-6,by],[bmx+6,by-1],[bmx+8,by+1],[bmx-4,by+2]],P.s5); }
  fin(bl);
  // Stühle der Gäste an den Tischenden (hinter den Tischbeinen, vor der Wand)
  var c1=M.layer(G1[0]-10,G1[1]-32,20,34,G1[1]-1), c1w=M.lw(c1); chairSide(c1w,G1[0],G1[1],'R'); fin(c1);
  var c2=M.layer(G2[0]-10,G2[1]-32,20,34,G2[1]-1), c2w=M.lw(c2); chairSide(c2w,G2[0],G2[1],'L');
  // Rucksack der Reisenden neben ihrem Stuhl
  c2w.rect(G2[0]+9,G2[1]-12,7,12,P.g2); c2w.hl(G2[0]+9,G2[0]+15,G2[1]-12,P.g3); c2w.rect(G2[0]+10,G2[1]-8,5,4,P.g1); c2w.vl(G2[0]+15,G2[1]-11,G2[1]-1,P.g1); c2w.rect(G2[0]+11,G2[1]-15,3,3,P.r2); fin(c2);
  // Halbkreis der Stühle (Abschied)
  if (far) ARC.forEach(function(a){ var p=rp(R3.st(a[0],a[1],'B')), l=M.layer(p[0]-10,p[1]-32,21,34,p[1]), lw=M.lw(l); if (a[2]==='B') chairBack(lw,p[0],p[1]); else chairSide(lw,p[0],p[1],a[2]); fin(l); });
  return L; }

// ---------------------------------------------------------------- jedes Bild: Dampf am Kessel und an der Tasse, Leute ziehen draußen vorbei, Schnee im Oberlicht
function dyn(fb,v,S,GS){ var t=v.t, w=wea(GS), i;
  var ph=t%11; if (ph<4) for (i=0;i<7;i++){ var q=((t*0.7+i*0.15)%1), sx=rnd(KET[0]+Math.sin(t*2+i)*1.5-q*2), sy=rnd(KET[1]-q*14); if (bayer(sx,sy)<0.8-q*0.7) fb.px(sx,sy,q<0.4?P.s6:P.s5); }
  if (S.farewell) for (i=0;i<5;i++){ var q2=((t*0.5+i*0.21)%1), cx=rnd(CUP[0]+Math.sin(t*1.7+i)*1.2), cy=rnd(CUP[1]-q2*10); if (bayer(cx,cy)<0.7-q2*0.6) fb.px(cx,cy,P.s6); }
  // eine Gestalt geht draußen auf dem Bahnsteig vorbei (nur Umriss vor dem Zug)
  var pp=(t*0.07)%1.6; if (pp<1){ var px=rnd(WIN.x0-6+pp*(WIN.x1-WIN.x0+12)), top=WIN.y0+22; for (var yy=top;yy<WIN.y1-6;yy++){ for (var xx=px-1;xx<=px+1;xx++){ if (xx<WIN.x0||xx>=WIN.x1||WM[yy*W+xx]!==1) continue; fb.px(xx,yy,(yy<top+3)?P.p2:((yy>WIN.y1-12)?P.k2:P.c1)); } } }
  if (w==='snow'){ for (i=0;i<14;i++){ var X=rnd(WIN.x0+((hash(i,43)*80+t*2)%80)), Y=rnd(WIN.y0+((t*(3+hash(i,41)*3)+hash(i,42)*11)%11)); if (X>=0&&X<W&&Y>=0&&Y<H&&WM[Y*W+X]===1) fb.px(X,Y,(i%3)?P.m3:P.m2); } } }

// ---------------------------------------------------------------- Geistersicht: Nachhall von Briefen am Koffer
function envelope(fb,x,y,a,ang,c){ var w=9, h=6, ca=Math.cos(ang), sa=Math.sin(ang);
  for (var j=0;j<h;j++) for (var i=0;i<w;i++){ var e=(i===0||j===0||i===w-1||j===h-1), d=(j===Math.round(i*0.6)&&i<4)||(j===Math.round((w-1-i)*0.6)&&i>2);
    if (!e && !d) continue; var X=rnd(x+(i-w/2)*ca-(j-h/2)*sa), Y=rnd(y+(i-w/2)*sa+(j-h/2)*ca); if (X<0||X>=fb.w||Y<0||Y>=144) continue; if (bayer(X,Y)<a) fb.px(X,Y,d?P.x3:c); } }
function ghost(fb,v,S,GS){ var t=v.t, i;
  if (S.suitcaseOut){ var cx=SUIT[0]+SUIT[2]/2, cy=SUIT[1]+8;
    for (var yy=cy-30;yy<cy+12;yy++) for (var xx=cx-26;xx<cx+26;xx++){ var d=Math.hypot((xx-cx)/26,(yy-cy+6)/22); if (d<1 && bayer(xx,yy+Math.floor(t*4))<(1-d)*0.4){ var k=yy*fb.w+xx; fb.d[k]=M.UP[fb.d[k]]; } }
    for (i=0;i<22;i++){ var ph=(t*0.12+i/22)%1, ang=i*2.4+t*0.4, r=6+ph*22, ex=cx+Math.cos(ang)*r*1.1, ey=cy-ph*34+Math.sin(ang)*r*0.35, a=Math.min(1,ph*5)*(1-ph)*1.2;
      envelope(fb,ex,ey,a,Math.sin(t*1.3+i)*0.6,(i%3===0)?P.v4:P.x5); }
    for (i=0;i<4;i++) envelope(fb,SUIT[0]+4+i*5,SUIT[1]+2-i*0.5,0.85,0.1*i,P.x6); }
  else { // ohne Koffer: ein schwacher Schein von Briefen unter der Lagertür
    var dq=M.wallQuad(SPEC,'L',DOORL[0],DOORL[1],DOORL[3]-2,DOORL[3]); var r0=qrect(dq);
    for (i=0;i<6;i++){ var ph2=(t*0.15+i/6)%1, ex2=r0[0]+r0[2]*0.3+ph2*16+i, ey2=r0[1]-ph2*20; envelope(fb,ex2,ey2,(1-ph2)*0.5,0.4,P.x4); } }
  if (S.farewell){ var ux=URN[0]+URN[2]/2, uy=URN[1]+6; for (var y2=uy-16;y2<uy+12;y2++) for (var x2=ux-14;x2<ux+14;x2++){ var d2=Math.hypot((x2-ux)/14,(y2-uy)/16); if (d2<1 && bayer(x2,y2+Math.floor(t*2))<(1-d2)*0.3){ var k2=y2*fb.w+x2; fb.d[k2]=M.UP[fb.d[k2]]; } } } }

// ---------------------------------------------------------------- Lauffläche
function walk(x,y,S){ if (y<116||y>138||x<10||x>310) return false; var f=R3.floor(x,y); if (!f) return false; if (f.X<RECT[0]+3||f.X>RECT[2]-3) return false;
  if (S && S.farewell){ for (var i=0;i<ARC.length;i++){ var p=R3.st(ARC[i][0],ARC[i][1]); if (Math.abs(x-p[0])<9 && y>p[1]-4 && y<p[1]+3) return false; } }
  return true; }
function actorLut(a,S,GS,tod){ if (tod==='day') return null; var L=levels(tod), f=Math.min(1,tubeAt(a.x,a.y-24)*0.95)*(L.length-1); return L[Math.round(f)].a; }
var DQL=qrect(M.wallQuad(SPEC,'L',DOORL[0]-2,DOORL[1]+2,DOORL[2]-3,DOORL[3])), DQR=qrect(M.wallQuad(SPEC,'R',DOORR[0]-2,DOORR[1]+2,DOORR[2]-2,DOORR[3]));
var CR=R3.rect(CNT.X0,CNT.X1,CNT.Y0,FY,CNT.Z0,CNT.Z1), TAR=R3.rect(TA.X0,TA.X1,TA.Y0,FY,TA.Z0,TA.Z1), TBR=R3.rect(TB.X0,TB.X1,TB.Y0,FY,TB.Z0,TB.Z1);
var SP=(function(){ var ct=rp(R3.p(CNT.X0,CNT.Y0,CNT.Z1)), a0=rp(R3.p(TA.X0,TA.Y0,TA.Z1)), a1=rp(R3.p(TA.X1,TA.Y0,TA.Z1)), b0=rp(R3.p(TB.X0,TB.Y0,TB.Z1)), b1=rp(R3.p(TB.X1,TB.Y0,TB.Z1)), bmx=rnd((b0[0]+b1[0])/2);
  return { door:[DQR[0],DQR[1],Math.min(W-DQR[0],DQR[2]),DQR[3]], counter:[CR[0],CR[1]-12,CR[2],CR[3]+12], urn:[ct[0]+3,ct[1]-24,18,24], board:[PIN.x0-3,PIN.y0-3,PIN.x1-PIN.x0+6,PIN.y1-PIN.y0+6],
    storage:DQL, tables:[TAR[0],TAR[1]-6,TBR[0]+TBR[2]-TAR[0],TBR[3]+6], window:[WIN.x0-4,WIN.y0-4,WIN.x1-WIN.x0+8,WIN.y1-WIN.y0+8], guests:[G1[0]-12,G1[1]-50,G2[0]-G1[0]+24,52],
    suitcase:[rnd((a0[0]+a1[0])/2)-13,a0[1]-17,26,17], farewell:[bmx-26,b0[1]-20,46,21] }; })();
M.defineArt('bmission',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, ghost:ghost, actorLut:actorLut,
  spots:SP,
  stands:{ door:[296,124,'R'], counter:[236,118,'B'], urn:[226,118,'B'], board:[78,118,'B'], storage:[30,122,'L'], tables:[160,124,'B'], window:[154,118,'B'], guests:[160,124,'B'], suitcase:[80,120,'B'], farewell:[158,126,'B'] },
  actorPos:{ wimmer:[WIMMER[0],WIMMER[1],'L'], gast1:[G1[0],G1[1],'R'], gast2:[G2[0],G2[1],'L'], mala:[120,126,'R'] },
  start:[292,124,'L'], entries:{ gleis11:[292,124,'L'] }
});
})(M);
