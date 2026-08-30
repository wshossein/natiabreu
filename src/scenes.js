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
  /* ---------- texturas: nanquim (ref. Moebius) ----------
     Tudo é desenhado em coordenadas lógicas com o canvas escalado ART×, e as
     imagens voltam a AS na tela: o traço sai fino, uniforme e antialiasado —
     ligne claire, não pixel art. Chapados planos, hachura só onde precisa de
     volume. A silhueta segue a folha de referência: domo, mandíbula sólida,
     peito fechado, extremidades bloqueadas. */
  makeTextures() {
    if (this.textures.exists('r_torso')) return;

    const mk = (key, w, h, draw) => {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.scaleCanvas(ART, ART);
      draw(g);
      g.generateTexture(key, w * ART, h * ART);
      g.destroy();
    };
    const line = (g, wgt) => g.lineStyle(wgt === undefined ? 0.9 : wgt, LINE_N, 1);
    /* hachura diagonal recortada num retângulo — volume sem pintar */
    const hatch = (g, x, y, w, h, step) => {
      g.lineStyle(0.5, HATCH_N, .5);
      for (let d = step; d < w + h; d += step) {
        g.lineBetween(x + Math.max(0, d - h), y + Math.min(d, h),
                      x + Math.min(d, w),     y + Math.max(0, d - w));
      }
    };

    /* -- robô: peças separadas, montadas no container -- */
    const headDraw = (g, eye) => {
      g.fillStyle(FILL_N, 1);
      g.fillRoundedRect(3, 2, 18, 16, { tl: 8, tr: 8, bl: 3, br: 3 });   // domo
      g.fillStyle(DARK_N, 1);
      g.fillRoundedRect(6, 15.5, 12, 5, { tl: 0, tr: 0, bl: 2, br: 2 }); // mandíbula sólida
      hatch(g, 14.5, 6, 5.5, 9, 2);
      line(g, 0.9);
      g.strokeRoundedRect(3, 2, 18, 16, { tl: 8, tr: 8, bl: 3, br: 3 });
      g.strokeRoundedRect(6, 15.5, 12, 5, { tl: 0, tr: 0, bl: 2, br: 2 });
      line(g, 0.6);
      g.lineBetween(4.5, 15.5, 19.5, 15.5);                              // costura do queixo
      g.fillStyle(DARK_N, 1);                                            // órbitas
      g.fillCircle(8.5, 10.5, 3.3); g.fillCircle(15.8, 10.5, 3.3);
      line(g, 0.8);
      g.strokeCircle(8.5, 10.5, 3.3); g.strokeCircle(15.8, 10.5, 3.3);
      if (eye) { g.fillStyle(AMBER_N, 1); g.fillCircle(8.5, 10.5, 2); }  // só o olho adquirido
      g.fillStyle(LINE_N, .75); g.fillCircle(4.6, 13.5, .6); g.fillCircle(19.4, 13.5, .6);
    };
    mk('r_head', 24, 24, g => headDraw(g, false));
    mk('r_head_eye', 24, 24, g => headDraw(g, true));

    mk('r_torso', 24, 22, g => {
      g.fillStyle(DARK_N, 1);
      g.fillRoundedRect(0, 2, 6.5, 6, 2); g.fillRoundedRect(17.5, 2, 6.5, 6, 2);  // ombreiras
      g.fillStyle(FILL_N, 1);
      g.fillRoundedRect(4, 1, 16, 14, { tl: 4, tr: 4, bl: 2, br: 2 });            // peito fechado
      g.fillStyle(DARK_N, 1); g.fillRect(4, 15, 16, 5);                           // cintura
      hatch(g, 13, 4, 6, 10, 2);
      line(g, 0.9);
      g.strokeRoundedRect(0, 2, 6.5, 6, 2); g.strokeRoundedRect(17.5, 2, 6.5, 6, 2);
      g.strokeRoundedRect(4, 1, 16, 14, { tl: 4, tr: 4, bl: 2, br: 2 });
      g.strokeRect(4, 15, 16, 5);
      line(g, 0.55);
      g.lineBetween(12, 2.5, 12, 14);                                             // costura central
      g.fillStyle(FILL_N, 1); g.fillRect(10, 16, 4, 3);                           // fivela
      line(g, 0.55); g.strokeRect(10, 16, 4, 3);
      g.fillStyle(LINE_N, .7); [7.5, 16.5].forEach(x => g.fillCircle(x, 4, .6));
    });

    mk('r_arm', 8, 18, g => {
      g.fillStyle(FILL_N, 1);
      g.fillCircle(4, 2.6, 2.6);                                   // ombro
      g.fillRoundedRect(2.4, 2.4, 3.2, 6.6, 1.4);                  // braço
      g.fillStyle(DARK_N, 1);
      g.fillRoundedRect(1.5, 8.4, 5, 8.2, 2);                      // extremidade bloqueada
      hatch(g, 4.2, 9, 2.2, 7, 1.6);
      line(g, 0.8);
      g.strokeCircle(4, 2.6, 2.6);
      g.strokeRoundedRect(2.4, 2.4, 3.2, 6.6, 1.4);
      g.strokeRoundedRect(1.5, 8.4, 5, 8.2, 2);
      line(g, 0.5); g.lineBetween(1.9, 11.6, 6.1, 11.6);           // anel do antebraço
    });

    mk('r_leg', 9, 17, g => {
      g.fillStyle(FILL_N, 1);
      g.fillRoundedRect(2.3, 0, 4.4, 7, 1.4);                      // coxa
      g.fillStyle(DARK_N, 1);
      g.fillCircle(4.5, 7.4, 2.1);                                 // joelho
      g.fillRoundedRect(2.6, 7.6, 3.8, 5.2, 1.2);                  // canela
      g.fillRoundedRect(0.5, 12.4, 8, 4.2, { tl: 1.6, tr: 1.6, bl: 1, br: 1 });  // pé bloqueado
      hatch(g, 4.6, 1, 2, 6, 1.8);
      line(g, 0.8);
      g.strokeRoundedRect(2.3, 0, 4.4, 7, 1.4);
      g.strokeCircle(4.5, 7.4, 2.1);
      g.strokeRoundedRect(2.6, 7.6, 3.8, 5.2, 1.2);
      g.strokeRoundedRect(0.5, 12.4, 8, 4.2, { tl: 1.6, tr: 1.6, bl: 1, br: 1 });
    });

    /* -- cenário -- */
    mk('gepeto', 34, 58, g => {
      g.fillStyle(DARK_N, 1);
      g.fillRoundedRect(8, 19, 18, 27, { tl: 5, tr: 5, bl: 1, br: 1 });  // casaco
      g.fillRect(10.5, 45, 5, 13); g.fillRect(18.5, 45, 5, 13);          // pernas
      g.fillStyle(FILL_N, 1); g.fillCircle(17, 11, 7.4);                 // cabeça
      hatch(g, 18, 22, 7.5, 21, 2.2);
      line(g, 0.9);
      g.strokeCircle(17, 11, 7.4);
      g.strokeRoundedRect(8, 19, 18, 27, { tl: 5, tr: 5, bl: 1, br: 1 });
      g.strokeRect(10.5, 45, 5, 13); g.strokeRect(18.5, 45, 5, 13);
      line(g, 0.6);
      g.lineBetween(10, 15.5, 24, 15.5);                                 // gola
      g.lineBetween(17, 20, 17, 44);                                     // fecho do casaco
    });

    mk('ear', 26, 26, g => {                                             // item: âmbar = aquisição
      g.lineStyle(1.4, AMBER_N, 1); g.strokeCircle(13, 13, 9);
      g.lineStyle(1.0, AMBER_N, 1); g.strokeCircle(13, 13, 5);
      g.lineStyle(0.8, AMBER_N, .8); g.strokeCircle(13, 13, 2);
    });

    mk('mark', 16, 16, g => {                                            // marcador de interação
      g.fillStyle(AMBER_N, 1);
      g.fillTriangle(8, 16, 1, 6, 15, 6); g.fillRect(6, 0, 4, 4.5);
    });

    mk('door', 22, 122, g => {
      g.fillStyle(DARK_N, 1); g.fillRect(0, 0, 22, 122);
      hatch(g, 2, 4, 18, 114, 5);
      line(g, 0.9); g.strokeRect(0.5, 0.5, 21, 121);
      line(g, 0.55);
      g.strokeRect(3, 6, 16, 34); g.strokeRect(3, 46, 16, 34); g.strokeRect(3, 86, 16, 30);
      g.fillStyle(LINE_N, .8); [10, 60, 112].forEach(y => g.fillCircle(11, y, .8));
    });

    mk('pipe', 44, 150, g => {
      g.fillStyle(DARK_N, 1); g.fillRect(9, 0, 26, 150);
      hatch(g, 24, 2, 10, 146, 4);
      line(g, 0.9); g.strokeRect(9, 0, 26, 150);
      line(g, 0.5); g.lineBetween(14.5, 12, 14.5, 138);                  // brilho do cilindro
      [[0, 10], [70, 8], [140, 10]].forEach(([y, hh]) => {               // flanges
        g.fillStyle(FILL_N, 1); g.fillRect(0, y, 44, hh);
        line(g, 0.9); g.strokeRect(0, y, 44, hh);
      });
      g.fillStyle(LINE_N, .7);
      [5, 74, 145].forEach(y => { g.fillCircle(3.5, y, 1); g.fillCircle(40.5, y, 1); });
    });

    mk('crate', 60, 50, g => {
      g.fillStyle(DARK_N, 1); g.fillRect(0, 0, 60, 50);
      hatch(g, 3, 3, 54, 44, 6);
      line(g, 1); g.strokeRect(0.5, 0.5, 59, 49);
      line(g, 0.7);
      g.lineBetween(0.5, 0.5, 59.5, 49.5); g.lineBetween(59.5, 0.5, 0.5, 49.5);
      g.strokeRect(3, 3, 54, 44);
    });

    mk('gear', 80, 80, g => {                                            // fundo: quase silhueta
      g.fillStyle(0x15151b, 1);
      for (let i = 0; i < 8; i++) {
        const a = i * Math.PI / 4;
        g.fillRect(40 + Math.cos(a) * 34 - 5, 40 + Math.sin(a) * 34 - 5, 10, 10);
      }
      g.fillCircle(40, 40, 32);
      g.lineStyle(0.8, 0x30303a, 1);
      g.strokeCircle(40, 40, 32); g.strokeCircle(40, 40, 21);
      g.fillStyle(0x0b0b10, 1); g.fillCircle(40, 40, 10);
      g.lineStyle(0.8, 0x30303a, 1); g.strokeCircle(40, 40, 10);
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
      this.add.image(620, 130, 'gear').setDepth(0).setScrollFactor(0.6).setScale(1.2 * AS),
      this.add.image(1560, 100, 'gear').setDepth(0).setScrollFactor(0.6).setScale(0.8 * AS),
      this.add.image(2380, 150, 'gear').setDepth(0).setScrollFactor(0.6).setScale(AS),
      this.add.image(3050, 110, 'gear').setDepth(0).setScrollFactor(0.6).setScale(1.4 * AS)
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
    const crate = this.add.image(1600, GROUND_Y - 25, 'crate').setDepth(3).setScale(AS);
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
    this.gepeto = this.add.image(1000, GROUND_Y - 29, 'gepeto').setDepth(4).setScale(AS);

    /* portas e itens */
    this.door1 = this.add.image(1390, GROUND_Y - 61, 'door').setDepth(5).setScale(AS);
    this.physics.add.existing(this.door1, true); this.solids.push(this.door1);
    this.door3 = this.add.image(3310, GROUND_Y - 61, 'door').setDepth(5).setScale(AS);
    this.physics.add.existing(this.door3, true); this.solids.push(this.door3);

    this.add.rectangle(2480, GROUND_Y - 14, 46, 28, 0x30303a).setDepth(3);
    this.add.rectangle(2480, GROUND_Y - 30, 54, 6, 0x44444e).setDepth(3);
    this.earItem = this.add.image(2480, GROUND_Y - 52, 'ear').setDepth(5).setScale(AS);
    this.tweens.add({ targets: this.earItem, y: GROUND_Y - 60, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    this.pipes = [2750, 2950, 3150].map(x => {
      const p = this.add.image(x, GROUND_Y - 75, 'pipe').setDepth(3).setScale(AS);
      p.px = x; return p;
    });
    this.tickPipe = this.pipes[Math.floor(Math.random() * 3)];

    this.add.rectangle(3560, 260, 120, 560, 0x3a3628, 0.35).setDepth(1);      // luz do fim

    /* ---------- robô: física + corpo segmentado ---------- */
    this.robot = this.physics.add.image(120, GROUND_Y - 40, 'r_torso').setVisible(false);
    this.robot.body.setSize(26, 46);
    this.physics.add.collider(this.robot, this.solids);

    this.armL = this.add.image(-12, -10, 'r_arm').setOrigin(.5, .08).setScale(AS);
    this.legL = this.add.image(-5, 7, 'r_leg').setOrigin(.5, .08).setScale(AS);
    this.torsoImg = this.add.image(0, -1, 'r_torso').setScale(AS);
    this.legR = this.add.image(5, 7, 'r_leg').setOrigin(.5, .08).setScale(AS);
    this.armR = this.add.image(12, -10, 'r_arm').setOrigin(.5, .08).setScale(AS);
    this.headImg = this.add.image(0, -20, 'r_head').setScale(AS);
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
    this.marker = this.add.image(0, 0, 'mark').setDepth(60).setVisible(false).setScale(AS);
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

