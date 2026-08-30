# Assets a produzir

Lista do que falta desenhar para o vertical slice (GDD seção 8), em ordem de prioridade, com prompts prontos para colar num gerador de imagem.

> **Estado atual:** toda a arte do jogo é **procedural** — desenhada por código em `makeTextures()` (`src/scenes.js`), em nanquim de traço claro sobre chapados escuros. O jogo roda sem nenhum arquivo de imagem. Os assets abaixo **substituem** essa arte quando a silhueta estiver validada; até lá o procedural é o protótipo jogável, não um placeholder descartável.

---

## Antes de gerar: leia isto

**1. Gerador não acerta tamanho nem transparência.** Peça a arte grande, sobre fundo chapado, e recorte depois. Não peça "512×512 com fundo transparente" — o resultado vem com fundo, em tamanho aleatório.

**2. Gere na direção natural do Moebius (nanquim ESCURO sobre papel CLARO).** É como a referência já é, e é onde o gerador acerta mais. O jogo usa a inversão (traço claro sobre escuro), então entra um passo de conversão no pipeline. Esse passo ainda não existe no repositório — **me avise quando tiver os arquivos e eu escrevo o conversor**; é pequeno, mas precisa existir antes de qualquer asset entrar no jogo.

**3. Consistência entre imagens é o problema difícil.** Gere **uma folha por personagem** (várias vistas na mesma imagem) em vez de uma imagem por vista. O gerador mantém coerência dentro de uma imagem, não entre chamadas separadas.

**4. Sempre anexe a referência.** `docs/arte/referencias/robo-schema-frente-lado.png` junto do prompt vale mais que qualquer descrição.

---

## Bloco de estilo (colar no início de TODO prompt)

```
Clean ligne claire ink drawing in the style of Moebius (Jean Giraud):
thin uniform-weight black ink contour, flat fills with no gradients,
sparse cross-hatching used only for volume, technical-blueprint precision,
generous negative space. Aged cream paper background. Monochrome grey
palette — the ONLY colour anywhere is a single amber accent (#d9a441).
No text, no labels, no watermark, no signature. Full figure, nothing cropped.
```

---

## A1 — Folha de peças do robô (prioridade máxima)

**Por quê:** o robô é montado por peças separadas (cabeça, torso, braço, perna) num container animado. Sem as peças soltas, nenhum asset entra no jogo.

**Peças, com o tamanho lógico atual:** cabeça 24×24, torso 24×22, braço 8×18, perna 9×17. Proporção importa mais que o número — o pipeline reescala.

```
[BLOCO DE ESTILO]

An exploded technical parts sheet of a small chunky tin robot, laid out flat
on the page with clear space between every piece: (1) dome head, front view;
(2) same dome head, 3/4 view; (3) torso with closed chest plate and belt;
(4) a single arm — upper arm, elbow joint, forearm ending in a BLOCKED
rounded stump, NO hand and NO fingers; (5) a single leg — thigh, knee joint,
shin, and a solid BLOCKED boot foot with no toes.

The head has two large round eye sockets with amber lenses, and a solid
horizontal jaw seam — the jaw does NOT open, there is no mouth.
Rivets along the seams. Straight limbs, no organic curves.
Each piece drawn separately and clearly detached from the others.
```

## A2 — Folha do Gepeto

**Por quê:** único NPC do slice. Aparece no prólogo às cegas — e é a cena que o jogador revê no fim.

```
[BLOCO DE ESTILO]

Character sheet of an elderly inventor: front view and side view, full body,
standing. Long work coat, heavy boots, round spectacles, full beard,
tired posture, hands of a craftsman. Early-20th-century workshop clothing.
Two views side by side on the same sheet, same scale, same lighting.
```

## A3 — Higher Lab: camadas de fundo (parallax)

**Por quê:** o laboratório é o cenário inteiro do slice. Hoje são retângulos e engrenagens desenhadas por código.

Três imagens, cada uma em faixa larga (proporção ~4:1), pensadas para repetir na horizontal:

```
[BLOCO DE ESTILO]

A wide horizontal panorama of the interior of an abandoned inventor's
laboratory, drawn as a single continuous band meant to tile seamlessly
left-to-right. LAYER [1 de 3]: distant background — giant slow gears,
tall arched windows, hanging cables, vast empty space, very light linework,
almost silhouette.
```

Repita trocando a `LAYER`:
- **2 de 3** — meio: bancadas, prateleiras com frascos, tubulação, andaimes. Traço médio.
- **3 de 3** — primeiro plano: colunas, canos grossos, caixotes empilhados. Traço mais pesado, quase preto.

## A4 — Props avulsos

Uma folha só, todos os objetos separados:

```
[BLOCO DE ESTILO]

A sheet of separate isolated props from an old laboratory, arranged with
clear space between each: a tall narrow riveted metal door; a vertical
industrial pipe with flanges at top, middle and bottom; a wooden crate with
diagonal cross bracing; a large toothed gear; a workbench with scattered
tools. Each object drawn complete and fully detached from the others.
```

## A5 — Itens de aquisição (olho e orelha)

**Por quê:** são o momento-chave do jogo. Merecem arte própria, não um círculo.

```
[BLOCO DE ESTILO]

Two isolated objects on the page, well separated: (1) a glass artificial eye
with an amber iris, resting in a small open metal case lined with cloth;
(2) a brass mechanical ear — a spiral horn like an antique hearing trumpet.
Both drawn as precious specimens on a collector's plate. The amber accent
appears ONLY in the eye's iris.
```

---

## Depois de gerar

1. Salve os originais em `docs/arte/gerados/` (não é o que o jogo carrega — é o material bruto).
2. Me avise. Eu escrevo o conversor (recorte, inversão para a paleta do jogo, atlas) e troco o `makeTextures()` por carregamento de atlas.
3. A troca é reversível: o procedural continua no histórico e serve de fallback se um asset não fechar.

## O que NÃO gerar ainda

- Partes do corpo dos Atos 2 e 3 (mãos, coração, pele): a ordem de aquisição só fecha no level design (GDD seção 9).
- Qualquer sprite com **mão, boca aberta ou peito aberto** na era lata — viola a regra de arte da seção 6 do GDD.
- Tela de título e UI: hoje são tipografia pura e funcionam. Arte ali é custo sem retorno enquanto o slice não estiver validado.
