"""Upload an immutable static release outside public_html; never changes DNS or the main site.
Usage: python tools/stage-hostinger.py --ssh-config <local config> --release <git sha>
"""
import argparse,hashlib,io,json,re,shlex,subprocess,tarfile
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--ssh-config',required=True);p.add_argument('--release',required=True);p.add_argument('--path-prefix',default='',help='Optional public URL prefix, for example /ao-trabalho');a=p.parse_args()
if len(a.release)!=40 or any(c not in '0123456789abcdef' for c in a.release):raise SystemExit('Use a full verified commit SHA.')
prefix=a.path_prefix.rstrip('/')
if prefix and (not prefix.startswith('/') or '//' in prefix or any(part in ['.','..'] for part in prefix.split('/'))):raise SystemExit('Use a safe absolute path prefix such as /ao-trabalho.')
root=Path(__file__).resolve().parents[1]/'dist'
if not (root/'index.html').is_file():raise SystemExit('Build and test first.')
files=[f for f in root.rglob('*') if f.is_file() and not any(part.startswith('.') for part in f.relative_to(root).parts) and f.suffix.lower() not in ['.md'] and f.name not in ['vercel.json','package.json']]
if any(f.is_symlink() for f in files):raise SystemExit('Symlinks are not published.')
head=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root.parent,text=True).strip()
if head!=a.release:raise SystemExit('Release SHA does not match this checkout.')
rewriteable={'.html','.css','.js','.mjs','.json','.webmanifest'}
root_path=re.compile(r'(?<![A-Za-z0-9.:])/(assets|ui|data|archive)/')
root_query=re.compile(r'(?<![A-Za-z0-9.:])/(?=[?#])')
def payload(f):
 if prefix and f.suffix.lower() in rewriteable:
  text=f.read_text(encoding='utf-8')
  text=root_path.sub(lambda m:prefix+'/'+m.group(1)+'/',text)
  text=root_query.sub(prefix+'/',text)
  text=text.replace("new URL('/',location.href)","new URL('"+prefix+"/',location.href)")
  text=text.replace('"/favicon.svg"','"'+prefix+'/favicon.svg"').replace("'/favicon.svg'","'"+prefix+"/favicon.svg'")
  return text.encode('utf-8')
 return None
manifest={'commit':a.release,'pathPrefix':prefix or '/','files':{}}
for f in files:
 data=payload(f);size=len(data) if data is not None else f.stat().st_size
 digest=hashlib.sha256(data if data is not None else f.read_bytes()).hexdigest()
 manifest['files'][f.relative_to(root).as_posix()]={'sha256':digest,'bytes':size}
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
process=subprocess.Popen(['ssh','-F',a.ssh_config,'-o','BatchMode=yes','-o','ServerAliveInterval=15','-o','ServerAliveCountMax=8','pilha-hostinger',command],stdin=subprocess.PIPE)
with tarfile.open(fileobj=process.stdin,mode='w|gz') as archive:
 for f in files:
  name=f.relative_to(root).as_posix();data=payload(f)
  if data is None:archive.add(f,arcname=name,recursive=False)
  else:
   entry=archive.gettarinfo(str(f),arcname=name);entry.size=len(data);archive.addfile(entry,io.BytesIO(data))
 for name,data in [('release-manifest.json',json.dumps(manifest).encode()),('.htaccess',b'DirectoryIndex index.html\n<IfModule mod_mime.c>\nAddType application/javascript .js .mjs\nAddType image/png .sprite\nAddType application/wasm .wasm\nAddType model/gltf-binary .glb\n</IfModule>\n<IfModule mod_headers.c>\n<FilesMatch "[.](html|js|mjs|css|json|sprite)$">\nHeader set Cache-Control "no-cache"\n</FilesMatch>\n</IfModule>\n')]:
  entry=tarfile.TarInfo(name);entry.size=len(data);entry.mode=0o644;archive.addfile(entry,io.BytesIO(data))
process.stdin.close();raise SystemExit(process.wait())
