/* ===== portraits/_derive.js — abgeleitete Porträts: eine bestehende Vorlage malen, dann Farben je Bildbereich umsetzen (Haar, Mütze,
   Kleidung, Bart) und Zubehör darüber zeichnen (Brille, Kopfhörer, Stirnlampe, Ausweis). So bekommen Nebenfiguren ein gemaltes
   Brustbild im selben Stil, ohne dass die Vorlage ein zweites Mal gezeichnet wird. Die Vorlage selbst bleibt unverändert.
   M.derivePortrait(id, vorlage, { maps:[{r:[x,y,w,h], map:{von:'nach', …}}, …], after:function(b,v){ … } })
   Die maps gelten nacheinander; innerhalb einer map wird jede Farbe nur einmal umgesetzt (keine Ketten). */
(function(M){
'use strict';
var P=M.P, T=M.T;
M.derivePortrait=function(id,base,o){ o=o||{};
  M.definePortrait(id,{ paint:function(b,v){ var d=M.PORTRAITS[base]; if (!d) throw new Error('Porträt-Vorlage fehlt: '+base); d.paint(b,v);
    (o.maps||[]).forEach(function(m){ var r=m.r||[0,0,b.w,b.h], tab=new Int16Array(256); tab.fill(-1);
      Object.keys(m.map).forEach(function(k){ if (P[k]===undefined||P[m.map[k]]===undefined) throw new Error('Porträt '+id+': Farbe '+k+'→'+m.map[k]); tab[P[k]]=P[m.map[k]]; });
      for (var y=Math.max(0,r[1]);y<Math.min(b.h,r[1]+r[3]);y++) for (var x=Math.max(0,r[0]);x<Math.min(b.w,r[0]+r[2]);x++){ var i=y*b.w+x, c=b.d[i]; if (c!==T && tab[c]>=0) b.d[i]=tab[c]; } });
    if (o.after) o.after(b,v); } }); };
})(M);
