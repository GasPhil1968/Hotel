// Validierung des VM-Treibers: (1) gleicher Seed zweimal → identischer Verlauf; (2) Render-Modus 'smart' gegen 'full'
// (volle Zeichnung wie im Browser) → identischer spielrelevanter Zustand an jedem Kapitelende.  node qa/validate_driver.js [seed]
const { open } = require('./vmdriver');
const C = require('./lib/common');
const crypto = require('crypto');
async function chain(seed, render) {
  const D = await open({ seed, render }); const t0 = Date.now(); const res = [];
  await D.ev(() => { window.__QA_CHAINED = true; });
  await C.tapTitle(D, 'Kapitel 1: Split'); await C.tapTitle(D, 'Platz 1');
  const names = ['walkthrough', 'walkthrough2', 'walkthrough3', 'walkthrough4'];
  for (let ch = 1; ch <= 4; ch++) {
    const r = await C.runPath(names[ch - 1], D, {});
    const g = await D.ev(() => JSON.parse(JSON.stringify(M.GS)));
    const rel = C.relevant(g);
    res.push({ ch, ok: r.ok, err: r.err, vtime: D.vtime(), frames: D.frames(), hash: crypto.createHash('sha1').update(JSON.stringify(rel)).digest('hex').slice(0, 12), rel, lines: r.lines.map(l => l.replace(/^\[[^\]]*\]\s*/, '')) });
    if (!r.ok) break;
    await C.waitTitleNext(D); if (ch < 4) await C.tapTitle(D, 'Weiter mit Kapitel ' + (ch + 1));
  }
  return { render, seed, wall: Date.now() - t0, errors: D.errors.slice(), res };
}
(async () => {
  const seed = +(process.argv[2] || 11);
  const a = await chain(seed, 'smart'), b = await chain(seed, 'smart'), c = await chain(seed, 'full');
  const report = { seed, sha: require('./vmdriver').loadScript().sha12, runs: [a, b, c].map(x => ({ render: x.render, wall: x.wall, errors: x.errors.length, chapters: x.res.map(r => ({ ch: r.ch, ok: r.ok, hash: r.hash, vtime: r.vtime, frames: r.frames })) })) };
  report.determinism = a.res.map((r, i) => ({ ch: r.ch, sameHash: r.hash === (b.res[i] || {}).hash, sameVtime: r.vtime === (b.res[i] || {}).vtime, sameLog: JSON.stringify(r.lines) === JSON.stringify((b.res[i] || {}).lines) }));
  report.smartVsFull = a.res.map((r, i) => ({ ch: r.ch, sameHash: r.hash === (c.res[i] || {}).hash, sameVtime: r.vtime === (c.res[i] || {}).vtime, diff: c.res[i] ? C.diffRelevant(r.rel, c.res[i].rel).slice(0, 10) : ['fehlt'] }));
  report.fullErrors = c.errors.slice(0, 10);
  require('fs').mkdirSync(__dirname + '/results', { recursive: true });
  require('fs').writeFileSync(__dirname + '/results/validate_driver.json', JSON.stringify(report, null, 1));
  console.log(JSON.stringify({ determinism: report.determinism, smartVsFull: report.smartVsFull, runs: report.runs.map(r => [r.render, r.wall, r.errors]) }, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
