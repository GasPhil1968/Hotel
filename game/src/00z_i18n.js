/* ===== 00z_i18n.js — Sprachfassungen. Übersetzt wird erst bei der Anzeige; Spiellogik, Tests und Spielstände bleiben deutsch.
   Tabellen: M.trAdd('bhs', { 'Deutscher Text': 'prijevod' }).
   - Ein Eintrag kann ein Objekt sein: { hr:'…', bs:'…' }. „bs“ gilt, wenn Marko gerade mit Mala spricht, sonst „hr“.
   - Gleicher deutscher Satz, anderer Sprecher: Schlüssel '@ivka:Danke.' hat Vorrang vor 'Danke.'.
   - Zusammengesetzte Texte (z. B. „Benutze X mit Y“): M.trPattern('bhs', /^Benutze (.+) mit (.+)$/, function(m,tr){ … }).
   Fehlt eine Übersetzung, erscheint der deutsche Text, und er wird in M.trMiss vermerkt (für die Tests). ===== */
(function(M){
'use strict';
function LS(){ try{ return window.localStorage; }catch(e){ return null; } }
M.LANGS={ de:'Deutsch', bhs:'Bosanski / Hrvatski' };
M.lang='de'; try{ var l0=LS()&&LS().getItem('mala.lang'); if (l0&&M.LANGS[l0]) M.lang=l0;
  else if (!l0 && typeof navigator!=='undefined' && /^(hr|bs|sr|sh)\b/i.test(String(navigator.language||''))) M.lang='bhs'; }catch(e){}   // erster Start: Browsersprache (UI-Konzept D1)
M.I18N={}; M.I18N_RE={}; M.trMiss={}; M.trVer=0;   // trVer steigt bei jeder Änderung (Sprache, Tabellen)
M.trAdd=function(lang,table){ var T=M.I18N[lang]||(M.I18N[lang]={}); for (var k in table) if (Object.prototype.hasOwnProperty.call(table,k)) T[k]=table[k]; M.trVer++; if (M.trFlush) M.trFlush(); };
M.I18N_IGN={}; M.trIgnore=function(a){ (a||[]).forEach(function(x){ M.I18N_IGN[x]=1; }); };   // nur für die Prüfung: Texte, die nie angezeigt werden
M.trPattern=function(lang,re,fn){ (M.I18N_RE[lang]||(M.I18N_RE[lang]=[])).push([re,fn]); };
M.setLang=function(l){ if (!M.LANGS[l]) l='de'; M.lang=l; M.trVer++; if (M.trFlush) M.trFlush(); try{ var s=LS(); if (s) s.setItem('mala.lang',l); }catch(e){} if (M.onLang) try{ M.onLang(l); }catch(e){} };
function pick(v,ctx){ if (v==null) return null; if (typeof v==='string') return v; if (ctx&&ctx.to==='mala'&&v.bs!=null) return v.bs; return v.hr!=null?v.hr:(v.bs!=null?v.bs:null); }
var HASTXT=/[A-Za-zÄÖÜäöüß]{2}/;
M.tr=function(s,ctx){ if (M.lang==='de'||s==null||s==='') return s; s=String(s); var T=M.I18N[M.lang]; if (!T) return s;
  var v; if (ctx&&ctx.who){ var w=String(ctx.who).replace(/^@/,''); v=T['@'+w+':'+s]; }
  if (v===undefined) v=T[s];
  var r=pick(v,ctx); if (r!=null) return r;
  var P=M.I18N_RE[M.lang]; if (P) for (var i=0;i<P.length;i++){ var m=P[i][0].exec(s); if (m){ var out=P[i][1](m,function(x){ return M.tr(x,ctx?{who:ctx.who,to:ctx.to,cat:ctx.cat}:null); }); if (out!=null) return out; } }
  if (ctx&&ctx.log && HASTXT.test(s)) M.trMiss[s]=(ctx.cat||'?')+(ctx.who?':'+String(ctx.who).replace(/^@/,''):'');
  return s; };
// Schrift: ganze Texte werden übersetzt, umbrochene Zeilen sind es schon (sie finden keinen Eintrag und bleiben, wie sie sind)
var text0=M.text, wrap0=M.wrap, tw0=M.textWidth;
var UIC={}, UIL=null, UIN=0;   // Zwischenspeicher je Sprache: Schrift wird in jedem Bild gezeichnet
function ui(s){ if (M.lang==='de'||typeof s!=='string'||s==='') return s; if (UIL!==M.lang){ UIC={}; UIL=M.lang; UIN=0; }
  var r=UIC[s]; if (r!==undefined) return r; r=M.tr(s,null); if (++UIN>20000){ UIC={}; UIN=0; } UIC[s]=r;
  if (M.trLogUI && r===s && LOOKS_DE.test(s)) M.trMiss[s]='ui';   // nur in Tests: sichtbarer Text, der noch deutsch aussieht
  return r; }
var LOOKS_DE=/[äöüßÄÖÜ]|(?<!\p{L})(der|die|das|und|ist|nicht|ich|sie|wir|ein|eine|einen|auf|zu|den|dem|des|von|ins|es|er|du|mich|dich|noch|schon|hier|wie|was|wer|wo)(?!\p{L})/iu;   // Wortgrenzen auch für č ć š ž đ
M.trFlush=function(){ UIC={}; UIN=0; };
M.trOverflow={};
M.text=function(buf,s,x,y,c,oc){ var t=ui(s);
  if (M.trLogUI && buf && buf.w===320 && typeof t==='string' && t.length>1){ var w=tw0(t); if (x+w>321 || x<-1) M.trOverflow[t]=Math.round(x)+'+'+w; }   // nur in Tests: Text läuft aus dem Bild
  return text0(buf,t,x,y,c,oc); };
M.wrap=function(s,maxw){ return wrap0(ui(s),maxw); };
M.textWidth=function(s){ return tw0(ui(s)); };
M.trUI=ui;
})(M);
