'use strict';
/* constantes globais do jogo */
const W = 960, H = 540;
const GROUND_Y = 480;

const FONT = 'Jost, "Segoe UI", sans-serif';
const MONO = '"IBM Plex Mono", Consolas, monospace';
const AMBER = '#d9a441', AMBER_N = 0xd9a441;   // único acento — interação
const INK = '#d8d8dc', DIM = '#8a8a92';

/* vibração (tato — o primeiro sentido é o do jogador) */
function vib(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }

/* quantizador — movimento "de lata": ângulos em degraus mecânicos */
const q = v => Math.round(v / 0.16) * 0.16;
