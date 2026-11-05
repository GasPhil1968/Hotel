#!/usr/bin/env python3
# MALA – Trailer-Montage. Baut aus den Aufnahmen (takes/<id>) und dem Schnittplan (edl.py) das fertige Video:
# 1920×1080, 30 Bilder/s, genau 2700 Bilder, H.264 (yuv420p, BT.709), AAC Stereo 48 kHz.
# Spielbild ganzzahlig ×5 (320×200 → 1600×1000, Pixel bleiben scharf), mittig auf dem dunklen Grund der Spielseite (#08070d).
#   python3 compose.py [ausgabe.mp4]        (ohne Ausgabe: nur Prüfbilder je Abschnitt in preview/)
import json, os, sys, struct, bisect, subprocess, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
T = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, T)
import edl as EDL

FPS, W, H, SC = 30, 1920, 1080, 5
GX, GY = (W - 320 * SC) // 2, 10          # Spielbild oben, darunter ein Textstreifen (1010–1080) für die Trailertexte
BG = np.array([8, 7, 13], dtype=np.uint8)
NFRAMES = int(round(EDL.DURATION * FPS))
SR = 48000

# ---------------------------------------------------------------- Aufnahmen
class Take:
    def __init__(self, tid):
        self.id = tid; self.dir = os.path.join(T, 'takes', tid)
        fr = json.load(open(os.path.join(self.dir, 'frames.json')))
        self.fn = [f[0] for f in fr]; self.ts = [f[1] for f in fr]; self.t0 = self.ts[0]
        self.cache = {}; self._audio = None
    def frame_path(self, t_rel):
        t = self.t0 + t_rel; i = bisect.bisect_right(self.ts, t) - 1; i = max(0, min(len(self.fn) - 1, i)); return os.path.join(self.dir, self.fn[i])
    def img(self, t_rel):
        p = self.frame_path(t_rel)
        if p not in self.cache:
            if len(self.cache) > 400: self.cache.clear()
            self.cache[p] = np.asarray(Image.open(p).convert('RGB'))
        return self.cache[p]
    def audio(self):
        if self._audio is not None: return self._audio
        meta = json.load(open(os.path.join(self.dir, 'audio.json'))); sr = meta['sr']; blk = meta['block']
        raw = open(os.path.join(self.dir, 'audio.f32'), 'rb').read(); B = 8 + blk * 8; n = len(raw) // B
        if n == 0: self._audio = (np.zeros((1, 2), np.float32), sr, self.t0); return self._audio
        ts = [struct.unpack_from('<d', raw, i * B)[0] for i in range(n)]; ta0 = ts[0]
        L = int(round((ts[-1] - ta0) * sr)) + blk; arr = np.zeros((L, 2), np.float32)
        for i in range(n):
            d = np.frombuffer(raw, dtype='<f4', count=blk * 2, offset=i * B + 8).reshape(blk, 2)
            k = int(round((ts[i] - ta0) * sr)); arr[k:k + blk] = d[:max(0, min(blk, L - k))]
        self._audio = (arr, sr, ta0); return self._audio
    def audio_seg(self, t_in, dur):
        arr, sr, ta0 = self.audio(); a = int(round((self.t0 + t_in - ta0) * sr)); b = a + int(round(dur * sr))
        out = np.zeros((b - a, 2), np.float32); s0, s1 = max(0, a), min(len(arr), b)
        if s1 > s0: out[s0 - a:s1 - a] = arr[s0:s1]
        return resample(out, sr, SR)
TAKES = {}
def take(tid):
    if tid not in TAKES: TAKES[tid] = Take(tid)
    return TAKES[tid]

def resample(x, sr0, sr1):
    if sr0 == sr1 or len(x) == 0: return x
    n1 = int(round(len(x) * sr1 / sr0)); t1 = np.arange(n1) * (sr0 / sr1); i0 = np.floor(t1).astype(np.int64); fr = (t1 - i0)[:, None].astype(np.float32)
    i0 = np.clip(i0, 0, len(x) - 1); i1 = np.clip(i0 + 1, 0, len(x) - 1); return x[i0] * (1 - fr) + x[i1] * fr

# ---------------------------------------------------------------- Bild
def upscale(img, crop=None, valign='center'):
    # crop: (x, y, w, h) in Spielkoordinaten, ganzzahlige Vergrößerung bis zur Höhe 1000 bzw. Breite 1600
    # valign: 'center' (mittig in der Spielbildfläche) oder 'top' (oben bündig, z. B. für die Endkarte)
    if crop:
        x, y, w, h = crop; sub = img[y:y + h, x:x + w]; k = max(1, min(1600 // w, 1000 // h)); big = sub.repeat(k, 0).repeat(k, 1)
    else:
        big = img.repeat(SC, 0).repeat(SC, 1)
    frame = np.empty((H, W, 3), np.uint8); frame[:] = BG
    hh, ww = big.shape[:2]; oy = GY if valign == 'top' else GY + (1000 - hh) // 2; ox = (W - ww) // 2; frame[oy:oy + hh, ox:ox + ww] = big; return frame

FONT_DIR = '/usr/share/fonts/opentype/inter/'
def font(weight, size):
    return ImageFont.truetype(os.path.join(FONT_DIR, {'semibold': 'Inter-SemiBold.otf', 'bold': 'Inter-Bold.otf', 'medium': 'Inter-Medium.otf', 'regular': 'Inter-Regular.otf', 'display': 'InterDisplay-SemiBold.otf', 'displaybold': 'InterDisplay-Bold.otf', 'light': 'Inter-Light.otf'}[weight]), size)
TEXT_CACHE = {}
def text_layer(spec):
    key = json.dumps(spec, sort_keys=True)
    if key in TEXT_CACHE: return TEXT_CACHE[key]
    lines = spec.get('lines', []); style = spec.get('style', 'caption')
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(layer)
    if style == 'strip':
        # eine Zeile im Streifen unter dem Spielbild; runs = [(text, gewicht, größe, farbe), …] nebeneinander
        runs = spec['runs']; fs = [font(r[1], r[2]) for r in runs]; ws = [d.textlength(r[0], font=f) for r, f in zip(runs, fs)]
        x = (W - sum(ws)) / 2; base = GY + 1000 + (H - GY - 1000) / 2
        for r, f, w in zip(runs, fs, ws):
            asc, desc = f.getmetrics(); d.text((x, base - (asc + desc) / 2 + 2), r[0], font=f, fill=r[3]); x += w
        arr = np.asarray(layer).astype(np.float32); TEXT_CACHE[key] = arr; return arr
    if style == 'endcard':
        # Endkarte: Untertitel unter dem Titelbild des Spiels
        y = spec.get('y', 860)
        for i, (txt, wt, sz, col) in enumerate(lines):
            f = font(wt, sz); w = d.textlength(txt, font=f); x = (W - w) / 2
            d.text((x, y), txt, font=f, fill=col); y += sz + spec.get('gap', 18)
    else:
        pos = spec.get('pos', 'bottom'); pad = 26
        fonts = [font(l[1], l[2]) for l in lines]; widths = [d.textlength(l[0], font=f) for l, f in zip(lines, fonts)]
        bw = max(widths) + pad * 2; bh = sum(l[2] for l in lines) + 14 * (len(lines) - 1) + pad * 1.4
        cx = W / 2 if spec.get('align', 'center') == 'center' else spec.get('x', GX + 60) + bw / 2
        bx = cx - bw / 2
        by = {'bottom': GY + 1000 - 60 - bh, 'top': GY + 50, 'mid': (H - bh) / 2, 'low': GY + 720 - 40 - bh}.get(pos, pos if isinstance(pos, (int, float)) else GY + 1000 - 60 - bh)
        box = Image.new('RGBA', (W, H), (0, 0, 0, 0)); bd = ImageDraw.Draw(box)
        bd.rounded_rectangle([bx, by, bx + bw, by + bh], radius=14, fill=(8, 7, 13, 205))
        layer = Image.alpha_composite(layer, box); d = ImageDraw.Draw(layer)
        y = by + pad * 0.7
        for (txt, wt, sz, col), f, w in zip(lines, fonts, widths):
            x = cx - w / 2; d.text((x, y), txt, font=f, fill=col); y += sz + 14
    arr = np.asarray(layer).astype(np.float32); TEXT_CACHE[key] = arr; return arr

def blend_text(frame, layer, alpha):
    if alpha <= 0: return frame
    a = layer[:, :, 3:4] / 255.0 * alpha; out = frame.astype(np.float32) * (1 - a) + layer[:, :, :3] * a; return out.astype(np.uint8)

# ---------------------------------------------------------------- Zeitachse
def build_timeline():
    segs = []; t = 0.0
    for s in EDL.SEGMENTS:
        dur = s['out'] - s['in']; xf = s.get('xfade', 0.0); start = t - xf
        segs.append(dict(s, start=start, dur=dur, end=start + dur)); t = start + dur
    return segs, t

def frame_at(segs, t):
    # aktive Abschnitte zur Zeit t (bei Überblendung zwei)
    act = [s for s in segs if s['start'] - 1e-4 <= t < s['end'] - 1e-4]   # Grenzen liegen auf ganzen Bildern (±1 µs Rundung)
    if not act: act = [segs[-1]]
    def render(s):
        if s.get('black'): f = np.empty((H, W, 3), np.uint8); f[:] = BG; return f
        img = take(s['take']).img(s['in'] + (t - s['start']) * s.get('speed', 1.0)); return upscale(img, s.get('crop'), s.get('valign', 'center'))
    if len(act) == 1: f = render(act[0])
    else:
        a, b = act[0], act[1]; k = (t - b['start']) / max(1e-6, b.get('xfade', 0.0001)); k = min(1, max(0, k))
        f = (render(a).astype(np.float32) * (1 - k) + render(b).astype(np.float32) * k).astype(np.uint8)
    s = act[-1]
    # Abblenden zu Beginn/Ende eines Abschnitts (in Schwarz)
    fi, fo = s.get('fade_in', 0), s.get('fade_out', 0)
    k = 1.0
    if fi and t - s['start'] < fi: k = min(k, (t - s['start']) / fi)
    if fo and s['end'] - t < fo: k = min(k, (s['end'] - t) / fo)
    if k < 1: f = (f.astype(np.float32) * k + BG.astype(np.float32) * (1 - k)).astype(np.uint8)
    for tx in EDL.TEXTS:
        if tx['t0'] - 0.001 <= t < tx['t1']:
            fd = tx.get('fade', 0.3); a = min(1, (t - tx['t0']) / fd if fd else 1, (tx['t1'] - t) / fd if fd else 1)
            f = blend_text(f, text_layer(tx), max(0, a))
    return f

def db(x): return 20 * math.log10(max(1e-9, x))
def auto_gain(a):
    # Gleicht die Klangkulisse eines Abschnitts an: Median-Pegel der 50-ms-Fenster auf FX_TARGET dBFS,
    # höchstens FX_MAX dB Verstärkung, Spitzen (Klicks, Effekte) nicht über FX_PEAK dBFS.
    w = int(SR * 0.05); n = len(a) // w
    if n < 1: return 1.0, None, None
    r = np.sqrt((a[:n * w] ** 2).mean(1).reshape(n, w).mean(1)); med = float(np.median(r)); pk = float(np.abs(a).max())
    g = EDL.FX_TARGET - db(med); g = min(g, EDL.FX_MAX, EDL.FX_PEAK - db(pk)); g = max(g, EDL.FX_MIN)
    return 10 ** (g / 20), db(med), db(pk)
GAINLOG = []
def build_audio(segs, total):
    n = int(round(total * SR)); fx = np.zeros((n, 2), np.float32); mus = np.zeros((n, 2), np.float32)
    for s in segs:
        if s.get('black') or s.get('mute'): continue
        a = take(s['take']).audio_seg(s['in'], s['dur'])
        if 'gain' in s: g, lv, pk = s['gain'], None, None
        else: g, lv, pk = auto_gain(a)
        g *= 10 ** (s.get('gain_db', 0) / 20); GAINLOG.append((s['take'], s['in'], s['out'], lv, pk, db(g))); a = a * g
        k0 = int(round(s['start'] * SR)); L = min(len(a), n - k0)
        if L <= 0: continue
        a = a[:L].copy(); ramp = int(SR * max(EDL.EDGE, s.get('xfade', 0) or EDL.EDGE))
        if ramp * 2 < L: a[:ramp] *= np.linspace(0, 1, ramp)[:, None]; a[-ramp:] *= np.linspace(1, 0, ramp)[:, None]
        fx[k0:k0 + L] += a
    for m in EDL.MUSIC:
        tk = take(m['take']); a = tk.audio_seg(m['in'], m['dur']) * m.get('gain', 1.0) * 10 ** (m.get('gain_db', 0) / 20)
        L = len(a); fi = int(SR * m.get('fade_in', 0.5)); fo = int(SR * m.get('fade_out', 0.8))
        if fi: a[:fi] *= np.linspace(0, 1, fi)[:, None]
        if fo: a[-fo:] *= np.linspace(1, 0, fo)[:, None]
        k0 = int(round(m['at'] * SR)); L = min(L, n - k0); mus[k0:k0 + L] += a[:L]
    # Musik unter Hervorhebungen etwas zurücknehmen
    env = np.ones(n, np.float32)
    for d in EDL.DUCK:
        a, b = int(d[0] * SR), int(d[1] * SR); lvl = d[2]; r = int(SR * 0.25)
        seg = np.full(b - a, lvl, np.float32); seg[:r] = np.linspace(1, lvl, r); seg[-r:] = np.linspace(lvl, 1, r); env[a:b] = np.minimum(env[a:b], seg)
    fx = fx * EDL.FX_GAIN; mus = mus * EDL.MUSIC_GAIN * env[:, None]
    end = int(SR * EDL.END_FADE); curve = (np.linspace(1, 0, end) ** 1.5)[:, None]; fx[-end:] *= curve; mus[-end:] *= curve
    return fx, mus

def write_wav(path, x):
    x = np.clip(x, -1, 1); pcm = (x * 32767).astype('<i2')
    with open(path, 'wb') as f:
        f.write(b'RIFF' + struct.pack('<I', 36 + pcm.nbytes) + b'WAVEfmt ' + struct.pack('<IHHIIHH', 16, 1, 2, SR, SR * 4, 4, 16) + b'data' + struct.pack('<I', pcm.nbytes)); f.write(pcm.tobytes())

def timecode(t):
    f = int(round(t * FPS)); return f'{f // (60 * FPS):02d}:{(f // FPS) % 60:02d}:{f % FPS:02d}'
def table(segs):
    print('| # | Trailer | Dauer | Aufnahme | In–Out (s) | Inhalt |'); print('|---|---|---|---|---|---|')
    for i, s in enumerate(segs, 1):
        print(f"| {i} | {timecode(s['start'])}–{timecode(s['end'])} | {s['dur']:.2f} | {s.get('take','—')} | {s['in']:.2f}–{s['out']:.2f} | {s.get('note','')} |")
def make_audio(segs, total):
    fx, mus = build_audio(segs, total); fxw, musw, wav = (os.path.join(T, n) for n in ('stem_fx.wav', 'stem_music.wav', 'mix_raw.wav'))
    write_wav(fxw, fx); write_wav(musw, mus)
    # Musikspur sanft verdichten (Spitzen auf den Takt-Einsen), dann mit den Geräuschen summieren
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', fxw, '-i', musw, '-filter_complex',
        f"[1:a]acompressor=threshold={EDL.MUS_COMP_THR}:ratio={EDL.MUS_COMP_RATIO}:attack=4:release=180:knee=4[m];[0:a][m]amix=inputs=2:normalize=0[a]",
        '-map', '[a]', '-ar', str(SR), '-ac', '2', '-c:a', 'pcm_s16le', wav], check=True)
    with open(os.path.join(T, 'gains.txt'), 'w') as f:
        for tk, a, b, lv, pk, g in GAINLOG: f.write(f'{tk:14s} {a:7.2f}–{b:7.2f}  Pegel {lv if lv is None else round(lv,1)}  Spitze {pk if pk is None else round(pk,1)}  Verstärkung {g:+.1f} dB\n')
    # Lautheit messen (EBU R128), linear auf −15 LUFS bringen, danach Begrenzer bei −2 dBFS (Reserve für echte Spitzen und AAC)
    meas = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', wav, '-af', 'loudnorm=I=-15:TP=-2:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
    j = json.loads(meas[meas.rindex('{'):meas.rindex('}') + 1]); print('Messung roh', {k: j[k] for k in ('input_i', 'input_tp', 'input_lra')})
    final_wav = os.path.join(T, 'mix.wav')
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', wav, '-af',
        f"loudnorm=I=-15:TP=-2:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true,aresample=48000,alimiter=limit=0.79:attack=2:release=40:level=false",
        '-ar', '48000', '-ac', '2', '-c:a', 'pcm_s16le', '-t', f'{total:.3f}', final_wav], check=True)
    return final_wav

def main():
    segs, total = build_timeline()
    if os.environ.get('TABLE'): table(segs); return
    print(f'Zeitachse {total:.3f} s, Soll {EDL.DURATION} s, {len(segs)} Abschnitte')
    assert abs(total - EDL.DURATION) < 1e-6, 'Schnittplan ist nicht genau 90 s lang'
    out = sys.argv[1] if len(sys.argv) > 1 else None
    if not out:
        pdir = os.path.join(T, os.environ.get('PREVIEW', 'preview')); os.makedirs(pdir, exist_ok=True)
        for i, s in enumerate(segs):
            tm = s['start'] + s['dur'] / 2; Image.fromarray(frame_at(segs, tm)).resize((960, 540), Image.NEAREST).save(os.path.join(pdir, f'p{i:02d}_{tm:05.1f}.png'))
        for tx in EDL.TEXTS:
            tm = (tx['t0'] + tx['t1']) / 2; Image.fromarray(frame_at(segs, tm)).resize((960, 540), Image.NEAREST).save(os.path.join(pdir, f'txt_{tm:05.1f}.png'))
        return
    final_wav = make_audio(segs, total)
    if os.environ.get('AUDIO_ONLY'): return
    enc = subprocess.Popen(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-i', final_wav,
        '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p,setsar=1', '-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-profile:v', 'high', '-level', '4.1',
        '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-r', str(FPS), '-frames:v', str(NFRAMES),
        '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-ac', '2', '-t', f'{total:.3f}', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
    for k in range(NFRAMES):
        t = k / FPS; enc.stdin.write(frame_at(segs, t).tobytes())
        if k % 150 == 0: print(f'  Bild {k}/{NFRAMES}', flush=True)
    enc.stdin.close(); enc.wait(); print('fertig', out, enc.returncode)

if __name__ == '__main__':
    main()
