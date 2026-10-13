# PilhA+ Game — Prompts de produção 3D para a Missão 01

**Direção de arte:** personagens estilizados 3D com cabeça relativamente grande, corpo compacto, braços e pernas discretamente reduzidos, leitura fácil em câmera isométrica (diagonal superior), semelhante aos personagens aprovados. O novo gestor deve pertencer à mesma família visual da operadora logística, da psicóloga e do psiquiatra. **Não reproduzir a aparência ou identidade de uma pessoa real.**

## 1. Personagem gestor/mentor — `char_gestor_mentor_01_v01.glb`

**Meshy Text-to-3D prompt (EN):**

> Full-body stylized 3D game character, friendly Brazilian organizational manager and learning mentor, middle-aged Black man with warm medium-dark brown skin, short natural coiled hair, expressive eyes, subtle confident smile, rectangular rounded glasses, navy blazer over cream shirt with subtle burnt-orange pocket square, khaki straight trousers and dark brown comfortable shoes. Contemporary soft 3D animated game aesthetic, large expressive head (approximately 1/3 of total height), compact torso, slightly shorter legs, carefully simplified but high-quality fabric folds, clearly readable hands for gesturing and pointing, mature yet welcoming, no exaggerated stereotypes. Neutral A-pose with hands slightly away from body, front-facing, entire character visible including footwear, isolated plain neutral background, consistent scale with other PilhA+ game characters, clean topology for humanoid rigging, PBR materials, game-ready mesh. No scenery, no base, no text, no logos, no props in hands.

**Recommended settings:** stylized/soft PBR, quad remesh where possible; one model, separated from accessories, up orientation Y, front facing +Z, initial target 15k–35k triangles, 1024–2048px textures, humanoid biped rig (separate animation stage). Target character height 1.65 game-world units after engine normalization, not absolute real-world unit from source.

**Separate animation prompts (if available, do not batch regenerate the model):**

- `idle_mentor`: neutral breathing, subtle posture shift, gentle eye movement, 3-second loop, character remains in place.
- `talk_mentor`: conversational hand movement with small head nods, 3–4-second loop, no mouth sync required.
- `point_mentor`: arm indicating a card or library terminal to the character's right, 2-second gesture, return to idle.
- `walk_mentor`: calm walk in place, grounded foot contact and no root translation, seamless loop.

Avoid a hard-coded walking route or cinematic baked camera. Animations must be separate clips usable by Three.js `AnimationMixer`.

## 2. Biblioteca modular — `env_biblioteca_nr1_modular_01_v01.glb`

**Meshy Text/Image-to-3D prompt (EN):**

> Modular isometric cutaway library and workplace learning hub interior for a mobile management simulation game. Square floor module, approx 8 x 8 meters in relative dimensions, warm ivory flooring, two back walls only, no ceiling or front walls. Clear 45-degree camera accessibility, three clearly identifiable learning stations, warm amber task lighting, soft sage green plants, blue-gray signage mounts without embedded text. Wooden bookshelves, reading table in center, cozy armchairs, three interactive digital podiums distributed across the room, compact reception desk, wooden book props, spacious walkable aisles with a minimum 1.5 meter corridor. Stylized high-quality game-ready hand-crafted 3D diorama matching modern isometric mobile simulation art, pleasant but uncluttered, clean separable geometry, warm off-white, olive/sage, mustard/orange and navy accent colors, PBR materials. No people, no written words, no logos, no floating objects, no decorative frame, no studio ground outside the module.

**Mandatory modularity:** retain open front and one side of the diorama, origin centered on floor, +Y up, floor y=0, leave an accessible center aisle, broad rectangular walkable floor polygon, three stations physically separate for click hotspots. Environment should export independently from the characters.

**Target mobile optimization:** 50k–100k triangles for whole scene at most when optimized; ideally deliver isolated props and lighter level-of-detail. 2k texture atlas max for whole library initially; prefer 1k props. Avoid giant 4k/8k textures per book.

## 3. Interactive assets — separate exports

| Export name | Prompt (EN) | Interactivity |
|---|---|---|
| `prop_estante_livros_01_v01.glb` | Cozy modern library wooden bookcase, adjustable cubbies, readable book silhouettes in mustard, ivory and sage, game-ready isometric 3D prop, no legible titles, no background | Collider; no click needed |
| `prop_mesa_leitura_01_v01.glb` | Rounded rectangular oak reading table with 4 slim legs and a few books, stylized game prop, isolated, clean PBR and topology | Collider; reading hotspot |
| `prop_poltrona_leitura_01_v01.glb` | Compact comfortable lounge chair upholstered in sage green fabric, rounded corners, game-ready stylized 3D prop, isolated | Seat interaction later |
| `prop_terminal_nr1_01_v01.glb` | Freestanding touchscreen learning terminal, navy body with blank warm-light screen, touch-height ~1.35m, subtle orange illuminated outline, game-ready, isolated, NO TEXT | Station trigger / UI |
| `prop_painel_nr1_01_v01.glb` | Wall-mounted learning display, simple beveled frame, blank light screen, stylized 3D game asset, no textual content | Quiz trigger |
| `prop_livro_aberto_01_v01.glb` | Open hardcover reference book with visible plain pages, neutral line shapes, no readable text, isolated PBR model | Book hotspot |
| `prop_balcao_biblioteca_01_v01.glb` | Simple modern learning-center reception desk with navy lower cabinets and pale oak top, compact scale, isolated | Mentor meeting position |
| `prop_luminaria_01_v01.glb` | Modern brass desk lamp, warm luminous diffuser, isolated stylized game asset | Light prop |
| `prop_planta_interior_01_v01.glb` | Indoor potted plant, dark matte ceramic pot, low-poly sage-green leaves, no background | Decor; no collision |
| `prop_quadro_informativo_01_v01.glb` | Wall-mounted blank framed information board, beige and blue-gray panel, no symbols, no words, PBR | Information hotspot |

**Important:** UI text (NR-1, question statements, button labels) should be rendered as HTML overlays, not baked in the 3D texture: this improves readability, accessibility and localization.

## 4. Character + prop production workflow

1. Generate mentor first in a neutral A-pose. Validate face proportions against the approved operator/psychologist/psychiatrist portraits.
2. Lock character mesh; rig using humanoid profile and apply 3–4 animation clips. Confirm animation names on export.
3. Generate library scene as a shell, **without characters**. Validate isometric wall visibility and walkable aisle before texturing.
4. Generate station terminals as separate GLBs. Avoid producing the same terminal already fused to the shell: duplicate meshes cost performance.
5. Export GLB assets in `Y-up`, bake materials, use isolated meshes and pivots at object bases; test drag-and-drop in the PilhA+ 3D lab.
6. Save authoritative originals in Drive; add only optimized, publication-approved derivatives to GitHub/Vercel.

## 5. Configuration checkpoints

- Humanoid avatar can turn through 360 degrees without disjoint elbows or legs.
- Sitting/walking animations do not drag model root across map.
- Doorways/corridors can fit a 1.65-unit avatar with 0.40-unit personal clearance.
- Objects' scale and floor height align with the galpão scene.
- `glb` contains no embedded medical records, user info, or real data.

## 6. Next integration

Current prototype `missao01.html` uses a static original library illustration with HTML hotspots. After the Meshy GLB is validated, mount it to the scene adapter (`scene3d.html`) using local import, define three station transforms and replace SVG illustration only after collision and performance checks. The prototype does not claim the library 3D is finished.
