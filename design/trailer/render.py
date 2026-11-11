#!/usr/bin/env python3
# Trailer schneiden, vertonen und ausgeben:
#   python3 design/trailer/render.py <arbeitsordner> <ausgabe.mp4>
# Arbeitsordner: raw/ (Szenenaufnahmen *.webm + *.marks.json aus record.js), titles/ (titles.js), html/ (html_shots.js),
# music/ (music.js). Andere Unterordner: TRAILER_RAW=raw2 TRAILER_HTML=html2 python3 … .
# Ablauf: jede Einstellung → verlustfreie Zwischendatei (1920 × 1080, 30 fps, genau n Bilder) → aneinanderhängen →
# Ton mischen (Spielgeräusche der Einstellungen + Spielmusik) → Lautheit angleichen → H.264/AAC.
#
# Bildformen (alle ganzzahlig vergrößert, „Pixelfang“: erst auf das Spielraster 320 × 200 gemittelt, dann nächster Nachbar):
#   full        Spielbild ×5 (1600 × 1000) bei x 160, y 40 – Szene und Leiste des Spiels
#   scene       nur die Szene ×5 (1600 × 720) an derselben Stelle; darunter ein dunkles Band für Trailertext
#   small       Spielbild ×4 (1280 × 800) bei x 320, y 40; darunter ein Band für Trailertext (Abschnitt „Komfort“)
#   html        Bildschirmfoto der HTML-Schicht (1600 × 1000, Spielbild darin ×5) wie full
#   html_small  dasselbe ×0,8 (Spielbild darin genau ×4) wie small
#   card        dunkler Grund;   end   Endkarte (Titelbild-Landschaft + Schriftebenen aus titles.js)
import json, os, subprocess, sys
from PIL import Image
W, H, FPS = 1920, 1080, 30
BG = '0x08070d'                       # P.k0 des Spiels (Grund der Leiste)
BAND = {'scene': (760, 1080), 'small': (840, 1080), 'html_small': (840, 1080)}
WORK, OUT = sys.argv[1], sys.argv[2]
RAW = os.path.join(WORK, os.environ.get('TRAILER_RAW', 'raw'))
HTML = os.path.join(WORK, os.environ.get('TRAILER_HTML', 'html'))
TIT = os.path.join(WORK, 'titles')
SEG = os.path.join(WORK, 'seg'); os.makedirs(SEG, exist_ok=True)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from edl import EDL, MUSIC, END_LAYERS   # Schnittliste, Musikplan, Endkarte (edl.py daneben)

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(' '.join(cmd)); print(r.stderr[-3000:]); raise SystemExit('ffmpeg-Fehler')
    return r

_marks = {}
def marks(src):
    if src not in _marks:
        p = os.path.join(RAW, src + '.marks.json')
        _marks[src] = {m[1]: m[0] for m in json.load(open(p))} if os.path.exists(p) else {}
    return _marks[src]

def fixed(src):   # MediaRecorder-WebM ohne Dauer/Index → einmal umverpacken (sonst springt die Suche)
    a, b = os.path.join(RAW, src + '.webm'), os.path.join(RAW, src + '_fix.mkv')
    if not os.path.exists(b) or os.path.getmtime(b) < os.path.getmtime(a): run(['ffmpeg', '-v', 'error', '-y', '-i', a, '-c', 'copy', b])
    return b

def t_in(e):
    if 'at' not in e: return e.get('t', 0.0)
    m = marks(e['src'])
    if e['at'] not in m: raise SystemExit(f"Marke fehlt: {e['src']} / {e['at']} (vorhanden: {', '.join(m)})")
    return m[e['at']] + e.get('off', 0.0)

def cap_y(e, png, where):
    h = Image.open(png).size[1]
    if where == 'top': return 40                                    # Streifen über dem oberen Rand des Spielbilds
    a, b = BAND[e['frame']]; return int((a + b) / 2 - h / 2)        # mitten im Textband

def caps_filter(e, base, inputs, dur):
    # Texte als Bildebenen: (png, von, bis[, 'band'|'top'[, einblenden[, ausblenden]]]) – 0,25 s weiche Blenden
    f, last = [], base
    for i, c in enumerate(e.get('caps', [])):
        png, a, b = c[0], c[1], c[2]; where = c[3] if len(c) > 3 else 'band'; fi = c[4] if len(c) > 4 else True; fo = c[5] if len(c) > 5 else True
        path = os.path.join(TIT, png + '.png'); idx = inputs.count('-i')
        inputs += ['-loop', '1', '-t', f'{dur + 0.5:.3f}', '-r', str(FPS), '-i', path]
        fx = ['format=rgba']
        if fi: fx.append(f'fade=t=in:st={a}:d=0.25:alpha=1')
        if fo: fx.append(f'fade=t=out:st={b - 0.25:.3f}:d=0.25:alpha=1')
        f.append(f"[{idx}:v]{','.join(fx)}[c{i}]")
        f.append(f"[{last}][c{i}]overlay=x=(W-w)/2:y={cap_y(e, path, where)}:enable='between(t,{a},{b})':format=auto[v{i}]"); last = f'v{i}'
    return f, last

def end_filter(base, inputs, dur):
    # Endkarte: Schriftebenen (1920 × 1080, durchsichtig) nacheinander einblenden
    f, last = [], base
    for i, (png, a, d) in enumerate(END_LAYERS):
        idx = inputs.count('-i')
        inputs += ['-loop', '1', '-t', f'{dur + 0.5:.3f}', '-r', str(FPS), '-i', os.path.join(TIT, png + '.png')]
        f.append(f"[{idx}:v]format=rgba,fade=t=in:st={a}:d={d}:alpha=1[l{i}]")
        f.append(f"[{last}][l{i}]overlay=0:0:format=auto[w{i}]"); last = f'w{i}'
    return f, last

def segment(i, e):
    n = e['n']; dur = n / FPS; out = os.path.join(SEG, f'{i:02d}.mkv'); inputs, fl = [], []
    kind = e['frame']
    if kind in ('full', 'scene', 'small'):
        inputs += ['-ss', f'{t_in(e):.3f}', '-t', f'{dur + 0.5:.3f}', '-i', fixed(e['src'])]
        snap = f'fps={FPS}:round=near,scale=320:200:flags=area'
        if kind == 'full': fl.append(f'[0:v]{snap},scale=1600:1000:flags=neighbor,pad={W}:{H}:160:40:color={BG},format=rgb24[b0]')
        elif kind == 'scene': fl.append(f'[0:v]{snap},crop=320:144:0:0,scale=1600:720:flags=neighbor,pad={W}:{H}:160:40:color={BG},format=rgb24[b0]')
        else: fl.append(f'[0:v]{snap},scale=1280:800:flags=neighbor,pad={W}:{H}:320:40:color={BG},format=rgb24[b0]')
    elif kind in ('html', 'html_small'):
        inputs += ['-loop', '1', '-t', f'{dur + 0.5:.3f}', '-r', str(FPS), '-i', os.path.join(HTML, e['src'])]
        if kind == 'html': fl.append(f'[0:v]format=rgb24,pad={W}:{H}:160:40:color={BG}[b0]')
        else: fl.append(f'[0:v]format=rgb24,scale=1280:800:flags=area,pad={W}:{H}:320:40:color={BG}[b0]')
    elif kind == 'card':
        inputs += ['-f', 'lavfi', '-t', f'{dur + 0.5:.3f}', '-i', f'color=c={BG}:s={W}x{H}:r={FPS}']
        fl.append('[0:v]format=rgb24[b0]')
    elif kind == 'end':
        inputs += ['-framerate', str(FPS), '-i', os.path.join(TIT, 'endbg', 'f%03d.png')]
        fl.append('[0:v]format=rgb24[b0]')
    base = 'b0'
    if kind == 'end':
        ef, base = end_filter(base, inputs, dur); fl += ef
    cf, last = caps_filter(e, base, inputs, dur); fl += cf
    fx = []
    if e.get('fadein'): fx.append(f"fade=t=in:st=0:d={e['fadein']}")
    if e.get('fadeout'): fx.append(f"fade=t=out:st={dur - e['fadeout']:.3f}:d={e['fadeout']}")
    fl.append(f"[{last}]{','.join(fx) if fx else 'null'},format=rgb24[vo]")
    run(['ffmpeg', '-v', 'error', '-y'] + inputs + ['-filter_complex', ';'.join(fl), '-map', '[vo]', '-frames:v', str(n), '-r', str(FPS),
         '-c:v', 'libx264rgb', '-qp', '0', '-preset', 'ultrafast', out])
    got = int(run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', out]).stdout.strip())
    if got != n: raise SystemExit(f'Einstellung {i} ({e.get("id")}): {got} statt {n} Bilder')
    # Ton der Einstellung (Spielgeräusche), sonst Stille; kurze Blenden gegen Knackser
    aout = os.path.join(SEG, f'{i:02d}.wav')
    if kind in ('full', 'scene', 'small') and e.get('gain', 1.0) > 0:
        g = e.get('gain', 1.0); fi = e.get('afi', 0.03); fo = e.get('afo', 0.05)
        run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t_in(e):.3f}', '-t', f'{dur:.4f}', '-i', fixed(e['src']), '-vn', '-af',
             f'aresample=48000,aformat=channel_layouts=stereo,volume={g},afade=t=in:d={fi},afade=t=out:st={max(0, dur - fo):.4f}:d={fo},apad,atrim=end_sample={1600 * n}',
             '-ar', '48000', '-ac', '2', '-c:a', 'pcm_s16le', aout])
    else:
        run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-af', f'atrim=end_sample={1600 * n}', '-c:a', 'pcm_s16le', aout])
    ns = int(run(['ffprobe', '-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=duration_ts', '-of', 'csv=p=0', aout]).stdout.strip())
    if ns != 1600 * n: raise SystemExit(f'Einstellung {i}: Ton {ns} statt {1600 * n} Abtastwerte')
    return out, aout, n

def music_track(total):
    # MUSIC: Stück aus music/<stück>.webm ab „von“ s, gelegt auf „bei“ s, „dauer“ s lang, mit Blenden und Pegel
    parts, inputs = [], []
    for k, m in enumerate(MUSIC):
        inputs += ['-ss', str(m['von']), '-t', str(m['dauer']), '-i', os.path.join(WORK, 'music', m['stueck'] + '.webm')]
        d = m['dauer']; t0 = int(round(m['bei'] * 1000))
        vol = f"volume={m['pegel']}"
        if m.get('rampe'):   # Pegel ab Sekunde a (im Stück) über b Sekunden linear auf c
            a, b, c = m['rampe']; vol = f"volume='{m['pegel']}+({c}-{m['pegel']})*min(max((t-{a:.3f})/{b},0),1)':eval=frame"
        parts.append(f"[{k}:a]aresample=48000,aformat=channel_layouts=stereo,{vol},afade=t=in:d={m['ein']},afade=t=out:st={d - m['aus']:.3f}:d={m['aus']},adelay={t0}|{t0},apad,atrim=end_sample={round(total * 48000)}[m{k}]")
    mix = ''.join(f'[m{k}]' for k in range(len(MUSIC))) + f'amix=inputs={len(MUSIC)}:normalize=0:duration=longest,atrim=end_sample={round(total * 48000)}[mo]'
    out = os.path.join(SEG, 'music.wav')
    run(['ffmpeg', '-v', 'error', '-y'] + inputs + ['-filter_complex', ';'.join(parts + [mix]), '-map', '[mo]', '-ar', '48000', '-c:a', 'pcm_s16le', out]); return out

def main():
    segs = [segment(i, e) for i, e in enumerate(EDL)]
    total_n = sum(s[2] for s in segs); total = total_n / FPS
    print('Einstellungen', len(segs), 'Bilder', total_n, f'({total:.3f} s)')
    with open(os.path.join(SEG, 'v.txt'), 'w') as f: f.writelines(f"file '{s[0]}'\n" for s in segs)
    with open(os.path.join(SEG, 'a.txt'), 'w') as f: f.writelines(f"file '{s[1]}'\n" for s in segs)
    vcat = os.path.join(SEG, 'video.mkv'); run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', os.path.join(SEG, 'v.txt'), '-c', 'copy', vcat])
    game = os.path.join(SEG, 'game.wav'); run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', os.path.join(SEG, 'a.txt'), '-c', 'copy', game])
    mus = music_track(total)
    # Mischung: Spielton + Musik. Mastering: Pegel so setzen, dass −15 LUFS herauskommen, dann Spitzen mit einem Begrenzer bei
    # vierfacher Abtastrate (≈ True Peak) auf −1,6 dBFS halten; nachmessen und den Pegel einmal nachführen.
    mixed = os.path.join(SEG, 'mix.wav')
    run(['ffmpeg', '-v', 'error', '-y', '-i', game, '-i', mus, '-filter_complex', f'[0:a][1:a]amix=inputs=2:normalize=0:duration=first,apad,atrim=end_sample={round(total * 48000)}[a]',
         '-map', '[a]', '-ar', '48000', '-c:a', 'pcm_f32le', mixed])
    def loud(path):
        r = run(['ffmpeg', '-hide_banner', '-nostats', '-i', path, '-af', 'ebur128=peak=true', '-f', 'null', '-']).stderr
        tail = r[r.rfind('Summary:'):]
        num = lambda key: float(tail.split(key)[1].split()[0])
        return num('I:'), num('Peak:'), num('LRA:')
    i0, p0, _ = loud(mixed); g = -15.0 - i0; norm = os.path.join(SEG, 'norm.wav')
    for _ in range(3):
        run(['ffmpeg', '-v', 'error', '-y', '-i', mixed, '-af', f'volume={g:.3f}dB,aresample=192000,alimiter=limit=0.832:attack=1:release=60:level=false:asc=1,aresample=48000',
             '-ar', '48000', '-c:a', 'pcm_s24le', norm])
        i1, p1, lra = loud(norm)
        if abs(i1 + 15.0) <= 0.2: break
        g += -15.0 - i1
    print(f'Mischung {i0:.1f} LUFS (Spitze {p0:.1f} dBTP) → {i1:.1f} LUFS, True Peak {p1:.1f} dBTP, LRA {lra:.1f} LU (Pegel {g:+.1f} dB)')
    run(['ffmpeg', '-v', 'error', '-y', '-i', vcat, '-i', norm, '-map', '0:v', '-map', '1:a',
         '-vf', 'scale=out_color_matrix=bt709:out_range=tv:flags=accurate_rnd+full_chroma_int,format=yuv420p', '-c:v', 'libx264', '-preset', 'slow', '-crf', os.environ.get('TRAILER_CRF', '16'), '-tune', 'animation',
         '-pix_fmt', 'yuv420p', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv', '-r', str(FPS), '-frames:v', str(total_n),
         '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', '-movflags', '+faststart',
         '-metadata', 'title=MALA – Trailer (DE)', '-metadata:s:a:0', 'language=deu', '-metadata:s:v:0', 'language=deu', OUT])
    print('fertig:', OUT)

if __name__ == '__main__': main()
