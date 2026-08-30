'use strict';
/* Partes do corpo — o mapa de progressão do jogo (GDD seções 1 e 4).
   Substitui os booleanos soltos (hasEye/hasEar/hasBrain) por um registro
   único. Regra de ouro do GDD: toda parte traz um CUSTO junto do benefício;
   por isso `cost` é campo obrigatório do registro, não comentário.

   `sense` marca as partes que alteram a interface do JOGADOR — o diferencial
   do jogo. Elas não são power-ups: são o que a tela, o alto-falante e o
   motor de vibração passam a fazer. */
const PARTS = {
  brain:  { tier: 1, sense: null,    ability: 'pensar',            cost: 'consciência: a partir daqui há culpa' },
  eye:    { tier: 1, sense: 'video', ability: 'metade da tela',    cost: 'só metade — o resto do mundo segue cego' },
  ear:    { tier: 1, sense: 'audio', ability: 'som do jogo',       cost: 'o mundo passa a ter ruído; nem tudo se quer ouvir' },
  mouth:  { tier: 1, sense: null,    ability: 'falar',             cost: 'o que se diz passa a poder ser usado contra você' },
  legs:   { tier: 1, sense: null,    ability: 'pulo alto',         cost: 'cansaço: o pulo piora sob esforço' },
  arms:   { tier: 2, sense: null,    ability: 'puxar, sustentar',   cost: 'o que se carrega, pesa — e o que se alcança, se perde' },
  eye2:   { tier: 2, sense: 'video', ability: 'a tela inteira',     cost: 'ver o que se preferia não ter visto' },
  hands:  { tier: 2, sense: null,    ability: 'agarrar, destravar', cost: 'o que se agarra também machuca' }
};

/* Quem é o falante `whoRobot` nas falas de src/story.js. Existe como
   constante porque o runtime BLOQUEIA fala do robô sem boca. */
const ROBOT_SPEAKER = 'whoRobot';

const Parts = {
  owned: new Set(),

  /* Sincroniza com o save. Chamar no create() da cena. */
  hydrate() {
    this.owned = new Set((Save.get('parts') || []).filter(id => PARTS[id]));
    return this;
  },

  has(id) { return this.owned.has(id); },
  count() { return this.owned.size; },
  list() { return [...this.owned]; },

  /* Adquire e persiste. Devolve false se já tinha — os chamadores usam isso
     para não repetir banner, som e vibração. */
  acquire(id) {
    if (!PARTS[id] || this.owned.has(id)) return false;
    this.owned.add(id);
    Save.set('parts', [...this.owned]);
    return true;
  },

  /* Sentidos do jogador: a interface É o corpo do robô. */
  canSee() { return this.has('eye'); },
  canHear() { return this.has('ear'); },
  canThink() { return this.has('brain'); },

  info(id) { return PARTS[id]; },

  reset() { this.owned = new Set(); }
};
