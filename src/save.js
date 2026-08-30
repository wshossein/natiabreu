'use strict';
/* Save — localStorage. O GDD depende dele para o twist: a flag `finished`
   é o que habilita o replay revelador do prólogo (seção 2.2b). Sem save,
   o twist não tem gatilho. */
const Save = {
  KEY: 'robo_save_v1',
  data: null,

  blank() {
    return {
      v: 1,
      parts: [],            // ids adquiridos (ver parts.js)
      flags: {},            // eventos do mundo já resolvidos
      spawn: null,          // { x, y } do último checkpoint
      finished: false,      // terminou uma vez -> libera o replay do prólogo
      playtime: 0
    };
  },

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      const d = raw ? JSON.parse(raw) : null;
      // versão diferente = save de um build anterior; começa limpo em vez de quebrar
      this.data = (d && d.v === 1) ? Object.assign(this.blank(), d) : this.blank();
    } catch (e) {
      this.data = this.blank();
    }
    return this.data;
  },

  save() {
    try { localStorage.setItem(this.KEY, JSON.stringify(this.data)); }
    catch (e) { /* modo privado / cota: o jogo segue, só não persiste */ }
  },

  get(k) { return this.data ? this.data[k] : undefined; },
  set(k, v) { if (this.data) { this.data[k] = v; this.save(); } },

  flag(k) { return !!(this.data && this.data.flags[k]); },
  setFlag(k, v) {
    if (!this.data) return;
    this.data.flags[k] = v === undefined ? true : v;
    this.save();
  },

  /* Recomeçar do zero mantém `finished`: quem já terminou não perde o direito
     de rever o prólogo desmascarado. */
  reset() {
    const finished = this.data ? this.data.finished : false;
    this.data = this.blank();
    this.data.finished = finished;
    this.save();
  },

  wipe() { this.data = this.blank(); this.save(); }
};
