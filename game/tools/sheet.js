// Rendert ein Modellblatt aller Figuren in verschiedenen Posen (Entwicklungswerkzeug)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const src = path.join(__dirname, '..', 'src');
  const files = ['00_core.js', '01_art.js', '02_rig.js', '03_cast.js'].map(f => fs.readFileSync(path.join(src, f), 'utf8')).join('\n');
  const out = process.argv[2] || path.join(__dirname, 'sheet.png');
  const html = `<!doctype html><html><body style="margin:0;background:#000"><canvas id="c"></canvas><script>${files}
  (function(){
    var ids=Object.keys(M.CHARS); var A=M.ANIMS;
    var poses=[['S',A.idleS[0][0],'R'],['S',A.walkS[0],'R'],['S',A.walkS[2],'R'],['S',A.walkS[4],'R'],['F',A.idleF[0][0],'F'],['F',A.walkF[0],'F'],['B',A.idleB[0][0],'B'],['S',A.reachM[3][0],'R'],['S',A.sit[0][0],'R'],['F',A.read[2][0],'F'],['S',A.idleS[0][0],'L']];
    var cw=34, ch=70, W=poses.length*cw+4, H=ids.length*ch+4;
    var b=new M.Buf(W,H,M.P.s2);
    ids.forEach(function(id,r){ poses.forEach(function(p,c){ var x=4+c*cw+15, y=4+r*ch+60; b.hl(x-14,x+14,y,M.P.s1);
      var pose=p[1]; var ca=M.CHARS[id].anims; if (c===8 && ca.sit) pose=ca.sit[0][0];
      try{ M.drawPose(b,x,y,pose,p[2],id,{}); }catch(e){ console.log('ERR',id,e.message); } }); M.text(b,id,2,4+r*ch,M.P.k1); });
    var cv=document.getElementById('c'); var S=3; cv.width=W*S; cv.height=H*S; var x=cv.getContext('2d'); var img=x.createImageData(W,H);
    for (var i=0;i<W*H;i++){ var q=M.RGB[b.d[i]]||[255,0,255]; img.data[i*4]=q[0]; img.data[i*4+1]=q[1]; img.data[i*4+2]=q[2]; img.data[i*4+3]=255; }
    var t=document.createElement('canvas'); t.width=W; t.height=H; t.getContext('2d').putImageData(img,0,0); x.imageSmoothingEnabled=false; x.drawImage(t,0,0,W*S,H*S);
    window.DONE=[W*S,H*S];
  })();<\/script></body></html>`;
  const tmp = path.join(path.dirname(out), 'sheet.html'); fs.writeFileSync(tmp, html);
  const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 1400, height: 1400 } });
  page.on('console', m => console.log('console:', m.text())); page.on('pageerror', e => console.log('PAGEERROR', e.message));
  await page.goto('file://' + tmp); await page.waitForFunction(() => window.DONE, null, { timeout: 10000 });
  const dims = await page.evaluate(() => window.DONE);
  await page.setViewportSize({ width: dims[0], height: dims[1] });
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: dims[0], height: dims[1] } });
  await browser.close(); console.log('ok', out, dims);
})();
