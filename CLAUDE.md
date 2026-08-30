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
- `src/scenes.js` — TitleScene + GameScene (prólogo → olho → orelha → puzzle sonoro)
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

## Rodar localmente

Servidor estático na raiz (fetch dos JSONs exige http): `python3 -m http.server` → http://localhost:8000

## Estado atual / próximos passos

Slice do início pronto (prólogo, cérebro, olho, orelha, puzzle do tique-taque). Próximos: mapa data-driven (Tiled/LDtk), save (localStorage), gerenciador de partes do corpo, passe de arte do prólogo, matriz habilidade × mapa. Ver seção 8+ do GDD.
