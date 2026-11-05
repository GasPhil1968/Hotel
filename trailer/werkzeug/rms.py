#!/usr/bin/env python3
# Lautstärkeverlauf einer Aufnahme (RMS in dBFS je Fenster), relativ zum ersten Bild: python3 rms.py <take> [fenster_s] [t0] [t1]
import sys, os, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import importlib.util
spec = importlib.util.spec_from_file_location('c', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'compose.py'))
tid = sys.argv[1]; win = float(sys.argv[2]) if len(sys.argv) > 2 else 1.0
os.environ.setdefault('NOEDL', '1')
c = importlib.util.module_from_spec(spec); spec.loader.exec_module(c)
tk = c.take(tid); arr, sr, ta0 = tk.audio(); off = tk.t0 - ta0
t0 = float(sys.argv[3]) if len(sys.argv) > 3 else 0.0; t1 = float(sys.argv[4]) if len(sys.argv) > 4 else (len(arr) / sr - off)
out = []
t = t0
while t < t1:
    a = int((t + off) * sr); b = int((t + win + off) * sr); x = arr[max(0, a):max(0, b)]
    r = 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9) if len(x) else -120
    pk = 20 * np.log10(np.max(np.abs(x)) + 1e-9) if len(x) else -120
    out.append(f'{t:6.1f} {r:6.1f} {pk:6.1f}'); t += win
print(f'{tid} sr={sr} dauer={len(arr)/sr:.1f}s')
print('\n'.join(out))
