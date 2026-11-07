// Browser-Engines und Geräteprofile. Chromium kommt aus der vorinstallierten Playwright-Umgebung (/opt/pw-browsers),
// Firefox und WebKit aus $MALA_PWB (Standard ~/pwb, installiert mit `PLAYWRIGHT_BROWSERS_PATH=~/pwb npx playwright install firefox webkit`).
// Geräte sind EMULIERT (Viewport, Touch, Pixeldichte, User-Agent) – kein Test auf echten iPhones/iPads.
const path = require('path'), fs = require('fs'), os = require('os');
const PWB = process.env.MALA_PWB || path.join(os.homedir(), 'pwb');
function exe(engine) {
  if (engine === 'firefox') { const d = fs.readdirSync(PWB).find(x => /^firefox-/.test(x)); return d ? path.join(PWB, d, 'firefox', 'firefox') : undefined; }
  if (engine === 'webkit') { const d = fs.readdirSync(PWB).find(x => /^webkit-/.test(x)); return d ? path.join(PWB, d, 'pw_run.sh') : undefined; }
  return undefined;
}
async function launch(pw, engine) { const o = {}; const e = exe(engine); if (e && fs.existsSync(e)) o.executablePath = e; return pw[engine].launch(o); }
const DEVICES = { desktop: null, phone: 'iPhone 13 landscape', tablet: 'iPad (gen 7) landscape', phonePortrait: 'iPhone 13', tabletPortrait: 'iPad (gen 7)' };
function contextOpts(pw, engine, device) {
  if (device === 'desktop') return { viewport: { width: 1280, height: 800 } };
  const d = Object.assign({}, pw.devices[DEVICES[device]]); delete d.defaultBrowserType;
  if (engine === 'firefox') { delete d.isMobile; }   // Firefox kennt isMobile nicht; Touch und Viewport bleiben
  return d;
}
module.exports = { launch, contextOpts, DEVICES, exe };
