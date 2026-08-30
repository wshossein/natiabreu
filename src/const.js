'use strict';
/* constantes globais do jogo */
const W = 960, H = 540;
const GROUND_Y = 480;

const FONT = 'Jost, "Segoe UI", sans-serif';
const MONO = '"IBM Plex Mono", Consolas, monospace';
const AMBER = '#d9a441', AMBER_N = 0xd9a441;   // único acento — interação
const INK = '#d8d8dc', DIM = '#8a8a92';

/* --- direção de arte: nanquim (ref. Moebius) ---
   O mundo é escuro, então a ligne claire aparece INVERTIDA: traço claro e
   uniforme sobre chapados escuros. Trocar para nanquim escuro sobre papel
   é só inverter estas 4 constantes — a arte é linha, não pintura. */
const ART = 4;                 // supersampling: desenha 4× e reduz -> traço fino e limpo
const AS = 1 / ART;            // escala de exibição das texturas
const LINE_N = 0xdededf;       // o traço
const FILL_N = 0x3c3c46;       // chapado da peça
const DARK_N = 0x23232b;       // chapado em sombra / vazado
const HATCH_N = 0x74747f;      // hachura (usar pouco: Moebius sombreia com parcimônia)

/* vibração (tato — o primeiro sentido é o do jogador) */
function vib(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }

/* quantizador — movimento "de lata": ângulos em degraus mecânicos */
const q = v => Math.round(v / 0.16) * 0.16;
