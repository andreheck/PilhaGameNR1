"""Upload an immutable static release outside public_html; never changes DNS or the main site.
Usage: python tools/stage-hostinger.py --ssh-config <local config> --release <git sha>
"""
import argparse,hashlib,io,json,shlex,subprocess,tarfile
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--ssh-config',required=True);p.add_argument('--release',required=True);a=p.parse_args()
if len(a.release)!=40 or any(c not in '0123456789abcdef' for c in a.release):raise SystemExit('Use a full verified commit SHA.')
root=Path(__file__).resolve().parents[1]/'dist'
if not (root/'index.html').is_file():raise SystemExit('Build and test first.')
files=[f for f in root.rglob('*') if f.is_file() and not any(part.startswith('.') for part in f.relative_to(root).parts) and f.suffix.lower() not in ['.md'] and f.name not in ['vercel.json','package.json']]
if any(f.is_symlink() for f in files):raise SystemExit('Symlinks are not published.')
head=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root.parent,text=True).strip()
if head!=a.release:raise SystemExit('Release SHA does not match this checkout.')
manifest={'commit':a.release,'files':{f.relative_to(root).as_posix():{'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'bytes':f.stat().st_size} for f in files}}
remote='domains/vaideplanob.com.br/aotrabalho-releases/'+a.release
# Keep extraction bounded and independent from shell expansion.
receiver=r"""import pathlib,tarfile,sys,json,hashlib
root=pathlib.Path(sys.argv[1]).resolve()
if root.exists():raise SystemExit('Release already exists; no files overwritten.')
root.mkdir(parents=True)
archive=tarfile.open(fileobj=sys.stdin.buffer,mode='r|gz')
for member in archive:
 target=(root/member.name).resolve()
 if root not in target.parents or not member.isfile():raise SystemExit('Unsafe package entry')
 target.parent.mkdir(parents=True,exist_ok=True)
 source=archive.extractfile(member)
 with target.open('wb') as out:
  while True:
   chunk=source.read(1048576)
   if not chunk:break
   out.write(chunk)
m=json.loads((root/'release-manifest.json').read_text())
for name,expected in m['files'].items():
 f=root/name
 if f.stat().st_size!=expected['bytes'] or hashlib.sha256(f.read_bytes()).hexdigest()!=expected['sha256']:raise SystemExit('Hash mismatch: '+name)
(root/'release-ready.json').write_text(json.dumps({'commit':m['commit'],'verifiedFiles':len(m['files'])}))
print(json.dumps({'release':str(root),'commit':m['commit'],'verifiedFiles':len(m['files']),'public':False}))
"""
command='python3 -c '+shlex.quote(receiver)+' '+shlex.quote(remote)
process=subprocess.Popen(['ssh','-F',a.ssh_config,'-o','BatchMode=yes','pilha-hostinger',command],stdin=subprocess.PIPE)
with tarfile.open(fileobj=process.stdin,mode='w|gz') as archive:
 for f in files:archive.add(f,arcname=f.relative_to(root).as_posix(),recursive=False)
 for name,data in [('release-manifest.json',json.dumps(manifest).encode()),('.htaccess',b'DirectoryIndex index.html\n<IfModule mod_mime.c>\nAddType application/javascript .js .mjs\nAddType application/wasm .wasm\nAddType model/gltf-binary .glb\n</IfModule>\n<IfModule mod_headers.c>\n<FilesMatch "[.](html|js|mjs|css|json)$">\nHeader set Cache-Control "no-cache"\n</FilesMatch>\n</IfModule>\n')]:
  entry=tarfile.TarInfo(name);entry.size=len(data);entry.mode=0o644;archive.addfile(entry,io.BytesIO(data))
process.stdin.close();raise SystemExit(process.wait())
