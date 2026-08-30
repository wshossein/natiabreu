'use strict';
/* Beats narrativos, data-driven — o mesmo princípio de world.js: o dado
   descreve, a cena interpreta. Cena nova de história = entrada aqui, sem
   tocar em scenes.js.

   O jogo é mais história que desafio (decisão do autor). Então o que
   precisa ser barato de escrever é BEAT, não plataforma.

   GATILHO
     at:    { x } dispara ao passar dessa posição do mundo
     needs: partes exigidas para o beat existir
     flag:  só dispara se a flag do save NÃO estiver marcada (once real,
            atravessa sessão)

   PASSOS (executados em sequência; cada um pode declarar `ms` de espera)
     think  chave i18n — voz interna do robô (só existe com cérebro)
     say    { who, key } — fala de NPC, com nome de quem fala
     spawn  { key, x, y, id } — entra em cena
     move   { id, x, ms } — vai até lá
     face   { id, dir } — vira para -1 / 1
     exit   { id } — some de cena
     vib    padrão de vibração (tato é canal de gameplay, não enfeite)
     follow { id } — passa a seguir o robô
     wait   só espera */
const STORY = [

  /* ---- SEM TETO ----
     Primeiro beat do exterior. Curto de propósito: o zoom recuando já diz
     quase tudo, o texto só nomeia o que ele sentiu. */
  {
    id: 'cidade-teto',
    at: { x: 3830, xMax: 6200 },
    needs: ['eye'],
    flag: 'st_cidade_teto',
    steps: [
      { wait: 700 },
      { think: 'cityThought', ms: 4200 }
    ]
  },

  /* ---- A CIDADE VÊ O ROBÔ ----
     Beat de Frankenstein: a criatura é chamada de monstro antes de fazer
     qualquer coisa. Ele não ataca, não se defende, não entende. O jogador
     recebe a rejeição sem ter cometido nada — que é exatamente o contrário
     do prólogo, onde cometeu sem saber. */
  {
    id: 'cidade-monstro',
    at: { x: 3980, xMax: 6200 },
    needs: ['eye'],
    flag: 'st_cidade_monstro',
    steps: [
      { wait: 400 },
      { spawn: { id: 'mulher', key: 'mulher', x: 4210, y: GROUND_Y - 28 }, ms: 500 },
      { face: { id: 'mulher', dir: -1 }, ms: 1400 },
      { say: { who: 'whoWoman', key: 'womanGasp' }, ms: 2200 },
      { vib: [180], ms: 200 },
      { say: { who: 'whoWoman', key: 'womanMonster' }, ms: 900 },
      { panic: true, ms: 900 },                       // a rua inteira esvazia
      { move: { id: 'mulher', x: 4980, ms: 2000 }, ms: 1600 },
      { exit: { id: 'mulher' }, ms: 900 },
      { think: 'thinkMonster1', ms: 3800 },
      { think: 'thinkMonster2', ms: 4200 }
    ]
  },

  /* ---- O DOG ----
     "Primeiro vínculo afetivo; sua morte prepara o Coração" (GDD 2.1).
     Precisa nascer da comparação: todo mundo correu, este não. Nenhuma
     linha de diálogo explica o vínculo — ele acontece por contraste com o
     beat anterior, que é por isso que os dois são vizinhos. */
  {
    id: 'cidade-dog',
    at: { x: 4260, xMax: 6200 },
    needs: ['eye'],
    flag: 'st_cidade_dog',
    steps: [
      { wait: 900 },
      { spawn: { id: 'dog', key: 'dog', x: 4640, y: GROUND_Y - 20, phys: true }, ms: 700 },
      { face: { id: 'dog', dir: -1 }, ms: 900 },
      { move: { id: 'dog', x: 4400, ms: 1500 }, ms: 1700 },
      { think: 'thinkDog1', ms: 3400 },
      { move: { id: 'dog', x: 4320, ms: 900 }, ms: 1100 },
      { vib: [20, 60, 20], ms: 400 },
      { think: 'thinkDog2', ms: 3600 },
      { follow: { id: 'dog' } }
    ]
  },

  /* ---- A BIFURCAÇÃO ----
     Não aponta caminho, só nomeia que existem dois. O jogador escolhe, e a
     escolha não é trancada: pegar um não fecha o outro (GDD seção 9 — a
     ordem é princípio, não contrato). */
  {
    id: 'cidade-escolha',
    at: { x: 4400, xMax: 6200 },
    needs: ['eye'],
    flag: 'st_cidade_escolha',
    steps: [
      { wait: 600 },
      { think: 'thinkFork', ms: 4400 }
    ]
  },

  /* ---- QUEM ESCOLHEU A VOZ ----
     Beat da Boca. O custo do GDD tem de ser sentido, não anunciado: ele
     ganha voz e a voz não é dele. */
  {
    id: 'escolha-boca',
    needs: ['mouth'],
    flag: 'st_escolha_boca',
    steps: [
      { wait: 1400 },
      { think: 'thinkMouth1', ms: 3800 },
      { say: { who: 'whoRobot', key: 'robotFirstWord' }, ms: 2600 },
      { think: 'thinkMouth2', ms: 4400 }
    ]
  },

  /* ---- QUEM ESCOLHEU AS PERNAS ---- */
  {
    id: 'escolha-pernas',
    needs: ['legs'],
    flag: 'st_escolha_pernas',
    steps: [
      { wait: 1400 },
      { think: 'thinkLegs1', ms: 3600 },
      { vib: [40, 50, 40], ms: 400 },
      { think: 'thinkLegs2', ms: 4000 }
    ]
  },

  /* ---- O DETETIVE ----
     GDD 2.1: persegue o jogo todo, depois compreende e vira aliado; e é
     ele quem revela o twist no fim. Portanto AQUI ele só planta. Cada
     linha tem de funcionar duas vezes: banal na 1ª jogada, carregada na
     releitura. Ele diz "o velho" e "não havia corpo" — o jogador ainda
     não tem como ligar isso ao que ele mesmo fez no escuro. */
  {
    id: 'ato1-detetive',
    at: { x: 5000, xMax: 6200 },
    needs: ['eye'],
    flag: 'st_ato1_detetive',
    steps: [
      { wait: 500 },
      { spawn: { id: 'det', key: 'detetive', x: 5620, y: GROUND_Y - 31 }, ms: 900 },
      { face: { id: 'det', dir: -1 }, ms: 1600 },
      { say: { who: 'whoDet', key: 'detSee' }, ms: 2800 },
      { say: { who: 'whoDet', key: 'detBody' }, ms: 3000 },
      { think: 'thinkDet', ms: 3800 }
    ]
  },

  /* ---- O SHERIFF ----
     Antagonista de campo. Combate NÃO-LETAL (GDD 5.1): o robô não revida,
     não pode revidar, e a saída é para baixo. O Sheriff empurra a história
     na direção dos Undergrounds sem que ninguém precise dizer "vá por ali". */
  {
    id: 'ato1-sheriff',
    at: { x: 5180, xMax: 6200 },
    needs: ['eye'],
    flag: 'st_ato1_sheriff',
    steps: [
      /* O bloqueio é o PRIMEIRO passo, não o último: se a rua só fecha ao
         fim da cena, o jogador corre e ultrapassa o Sheriff enquanto ele
         ainda está falando — e a cena vira mentira. Fecha primeiro, encena
         depois. */
      { block: { x: 5430, w: 26 } },
      { spawn: { id: 'she', key: 'sheriff', x: 5560, y: GROUND_Y - 30 }, ms: 800 },
      { face: { id: 'she', dir: -1 }, ms: 600 },
      { say: { who: 'whoSheriff', key: 'sheStop' }, ms: 2200 },
      { vib: [200, 80, 200], ms: 300 },
      { move: { id: 'she', x: 5470, ms: 1300 }, ms: 1000 },
      { say: { who: 'whoDet', key: 'detWait' }, ms: 2600 },
      { say: { who: 'whoSheriff', key: 'sheAnswer' }, ms: 2600 },
      { think: 'thinkFlee', ms: 3800 }
    ]
  },

  /* ---- AS DUAS ----
     Só dispara para quem voltou e pegou a outra. Recompensa a exploração
     sem exigi-la. */
  {
    id: 'escolha-ambas',
    needs: ['mouth', 'legs'],
    flag: 'st_escolha_ambas',
    steps: [
      { wait: 2000 },
      { think: 'thinkBoth', ms: 4600 }
    ]
  },

  /* ============ ATO 2 — CARNE ============ */

  /* ---- CHEGADA ----
     Depois da avenida aberta, o zoom volta a apertar. Ele não tem nada a
     dizer ainda; o Dog, sim — pulou atrás dele. Nenhuma linha explica isso. */
  {
    id: 'ato2-chegada',
    at: { x: 6380, xMax: 8600 },
    needs: ['eye'],
    flag: 'st_ato2_chegada',
    steps: [
      { wait: 1600 },
      { think: 'thinkUnder1', ms: 4000 },
      { think: 'thinkUnder2', ms: 4200 }
    ]
  },

  /* ---- O BOM LADRÃO ----
     GDD 2.1: mentor; ensina o Robô a PARAR DE FUGIR; ligado a Orelhas/Braços.
     Ele é o terceiro que não corre — depois do Dog e do Detetive — e o
     primeiro que fala com o robô como se ele fosse alguém. */
  {
    id: 'ato2-ladrao',
    at: { x: 6700, xMax: 8600 },
    needs: ['eye'],
    flag: 'st_ato2_ladrao',
    steps: [
      { wait: 500 },
      { spawn: { id: 'lad', key: 'ladrao', x: 7020, y: 1372 }, ms: 900 },
      { face: { id: 'lad', dir: -1 }, ms: 1200 },
      { say: { who: 'whoThief', key: 'thief1' }, ms: 2800 },
      { move: { id: 'lad', x: 6880, ms: 1300 }, ms: 1100 },
      { say: { who: 'whoThief', key: 'thief2' }, ms: 3000 },
      { say: { who: 'whoThief', key: 'thief3' }, ms: 3200 },
      { think: 'thinkThief', ms: 3600 },
      { say: { who: 'whoThief', key: 'thief4' }, ms: 3000 },
      { move: { id: 'lad', x: 7160, ms: 1600 }, ms: 1400 },
      { say: { who: 'whoThief', key: 'thief5' }, ms: 1200 },
      { setFlag: 'bracosOfertados' },     // só agora as bielas existem no chão
      { wait: 1800 },
      { exit: { id: 'lad' }, ms: 500 }
    ]
  },

  /* ---- BRAÇOS ----
     A lição vira corpo: ele para de fugir quando ganha com o que sustentar. */
  {
    id: 'ato2-bracos',
    needs: ['arms'],
    flag: 'st_ato2_bracos',
    steps: [
      { wait: 1300 },
      { think: 'thinkArms1', ms: 3800 },
      { think: 'thinkArms2', ms: 4200 }
    ]
  }
];
