# Robô de Lata — contexto do projeto

Metroidvania 2D mobile: um robô de lata se torna humano parte por parte. Cada parte do corpo é habilidade de gameplay, chave de progressão E os sentidos do PRÓPRIO JOGADOR (olho = tela, orelha = som do jogo, tato = vibração). Leia `docs/GDD.md` antes de qualquer mudança de design — as decisões lá são vinculantes.

## Pilares (não violar)

1. A interface É o corpo do robô. Sem olho não há imagem; sem orelha não há som.
2. Toda parte nova traz um custo junto do benefício (ver tabela do GDD).
3. Combate não-letal em gameplay, sempre. As únicas mortes são 3 set pieces roteirizadas.
4. Era lata = invulnerável (sem game over, "remontado"); humanização = fragilidade crescente.
5. Animação dura/quantizada de propósito (função `q()`); suaviza conforme o robô se humaniza.

## Regra de produção do twist (crítica)

O prólogo às cegas é UMA cena completa (Gepeto existe, a morte acontece), apenas MASCARADA por overlays pretos na 1ª jogada. Nunca criar uma "cena do prólogo" separada para o replay pós-créditos — é a mesma cena com as máscaras desligadas. O jogador NUNCA pode ver Gepeto ou sua queda na 1ª jogada.

## Estrutura

- `index.html` — página única; Phaser 3 via CDN; scripts em ordem de dependência (sem bundler por enquanto)
- `src/const.js` — constantes, `vib()` (vibração), `q()` (quantizador de animação)
- `src/i18n.js` — carregador de idiomas; `T(chave)` para todo texto
- `src/lang/*.json` — dicionários (pt-BR é o principal; en; multilíngue por design)
- `src/audio.js` — `Snd`: WebAudio sintetizado; só toca após `Snd.enable()` (aquisição da Orelha)
- `src/save.js` — `Save`: localStorage. A flag `finished` é o gatilho do replay do prólogo (GDD 2.2b)
- `src/parts.js` — `Parts`: registro das partes do corpo. Substitui booleanos soltos; todo registro tem `cost`
- `src/world.js` — `WORLD`: mapa data-driven (zonas de câmera, chão, plataformas, props) + `zoneAt(x)`
- `src/story.js` — `STORY`: beats narrativos data-driven (gatilho + passos). Cena de história nova vai aqui, não em `scenes.js`
- `docs/ATO1.md`, `docs/ATO2.md` — mapas de beats por ato: o que está feito, o que falta, e os cuidados de cada um
- `src/scenes.js` — TitleScene + GameScene (prólogo → olho → orelha → puzzle sonoro → saída para a cidade)
- `src/main.js` — boot (espera fontes + i18n)
- `docs/GDD.md` — game design document, fonte da verdade
- `docs/arte/` — direção de arte: `ASSETS.md` (o que falta desenhar + prompts) e `referencias/` (folhas canônicas)

## Convenções

- NENHUM texto hardcoded em cena: sempre `T('chave')` + entrada nos dois JSONs de idioma.
- Paleta: mundo em cinzas (olho N1 é P&B por design); único acento `AMBER` (#d9a441) para interação. Cor plena só existirá com o Olho N2.
- Arte é **nanquim (ligne claire, ref. Moebius)**, hoje procedural em `makeTextures()`: contorno claro de espessura uniforme, chapados planos, hachura escassa. Texturas desenhadas em `ART`× e exibidas em `AS` — sempre aplicar `.setScale(AS)` em sprite novo. Acabamento inteiro sai de 4 constantes em `const.js`.
- Regra dura da era lata: **nenhum sprite pode ter mão, boca que abre ou peito aberto.** O que está lacrado é a lista de partes que o jogador ainda vai conquistar (GDD seção 6).
- Vibração (`vib`) é canal de gameplay (tato), não enfeite — mantê-la coerente.
- Controles: ◀▶ mover, ▲/W pular (pulo baixo — pernas de lata), espaço/E interagir. Touch: botões na tela, interação só aparece em contexto.
- Sem dependências novas sem necessidade real; o jogo deve rodar abrindo `index.html` num servidor estático.
- Testar sempre em viewport mobile paisagem (960×540 FIT).
- **Cenário novo vai em `src/world.js`, nunca cravado no `create()`.** O `create()` interpreta dados; se você está escrevendo coordenadas dentro dele, está no arquivo errado.
- **Duas câmeras:** `this.cam` (mundo, com zoom por zona) e `this.uiCam` (fixa em 1). Todo objeto de UI criado depois do `create()` precisa passar por `this.ui(obj)`, senão renderiza duas vezes e o zoom o deforma.
- Zoom é linguagem: interior aproxima (o robô enche a sala), exterior afasta (a cidade é grande e ele é pequeno). Ajustar em `WORLD.zones`.
- **Com um olho só, o robô fica no CENTRO da tela, colado na borda da máscara** (`camLead()`). Tudo à frente cai no escuro e avançar vira ato de fé. Dar folga à frente destrói o Olho N1: a meia tela vira só uma tela menor. A folga volta com o Olho N2.
- **`body.setSize()` trabalha em pixels da TEXTURA e é multiplicado pela escala do sprite.** Como as texturas são desenhadas em `ART`× e exibidas em `AS`, passar o tamanho de tela direto gera um corpo 4× menor. Sempre `setSize(w / AS, h / AS, true)` em sprite com física.
- **O robô não fala sem boca.** O runtime bloqueia `say` com `who: ROBOT_SPEAKER` enquanto `Parts.has('mouth')` for falso, e avisa no console. A mandíbula sólida é regra do GDD, não estilo.
- **História é dado.** Beat novo é entrada em `src/story.js`; o runtime já interpreta `think`, `say`, `spawn`, `move`, `face`, `exit`, `follow`, `vib`, `wait`, `panic`, `block`, `setFlag`. Se você está escrevendo cutscene dentro do `scenes.js`, está no arquivo errado.
- `thought()` é a voz interna do robô (itálico, sem nome); `say()` é fala de NPC (com nome de quem fala). Não misturar: um só existe porque ele tem cérebro, o outro vem de fora.
- Objeto de mundo criado depois do `create()` precisa passar por `this.world(obj)`, assim como UI passa por `this.ui(obj)`. Sem isso ele renderiza nas duas câmeras.
- **Gatilho de beat é FAIXA, não limiar** (`at: { x, xMax }`). O mapa é um eixo X só e os Undergrounds ficam à direita da cidade: sem `xMax`, todo beat pendente do Ato 1 dispara debaixo da terra.
- **Gating nunca é "você precisa do item X".** O mundo recusa e o corpo explica — ver `pullLever()`. A recusa é informação, não obstáculo.
- Sentido nunca é booleano solto: `Parts.has('eye')`, não `this.hasEye = true`. Aquisição é `Parts.acquire(id)`, que persiste sozinho.

## Rodar localmente

Servidor estático na raiz (fetch dos JSONs exige http): `python3 -m http.server` → http://localhost:8000

## Estado atual / próximos passos

Pronto: prólogo às cegas, cérebro, olho, orelha, puzzle do tique-taque, saída para a cidade. Arte em nanquim procedural. Mapa data-driven com zonas de câmera. Save em localStorage com "continuar" (quem tem o olho não repete o prólogo). Registro de partes do corpo.

Ato 1 em construção: beats 1 a 9 jogáveis (ver `docs/ATO1.md`). A avenida tem multidão que entra em pânico, o Dog tem corpo e acompanha em plataforma, e há **bifurcação**: escada de incêndio (Pernas N1) e beco (Boca N1), em qualquer ordem, nenhuma tranca a outra.

**Ato 1 fechado**: prólogo às cegas → cérebro, olho, orelha → saída para a cidade → a rua o chama de monstro → o Dog → bifurcação (Pernas ou Boca, ordem livre) → Detetive → Sheriff → a grade.

**Ato 2 começado** (Undergrounds): chegada → Bom Ladrão → Braços N1 → portão com alavanca. Próximos em `docs/ATO2.md`: Rei do Crime, Mãos N1, bifurcação Padre/Líder Sindical, Pulmões.

O jogo é mais história que desafio — obstáculo só entra quando significa alguma coisa. Não-linearidade fica **concentrada em bifurcações**, com trechos guiados entre elas.

Adiado a pedido: passe de arte do prólogo e do Gepeto — é a última cena a ser produzida. **Atenção:** adiar a ARTE é seguro; o que não pode é virar uma cena separada. O prólogo às cegas e o replay revelador têm de continuar sendo a MESMA cena com camadas ligadas/desligadas (GDD 2.2).
