# GDD — "Robô de Lata" (título provisório)

Metroidvania 2D mobile sobre um robô de lata que se torna humano, parte por parte. Cada parte do corpo é simultaneamente: habilidade de gameplay, chave de progressão no mapa e passo narrativo de humanização.

---

## 1. Pilares de design

1. **O corpo é o mapa de progressão.** Nada de "power-ups" genéricos: toda habilidade vem de uma parte do corpo e faz sentido biológico (pulmões → nadar, mãos → lockpick).
2. **Os sentidos do JOGADOR evoluem junto com o robô.** Olho = tela, orelha = som, tato = vibração. A interface do jogo É o corpo do personagem. Este é o diferencial único do jogo — proteger a todo custo.
3. **Humanização visível.** Animação rígida de lata → animação fluida e orgânica. O jogador sente a evolução sem ler uma linha de texto.
4. **Mundo interconectado que conta a história pelo cenário** (ref. Hollow Knight): ir e voltar pelas mesmas áreas com novos sentidos revela camadas novas — literalmente, porque agora você vê/ouve/cheira o que antes não existia para você.

## 2. Narrativa (consolidado do PDF)

**Síntese:** Pinóquio + Frankenstein + Homem de Lata (Oz) + Asimov + **Dororo (Hyakkimaru)**, em uma metrópole vertical inspirada em **Metropolis (Fritz Lang, 1927)**.

### Inspirações principais

| Referência | O que empresta |
|---|---|
| **Dororo / Hyakkimaru** | A espinha dorsal mecânica-emocional: protagonista sem partes do corpo que as recupera uma a uma — e cada sentido recuperado traz dor junto (ao ganhar audição, a primeira coisa que Hyakkimaru ouve é o sofrimento do mundo). Valida a coluna "Custo" da tabela de partes. |
| **Metropolis (1927)** | A cidade em camadas verticais como estrutura de classes: elite no alto (Alta Metrópolis/Jardim ≈ Clube dos Filhos), operários embaixo (Undergrounds), catedral, mediador entre cabeça e mãos = coração. A greve da timeline vem direto daqui. Estética P&B expressionista casa com o olho nível 1. |
| **Pinóquio** | Criador e criatura, virar "menino de verdade", ganhar nome |
| **Frankenstein** | A criatura chamada de "monstro", rejeição social, criador destruído pela criação |
| **Homem de Lata (Oz)** | "Agora sei que tenho um coração, pois ele está quebrado" |
| **Asimov (3 Leis)** | Limite moral programado — e o custo de quebrá-lo |
| **Machinarium** | Direção de arte do robô |
| **Hollow Knight** | Estrutura de mapa e level design |

**Arco:** Gepeto cria o Robô → acidente/morte de Gepeto e fuga → perseguição (Detetive, Sheriff, Prefeito que quer o robô para ter vida eterna) → Undergrounds e pacto com Rei do Crime → aliados (Bom Ladrão, Líder Sindical, Padre, Parceir@, Dog) → morte do Dog e do Sheriff, depressão ("agora sei que tenho um coração, pois ele está quebrado") → greve, queda do Prefeito → Robô livre, ganha nome e RG → epílogo: filho, e morte (JFK) — o preço final de ser humano é ser mortal.

**Tema central:** "Amor não é sobre quanto você ama, mas quanto é amado." Humanidade = vulnerabilidade. Cada parte ganha um poder E uma fraqueza (coração = sentimentos, pele = dor, pulmões = fôlego finito).

**Regra de ouro narrativa:** toda parte nova deve trazer um custo junto com o benefício. É isso que diferencia de um metroidvania comum.

**A inversão central:** o robô de lata é *invulnerável porém limitado* (não respira, não sente dor, não morre — pode andar no fundo do mar, atravessar fogo, ser remontado). O humano é *capaz porém frágil*. O jogo não é sobre ficar mais forte; é sobre trocar invulnerabilidade por capacidade. Progressão de metroidvania com curva emocional invertida.

### 2.1 Elenco

| Personagem | Papel | Referência | Ligação com partes/tema |
|---|---|---|---|
| **Robô** | Protagonista | Pinóquio, Criatura de Frankenstein, Homem de Lata, **Hyakkimaru** | O corpo inteiro |
| **Gepeto** | Criador; perdeu o filho, perdeu a alegria | Gepeto/Victor Frankenstein | Origem; sua morte dispara a jornada — e, no twist candidato (2.2), ele É o protagonista |
| **Dog** | Companheiro fiel, encontra o Robô | Totó (Oz), Dororo | Primeiro vínculo afetivo; sua morte prepara o Coração |
| **Detetive** | Persegue o jogo todo, depois compreende e vira aliado; Sheriff no fim | — | Investiga Gepeto e o filho; no twist, é quem revela ao Robô quem ele é |
| **Sheriff** | Antagonista de campo; mata o Dog; é morto pelo Robô | — | A primeira "mancha" humana do Robô: raiva e culpa |
| **Prefeito** | Vilão real: quer o corpo do Robô para ter vida eterna | — | Inveja da imortalidade — deseja exatamente o que o Robô quer abandonar |
| **Rei do Crime** | Poder dos Undergrounds; pacto e traição | — | Zona cinzenta moral; morto pelo Robô |
| **Bom Ladrão** | Mentor; ensina, é raptado, vira Líder | Bom Ladrão (bíblico) | Orelhas/Braços; ensina o Robô a parar de fugir |
| **Líder Sindical** | Alia o Robô à cidade; vira prefeito | — | Pernas/Torso; a luta coletiva ("Road of Trials") |
| **Padre** | Confissão, recuperação da confiança, sino da Catedral | — | Perdão; ponte para o Coração |
| **Parceir@** | Interesse romântico, Jardim dos Filhos | — | Coração, Pele, Órgão reprodutor; "quanto é amado" |

### 2.2 Plot twist: o Robô É Gepeto ✔ DECIDIDO

No escuro do prólogo, o Robô mata Gepeto acidentalmente — e o cérebro que adquire é **o cérebro de Gepeto**. Sem memória de quem foi. A jornada de humanização é, na verdade, a redenção de Gepeto: um homem que tinha perdido o sentido de viver reaprendendo a amar a vida — de dentro do corpo que construiu.

Por que funciona:

- Já é consistente com a timeline existente: o Cérebro é adquirido exatamente no evento "O Robô mata Gepeto e foge".
- Resolve a motivação de Gepeto ("perde a alegria de viver e fica vagando") — ambiguidade rica: foi acidente mesmo, ou a "saída" que ele buscava?
- Recontextualiza o tema: não é uma máquina aprendendo a ser humana; é um humano que desistiu reaprendendo. "Virar humano" = "voltar a querer viver".
- **Revelação pelo Detetive**, que persegue o Robô o jogo todo e vira aliado: a investigação dele (história de Gepeto e do filho) é o mecanismo natural da revelação — ele é o único que junta as peças. O perseguidor vira o espelho que conta ao Robô quem ele é.
- Eco de Frankenstein invertido: criador e criatura no mesmo corpo.

**Mecanismo de revelação decidido:** ao recomeçar o jogo com todos os sentidos ativos, o jogador revê o prólogo — agora com imagem e som completos — e presencia o que a tela preta escondia: o Robô matou Gepeto. Ele era o monstro e o criador ao mesmo tempo.

**Restrição de produção derivada (importante):** o prólogo deve ser construído desde o dia 1 como uma cena completa (arte, som, animação da morte de Gepeto) que na primeira jogada é apenas *mascarada* (tela preta, áudio mudo, vibração ativa). A versão às cegas e a versão reveladora são a MESMA cena com camadas ligadas/desligadas — nunca duas cenas separadas, senão dessincronizam.

Cuidados:

- Plantar pistas relidas na segunda jogada (o Robô "sabe" coisas que não deveria: consertar máquinas, caminhos da cidade, NPCs antigos que hesitam ao vê-lo).
- Decidir o papel do filho morto de Gepeto — o Robô pode ter sido construído à imagem do filho (reforça Pinóquio: o boneco como filho substituto).
- O prólogo às cegas ganha releitura sombria: o jogador *estava lá* e não viu o que aconteceu — a tela preta esconde o twist à vista de todos desde o minuto zero.

### 2.2b Desenho da revelação ✔ DECIDIDO

1. **Replay automático pós-créditos:** após os créditos da 1ª jogada, o jogo reprisa o prólogo com todos os sentidos ativos — a mesma cena, desmascarada. Todo jogador que termina vê o twist, sem fala expositiva. O Detetive apenas *insinua* antes do fim (junta as peças, hesita, não diz).
2. **O jogador é cúmplice:** o golpe fatal é um comando natural do tutorial às cegas (um empurrão/movimento que o jogador fez sem ver). No replay, ele descobre que as próprias mãos fizeram. Coreografia deve ser justa: ação comum, sem pegadinha.
3. **A 1ª Lei sobre a tela preta:** no momento fatal do prólogo, o texto da 1ª Lei de Asimov aparece sobre o preto — na 1ª jogada parece ambientação; no replay, o jogador entende que o jogo avisou desde o minuto zero. A citação na morte do Sheriff vira eco da primeira.

### 2.2c Memória ✔ DECIDIDO — poucos fragmentos, e eles apontam para o futuro

Versão mínima adotada: **poucos flashbacks** (3–5 no jogo inteiro), fragmentos sensoriais anônimos concentrados nas partes finais. E com função dupla: além de pista retroativa, os fragmentos (riso de criança, uma mão pequena segurando um dedo) plantam no Robô uma saudade sem origem — que amadurece no desejo de ter um filho com Parceir@ no final. O eco do filho perdido de Gepeto vira pulsão de futuro: a redenção não é só voltar a querer viver, é querer gerar vida. No epílogo, **o Robô escolhe seu sexo** (órgão reprodutor = escolha do jogador, já na tabela de partes) — a identidade final é escolhida, não dada.

Detalhamento da técnica dos fragmentos:

Preferência declarada: **amnésia de identidade total até o fim** — nenhum flashback pode entregar o twist. Proposta que preserva isso e ainda dá recompensa narrativa por parte: **fragmentos sensoriais anônimos**.

- Cada parte orgânica recuperada devolve UM fragmento de 5–10s, **travado no canal daquele sentido**: orelha = só áudio (uma canção de ninar assobiada, riso de criança, ritmo de martelo); olho = uma imagem estática desfocada (serragem caindo, uma mão pequena segurando um dedo grande); nariz = um cheiro + uma emoção (serragem → saudade). Nunca cena completa, nunca rosto, nunca nome, nunca legenda.
- **Sempre em 1ª pessoa** — o que é a própria proteção: sem rosto, o jogador não tem como saber de QUEM é a memória.
- **Decoy embutido:** os fragmentos giram em torno do filho (mãos pequenas, riso, brinquedos). A teoria natural do jogador vira "o robô tem a mente do FILHO morto de Gepeto" — uma pista falsa que torna a verdade invisível. Quando o twist cai, o jogador reinterpreta: eram memórias de um PAI olhando o filho, não do filho.
- Regra dura: **a memória do prólogo nunca retorna** (trauma). Ela só existe no replay pós-créditos.
- Cobertura no mundo: NPCs tratam os fragmentos como "defeito" do robô ("essas máquinas velhas guardam ecos") — ninguém, nem o jogador, tem motivo para levá-los a sério como memória real.

Se mesmo assim parecer arriscado: versão mínima = fragmentos só nos 3 últimos órgãos (coração, pele, cérebro nível 2), perto da revelação.

### 2.3 Estrutura em 3 atos

- **Ato 1 — Lata (fuga):** criação, morte de Gepeto, fuga, perseguição. Partes básicas: olho, orelha, boca, cérebro. Áreas: Higher Lab → Ground → Undergrounds.
- **Ato 2 — Carne (aprendizado):** mentores e aliados, mar, Eden, amor. Partes de capacidade: braços, mãos, pernas, pulmões, estômago. Custo crescente: fome, fôlego, cansaço.
- **Ato 3 — Humano (escolha):** coração, pele, perda (Dog, Sheriff), depressão, greve, libertação. O jogo fica mais difícil porque agora tudo dói. Termina com nome, RG — e mortalidade.

## 3. Mundo (camadas verticais, do PDF)

De cima para baixo — estrutura vertical tipo poço, boa para mobile (scroll vertical natural). A verticalidade é temática, não só espacial (ref. Metropolis 1927): altura = classe social, e a jornada do Robô cruza todas as camadas que a cidade mantém separadas:

| Camada | Função |
|---|---|
| Higher Lab | Origem — laboratório de Gepeto, tutorial |
| Alta Metrópolis | Elite, aceitação social, Jardim dos Filhos |
| Cathedral | Padre, confissão, sino |
| Prefeitura | Poder, Prefeito, clímax político |
| Ground | Cidade comum, comércio, hub central |
| Eden | Área verde/oásis |
| Undergrounds | Rei do Crime, civilização antiga |
| Sea | Fundo do mar (exige pulmões) |

Ref. estrutural: mapa do Hollow Knight — hub central (Ground ≈ Dirtmouth/Crossroads) com áreas radiais, atalhos destraváveis, chefe final visível/acessível desde o início (Prefeitura?).

## 4. Sistema de partes do corpo (consolidado)

### Progressão em tiers (cada parte tem 2–3 níveis, como no PDF)

| Parte | Nível 1 | Nível 2 | Nível 3 | **Custo (o que dói agora)** |
|---|---|---|---|---|
| **Olho** | ½ tela, P&B, sem background | Tela toda, colorido | Background visível → revela entradas secretas | Vê o medo nos rostos dos NPCs; luz forte ofusca; escuro passa a ser assustador |
| **Orelha** | Ouvir falas (diálogo) | Som ambiente + música | Som estéreo/direcional (sound source como guia) | Ouve os insultos ("monstro"); sons muito altos atordoam |
| **Boca** | Falar | Comer rápido | Conversar/negociar | Pode ser interrogado; o que diz tem consequência |
| **Cérebro** | Conversar sem alternativas | 2 respostas (escolha em diálogo) | — | Dúvida: escolhas erradas existem agora |
| **Nariz** | Cheiro (fumaça mostra caminhos/perigos) | + Fôlego (com pulmões) | — | Gases tóxicos passam a intoxicar |
| **Pulmões** | Boiar/nadar, fôlego pouco | Muito fôlego, mergulho | — | **Perde** o andar infinito no fundo do mar da era lata; pode se afogar |
| **Braços** | Puxar objetos, melee | Bater forte | Subir escada, corda, pendurar | Bater forte machuca as próprias mãos (com pele) |
| **Mãos** | Bater, empurrar | Leitor digital, senhas, lockpick | Carinho, libras com NPCs | Deixa impressões digitais — pode ser rastreado |
| **Pernas** | Caminhar, pulo baixo | Agachar, correr | Parkour | Cansaço/estamina em corridas longas |
| **Pés** | — | Wall jump | — | — |
| **Torso** | Defesa++ | — | — | — |
| **Estômago** | Comer = recuperar PV | Mais PV máximo | — | **Fome**: precisa comer; fase da fome (paladar) |
| **Pele** | Aparência pálida, pontos de vida, choro e dor | Aparência humana, tato/vibração | — | **Dor**: dano real, fogo/frio/espinhos passam a ferir; fim da invulnerabilidade |
| **Coração** | Sentimentos, mais PV | — | — | Pode ser **quebrado** (luto mecânico após perdas); medo afeta controle |
| **Órgão reprodutor** | Escolha do jogador (identidade) | — | — | — |

**Princípio de level design derivado:** áreas visitadas na era lata (fundo do mar sem pulmões, corredores de fogo, câmaras de gás) tornam-se **perigosas ou intransitáveis** depois da humanização — o backtracking clássico de metroidvania ganha uma segunda direção: lugares que *fecham* conforme você evolui, forçando rotas novas e dando valor à escolha de quando pegar cada parte.

### Mapeamento dos 5 sentidos → hardware do celular

| Sentido | Mecânica no dispositivo |
|---|---|
| Visão | Máscara de tela, cor, camadas de render |
| Audição | WebAudio, pan estéreo, mixagem por camadas |
| Tato | API de vibração (Android; iOS limitado — verificar) |
| Olfato | Visual: partículas de fumaça/odor |
| Paladar | Sistema de comida preferida (recupera mais PV) |
| 6º sentido | "Spider sense" — aviso de perigo (late game) |

## 5. Prólogo às cegas ✔ DECIDIDO

O jogo abre com tela preta e sem som — 2–3 minutos, corredor linear, impossível errar. Rascunho beat a beat (Higher Lab, mesa de Gepeto):

1. **0:00** — Preto total. Apenas vibração ritmada: batidas de martelo de Gepeto trabalhando (tato antes de tudo — o primeiro sentido que existe é o do jogador segurando o celular).
2. **0:20** — Texto mínimo na tela (a "consciência" do robô, sem sentidos, só pensamento): *"...escuro. ...o que é escuro?"* Instrução única: "deslize para se mover".
3. **0:40** — O jogador anda no vazio. Vibrações curtas quando encosta em paredes (colisão = tato). O corredor é reto; impossível se perder.
4. **1:30** — Vibração forte dupla: Gepeto encaixa algo. **Meio segundo de silêncio... e a metade esquerda da tela acende em P&B.** Primeiro plano do jogo: o rosto de Gepeto, sorrindo, visto por metade de um olho. Título do jogo aparece aqui.
5. **2:30** — Alguns passos jogáveis em ½ tela; Gepeto gesticula (sem som — ainda não há orelhas). A boca dele se mexe e nada sai. O jogador entende o sistema inteiro sem um tutorial.

Regra do prólogo: nenhum desafio, só descoberta. O "momento uau" da meia-tela é o trailer do jogo.

## 5.1 Combate leve e NÃO-LETAL ✔ DECIDIDO

Foco em exploração, plataforma e puzzles (Machinarium/Inside). Regra absoluta: **em gameplay, o Robô nunca mata.** Ferramentas do jogador: fugir, esconder, pular sobre inimigos, empurrar, atirar objetos, incapacitar (atordoar, prender, desligar máquinas). Inimigos incapacitados voltam — o mundo não se "limpa".

**As 3 Leis de Asimov como âncora:** a 1ª Lei é citada em tela nos momentos em que o Robô a quebra na narrativa. As únicas mortes causadas pelo Robô no jogo inteiro são as 3 da história (Gepeto — acidental e invisível no prólogo; Sheriff — raiva após a morte do Dog; Rei do Crime), todas set pieces roteirizadas. **É justamente porque o jogador passa o jogo inteiro sem poder matar que essas cenas chocam** — a mecânica não-letal não é limitação, é a preparação do impacto narrativo. O jogo as trata como trauma, não conquista.

## 5.2 Morte e humanização ✔ DECIDIDO

- **Era lata:** não existe game over. Cair, queimar, afundar = robô desmontado e remontado no último banco de trabalho (checkpoint). Custo: tempo e, talvez, sucata (moeda).
- **Com a Pele:** surge barra de PV e dano real. Espinhos, fogo e quedas passam a ferir. O choro entra como feedback.
- **Com o Coração:** a morte definitiva passa a existir — e o robô *descobre isso na narrativa exatamente quando o jogador o sente na mecânica*. Luto mecânico: após perdas da história (Dog), atributos temporariamente reduzidos, tela dessaturada.
- Dificuldade crescente vem da fragilidade, não de inimigos mais fortes.

## 6. Arte e animação

- Ref. visual: robô do Machinarium — cartoon, fofo, rebites, membros retos.
- **Rigidez como linguagem:** início = animação "stop motion" com poucos frames, movimentos duros de lata; a cada parte orgânica, frames extras e curvas suaves (easing). A física também evolui: pulo duro → pulo com antecipação e squash & stretch.
- Paleta acompanha o olho: P&B → cor → backgrounds ricos. Isso ECONOMIZA arte no início do desenvolvimento (bônus de produção).
- Pipeline sugerido: sprites desenhados (Aseprite ou Krita) + animação esquelética leve (Spine/DragonBones export para Phaser) para a fase "suave".

## 7. Tecnologia (decidido na conversa anterior)

- **Engine:** Phaser 3 (TypeScript) — roda no navegador do celular desde o dia 1.
- **Mapas:** Tiled ou LDtk (editor gratuito, ótimo para metroidvania; Phaser importa nativo).
- **Empacotamento futuro:** Capacitor → Android/iOS nas lojas.
- **Controles touch:** joystick virtual esquerdo + 2 botões direita (pulo/ação); mapear tudo também para teclado (testes no PC).
- **Save:** localStorage no protótipo → save nativo via Capacitor depois. O save guarda flag de "jogo terminado" para habilitar o replay revelador do prólogo.
- **Idiomas (i18n) ✔ DECIDIDO:** PT-BR principal + EN desde o dia 1, troca no menu de pausa. Arquitetura: nenhum texto hardcoded — todo texto vem de dicionários JSON por idioma (`pt-BR.json`, `en.json`), chaveados por ID (`dialog.gepeto.01`). Adicionar um idioma novo = adicionar um arquivo. Fonte com suporte a acentos/diacríticos desde o início.

## 8. Escopo proposto — Fase 1 (vertical slice)

Objetivo: provar o conceito único (sentidos do jogador) em ~10 min de jogo.

1. Higher Lab + um pedaço do Ground (5–8 salas interconectadas, 1 atalho destravável).
2. Robô lata: caminhar, pulo baixo, empurrar.
3. **2 aquisições:** Olho nível 1 (½ tela P&B → efeito assinatura do jogo) e Orelha nível 1 (som liga).
4. 1 puzzle que exige a orelha (ex.: bomba-relógio que só se localiza pelo tique-taque).
5. 1 NPC (Gepeto), sem combate ainda.
6. Rodando no navegador do seu celular.

Se o slice divertir, o resto é produção. Se não divertir, descobrimos barato.

## 9. Ordem de aquisição das partes ✔ DECIDIDO (princípio, não lista)

A ordem do PDF é referência, não contrato. Princípio norteador: **a história puxa, o jogador entende o que quer naquele momento, sem travar em dificuldade.** Cada parte deve ser desejada antes de ser obtida (o jogador esbarra no obstáculo/situação que a pede, a história apresenta o doador/evento, o jogador vai buscá-la). A matriz exata habilidade × área será definida sala a sala durante o level design, validada em playtest — começando pelo vertical slice (Olho N1 → Orelha N1, fixo).

## 10. Decisões em aberto

1. Título do jogo — decisão deliberadamente adiada para o fim.
2. Validar a proposta de memória por fragmentos sensoriais anônimos (seção 2.2c) — ou adotar amnésia total pura.
3. Papel do filho morto de Gepeto no twist (o Robô foi construído à imagem dele? alimenta o decoy da seção 2.2c).
4. Passe de consistência na timeline: com Gepeto morto no prólogo, revisar cada cartão que o cita ("Detetive investiga Gepeto" vira investigação póstuma; o que a cidade achou no laboratório — corpo sem cérebro → manchete do "monstro"). Trabalho de escrita, não de decisão.

## Decisões já tomadas

| Decisão | Escolha |
|---|---|
| Tecnologia | Phaser 3 + Capacitor (mobile via navegador primeiro) |
| Início do jogo | Prólogo às cegas de 2–3 min (seção 5) |
| Combate | Leve e não-letal; mortes só nas 3 set pieces da história (seção 5.1) |
| Morte | Chega junto com a humanização (seção 5.2) |
| Asimov | 1ª Lei citada em tela nos momentos de quebra narrativa |
| Twist | Robô é Gepeto; revelação visual no replay do prólogo com sentidos (seção 2.2) |
| Ordem das partes | Guiada pela história, definida no level design (seção 9) |
| Idiomas | PT-BR principal + EN, i18n por JSON, multilíngue desde a arquitetura (seção 7) |
| Revelação do twist | Replay automático do prólogo pós-créditos (seção 2.2b) |
| Cumplicidade | O golpe fatal é comando do próprio jogador no tutorial às cegas (seção 2.2b) |

---
*v0.4 — decisões fechadas: ordem flexível, i18n, combate não-letal + Asimov, twist com replay pós-créditos e cumplicidade do jogador; proposta de memória em validação — 29/08/2026*
