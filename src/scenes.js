/* ---------------- cena: título ---------------- */
class TitleScene extends Phaser.Scene {
  constructor() { super('title'); }
  create() {
    this.cameras.main.setBackgroundColor('#0a0a0c');
    for (let x = 60; x < W; x += 150) this.add.rectangle(x, H / 2, 8, H, 0x121216);
    this.add.text(W / 2, 165, T('title'), { fontFamily: FONT, fontSize: '54px', color: INK, letterSpacing: 10 }).setOrigin(.5);
    this.add.text(W / 2, 222, T('proto'), { fontFamily: FONT, fontSize: '17px', color: DIM, letterSpacing: 4 }).setOrigin(.5);
    this.add.text(W / 2, 468, T('phones'), { fontFamily: FONT, fontSize: '14px', color: '#55555c', letterSpacing: 2 }).setOrigin(.5);

    const tap = this.add.text(W / 2, 330, T('tap'), { fontFamily: FONT, fontSize: '22px', color: AMBER, letterSpacing: 3 }).setOrigin(.5);
    this.tweens.add({ targets: tap, alpha: .25, duration: 900, yoyo: true, repeat: -1 });

    const zone = this.add.zone(W / 2, H / 2 + 40, W, H - 130).setInteractive();
    zone.once('pointerdown', () => { Snd.init(); this.scene.start('game'); });
    this.input.keyboard.once('keydown', () => { Snd.init(); this.scene.start('game'); });

    const lang = this.add.text(W - 24, 24, T('langBtn'), {
      fontFamily: FONT, fontSize: '16px', color: DIM, letterSpacing: 2,
      backgroundColor: '#16161a', padding: { x: 12, y: 6 }
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
    lang.on('pointerdown', () => { setLang(LANG === 'pt' ? 'en' : 'pt'); this.scene.restart(); });
  }
}

/* ---------------- cena: jogo ---------------- */
class GameScene extends Phaser.Scene {
  constructor() { super('game'); }

  /* --- texturas geradas (cinza por design: era P&B) --- */
  makeTextures() {
    if (this.textures.exists('r_torso')) return;
    const mk = (key, w, h, draw) => {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      draw(g); g.generateTexture(key, w, h); g.destroy();
    };
    // -- robô segmentado --
    const headDraw = (g, eye) => {
      g.fillStyle(0xb0b0b8); g.fillCircle(12, 13, 10);
      g.fillStyle(0x8d8d95); g.fillRect(2, 13, 20, 4);           // costura da "panela"
      g.fillStyle(0x62626a); g.fillRect(10, 0, 4, 6);            // funil
      g.fillStyle(0x1a1a1e); g.fillCircle(8, 11, 3); g.fillCircle(17, 11, 2); // órbitas vazias
      if (eye) { g.fillStyle(AMBER_N); g.fillCircle(8, 11, 2); }
      g.fillStyle(0x55555c); g.fillCircle(3, 14, 1); g.fillCircle(21, 14, 1); // rebites
    };
    mk('r_head', 24, 24, g => headDraw(g, false));
    mk('r_head_eye', 24, 24, g => headDraw(g, true));
    mk('r_torso', 24, 22, g => {
      g.fillStyle(0x9a9aa2); g.fillRect(2, 0, 20, 20);
      g.fillStyle(0x7c7c84); g.fillRect(2, 6, 20, 2); g.fillRect(2, 13, 20, 2); // anéis de lata
      g.fillStyle(0x55555c); [5, 12, 19].forEach(x => g.fillCircle(x, 3, 1.2));
    });
    mk('r_arm', 8, 18, g => {
      g.fillStyle(0x84848c); g.fillRect(2, 0, 4, 16);
      g.fillStyle(0x9a9aa2); g.fillCircle(4, 1, 3);              // ombro
      g.fillCircle(4, 16, 2.5);                                   // mão-pinça
    });
    mk('r_leg', 9, 17, g => {
      g.fillStyle(0x7c7c84); g.fillRect(2, 0, 4, 13);
      g.fillStyle(0x62626a); g.fillRect(0, 13, 9, 4);            // pé
    });
    // -- cenário --
    mk('gepeto', 34, 58, g => {
      g.fillStyle(0x4a4a52); g.fillRect(8, 20, 18, 26);
      g.fillStyle(0x3a3a42); g.fillRect(10, 46, 5, 12); g.fillRect(19, 46, 5, 12);
      g.fillStyle(0x8a8a92); g.fillCircle(17, 11, 8);
      g.fillStyle(0xcacace); g.fillRect(9, 14, 16, 4);
    });
    mk('ear', 26, 26, g => {
      g.lineStyle(3, AMBER_N); g.strokeCircle(13, 13, 9); g.strokeCircle(13, 13, 4);
    });
    mk('mark', 16, 16, g => {                                     // marcador de interação
      g.fillStyle(AMBER_N);
      g.fillTriangle(8, 16, 0, 6, 16, 6); g.fillRect(6, 0, 4, 4);
    });
    mk('door', 22, 122, g => {
      g.fillStyle(0x44444e); g.fillRect(0, 0, 22, 122);
      g.fillStyle(0x33333c); g.fillRect(3, 6, 16, 34); g.fillRect(3, 46, 16, 34); g.fillRect(3, 86, 16, 30);
      g.fillStyle(0x5a5a64); [10, 60, 112].forEach(y => g.fillCircle(11, y, 1.5));
    });
    mk('pipe', 44, 150, g => {
      g.fillStyle(0x33333d); g.fillRect(9, 0, 26, 150);
      g.fillStyle(0x44444e); g.fillRect(0, 0, 44, 10); g.fillRect(0, 70, 44, 8); g.fillRect(0, 140, 44, 10);
      g.fillStyle(0x1f1f26); g.fillRect(13, 12, 3, 126);          // sombra do cilindro
      g.fillStyle(0x5a5a64); [5, 74, 145].forEach(y => { g.fillCircle(4, y, 2); g.fillCircle(40, y, 2); });
    });
    mk('crate', 60, 50, g => {
      g.fillStyle(0x30303a); g.fillRect(0, 0, 60, 50);
      g.lineStyle(3, 0x22222a); g.strokeRect(1, 1, 58, 48);
      g.lineBetween(0, 0, 60, 50); g.lineBetween(60, 0, 0, 50);   // travessas
    });
    mk('gear', 80, 80, g => {
      g.fillStyle(0x16161c);
      for (let i = 0; i < 8; i++) {
        const a = i * Math.PI / 4;
        g.fillRect(40 + Math.cos(a) * 34 - 5, 40 + Math.sin(a) * 34 - 5, 10, 10);
      }
      g.fillCircle(40, 40, 32);
      g.fillStyle(0x0e0e12); g.fillCircle(40, 40, 10);
    });
  }

  create() {
    this.makeTextures();
    this.cameras.main.setBackgroundColor('#0a0a0c');

    /* estado */
    this.pushed = false; this.hasBrain = false; this.hasEye = false; this.hasEar = false;
    this.doorOpen = false; this.ended = false; this.paused = false;
    this.checkpoint = { x: 120, y: GROUND_Y - 40 };
    this.lastToast = 0; this.stepAcc = 0; this.movedFar = false; this.d1open = false;

    /* ---------- fundo (parallax + engrenagens) ---------- */
    for (let x = 40; x < W; x += 190) {
      this.add.rectangle(x, H / 2, 22, H, 0x0e0e13).setScrollFactor(0.35).setDepth(0);
    }
    this.gears = [
      this.add.image(620, 130, 'gear').setDepth(0).setScrollFactor(0.6).setScale(1.2),
      this.add.image(1560, 100, 'gear').setDepth(0).setScrollFactor(0.6).setScale(0.8),
      this.add.image(2380, 150, 'gear').setDepth(0).setScrollFactor(0.6),
      this.add.image(3050, 110, 'gear').setDepth(0).setScrollFactor(0.6).setScale(1.4)
    ];
    // colunas próximas com rebites
    for (let x = 100; x < 3600; x += 260) {
      this.add.rectangle(x, 240, 14, 480, 0x14141a).setDepth(1);
      this.add.circle(x, 120, 2, 0x2a2a32).setDepth(1);
      this.add.circle(x, 360, 2, 0x2a2a32).setDepth(1);
    }
    // cabos que penduram entre colunas
    const cable = this.add.graphics().setDepth(1);
    cable.lineStyle(2, 0x1c1c24);
    for (let x = 100; x < 3400; x += 520) {
      cable.beginPath(); cable.moveTo(x, 60);
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        cable.lineTo(x + t * 520, 60 + Math.sin(t * Math.PI) * 46);
      }
      cable.strokePath();
    }

    /* ---------- sólidos ---------- */
    this.solids = [];
    const solid = (x, y, w, h, color, depth) => {
      const r = this.add.rectangle(x, y, w, h, color === undefined ? 0x26262c : color);
      r.setDepth(depth === undefined ? 2 : depth);
      this.physics.add.existing(r, true);
      this.solids.push(r);
      return r;
    };
    solid(850, GROUND_Y + 30, 1700, 60);
    solid(2010, GROUND_Y + 30, 380, 60);
    solid(2975, GROUND_Y + 30, 1250, 60);
    solid(30, 300, 20, 400);
    // faixa superior do chão (acabamento)
    [[850, 1700], [2010, 380], [2975, 1250]].forEach(([cx, w]) =>
      this.add.rectangle(cx, GROUND_Y + 3, w, 6, 0x33333c).setDepth(2));

    // caixote e plataformas
    const crate = this.add.image(1600, GROUND_Y - 25, 'crate').setDepth(3);
    this.physics.add.existing(crate, true); this.solids.push(crate);
    const plat = (x, y, w) => {
      const p = solid(x, y, w, 12, 0x3a3a44, 3);
      this.add.rectangle(x, y - 7, w, 3, 0x50505a).setDepth(3);
      return p;
    };
    plat(1760, 430, 70); plat(1955, 405, 90); plat(2275, 420, 80);

    /* ---------- laboratório de Gepeto ---------- */
    this.add.rectangle(1080, GROUND_Y - 26, 210, 46, 0x30303a).setDepth(6);   // bancada
    this.add.rectangle(1080, GROUND_Y - 52, 220, 8, 0x44444e).setDepth(6);
    this.add.rectangle(995, GROUND_Y - 15, 10, 30, 0x22222a).setDepth(6);     // pés
    this.add.rectangle(1165, GROUND_Y - 15, 10, 30, 0x22222a).setDepth(6);
    this.add.rectangle(1035, GROUND_Y - 62, 26, 8, 0x55555c).setDepth(7);     // ferramentas
    this.add.circle(1070, GROUND_Y - 62, 5, 0x62626a).setDepth(7);
    this.add.rectangle(1250, GROUND_Y - 80, 90, 160, 0x1d1d24).setDepth(8);   // armário (oclusor do twist)
    this.add.rectangle(1250, GROUND_Y - 80, 78, 148, 0x23232b).setDepth(8);
    this.add.rectangle(1010, 250, 4, 70, 0x2a2a32).setDepth(5);               // luminária
    this.add.circle(1010, 292, 14, 0x3f3a2c).setDepth(5);
    this.add.triangle(1010, 380, 0, 0, 60, 176, -60, 176, 0xd9a441, 0.05).setDepth(5); // cone de luz
    this.add.rectangle(1100, GROUND_Y - 62, 18, 22, 0x55555c).setDepth(7);    // porta-retrato
    this.add.rectangle(1100, GROUND_Y - 62, 12, 16, 0x777780).setDepth(7);

    // GEPETO — presente desde o dia 1 (mascarado na 1ª jogada)
    this.gepeto = this.add.image(1000, GROUND_Y - 29, 'gepeto').setDepth(4);

    /* portas e itens */
    this.door1 = this.add.image(1390, GROUND_Y - 61, 'door').setDepth(5);
    this.physics.add.existing(this.door1, true); this.solids.push(this.door1);
    this.door3 = this.add.image(3310, GROUND_Y - 61, 'door').setDepth(5);
    this.physics.add.existing(this.door3, true); this.solids.push(this.door3);

    this.add.rectangle(2480, GROUND_Y - 14, 46, 28, 0x30303a).setDepth(3);
    this.add.rectangle(2480, GROUND_Y - 30, 54, 6, 0x44444e).setDepth(3);
    this.earItem = this.add.image(2480, GROUND_Y - 52, 'ear').setDepth(5);
    this.tweens.add({ targets: this.earItem, y: GROUND_Y - 60, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    this.pipes = [2750, 2950, 3150].map(x => {
      const p = this.add.image(x, GROUND_Y - 75, 'pipe').setDepth(3);
      p.px = x; return p;
    });
    this.tickPipe = this.pipes[Math.floor(Math.random() * 3)];

    this.add.rectangle(3560, 260, 120, 560, 0x3a3628, 0.35).setDepth(1);      // luz do fim

    /* ---------- robô: física + corpo segmentado ---------- */
    this.robot = this.physics.add.image(120, GROUND_Y - 40, 'r_torso').setVisible(false);
    this.robot.body.setSize(26, 46);
    this.physics.add.collider(this.robot, this.solids);

    this.armL = this.add.image(-12, -10, 'r_arm').setOrigin(.5, .08);
    this.legL = this.add.image(-5, 7, 'r_leg').setOrigin(.5, .08);
    this.torsoImg = this.add.image(0, -1, 'r_torso');
    this.legR = this.add.image(5, 7, 'r_leg').setOrigin(.5, .08);
    this.armR = this.add.image(12, -10, 'r_arm').setOrigin(.5, .08);
    this.headImg = this.add.image(0, -20, 'r_head');
    this.robotC = this.add.container(120, GROUND_Y - 40,
      [this.armL, this.legL, this.torsoImg, this.legR, this.armR, this.headImg]).setDepth(10);
    // tique de cabeça no idle (curioso, mecânico)
    this.time.addEvent({
      delay: 3400, loop: true,
      callback: () => {
        if (this.paused || this.ended) return;
        if (Math.abs(this.robot.body.velocity.x) < 5) {
          this.tweens.add({ targets: this.headImg, angle: 10, duration: 120, yoyo: true, hold: 500 });
        }
      }
    });

    /* câmera */
    this.cameras.main.setBounds(0, 0, 3600, 540);
    this.cameras.main.startFollow(this.robot, true, 0.15, 0.15, -240, 0);

    /* ---------- máscaras dos sentidos ---------- */
    this.coverL = this.add.rectangle(0, 0, W / 2 + 2, H, 0x000000).setOrigin(0).setScrollFactor(0).setDepth(500);
    this.coverR = this.add.rectangle(W / 2, 0, W / 2 + 2, H, 0x000000).setOrigin(0).setScrollFactor(0).setDepth(500);
    this.divider = this.add.rectangle(W / 2, H / 2, 2, H, 0x2a2a30).setScrollFactor(0).setDepth(501).setAlpha(0);

    /* ---------- UI ---------- */
    this.buildUI();

    /* ---------- prólogo: só vibração e o tutorial de mover ---------- */
    this.hammerTimer = this.time.addEvent({
      delay: 1300, loop: true,
      callback: () => { if (!this.pushed) vib(45); }
    });
    this.time.delayedCall(1200, () => {
      this.hint.setText(T('hintMove')).setAlpha(0);
      this.tweens.add({ targets: this.hint, alpha: .85, duration: 800 });
    });

    /* marcador de interação (mundo) */
    this.marker = this.add.image(0, 0, 'mark').setDepth(60).setVisible(false);
    this.tweens.add({ targets: this.marker, y: '+=6', duration: 500, yoyo: true, repeat: -1 });

    /* interagíveis */
    this.interactables = [
      { x: 985, r: 70, my: GROUND_Y - 120, label: () => T('push'), on: () => !this.pushed, cb: () => this.doPush() },
      { x: 1100, r: 46, my: GROUND_Y - 100, label: () => T('use'), on: () => this.hasEye, cb: () => this.toast(T('photo'), 3600) },
      ...this.pipes.map(p => ({
        x: p.px, r: 55, my: GROUND_Y - 170, label: () => T('use'),
        on: () => this.hasEye && !this.doorOpen, cb: () => this.tryPipe(p)
      }))
    ];
  }

  /* ---------- UI ---------- */
  buildUI() {
    const sf = o => o.setScrollFactor(0);
    this.uiCX = W / 2; // centro da área visível (vira W/4 após o olho)

    this.thoughtTxt = sf(this.add.text(W / 2, 210, '', {
      fontFamily: FONT, fontSize: '26px', fontStyle: 'italic', color: '#74747c',
      align: 'center', wordWrap: { width: 640 }, lineSpacing: 10
    }).setOrigin(.5).setDepth(700)).setAlpha(0);

    // tutorial: embaixo, grande, discreto na cor
    this.hint = sf(this.add.text(W / 2, 498, '', {
      fontFamily: FONT, fontSize: '26px', color: '#5a5a64', letterSpacing: 6
    }).setOrigin(.5).setDepth(700));

    // rótulo da ação contextual: pequeno, junto ao tutorial, não tampa o cenário
    this.actionHint = sf(this.add.text(W / 2, 498, '', {
      fontFamily: FONT, fontSize: '22px', color: AMBER, letterSpacing: 4
    }).setOrigin(.5).setDepth(700)).setVisible(false);

    this.toastTxt = sf(this.add.text(W / 2, 120, '', {
      fontFamily: FONT, fontSize: '17px', color: INK, align: 'center', wordWrap: { width: 420 }
    }).setOrigin(.5).setDepth(700)).setAlpha(0);

    // pausa
    const pauseBtn = sf(this.add.text(W - 20, 16, 'II', {
      fontFamily: FONT, fontSize: '20px', color: DIM, letterSpacing: 2,
      backgroundColor: '#16161a', padding: { x: 12, y: 6 }
    }).setOrigin(1, 0).setDepth(800).setInteractive({ useHandCursor: true }));
    pauseBtn.on('pointerdown', () => this.togglePause());
    this.input.keyboard.on('keydown-P', () => this.togglePause());
    this.input.keyboard.on('keydown-ESC', () => this.togglePause());

    /* controles: ◀▶ mover · ▲ pular · espaço/E interagir */
    this.keys = this.input.keyboard.addKeys('LEFT,RIGHT,A,D,W,UP,SPACE,E');
    this.touch = { l: false, r: false, j: false };
    this.currentAction = null;
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      this.input.addPointer(3);
      const mkBtn = (x, y, label, key, radius) => {
        const c = sf(this.add.circle(x, y, radius || 44, 0x2a2a32, .5).setDepth(750)).setInteractive();
        const t = sf(this.add.text(x, y, label, { fontFamily: FONT, fontSize: '28px', color: DIM }).setOrigin(.5).setDepth(751));
        c.on('pointerdown', () => this.touch[key] = true);
        c.on('pointerup', () => this.touch[key] = false);
        c.on('pointerout', () => this.touch[key] = false);
        return { c, t };
      };
      mkBtn(66, 470, '◀', 'l'); mkBtn(174, 470, '▶', 'r'); mkBtn(892, 470, '▲', 'j');
      // botão de interação: só aparece quando há algo perto
      this.iBtn = sf(this.add.circle(796, 470, 34, AMBER_N, .85).setDepth(750)).setInteractive().setVisible(false);
      this.iBtnT = sf(this.add.text(796, 470, '✦', { fontFamily: FONT, fontSize: '24px', color: '#0a0a0c' }).setOrigin(.5).setDepth(751)).setVisible(false);
      this.iBtn.on('pointerdown', () => { if (this.currentAction) this.currentAction(); });
    }
  }

  /* pensamento: fade lento + tempo de leitura generoso */
  thought(msg, hold) {
    this.thoughtTxt.setText(msg).setAlpha(0);
    this.tweens.add({ targets: this.thoughtTxt, alpha: 1, duration: 900, yoyo: true, hold: hold || 3200 });
  }

  toast(msg, dur) {
    this.toastTxt.setText(msg).setAlpha(0);
    this.tweens.killTweensOf(this.toastTxt);
    this.tweens.add({ targets: this.toastTxt, alpha: 1, duration: 350, yoyo: true, hold: dur || 2400 });
  }

  banner(titleKey, descKey, holdMs) {
    const cx = this.hasEye ? W / 4 : W / 2;
    const t1 = this.add.text(cx, 196, T(titleKey), {
      fontFamily: FONT, fontSize: '32px', color: AMBER, letterSpacing: 7
    }).setOrigin(.5).setScrollFactor(0).setDepth(710).setAlpha(0);
    const t2 = this.add.text(cx, 238, T(descKey), {
      fontFamily: FONT, fontSize: '18px', color: DIM
    }).setOrigin(.5).setScrollFactor(0).setDepth(710).setAlpha(0);
    this.tweens.add({
      targets: [t1, t2], alpha: 1, duration: 700, yoyo: true, hold: holdMs || 3400,
      onComplete: () => { t1.destroy(); t2.destroy(); }
    });
  }

  /* ---------- o empurrão (mascarado) → cérebro → pensamentos → lei → olho ---------- */
  doPush() {
    if (this.pushed) return;
    this.pushed = true;
    this.hideAction();
    this.hint.setText('');
    this.hammerTimer.remove();
    vib([90, 60, 160]);
    this.tweens.add({ targets: this.gepeto, x: 1225, y: GROUND_Y - 12, angle: 90, duration: 500, ease: 'Quad.in' });
    this.time.delayedCall(500, () => vib(220));

    // CÉREBRO adquirido — só agora existem pensamentos
    this.time.delayedCall(2200, () => { this.hasBrain = true; this.banner('brainGet', 'brainDesc', 3600); });
    this.time.delayedCall(7400, () => this.thought(T('think1'), 3000));
    this.time.delayedCall(12200, () => this.thought(T('think2'), 3400));
    this.time.delayedCall(17600, () => this.thought(T('think3'), 3800));
    // a 1ª Lei, na morte
    this.time.delayedCall(23600, () => {
      const law = this.add.text(W / 2, H / 2 - 20, T('law'), {
        fontFamily: MONO, fontSize: '17px', color: '#b8b8c0', align: 'center',
        wordWrap: { width: 620 }, lineSpacing: 9
      }).setOrigin(.5).setScrollFactor(0).setDepth(710).setAlpha(0);
      this.tweens.add({
        targets: law, alpha: 1, duration: 1500, yoyo: true, hold: 5600,
        onComplete: () => { law.destroy(); this.acquireEye(); }
      });
    });
  }

  acquireEye() {
    this.time.delayedCall(1200, () => {
      this.hasEye = true;
      this.headImg.setTexture('r_head_eye');
      this.tweens.add({ targets: this.coverL, alpha: 0, duration: 2800, ease: 'Sine.inOut' });
      this.tweens.add({ targets: this.divider, alpha: .6, duration: 2800 });
      this.time.delayedCall(1500, () => this.banner('eyeGet', 'eyeDesc', 3400));
      // UI migra para o centro da metade visível
      this.uiCX = W / 4;
      this.thoughtTxt.setX(W / 4);
      this.toastTxt.setX(W / 4);
      this.hint.setX(W / 4);
      this.actionHint.setX(W / 4);
      this.time.delayedCall(5200, () => {
        this.hint.setText(T('hintJump')).setAlpha(0);
        this.tweens.add({ targets: this.hint, alpha: .85, duration: 700, yoyo: true, hold: 3400, onComplete: () => this.hint.setText('') });
      });
    });
  }

  acquireEar() {
    if (this.hasEar) return;
    this.hasEar = true;
    this.earItem.destroy();
    Snd.enable();
    this.time.delayedCall(600, () => Snd.chime());
    this.banner('earGet', 'earDesc', 3400);
    vib([30, 40, 30]);
    this.tickTimer = this.time.addEvent({
      delay: 800, loop: true,
      callback: () => {
        if (this.doorOpen) return;
        const pan = (this.tickPipe.px - this.robot.x) / 500;
        if (Math.abs(this.tickPipe.px - this.robot.x) < 700) Snd.tick(pan);
      }
    });
  }

  tryPipe(p) {
    if (this.doorOpen) return;
    if (p === this.tickPipe && this.hasEar) {
      this.doorOpen = true;
      Snd.clank(); vib([30, 30, 30]);
      this.toast(T('pipeRight'), 2600);
      this.tweens.add({ targets: this.door3, y: this.door3.y - 118, duration: 900, ease: 'Quad.out' });
      this.time.delayedCall(900, () => { this.door3.body.enable = false; });
    } else {
      Snd.buzz(); vib(120);
      this.toast(T('pipeWrong'), 1400);
    }
  }

  showAction(it) {
    this.currentAction = it.cb;
    // marcador no mundo (só visível com o olho; no escuro, o texto embaixo guia)
    if (this.hasEye) this.marker.setVisible(true).setX(it.x).setY(it.my || GROUND_Y - 120);
    this.actionHint.setVisible(true).setText(it.label() + '  ' + T('keyHint'));
    this.hint.setVisible(false);
    if (this.iBtn) { this.iBtn.setVisible(true); this.iBtnT.setVisible(true); }
  }
  hideAction() {
    this.currentAction = null;
    this.marker.setVisible(false);
    this.actionHint.setVisible(false);
    this.hint.setVisible(true);
    if (this.iBtn) { this.iBtn.setVisible(false); this.iBtnT.setVisible(false); }
  }

  togglePause() {
    if (this.ended) return;
    this.paused = !this.paused;
    if (this.paused) {
      this.physics.pause(); this.time.paused = true;
      const d = 900;
      this.pauseUI = [
        this.add.rectangle(W / 2, H / 2, W, H, 0x000000, .78).setScrollFactor(0).setDepth(d),
        this.add.text(W / 2, 150, T('pause'), { fontFamily: FONT, fontSize: '34px', color: INK, letterSpacing: 8 }).setOrigin(.5).setScrollFactor(0).setDepth(d + 1)
      ];
      const btn = (y, label, cb) => {
        const t = this.add.text(W / 2, y, label, {
          fontFamily: FONT, fontSize: '20px', color: AMBER, letterSpacing: 3,
          backgroundColor: '#16161a', padding: { x: 26, y: 10 }
        }).setOrigin(.5).setScrollFactor(0).setDepth(d + 1).setInteractive({ useHandCursor: true });
        t.on('pointerdown', cb); this.pauseUI.push(t); return t;
      };
      btn(240, T('resume'), () => this.togglePause());
      btn(302, T('restart'), () => { this.closePause(); this.paused = false; this.time.paused = false; this.scene.restart(); });
      btn(364, T('langBtn'), () => {
        setLang(LANG === 'pt' ? 'en' : 'pt');
        this.closePause(); this.paused = false; this.physics.resume(); this.time.paused = false;
        this.togglePause();
      });
    } else {
      this.closePause();
      this.physics.resume(); this.time.paused = false;
    }
  }
  closePause() { if (this.pauseUI) { this.pauseUI.forEach(o => o.destroy()); this.pauseUI = null; } }

  endGame() {
    if (this.ended) return;
    this.ended = true;
    const d = 950;
    const bg = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0).setScrollFactor(0).setDepth(d);
    this.tweens.add({ targets: bg, fillAlpha: 1, duration: 1600 });
    this.time.delayedCall(1700, () => {
      this.add.text(W / 2, 210, T('endT'), { fontFamily: FONT, fontSize: '36px', color: INK, letterSpacing: 8 }).setOrigin(.5).setScrollFactor(0).setDepth(d + 1);
      this.add.text(W / 2, 262, T('endB'), { fontFamily: FONT, fontSize: '18px', color: DIM }).setOrigin(.5).setScrollFactor(0).setDepth(d + 1);
      const again = this.add.text(W / 2, 340, T('again'), {
        fontFamily: FONT, fontSize: '20px', color: AMBER, letterSpacing: 3,
        backgroundColor: '#16161a', padding: { x: 26, y: 10 }
      }).setOrigin(.5).setScrollFactor(0).setDepth(d + 1).setInteractive({ useHandCursor: true });
      again.on('pointerdown', () => this.scene.restart());
    });
  }

  /* ---------- update ---------- */
  update(time, dt) {
    if (this.paused || this.ended) return;
    const r = this.robot, b = r.body;
    const left = this.keys.LEFT.isDown || this.keys.A.isDown || this.touch.l;
    const right = this.keys.RIGHT.isDown || this.keys.D.isDown || this.touch.r;
    const jump = this.keys.W.isDown || this.keys.UP.isDown || this.touch.j;
    const grounded = b.blocked.down;

    if (left) r.setVelocityX(-180);
    else if (right) r.setVelocityX(180);
    else r.setVelocityX(0);

    if (jump && grounded) { r.setVelocityY(-430); vib(15); }

    /* --- animação segmentada: dura, mas viva --- */
    const c = this.robotC;
    c.setPosition(r.x, r.y);
    if (left) c.scaleX = -1; else if (right) c.scaleX = 1;
    const moving = left || right;
    if (!grounded) {                                     // pose de pulo: pernas recolhidas
      this.legL.rotation = -0.55; this.legR.rotation = 0.55;
      this.armL.rotation = 0.7; this.armR.rotation = -0.7;
      this.headImg.rotation = 0;
    } else if (moving) {                                 // passo mecânico quantizado
      const ph = time / 110;
      const s = Math.sin(ph);
      this.legL.rotation = q(s * 0.6);
      this.legR.rotation = q(-s * 0.6);
      this.armL.rotation = q(-s * 0.4);
      this.armR.rotation = q(s * 0.4);
      this.headImg.rotation = q(Math.sin(ph / 2) * 0.05);
      c.y = r.y + (Math.abs(s) > .7 ? -2 : 0);           // solavanco do passo
      this.stepAcc += dt;
      if (this.stepAcc > 320) { this.stepAcc = 0; vib(8); Snd.step(); }
    } else {                                             // idle: reto, parado, de lata
      this.legL.rotation = 0; this.legR.rotation = 0;
      this.armL.rotation = 0; this.armR.rotation = 0;
    }

    // tutorial de mover some quando cumprido
    if (!this.movedFar && r.x > 380) {
      this.movedFar = true;
      this.tweens.add({ targets: this.hint, alpha: 0, duration: 900, onComplete: () => { this.hint.setText('').setAlpha(.85); } });
    }

    // limites do prólogo
    if (!this.pushed && r.x > 960) { r.x = 960; r.setVelocityX(0); }
    if (r.x < 60) { r.x = 60; if (!this.hasEye) vib(25); }

    // porta 1 abre após o olho
    if (this.hasEye && !this.d1open && r.x > 1300) {
      this.d1open = true;
      this.tweens.add({ targets: this.door1, y: this.door1.y - 118, duration: 800 });
      this.time.delayedCall(800, () => { this.door1.body.enable = false; });
    }

    // orelha
    if (!this.hasEar && this.hasEye && Math.abs(r.x - 2480) < 34 && r.y > GROUND_Y - 110) this.acquireEar();

    // porta 3 trancada
    if (!this.doorOpen && r.x > 3250 && time - this.lastToast > 3000) {
      this.lastToast = time;
      this.toast(this.hasEar ? T('doorEar') : T('doorNoEar'), 2600);
    }

    // checkpoints
    if (r.x > 1420 && this.checkpoint.x < 1420) this.checkpoint = { x: 1430, y: GROUND_Y - 40 };
    if (r.x > 2650 && this.checkpoint.x < 2650) this.checkpoint = { x: 2650, y: GROUND_Y - 40 };

    // queda = remontagem (era lata: sem game over)
    if (r.y > 700) {
      vib([120, 80, 120]);
      this.cameras.main.flash(300, 10, 10, 12);
      r.setPosition(this.checkpoint.x, this.checkpoint.y).setVelocity(0, 0);
      this.toast(T('remade'), 1800);
    }

    // fim
    if (this.doorOpen && r.x > 3480) this.endGame();

    // interação contextual (espaço/E, marcador no mundo, botão touch)
    let found = null;
    for (const it of this.interactables) {
      if (it.on() && Math.abs(r.x - it.x) < it.r) { found = it; break; }
    }
    if (found) {
      this.showAction(found);
      if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE) || Phaser.Input.Keyboard.JustDown(this.keys.E)) found.cb();
    } else this.hideAction();

    // engrenagens giram devagar
    this.gears.forEach((g, i) => g.rotation += (i % 2 ? -1 : 1) * 0.0012 * dt / 16);
  }
}

