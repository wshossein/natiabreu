'use strict';
/* Mapa data-driven. Antes o cenário eram coordenadas cravadas no create();
   agora é dado, e o create() só interpreta. Sala nova = entrada aqui.

   ZONAS DE CÂMERA — o mapa é contínuo (metroidvania: sem tela de transição).
   O que muda por área é o zoom: interior aproxima (o robô ocupa a tela,
   cada rebite conta), exterior afasta (a cidade é grande e ele é pequeno).
   Isso é linguagem, não conforto: o mesmo robô que enche um laboratório
   some numa avenida. */
const WORLD = {
  w: 5600,
  h: 900,   // o beco desce abaixo da rua
  spawn: { x: 120, y: GROUND_Y - 40 },

  zones: [
    { id: 'lab',     kind: 'interior', x0: -200, x1: 1500, zoom: 1.70, decor: 'lab'  },
    { id: 'duto',    kind: 'interior', x0: 1500, x1: 2620, zoom: 1.45, decor: 'lab'  },
    { id: 'canos',   kind: 'interior', x0: 2620, x1: 3480, zoom: 1.70, decor: 'lab'  },
    { id: 'soleira', kind: 'interior', x0: 3480, x1: 3760, zoom: 1.25, decor: 'lab'  },
    { id: 'cidade',  kind: 'exterior', x0: 3760, x1: 5800, zoom: 0.92, decor: 'city' }
  ],

  /* chão: [centro, largura] — os vãos entre faixas são as quedas */
  ground: [
    [850, 1700], [2010, 380], [2975, 1250],
    [4150, 1200],            // avenida, trecho oeste (3550..4750)
    [5180, 800],             // avenida, trecho leste (4780..5580)
    [4680, 420, 820]         // fundo do beco, lá embaixo — [cx, larg, y]
  ],

  platforms: [
    [1760, 430, 70], [1955, 405, 90], [2275, 420, 80],

    /* ESCADA DE INCÊNDIO (sobe) -> Pernas N1.
       Degraus de 70px: sobem com o pulo de lata, sem precisar das Pernas.
       Quem escolhe este caminho primeiro sobe no limite do que consegue. */
    [3900, 420, 90], [4010, 350, 80], [3910, 280, 80], [4020, 210, 80], [3930, 145, 110],

    /* BECO (desce) -> Boca N1. A descida é de graça; a volta é a escalada. */
    [4830, 560, 90], [4700, 650, 90], [4840, 740, 90]
  ],

  /* paredes e blocos sólidos: [x, y, w, h] */
  walls: [
    [30, 300, 20, 400]
  ],

  checkpoints: [
    { at: 1420, x: 1430, y: GROUND_Y - 40 },
    { at: 2650, x: 2650, y: GROUND_Y - 40 },
    { at: 3800, x: 3820, y: GROUND_Y - 40 },
    { at: 4900, x: 4900, y: GROUND_Y - 40 }
  ],

  /* Gente na rua. A avenida precisa estar viva ANTES do grito — o que
     custa não é uma pessoa fugir, é uma rua inteira esvaziar. */
  crowd: [
    { x: 3900, key: 'homem',   dir:  1, d: 7 },
    { x: 4080, key: 'mulher',  dir: -1, d: 7 },
    { x: 4240, key: 'crianca', dir:  1, d: 8, s: 1 },
    { x: 4310, key: 'mulher',  dir: -1, d: 7, s: .95 },
    { x: 4520, key: 'homem',   dir: -1, d: 6, s: .92 },
    { x: 4760, key: 'homem',   dir:  1, d: 7 },
    { x: 5010, key: 'mulher',  dir: -1, d: 6, s: .9 }
  ],

  /* Partes espalhadas. NENHUMA é obrigatória para a outra: os dois caminhos
     saem da mesma avenida e o jogador escolhe qual descer primeiro (GDD
     seção 9 — a ordem é princípio, não contrato). */
  pickups: [
    { part: 'legs',  key: 'pernas', x: 3930, y: 110, needs: ['eye'] },
    { part: 'mouth', key: 'boca',   x: 4680, y: 786, needs: ['eye'] }
  ],

  /* cenário. t: rect | circle | tri | img
     d = depth. Ordem do array não importa; o depth manda. */
  props: [
    /* -- laboratório de Gepeto -- */
    { t: 'rect', x: 1080, y: GROUND_Y - 26, w: 210, h: 46, c: 0x30303a, d: 6 },   // bancada
    { t: 'rect', x: 1080, y: GROUND_Y - 52, w: 220, h: 8,  c: 0x44444e, d: 6 },
    { t: 'rect', x: 995,  y: GROUND_Y - 15, w: 10,  h: 30, c: 0x22222a, d: 6 },
    { t: 'rect', x: 1165, y: GROUND_Y - 15, w: 10,  h: 30, c: 0x22222a, d: 6 },
    { t: 'rect', x: 1035, y: GROUND_Y - 62, w: 26,  h: 8,  c: 0x55555c, d: 7 },   // ferramentas
    { t: 'circle', x: 1070, y: GROUND_Y - 62, r: 5, c: 0x62626a, d: 7 },
    { t: 'rect', x: 1250, y: GROUND_Y - 80, w: 90,  h: 160, c: 0x1d1d24, d: 8 },  // armário: oclusor do twist
    { t: 'rect', x: 1250, y: GROUND_Y - 80, w: 78,  h: 148, c: 0x23232b, d: 8 },
    { t: 'rect', x: 1010, y: 250, w: 4, h: 70, c: 0x2a2a32, d: 5 },               // luminária
    { t: 'circle', x: 1010, y: 292, r: 14, c: 0x3f3a2c, d: 5 },
    { t: 'tri',  x: 1010, y: 380, pts: [0, 0, 60, 176, -60, 176], c: 0xd9a441, a: 0.05, d: 5 },
    { t: 'rect', x: 1100, y: GROUND_Y - 62, w: 18, h: 22, c: 0x55555c, d: 7 },    // porta-retrato
    { t: 'rect', x: 1100, y: GROUND_Y - 62, w: 12, h: 16, c: 0x777780, d: 7 },

    /* -- sala das tubulações -- */
    { t: 'rect', x: 2480, y: GROUND_Y - 14, w: 46, h: 28, c: 0x30303a, d: 3 },    // pedestal da orelha
    { t: 'rect', x: 2480, y: GROUND_Y - 30, w: 54, h: 6,  c: 0x44444e, d: 3 },

    /* -- soleira: a luz de fora, vista de dentro -- */
    { t: 'rect', x: 3620, y: 260, w: 150, h: 560, c: 0x3a3628, a: 0.35, d: 1 },

    /* -- cidade (exterior): silhuetas em três profundidades -- */
    { t: 'rect', x: 4000, y: 250, w: 150, h: 470, c: 0x16161f, d: 0, sf: 0.30 },
    { t: 'rect', x: 4260, y: 210, w: 110, h: 550, c: 0x16161f, d: 0, sf: 0.30 },
    { t: 'rect', x: 4520, y: 275, w: 190, h: 420, c: 0x16161f, d: 0, sf: 0.30 },
    { t: 'rect', x: 4830, y: 195, w: 130, h: 580, c: 0x16161f, d: 0, sf: 0.30 },
    { t: 'rect', x: 5120, y: 250, w: 165, h: 470, c: 0x16161f, d: 0, sf: 0.30 },
    { t: 'rect', x: 4140, y: 300, w: 90,  h: 380, c: 0x1e1e28, d: 1, sf: 0.58 },
    { t: 'rect', x: 4420, y: 265, w: 120, h: 450, c: 0x1e1e28, d: 1, sf: 0.58 },
    { t: 'rect', x: 4720, y: 315, w: 100, h: 360, c: 0x1e1e28, d: 1, sf: 0.58 },
    { t: 'rect', x: 5000, y: 280, w: 140, h: 420, c: 0x1e1e28, d: 1, sf: 0.58 },
    /* postes da avenida — dão escala: o robô é menor que a base deles */
    { t: 'rect', x: 4050, y: GROUND_Y - 70, w: 6, h: 140, c: 0x1e1e26, d: 2 },
    { t: 'circle', x: 4050, y: GROUND_Y - 142, r: 9, c: 0x3f3a2c, d: 2 },
    { t: 'rect', x: 4600, y: GROUND_Y - 70, w: 6, h: 140, c: 0x1e1e26, d: 2 },
    { t: 'circle', x: 4600, y: GROUND_Y - 142, r: 9, c: 0x3f3a2c, d: 2 },
    { t: 'rect', x: 5150, y: GROUND_Y - 70, w: 6, h: 140, c: 0x1e1e26, d: 2 },
    { t: 'circle', x: 5150, y: GROUND_Y - 142, r: 9, c: 0x3f3a2c, d: 2 },

    /* -- massa de terra sob a cidade --
       Sem isto, a rua parece flutuar sobre o nada agora que o mundo é mais
       alto. O recorte entre as duas peças É a boca do beco. -- */
    { t: 'rect', x: 2290, y: 706, w: 4600, h: 392, c: 0x121219, d: 0 },
    { t: 'rect', x: 2290, y: 514, w: 4600, h: 5, c: 0x2c2c36, d: 1 },
    { t: 'rect', x: 5190, y: 706, w: 830,  h: 392, c: 0x121219, d: 0 },
    { t: 'rect', x: 5190, y: 514, w: 830, h: 5, c: 0x2c2c36, d: 1 },

    /* -- escada de incêndio: a estrutura encostada no prédio -- */
    { t: 'rect', x: 3965, y: 300, w: 8, h: 380, c: 0x1a1a22, d: 1 },
    { t: 'rect', x: 3860, y: 300, w: 8, h: 380, c: 0x1a1a22, d: 1 },
    { t: 'rect', x: 3912, y: 100, w: 150, h: 10, c: 0x22222c, d: 1 },

    /* -- beco: paredes que apertam, e o único ponto de luz lá no fundo -- */
    { t: 'rect', x: 4762, y: 690, w: 26, h: 400, c: 0x101016, d: 1 },
    { t: 'rect', x: 4600, y: 690, w: 26, h: 400, c: 0x101016, d: 1 },
    { t: 'rect', x: 4680, y: 620, w: 6, h: 60, c: 0x1e1e26, d: 2 },
    { t: 'circle', x: 4680, y: 588, r: 8, c: 0x3f3a2c, d: 2 },
    { t: 'rect', x: 4740, y: 800, w: 40, h: 34, c: 0x191920, d: 3 },     // entulho
    { t: 'rect', x: 4620, y: 806, w: 30, h: 24, c: 0x191920, d: 3 }
  ],

  /* imagens de cenário: as que colidem entram em `solid` */
  images: [
    { key: 'crate', x: 1600, y: GROUND_Y - 25, d: 3, solid: true }
    /* Nada de sólido no nível do chão da avenida: a primeira saída para a
       cidade é cena, não obstáculo. Um caixote no caminho vira parede — o
       robô pula, mas parar a caminhada aqui atropela o beat. */
  ],

  /* engrenagens de fundo: [x, y, escala] */
  gears: [[620, 130, 1.2], [1560, 100, 0.8], [2380, 150, 1.0], [3050, 110, 1.4]],

  pipes: [2750, 2950, 3150],

  /* fim do slice: o robô alcança a avenida */
  finishX: 5520
};

/* Zona que contém x. Fora de tudo -> a última (a cidade segue). */
function zoneAt(x) {
  for (const z of WORLD.zones) if (x >= z.x0 && x < z.x1) return z;
  return WORLD.zones[WORLD.zones.length - 1];
}
