// Führt ein vorhandenes Werkzeug aus game/tools (walkthrough*.js, k*tests.js) mit dem VM-Treiber statt Playwright aus.
//   node qa/runwalk.js game/tools/walkthrough4.js [args]     MALA_SEED=n
const Module = require('module'), path = require('path');
const VMD = path.join(__dirname, 'vmdriver.js');
const orig = Module._resolveFilename;
Module._resolveFilename = function (req, parent, ...rest) { if (req === './driver' && parent && /game[\\/]tools/.test(parent.filename)) return VMD; return orig.call(this, req, parent, ...rest); };
const vmd = require(VMD); const o = vmd.open; vmd.open = (opts = {}) => o(Object.assign({}, opts, { seed: +(process.env.MALA_SEED || 1) }));
const target = path.resolve(process.argv[2]); process.argv.splice(1, 2, target);
require(target);
