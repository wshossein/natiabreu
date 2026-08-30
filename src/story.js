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
    at: { x: 3830 },
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
    at: { x: 3980 },
    needs: ['eye'],
    flag: 'st_cidade_monstro',
    steps: [
      { wait: 400 },
      { spawn: { id: 'mulher', key: 'mulher', x: 4210, y: GROUND_Y - 28 }, ms: 500 },
      { face: { id: 'mulher', dir: -1 }, ms: 1400 },
      { say: { who: 'whoWoman', key: 'womanGasp' }, ms: 2200 },
      { vib: [180], ms: 200 },
      { say: { who: 'whoWoman', key: 'womanMonster' }, ms: 1600 },
      { move: { id: 'mulher', x: 4820, ms: 1800 }, ms: 1500 },
      { exit: { id: 'mulher' }, ms: 600 },
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
    at: { x: 4260 },
    needs: ['eye'],
    flag: 'st_cidade_dog',
    steps: [
      { wait: 900 },
      { spawn: { id: 'dog', key: 'dog', x: 4640, y: GROUND_Y - 12 }, ms: 700 },
      { face: { id: 'dog', dir: -1 }, ms: 900 },
      { move: { id: 'dog', x: 4400, ms: 1500 }, ms: 1700 },
      { think: 'thinkDog1', ms: 3400 },
      { move: { id: 'dog', x: 4320, ms: 900 }, ms: 1100 },
      { vib: [20, 60, 20], ms: 400 },
      { think: 'thinkDog2', ms: 3600 },
      { follow: { id: 'dog' } }
    ]
  }
];
