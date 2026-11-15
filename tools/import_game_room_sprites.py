"""Convert the approved 2D game-room renders to compact transparent WebP sprites."""
from pathlib import Path
from PIL import Image

SOURCE = Path(r"C:\Users\CRM7\Desktop\KONWERSA\PLANO B\PilhA+\Pilha Game\Assets_3D\Props_Moveis\Sala_de_Jogos\2D_Renders")
DESTINATION = Path(__file__).resolve().parents[1] / "assets" / "game-room"
SOURCES = {
    "game-foosball.webp": "01_mesa_de_pebolim.png",
    "game-pool.webp": "02_mesa_de_sinuca.png",
    "game-ping-pong.webp": "03_mesa_de_ping_pong.png",
    "game-air-hockey.webp": "04_mesa_de_air_hockey.png",
    "game-arcade.webp": "05_fliperamas_arcade.png",
    "game-pinball.webp": "06_maquina_de_pinball.png",
    "game-board.webp": "07_mesa_jogos_tabuleiro.png",
}

DESTINATION.mkdir(parents=True, exist_ok=True)
for output, source in SOURCES.items():
    with Image.open(SOURCE / source) as image:
        image.convert("RGBA").save(DESTINATION / output, "WEBP", quality=92, method=6)
    print(f"{output}: {(DESTINATION / output).stat().st_size:,} bytes")
