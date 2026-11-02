/* ===== 07_portraits.js — gemalte Porträts (Brustbilder 56 × 64) für Gespräche =====
   Jede Figur hat eine Datei in portraits/<id>.js mit M.definePortrait(id,{paint:function(b,v){…}}).
   Varianten: 'n' ruhig, 'o' spricht (Mund offen), 'b' blinzelt (Augen zu). Gemalt wird nach rechts blickend
   auf transparentem Grund; die Oberfläche spiegelt, wenn das Porträt rechts steht. Geister werden beim
   Zwischenspeichern eingefärbt (Mala kalt blau, die anderen fahl-lavendel). */
(function(M){
'use strict';
var P=M.P, T=M.T, Buf=M.Buf;
M.PORTRAIT_W=56; M.PORTRAIT_H=64;
M.PORTRAITS={};
M.PORTRAIT_GHOSTS={ mala:'ghostP', ivka:'spiritP', luka:'spiritP', bruno:'spiritP', jakov:'spiritP' };
M.definePortrait=function(id,def){ def=def||{}; def.id=id; def.cache={}; M.PORTRAITS[id]=def; };
M.hasPortrait=function(id){ return !!M.PORTRAITS[id]; };
// ghost: true = so, wie Marko einen Geist sieht (eingefärbt); false = ungefärbt (Malas eigene Sicht auf sich selbst, Testblatt)
M.portrait=function(id,variant,ghost){ var d=M.PORTRAITS[id]; if (!d) return null; variant=variant||'n'; if (ghost===undefined) ghost=!!M.PORTRAIT_GHOSTS[id];
  var key=variant+(ghost?'g':''); if (d.cache[key]) return d.cache[key];
  var b=d.cache[variant];
  if (!b){ b=new Buf(M.PORTRAIT_W,M.PORTRAIT_H,T); var v={mouth:variant==='o'?1:0,eyes:variant==='b'?1:0,variant:variant};
    try{ d.paint(b,v); }catch(e){ console.error('Porträt '+id,e); } d.cache[variant]=b; }
  if (!ghost) return b;
  // ohne Dithering (ruhigere Gesichter): jede Farbe auf ihre nächste Geisterfarbe
  var g=new Buf(b.w,b.h,T), tn=M.TINT[M.PORTRAIT_GHOSTS[id]||'spiritP']; for (var i=0;i<b.d.length;i++){ var c=b.d[i]; g.d[i]=(c===T||!tn)?c:((c===P.k0||c===P.k1)?P.k0:tn.a[c]); } return (d.cache[key]=g); }; // Kontur bleibt dunkel, damit sie sich vom Schein abhebt
})(M);
