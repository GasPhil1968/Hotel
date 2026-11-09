// Auswertung der Messung (qa/analyse/messung.js): node qa/analyse/messung_auswertung.js <ordner>/messung.json
const fs=require('fs'); const files=process.argv.slice(2); const all={};
files.forEach(f=>{ const d=JSON.parse(fs.readFileSync(f,'utf8')); Object.assign(all,d.out); });
const med=a=>{ if(!a.length) return 0; const s=a.slice().sort((x,y)=>x-y); return s[Math.floor(s.length/2)]; };
for (const k of Object.keys(all).sort()){ const R=all[k].filter(r=>!r.err && r.phase); const n=R.length;
  const sum=(f)=>R.reduce((a,r)=>a+(f(r)||0),0);
  const pairs=sum(r=>r.pairs), spec=sum(r=>r.spec), np=sum(r=>r.npcPairs), ns=sum(r=>r.npcSpec);
  const vA=sum(r=>r.vAll), vS=sum(r=>r.vSpec), gA=sum(r=>r.gAll), gS=sum(r=>r.gSpec), sA=sum(r=>r.gSense), sS=sum(r=>r.gSenseSpec);
  const H=R.map(r=>r.hints.length), one=H.filter(h=>h<=1).length, two=H.filter(h=>h>=2).length, three=H.filter(h=>h>=3).length;
  const NB=R.map(r=>r.nb), PP=R.map(r=>r.nbPairs), withDed=R.filter(r=>r.ded>0), ratio=withDed.map(r=>r.ded/r.nbPairs);
  console.log(`${k}: Stände ${n} | Gegenstand×Hotspot ${pairs} Versuche, eigene Antwort ${spec} (${(100*spec/Math.max(1,pairs)).toFixed(1)} %) | davon an Personen ${np}, eigene ${ns} (${(100*ns/Math.max(1,np)).toFixed(1)} %)`);
  console.log(`   Marko-Verben mit eigener Antwort ${vS}/${vA} (${(100*vS/Math.max(1,vA)).toFixed(0)} %) | Mala ansehen/spüren/lauschen ${gS}/${gA} (${(100*gS/Math.max(1,gA)).toFixed(0)} %), Spüren angeboten an ${sS}/${sA} Hotspots (${(100*sS/Math.max(1,sA)).toFixed(0)} %)`);
  const lN=sum(r=>r.lookN), lS=sum(r=>r.lookS), glN=sum(r=>r.glookN), glS=sum(r=>r.glookS);
  console.log(`   eigener „Schau an“-Text: Marko ${lS}/${lN} (${(100*lS/Math.max(1,lN)).toFixed(0)} %), Mala ${glS}/${glN} (${(100*glS/Math.max(1,glN)).toFixed(0)} %)`);
  console.log(`   offene Hinweisthemen: Median ${med(H)}, max ${Math.max(...H)}, Stände mit genau/höchstens 1: ${one} (${(100*one/n).toFixed(0)} %), mit ≥2: ${two}, mit ≥3: ${three}`);
  console.log(`   Notizbuch: sichtbare Notizen Median ${med(NB)}, max ${Math.max(...NB)}; Paare Median ${med(PP)}, max ${Math.max(...PP)}; Stände mit möglichem Schluss ${withDed.length}, Trefferquote je Zufallspaar Median ${(100*med(ratio)).toFixed(0)} %`);
}
