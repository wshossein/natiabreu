/* ---------------- áudio (só existe após a Orelha) ---------------- */
const Snd = {
  ctx: null, master: null, earOn: false, musicTimer: null,
  init() {
    if (this.ctx) return;
    try {
      const C = window.AudioContext || window.webkitAudioContext;
      this.ctx = new C();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0;
      this.master.connect(this.ctx.destination);
    } catch (e) {}
  },
  enable() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.resume) this.ctx.resume();
    this.earOn = true;
    this.master.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + 2.5);
    this.startMusic();
  },
  tone(freq, dur, type, vol, delay, pan) {
    if (!this.earOn || !this.ctx) return;
    const t = this.ctx.currentTime + (delay || 0);
    const o = this.ctx.createOscillator();
    o.type = type || 'sine'; o.frequency.value = freq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol || 0.2, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (dur || 0.2));
    o.connect(g);
    let node = g;
    if (pan !== undefined && this.ctx.createStereoPanner) {
      const p = this.ctx.createStereoPanner();
      p.pan.value = Math.max(-1, Math.min(1, pan));
      g.connect(p); node = p;
    }
    node.connect(this.master);
    o.start(t); o.stop(t + (dur || 0.2) + 0.05);
  },
  chime() { this.tone(660, .5, 'sine', .25); this.tone(880, .7, 'sine', .2, .12); this.tone(1320, .9, 'sine', .12, .24); },
  step() { this.tone(110 + Math.random() * 50, .05, 'square', .04); },
  buzz() { this.tone(85, .3, 'sawtooth', .18); },
  clank() { this.tone(210, .25, 'square', .2); this.tone(140, .5, 'square', .15, .1); },
  tick(pan) { this.tone(1150, .05, 'square', .14, 0, pan); },
  startMusic() {
    if (this.musicTimer) return;
    const notes = [220, 261.6, 329.6, 293.7, 220, 261.6, 349.2, 329.6];
    let i = 0;
    const loop = () => {
      if (!this.earOn) return;
      this.tone(notes[i % notes.length] / 2, 1.6, 'triangle', .06);
      this.tone(notes[i % notes.length], 1.2, 'sine', .045);
      i++;
    };
    loop();
    this.musicTimer = setInterval(loop, 1700);
  }
};

