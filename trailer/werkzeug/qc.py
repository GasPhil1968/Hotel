#!/usr/bin/env python3
# Technische Prüfung des fertigen Trailers (ffprobe/ffmpeg): Format, Bildzahl, Farbraum, Ton, Lautheit (EBU R128),
# schwarze Bilder, Stille, Kontaktbogen alle 3 s und erstes/letztes Bild.
#   python3 qc.py MALA_Trailer_90s_DE.mp4 [ausgabeordner]
import json, os, re, subprocess, sys
mp4 = sys.argv[1]; out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(os.path.abspath(mp4)), 'qc'); os.makedirs(out, exist_ok=True)
def run(args): return subprocess.run(args, capture_output=True, text=True)
pr = json.loads(run(['ffprobe', '-v', 'error', '-count_frames', '-show_entries',
    'format=duration,size,bit_rate:stream=index,codec_type,codec_name,profile,level,pix_fmt,width,height,sample_aspect_ratio,display_aspect_ratio,r_frame_rate,avg_frame_rate,nb_read_frames,color_space,color_primaries,color_transfer,color_range,sample_rate,channels,channel_layout,bit_rate,duration',
    '-of', 'json', mp4]).stdout)
v = [s for s in pr['streams'] if s['codec_type'] == 'video'][0]; a = [s for s in pr['streams'] if s['codec_type'] == 'audio'][0]
eb = run(['ffmpeg', '-hide_banner', '-nostats', '-i', mp4, '-map', '0:a', '-af', 'ebur128=peak=true', '-f', 'null', '-']).stderr
summ = eb[eb.rindex('Summary:'):]
I = float(re.search(r'I:\s+(-?[\d.]+) LUFS', summ).group(1)); LRA = float(re.search(r'LRA:\s+(-?[\d.]+) LU', summ).group(1)); TP = float(re.search(r'Peak:\s+(-?[\d.]+) dBFS', summ).group(1))
bd = run(['ffmpeg', '-hide_banner', '-nostats', '-i', mp4, '-map', '0:v', '-vf', 'blackdetect=d=0.2:pic_th=0.995:pix_th=0.02', '-f', 'null', '-']).stderr
blacks = re.findall(r'black_start:([\d.]+) black_end:([\d.]+) black_duration:([\d.]+)', bd)
sd = run(['ffmpeg', '-hide_banner', '-nostats', '-i', mp4, '-map', '0:a', '-af', 'silencedetect=n=-50dB:d=0.4', '-f', 'null', '-']).stderr
sil = re.findall(r'silence_start: (-?[\d.]+)[\s\S]*?silence_end: ([\d.]+) \| silence_duration: ([\d.]+)', sd)
# Kontaktbogen: alle 3 s ein Bild (30 Bilder), 6 Spalten
run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', mp4, '-vf', "select='not(mod(n\\,90))',scale=480:270:flags=lanczos,tile=6x5", '-frames:v', '1', '-update', '1', os.path.join(out, 'kontakt_alle_3s.png')])
run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', mp4, '-vf', 'select=eq(n\\,0)', '-frames:v', '1', '-update', '1', os.path.join(out, 'erstes_bild.png')])
run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-sseof', '-0.2', '-i', mp4, '-update', '1', '-frames:v', '1', os.path.join(out, 'letztes_bild.png')])
res = dict(datei=os.path.basename(mp4), groesse_mb=round(int(pr['format']['size']) / 1e6, 1), dauer_s=float(pr['format']['duration']),
    video=dict(codec=v['codec_name'], profil=v.get('profile'), level=v.get('level'), pix_fmt=v['pix_fmt'], groesse=f"{v['width']}x{v['height']}", sar=v.get('sample_aspect_ratio'), dar=v.get('display_aspect_ratio'),
               r_frame_rate=v['r_frame_rate'], avg_frame_rate=v['avg_frame_rate'], bilder=int(v['nb_read_frames']), dauer_s=float(v.get('duration', 0)), farbraum=v.get('color_space'), primaries=v.get('color_primaries'), transfer=v.get('color_transfer'), bereich=v.get('color_range')),
    audio=dict(codec=a['codec_name'], profil=a.get('profile'), abtastrate=int(a['sample_rate']), kanaele=a['channels'], layout=a.get('channel_layout'), dauer_s=float(a.get('duration', 0))),
    lautheit=dict(integriert_lufs=I, lra_lu=LRA, true_peak_dbtp=TP),
    schwarz=[dict(von=float(x[0]), bis=float(x[1]), dauer=float(x[2])) for x in blacks],
    stille_unter_minus50dB=[dict(von=float(x[0]), bis=float(x[1]), dauer=float(x[2])) for x in sil])
ok = dict(dauer=abs(res['dauer_s'] - 90.0) < 0.05, bilder=res['video']['bilder'] == 2700, h264=res['video']['codec'] == 'h264', yuv420p=res['video']['pix_fmt'] == 'yuv420p',
          groesse=res['video']['groesse'] == '1920x1080', fps=res['video']['r_frame_rate'] == '30/1' and res['video']['avg_frame_rate'] == '30/1', aac=res['audio']['codec'] == 'aac',
          ton48k=res['audio']['abtastrate'] == 48000, stereo=res['audio']['kanaele'] == 2, lautheit=-16.0 <= I <= -14.0, spitze=TP <= -1.0)
res['pruefung'] = ok
json.dump(res, open(os.path.join(out, 'qc.json'), 'w'), indent=1, ensure_ascii=False)
print(json.dumps(res, indent=1, ensure_ascii=False))
print('ALLE PRÜFUNGEN BESTANDEN' if all(ok.values()) else 'NICHT BESTANDEN: ' + ', '.join(k for k, x in ok.items() if not x))
