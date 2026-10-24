#!/usr/bin/env python3
"""Import approved PilhA furniture assets from the supplied package.

Usage:
    python3 tools/import_furniture_kit.py /path/to/Pilha_Game_Kit_Mobiliario_Poof_v1.zip

Only this importer changes the graphicsStatus to "ready" after verifying files.
Economics and source of truth remain data/continuous/catalog.js.
"""
import json
import sys
import zipfile
import shutil
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEST = ROOT / "assets" / "furniture"
PREFIX = "Pilha_Game_Mobiliario/"
MANIFEST_PATH = ROOT / "data" / "continuous" / "furniture-visuals.json"
JS_MANIFEST_PATH = ROOT / "data" / "continuous" / "furniture-visuals.js"

def main(source):
    source = Path(source)
    if not source.is_file():
        raise SystemExit(f"ZIP ausente: {source}")
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    assets = manifest["assets"]
    paths = []
    for a in assets:
        paths.extend([f"sprites/webp/{a['file']}", f"sprites/png/{a['png']}"])
    paths.append("effects/poof_atlas_4x3.png")
    paths.extend("icons/" + x for x in manifest["programs"].values())
    with zipfile.ZipFile(source) as archive:
        missing = [p for p in paths if PREFIX+p not in archive.namelist()]
        if missing:
            raise SystemExit("Arquivos ausentes no ZIP: " + ", ".join(missing))
        for name in paths:
            output=DEST/name
            output.parent.mkdir(parents=True,exist_ok=True)
            with archive.open(PREFIX+name) as src, output.open("wb") as dst:
                shutil.copyfileobj(src,dst)
            if output.stat().st_size == 0:
                raise SystemExit("Arquivo vazio: " + str(output))
    manifest["graphicsStatus"] = "ready"
    manifest["poof"]["atlas"] = "/assets/furniture/effects/poof_atlas_4x3.png"
    manifest["rasterImported"] = True
    MANIFEST_PATH.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    JS_MANIFEST_PATH.write_text("// Generated from furniture-visuals.json by tools/import_furniture_kit.py\nexport const FURNITURE_VISUALS = Object.freeze("+json.dumps(manifest,ensure_ascii=False,separators=(',',':'))+");\n",encoding="utf-8")
    print(f"Importados {len(assets)} WebP, {len(assets)} PNG, atlas Poof e {len(manifest['programs'])} SVGs em {DEST}")
    print("Em seguida: npm test && npm run build. Commitar imagens e manifesto atualizado.")

if __name__ == "__main__":
    if len(sys.argv)!=2:
        raise SystemExit("Uso: python3 tools/import_furniture_kit.py CAMINHO_DO_ZIP")
    main(sys.argv[1])
