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

    /* -- elenco do Ato 1 -- */
    mk('mulher', 30, 56, g => {                                          // moradora: xale e lampião
      g.fillStyle(DARK_N, 1);
      g.fillTriangle(15, 18, 3, 52, 27, 52);                             // saia/xale
      g.fillStyle(FILL_N, 1); g.fillCircle(15, 10, 6.6);                 // cabeça
      hatch(g, 16, 22, 9, 26, 2.4);
      line(g, 0.9);
      g.strokeCircle(15, 10, 6.6);
      g.strokeTriangle(15, 18, 3, 52, 27, 52);
      line(g, 0.6); g.lineBetween(8, 15, 22, 15);                        // gola do xale
      g.lineBetween(24, 26, 27.5, 34);                                   // braço do lampião
      g.fillStyle(0x3f3a2c, 1); g.fillCircle(27.5, 37, 3.4);             // lampião: luz, não interação
      line(g, 0.6); g.strokeCircle(27.5, 37, 3.4);
    });

    mk('homem', 28, 56, g => {                                           // transeunte: sobretudo e chapéu
      g.fillStyle(DARK_N, 1);
      g.fillRoundedRect(7, 17, 15, 27, { tl: 4, tr: 4, bl: 1, br: 1 });   // sobretudo
      g.fillRect(9.5, 43, 4.5, 13); g.fillRect(15, 43, 4.5, 13);          // pernas
      g.fillStyle(FILL_N, 1); g.fillCircle(14.5, 10, 6);                  // cabeça
      g.fillStyle(DARK_N, 1);
      g.fillRect(7.5, 5.5, 14, 2.6); g.fillRect(10.5, 1.5, 8, 4.5);       // chapéu
      hatch(g, 15, 20, 7, 22, 2.4);
      line(g, 0.9);
      g.strokeCircle(14.5, 10, 6);
      g.strokeRoundedRect(7, 17, 15, 27, { tl: 4, tr: 4, bl: 1, br: 1 });
      g.strokeRect(9.5, 43, 4.5, 13); g.strokeRect(15, 43, 4.5, 13);
      g.strokeRect(7.5, 5.5, 14, 2.6); g.strokeRect(10.5, 1.5, 8, 4.5);
      line(g, 0.55); g.lineBetween(14.5, 18, 14.5, 42);                   // fecho do sobretudo
    });

    mk('detetive', 30, 62, g => {                                        // o Detetive: observa, não corre
      g.fillStyle(DARK_N, 1);
      g.fillRoundedRect(7, 18, 16, 32, { tl: 4, tr: 4, bl: 1, br: 1 });   // sobretudo comprido
      g.fillRect(9.5, 49, 4.5, 13); g.fillRect(16, 49, 4.5, 13);
      g.fillStyle(FILL_N, 1); g.fillCircle(15, 10.5, 6);
      g.fillStyle(DARK_N, 1);
      g.fillRect(7.5, 6, 15, 2.6); g.fillRect(10.5, 1.5, 9, 5);           // chapéu de aba
      hatch(g, 15, 21, 8, 27, 2.3);
      line(g, 0.9);
      g.strokeCircle(15, 10.5, 6);
      g.strokeRoundedRect(7, 18, 16, 32, { tl: 4, tr: 4, bl: 1, br: 1 });
      g.strokeRect(9.5, 49, 4.5, 13); g.strokeRect(16, 49, 4.5, 13);
      g.strokeRect(7.5, 6, 15, 2.6); g.strokeRect(10.5, 1.5, 9, 5);
      line(g, 0.55);
      g.lineBetween(15, 19, 15, 48);
      g.lineBetween(23, 27, 27, 34);                                     // braço do lampião
      g.fillStyle(0x3f3a2c, 1); g.fillCircle(27, 37.5, 3.6);
      line(g, 0.6); g.strokeCircle(27, 37.5, 3.6);
    });

    mk('sheriff', 32, 60, g => {                                         // o Sheriff: corpo de campo, cassetete
      g.fillStyle(DARK_N, 1);
      g.fillRoundedRect(6, 17, 20, 28, { tl: 5, tr: 5, bl: 1, br: 1 });   // tronco largo
      g.fillRect(9, 44, 5.5, 16); g.fillRect(17.5, 44, 5.5, 16);
      g.fillStyle(FILL_N, 1); g.fillCircle(16, 10, 6.2);
      g.fillStyle(DARK_N, 1);
      g.fillRect(7.5, 5.5, 17, 2.8); g.fillRect(11, 1, 10, 5);
      hatch(g, 17, 20, 8, 23, 2.2);
      line(g, 1);
      g.strokeCircle(16, 10, 6.2);
      g.strokeRoundedRect(6, 17, 20, 28, { tl: 5, tr: 5, bl: 1, br: 1 });
      g.strokeRect(9, 44, 5.5, 16); g.strokeRect(17.5, 44, 5.5, 16);
      g.strokeRect(7.5, 5.5, 17, 2.8); g.strokeRect(11, 1, 10, 5);
      line(g, 0.7);
      g.lineBetween(26, 24, 30, 42);                                     // cassetete na mão
      g.fillStyle(LINE_N, .9); g.fillCircle(11.5, 23, 1.1);              // distintivo
    });

    mk('ladrao', 28, 54, g => {                                          // o Bom Ladrão: capuz, magro, sem chapéu
      g.fillStyle(DARK_N, 1);
      g.fillTriangle(14, 4, 4, 22, 24, 22);                              // capuz
      g.fillRoundedRect(7, 20, 14, 24, { tl: 3, tr: 3, bl: 1, br: 1 });
      g.fillRect(9.5, 43, 4, 11); g.fillRect(15, 43, 4, 11);
      g.fillStyle(FILL_N, 1); g.fillCircle(14, 14, 4.6);                 // rosto na sombra do capuz
      hatch(g, 15, 23, 6, 19, 2.2);
      line(g, 0.9);
      g.strokeTriangle(14, 4, 4, 22, 24, 22);
      g.strokeRoundedRect(7, 20, 14, 24, { tl: 3, tr: 3, bl: 1, br: 1 });
      g.strokeRect(9.5, 43, 4, 11); g.strokeRect(15, 43, 4, 11);
      line(g, 0.55); g.lineBetween(21, 26, 25, 33);                      // braço estendido: ele oferece
    });

    mk('bracos', 26, 26, g => {                                          // Braços N1: par de bielas
      g.lineStyle(1.3, AMBER_N, 1);
      [9, 17].forEach(x => {
        g.strokeRoundedRect(x - 2.6, 4, 5.2, 12, 2.2);
        g.strokeCircle(x, 19.5, 3.4);
        g.lineBetween(x, 16, x, 16.2);
      });
      g.lineStyle(0.8, AMBER_N, .7); g.lineBetween(9, 10, 17, 10);
    });

    mk('alavanca', 20, 34, g => {                                        // alavanca: exige Braços
      g.fillStyle(DARK_N, 1); g.fillRoundedRect(5, 22, 10, 11, 2);
      line(g, 0.9); g.strokeRoundedRect(5, 22, 10, 11, 2);
      g.lineStyle(1.4, AMBER_N, 1); g.lineBetween(10, 22, 15, 4);
      g.fillStyle(AMBER_N, 1); g.fillCircle(15, 3, 2.6);
    });

    mk('grade', 40, 14, g => {                                           // a descida para os Undergrounds
      g.fillStyle(0x07070a, 1); g.fillRect(2, 3, 36, 11);
      line(g, 0.9); g.strokeRect(2, 3, 36, 11);
      line(g, 0.6);
      for (let x = 7; x < 38; x += 5) g.lineBetween(x, 3, x, 14);
    });

    mk('crianca', 20, 36, g => {                                         // criança: a rua tem quem ainda não aprendeu a temer
      g.fillStyle(DARK_N, 1);
      g.fillRoundedRect(5, 13, 10, 15, { tl: 3, tr: 3, bl: 1, br: 1 });
      g.fillRect(6.5, 27, 3.2, 9); g.fillRect(10.5, 27, 3.2, 9);
      g.fillStyle(FILL_N, 1); g.fillCircle(10, 7.5, 5.4);
      line(g, 0.85);
      g.strokeCircle(10, 7.5, 5.4);
      g.strokeRoundedRect(5, 13, 10, 15, { tl: 3, tr: 3, bl: 1, br: 1 });
      g.strokeRect(6.5, 27, 3.2, 9); g.strokeRect(10.5, 27, 3.2, 9);
    });

    mk('boca', 26, 26, g => {                                            // Boca N1: corneta de gramofone no lixo
      g.fillStyle(DARK_N, 1);
      g.fillTriangle(4, 5, 4, 21, 20, 13);                               // pavilhão
      g.fillRoundedRect(19, 11, 5, 4, 1.4);                              // tubo
      g.lineStyle(1.1, AMBER_N, 1);
      g.strokeTriangle(4, 5, 4, 21, 20, 13);
      g.strokeRoundedRect(19, 11, 5, 4, 1.4);
      g.lineStyle(0.7, AMBER_N, .75);
      g.strokeTriangle(7, 8, 7, 18, 17, 13);
    });

    mk('pernas', 26, 26, g => {                                          // Pernas N1: molas de amortecedor
      g.lineStyle(1.2, AMBER_N, 1);
      [8, 18].forEach(x => {
        g.lineBetween(x, 3, x, 5);
        for (let i = 0; i < 5; i++) {                                    // espiral da mola
          g.lineBetween(x - 3.4, 5 + i * 3.2, x + 3.4, 6.6 + i * 3.2);
          g.lineBetween(x + 3.4, 6.6 + i * 3.2, x - 3.4, 8.2 + i * 3.2);
        }
        g.lineBetween(x, 21, x, 23);
      });
    });

    mk('dog', 26, 16, g => {                                             // o Dog: o primeiro vínculo
      g.fillStyle(FILL_N, 1);
      g.fillRoundedRect(4, 4, 14, 7, 3);                                 // corpo
      g.fillCircle(20, 5.5, 4);                                          // cabeça
      g.fillStyle(DARK_N, 1);
      g.fillRect(5.5, 10, 2.2, 5); g.fillRect(9, 10, 2.2, 5);            // patas
      g.fillRect(13, 10, 2.2, 5); g.fillRect(16, 10, 2.2, 5);
      hatch(g, 8, 5, 8, 5, 2);
      line(g, 0.8);
      g.strokeRoundedRect(4, 4, 14, 7, 3);
      g.strokeCircle(20, 5.5, 4);
      line(g, 0.7);
      g.strokeRect(5.5, 10, 2.2, 5); g.strokeRect(9, 10, 2.2, 5);
      g.strokeRect(13, 10, 2.2, 5); g.strokeRect(16, 10, 2.2, 5);
      g.fillStyle(LINE_N, 1);
      g.fillTriangle(21, 1.5, 18.5, 4.5, 22.5, 4.5);                     // orelha em pé
      g.fillCircle(22.6, 6, .7);                                         // olho
      line(g, 0.8); g.lineBetween(4, 5, 1, 1.5);                         // rabo
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

  /* Marca um objeto como UI: sai da câmera do mundo, logo é imune ao zoom.
     Todo objeto criado depois do create() precisa passar por aqui, ou vai
     renderizar duas vezes. */
  ui(o) { this.uiObjs.push(o); if (this.cam) this.cam.ignore(o); return o; }

  /* Onde o robô fica na tela. Com UM olho ele fica no CENTRO, colado na
     borda da máscara: tudo que está à frente cai no escuro, e avançar vira
     um ato de fé — pular onde não se vê. Dar folga à frente aqui destruiria
     o Olho N1, porque a meia tela viraria só uma tela menor.
     Com o segundo olho a câmera volta a abrir caminho.
     screenX = W/2 + offset * zoom, então o offset vai em unidades de mundo. */
  camLead(zoom) { return (Parts.has('eye2') ? -240 : -26) / zoom; }

  /* Os sentidos vêm do registro de partes, nunca de booleanos soltos: a
     interface É o corpo do robô, então quem responde "enxerga?" é o corpo. */
  get hasBrain() { return Parts.has('brain'); }
  get hasEye()   { return Parts.has('eye'); }
  get hasEar()   { return Parts.has('ear'); }

  create() {
    this.makeTextures();
    this.cameras.main.setBackgroundColor('#0a0a0c');

    /* estado — parte vem do save, parte é da sessão */
    Save.load(); Parts.hydrate();
    this.pushed = Parts.has('eye');           // quem tem o olho já deu o empurrão
    this.doorOpen = Save.flag('doorOpen');
    this.ended = false; this.paused = false;
    this.checkpoint = Save.get('spawn') || { x: WORLD.spawn.x, y: WORLD.spawn.y };
    this.lastToast = 0; this.stepAcc = 0; this.movedFar = false; this.d1open = false;

    /* ---------- mundo: construído a partir de src/world.js ---------- */
    this.uiObjs = [];
    this.solids = [];

    // fundo por zona: cada decor desenha o que é seu
    WORLD.zones.forEach(z => {
      const x0 = Math.max(0, z.x0), x1 = Math.min(WORLD.w, z.x1);
      if (z.decor === 'lab') {
        for (let x = x0 + 100; x < x1; x += 260) {
          this.add.rectangle(x, 240, 14, 480, 0x14141a).setDepth(1);
          this.add.circle(x, 120, 2, 0x2a2a32).setDepth(1);
          this.add.circle(x, 360, 2, 0x2a2a32).setDepth(1);
        }
        const cable = this.add.graphics().setDepth(1);
        cable.lineStyle(2, 0x1c1c24);
        for (let x = x0 + 100; x < x1 - 200; x += 520) {
          cable.beginPath(); cable.moveTo(x, 60);
          for (let i = 0; i <= 20; i++) {
            const t = i / 20;
            cable.lineTo(x + t * 520, 60 + Math.sin(t * Math.PI) * 46);
          }
          cable.strokePath();
        }
      }
      if (z.decor === 'under') {
        /* Civilização antiga (GDD seção 3): colunas quebradas, teto baixo,
           raízes descendo. Nada de engrenagem — aqui é anterior à máquina. */
        const solo = 1400;
        this.add.rectangle((x0 + x1) / 2, solo - 300, x1 - x0, 26, 0x16161d).setDepth(1);   // teto
        for (let x = x0 + 90; x < x1; x += 210) {
          const alt = 190 + ((x * 7) % 70);
          this.add.rectangle(x, solo - alt / 2, 22, alt, 0x14141b).setDepth(1);             // coluna
          this.add.rectangle(x, solo - alt, 34, 10, 0x1c1c25).setDepth(1);                  // capitel
          this.add.rectangle(x, solo - 6, 30, 12, 0x1c1c25).setDepth(1);                    // base
        }
        const raiz = this.add.graphics().setDepth(1);
        raiz.lineStyle(2, 0x1a1a22);
        for (let x = x0 + 40; x < x1; x += 130) {
          raiz.beginPath(); raiz.moveTo(x, solo - 288);
          for (let i = 1; i <= 6; i++) raiz.lineTo(x + Math.sin(i * 1.7 + x) * 9, solo - 288 + i * 13);
          raiz.strokePath();
        }
      }
    });
    // faixas verticais de parallax só onde é interior
    for (let x = 40; x < 1500; x += 190) {
      this.add.rectangle(x, H / 2, 22, H, 0x0e0e13).setScrollFactor(0.35).setDepth(0);
    }

    this.gears = WORLD.gears.map(([x, y, s]) =>
      this.add.image(x, y, 'gear').setDepth(0).setScrollFactor(0.6).setScale(s * AS));

    /* sólidos */
    const solid = (x, y, w, h, color, depth) => {
      const r = this.add.rectangle(x, y, w, h, color === undefined ? 0x26262c : color);
      r.setDepth(depth === undefined ? 2 : depth);
      this.physics.add.existing(r, true);
      this.solids.push(r);
      return r;
    };
    WORLD.ground.forEach(([cx, w, y]) => {
      const top = y === undefined ? GROUND_Y : y;    // 3º valor = piso em outra altura
      /* Laje fina de propósito: com 60px de espessura, uma plataforma logo
         abaixo da rua fazia a cabeça do robô entrar na lateral da laje e ele
         encravava sem conseguir andar. Chão é superfície, não bloco. */
      solid(cx, top + 20, w, 40);
      this.add.rectangle(cx, top + 3, w, 6, 0x33333c).setDepth(2);        // acabamento
    });
    WORLD.walls.forEach(([x, y, w, h]) => solid(x, y, w, h));
    WORLD.platforms.forEach(([x, y, w]) => {
      solid(x, y, w, 12, 0x3a3a44, 3);
      this.add.rectangle(x, y - 7, w, 3, 0x50505a).setDepth(3);
    });

    /* cenário */
    WORLD.props.forEach(o => {
      let g;
      if (o.t === 'rect')        g = this.add.rectangle(o.x, o.y, o.w, o.h, o.c, o.a);
      else if (o.t === 'circle') g = this.add.circle(o.x, o.y, o.r, o.c, o.a);
      else if (o.t === 'tri')    g = this.add.triangle(o.x, o.y, ...o.pts, o.c, o.a);
      else return;
      g.setDepth(o.d || 0);
      if (o.sf !== undefined) g.setScrollFactor(o.sf);
    });
    WORLD.images.forEach(o => {
      const im = this.add.image(o.x, o.y, o.key).setDepth(o.d || 3).setScale(AS);
      if (o.solid) { this.physics.add.existing(im, true); this.solids.push(im); }
    });

    /* GEPETO — presente desde o dia 1, mascarado na 1ª jogada */
    this.gepeto = this.add.image(1000, GROUND_Y - 29, 'gepeto').setDepth(4).setScale(AS);

    /* portas */
    this.door1 = this.add.image(1390, GROUND_Y - 61, 'door').setDepth(5).setScale(AS);
    this.physics.add.existing(this.door1, true); this.solids.push(this.door1);
    this.door3 = this.add.image(3310, GROUND_Y - 61, 'door').setDepth(5).setScale(AS);
    this.physics.add.existing(this.door3, true); this.solids.push(this.door3);

    /* orelha */
    this.earItem = this.add.image(2480, GROUND_Y - 52, 'ear').setDepth(5).setScale(AS);
    this.tweens.add({ targets: this.earItem, y: GROUND_Y - 60, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    /* portão dos Undergrounds + alavanca: a primeira coisa do jogo que exige
       uma parte específica para ser usada. Sem braços não há força. */
    this.gate = this.add.rectangle(8320, 1340, 26, 120, 0x2b2b34).setDepth(5);
    this.physics.add.existing(this.gate, true); this.solids.push(this.gate);
    this.add.rectangle(8320, 1340, 14, 108, 0x1b1b23).setDepth(5);
    this.lever = this.add.image(8210, 1366, 'alavanca').setDepth(5).setScale(AS);
    this.gateOpen = Save.flag('gateOpen');
    if (this.gateOpen) { this.gate.y -= 118; this.gate.body.enable = false; this.lever.setAngle(-40); }

    /* partes espalhadas pelo mundo — as já adquiridas nem nascem */
    this.pickups = (WORLD.pickups || []).filter(d => !Parts.has(d.part)).map(d => {
      const o = this.add.image(d.x, d.y, d.key).setDepth(5).setScale(AS);
      this.tweens.add({ targets: o, y: d.y - 8, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      o.def = d;
      return o;
    });

    this.pipes = WORLD.pipes.map(x => {
      const p = this.add.image(x, GROUND_Y - 75, 'pipe').setDepth(3).setScale(AS);
      p.px = x; return p;
    });
    this.tickPipe = this.pipes[Math.floor(Math.random() * this.pipes.length)];

    /* ---------- robô: física + corpo segmentado ---------- */
    this.robot = this.physics.add.image(this.checkpoint.x, this.checkpoint.y, 'r_torso').setVisible(false);
    this.robot.body.setSize(26, 46);
    this.physics.add.collider(this.robot, this.solids);

    this.armL = this.add.image(-12, -10, 'r_arm').setOrigin(.5, .08).setScale(AS);
    this.legL = this.add.image(-5, 7, 'r_leg').setOrigin(.5, .08).setScale(AS);
    this.torsoImg = this.add.image(0, -1, 'r_torso').setScale(AS);
    this.legR = this.add.image(5, 7, 'r_leg').setOrigin(.5, .08).setScale(AS);
    this.armR = this.add.image(12, -10, 'r_arm').setOrigin(.5, .08).setScale(AS);
    this.headImg = this.add.image(0, -20, 'r_head').setScale(AS);
    this.robotC = this.add.container(this.checkpoint.x, this.checkpoint.y,
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

    /* ---------- câmeras ----------
       Duas, e por um motivo: a do mundo tem zoom por zona, a da UI fica
       travada em 1. Com uma só, o zoom escalaria junto as máscaras dos
       sentidos — e a máscara de meia tela é o efeito assinatura do jogo,
       não pode respirar com a câmera. */
    this.cam = this.cameras.main;
    this.cam.setBounds(0, 0, WORLD.w, WORLD.h);
    this.zone = zoneAt(this.robot.x);
    this.cam.setZoom(this.zone.zoom);
    this.cam.startFollow(this.robot, true, 0.15, 0.10);
    this.cam.setFollowOffset(this.camLead(this.zone.zoom), 0);
    /* Zero na horizontal: o robô tem de ficar CRAVADO no centro. Com folga,
       ele encosta na borda da máscara ao ser encurralado contra uma parede
       e o corpo entra na metade cega. Vertical generoso, para não balançar
       no pulo. */
    this.cam.setDeadzone(0, 190);

    this.uiCam = this.cameras.add(0, 0, W, H);
    this.uiCam.setName('ui');

    /* ---------- máscaras dos sentidos (espaço de tela) ---------- */
    this.coverL = this.ui(this.add.rectangle(0, 0, W / 2 + 2, H, 0x000000).setOrigin(0).setScrollFactor(0).setDepth(500));
    this.coverR = this.ui(this.add.rectangle(W / 2, 0, W / 2 + 2, H, 0x000000).setOrigin(0).setScrollFactor(0).setDepth(500));
    this.divider = this.ui(this.add.rectangle(W / 2, H / 2, 2, H, 0x2a2a30).setScrollFactor(0).setDepth(501).setAlpha(0));

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
      { x: 8210, r: 110, my: 1290, label: () => T('use'),
        on: () => !this.gateOpen && this.zone.decor === 'under', cb: () => this.pullLever() },
      ...this.pipes.map(p => ({
        x: p.px, r: 55, my: GROUND_Y - 170, label: () => T('use'),
        on: () => this.hasEye && !this.doorOpen, cb: () => this.tryPipe(p)
      }))
    ];

    /* separa as camadas: o que é UI já saiu da câmera do mundo; agora a
       câmera da UI deixa de ver tudo que é mundo. */
    const uiSet = new Set(this.uiObjs);
    this.uiCam.ignore(this.children.list.filter(o => !uiSet.has(o)));

    this.buildCrowd();
    this.initStory();

    /* jogo já em andamento: pula o prólogo às cegas e devolve os sentidos */
    if (Parts.has('eye')) this.resumeFromSave();
  }

  /* ---------- UI ---------- */
  buildUI() {
    const sf = o => this.ui(o.setScrollFactor(0));
    this.uiCX = W / 2; // centro da área visível (vira W/4 após o olho)

    this.thoughtTxt = sf(this.add.text(W / 2, 210, '', {
      fontFamily: FONT, fontSize: '26px', fontStyle: 'italic', color: '#74747c',
      align: 'center', wordWrap: { width: 640 }, lineSpacing: 10
    }).setOrigin(.5).setDepth(700)).setAlpha(0);

    // tutorial: embaixo, grande, discreto na cor
    this.hint = sf(this.add.text(W / 2, 498, '', {
      fontFamily: FONT, fontSize: '26px', color: '#5a5a64', letterSpacing: 6
    }).setOrigin(.5).setDepth(700));

    // diálogo de NPC: nome de quem fala + a linha
    this.sayWho = sf(this.add.text(W / 2, 404, '', {
      fontFamily: FONT, fontSize: '15px', color: '#6e6e78', letterSpacing: 5
    }).setOrigin(.5).setDepth(700)).setAlpha(0);
    this.sayTxt = sf(this.add.text(W / 2, 434, '', {
      fontFamily: FONT, fontSize: '24px', color: INK,
      align: 'center', wordWrap: { width: 400 }, lineSpacing: 8
    }).setOrigin(.5).setDepth(700)).setAlpha(0);

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
    this.ui(t1); this.ui(t2);
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
    this.time.delayedCall(2200, () => { Parts.acquire('brain'); this.banner('brainGet', 'brainDesc', 3600); });
    this.time.delayedCall(7400, () => this.thought(T('think1'), 3000));
    this.time.delayedCall(12200, () => this.thought(T('think2'), 3400));
    this.time.delayedCall(17600, () => this.thought(T('think3'), 3800));
    // a 1ª Lei, na morte
    this.time.delayedCall(23600, () => {
      const law = this.add.text(W / 2, H / 2 - 20, T('law'), {
        fontFamily: MONO, fontSize: '17px', color: '#b8b8c0', align: 'center',
        wordWrap: { width: 620 }, lineSpacing: 9
      }).setOrigin(.5).setScrollFactor(0).setDepth(710).setAlpha(0);
      this.ui(law);
      this.tweens.add({
        targets: law, alpha: 1, duration: 1500, yoyo: true, hold: 5600,
        onComplete: () => { law.destroy(); this.acquireEye(); }
      });
    });
  }

  acquireEye() {
    this.time.delayedCall(1200, () => {
      Parts.acquire('eye');
      this.headImg.setTexture('r_head_eye');
      this.tweens.add({ targets: this.coverL, alpha: 0, duration: 2800, ease: 'Sine.inOut' });
      this.tweens.add({ targets: this.cam.followOffset, x: this.camLead(this.zone.zoom), duration: 2800, ease: 'Sine.inOut' });
      this.tweens.add({ targets: this.divider, alpha: .6, duration: 2800 });
      this.time.delayedCall(1500, () => this.banner('eyeGet', 'eyeDesc', 3400));
      this.narrowUI();
      this.time.delayedCall(5200, () => {
        this.hint.setText(T('hintJump')).setAlpha(0);
        this.tweens.add({ targets: this.hint, alpha: .85, duration: 700, yoyo: true, hold: 3400, onComplete: () => this.hint.setText('') });
      });
    });
  }

  acquireEar() {
    if (!Parts.acquire('ear')) return;
    this.earItem.destroy();
    Snd.enable();
    this.time.delayedCall(600, () => Snd.chime());
    this.banner('earGet', 'earDesc', 3400);
    vib([30, 40, 30]);
    this.startTick();
  }

  /* ---------- história: runtime dos beats (src/story.js) ----------
     O dado descreve, isto interpreta. Nenhum beat mexe em scenes.js. */
  initStory() {
    this.npc = {};                 // id -> GameObject em cena
    this.follower = null;          // quem anda atrás do robô
    this.beatBusy = false;
    this.followBob = 0;
    // flags do save: beat já vivido não repete, nem em outra sessão
    this.beats = STORY.map(b => ({ ...b, done: Save.flag(b.flag) }));
  }

  /* Objeto de mundo criado depois do create() precisa sair da câmera da UI,
     senão renderiza nas duas. */
  world(o) { if (this.uiCam) this.uiCam.ignore(o); return o; }

  checkBeats(x) {
    if (this.beatBusy || this.ended || this.paused) return;
    for (const b of this.beats) {
      if (b.done) continue;
      if (b.needs && !b.needs.every(p => Parts.has(p))) continue;
      /* Faixa, não limiar. O mapa é um eixo X só, e os Undergrounds ficam à
         DIREITA da cidade: com gatilho de "passou de X", todo beat do Ato 1
         ainda pendente disparava debaixo da terra. `xMax` fecha a cena na
         área onde ela acontece. Sem `at`, o gatilho é só `needs`. */
      if (b.at && (x < b.at.x || (b.at.xMax !== undefined && x > b.at.xMax))) continue;
      b.done = true;
      Save.setFlag(b.flag);
      this.beatBusy = true;
      this.runSteps(b.steps, 0);
      return;
    }
  }

  runSteps(steps, i) {
    if (this.ended) { this.beatBusy = false; return; }
    if (i >= steps.length) { this.beatBusy = false; return; }
    const s = steps[i];
    let d = s.ms || 0;

    if (s.think !== undefined) {
      d = s.ms || 3400;
      this.thought(T(s.think), d);
    } else if (s.say) {
      /* Regra do GDD, não estilo: a mandíbula é sólida até a Boca N1. Se um
         beat tentar dar voz ao robô antes disso, o passo é engolido e o
         aviso aparece no console — melhor falhar barulhento na autoria do
         que quebrar o personagem em silêncio. */
      if (s.say.who === ROBOT_SPEAKER && !Parts.has('mouth')) {
        console.warn('story: o robô não tem boca; fala ignorada —', s.say.key);
      } else {
        this.say(s.say.who, s.say.key, s.ms || 2400);
      }
    } else if (s.spawn) {
      const o = s.spawn.phys
        ? this.world(this.physics.add.image(s.spawn.x, s.spawn.y, s.spawn.key).setDepth(9).setScale(AS))
        : this.world(this.add.image(s.spawn.x, s.spawn.y, s.spawn.key).setDepth(9).setScale(AS));
      if (s.spawn.phys) {
        /* setSize trabalha em pixels da TEXTURA e o corpo é multiplicado
           pela escala do sprite. Como as texturas são desenhadas em ART× e
           exibidas em AS, passar 20x12 aqui produziria um corpo de 5x3 —
           pequeno demais para pousar em plataforma, e o cachorro escorrega
           pelas quinas. Dividir por AS devolve o tamanho em pixels de tela. */
        o.body.setSize(20 / AS, 12 / AS, true);
        this.physics.add.collider(o, this.solids);   // anda no mesmo chão que o robô
      }
      o.setAlpha(0);
      this.tweens.add({ targets: o, alpha: 1, duration: 400 });
      this.npc[s.spawn.id] = o;
    } else if (s.move) {
      const o = this.npc[s.move.id];
      if (o) {
        o.setFlipX(s.move.x < o.x);
        this.tweens.add({ targets: o, x: s.move.x, duration: s.move.ms || 1200, ease: 'Sine.easeInOut' });
      }
    } else if (s.face) {
      const o = this.npc[s.face.id];
      if (o) o.setFlipX(s.face.dir < 0);
    } else if (s.exit) {
      const o = this.npc[s.exit.id];
      if (o) {
        this.tweens.add({ targets: o, alpha: 0, duration: 400, onComplete: () => o.destroy() });
        delete this.npc[s.exit.id];
      }
    } else if (s.setFlag) {
      /* Marca um instante DENTRO da cena. A flag do beat sobe quando ele
         começa; isto sobe na hora exata — o que permite, por exemplo, uma
         parte só aparecer no mundo depois de alguém oferecê-la. */
      Save.setFlag(s.setFlag);
    } else if (s.block) {
      /* Bloqueio invisível: quando a história diz que não dá para passar,
         não pode dar para passar. NPC não colide, então o funil precisa de
         um corpo de verdade — senão o jogador atravessa o Sheriff e a cena
         vira mentira. */
      const w = this.add.rectangle(s.block.x, GROUND_Y - 40, s.block.w || 26, 90, 0x000000, 0);
      this.physics.add.existing(w, true);
      this.solids.push(w);
      this.physics.add.collider(this.robot, w);
      this.world(w);
    } else if (s.panic) {
      this.panicCrowd();
    } else if (s.follow) {
      this.follower = this.npc[s.follow.id] || null;
    } else if (s.vib) {
      vib(s.vib);
    }

    this.time.delayedCall(d, () => this.runSteps(steps, i + 1));
  }

  /* Fala de NPC. Diferente de thought(): aquilo é a voz interna do robô,
     isto é alguém de fora — por isso tem nome de quem fala e não é itálico. */
  say(whoKey, lineKey, dur) {
    const cx = this.uiCX;
    this.sayWho.setX(cx).setText(T(whoKey));
    this.sayTxt.setX(cx).setText(T(lineKey));
    /* Zerar o alpha antes de animar não é detalhe: o yoyo volta para o valor
       INICIAL do tween. Se uma fala substitui outra ainda visível, o tween
       nasce em alpha 1 e o yoyo devolve a 1 — a legenda trava na tela. */
    this.tweens.killTweensOf([this.sayWho, this.sayTxt]);
    this.sayWho.setAlpha(0); this.sayTxt.setAlpha(0);
    this.tweens.add({
      targets: [this.sayWho, this.sayTxt], alpha: 1, duration: 260,
      yoyo: true, hold: dur || 2400
    });
  }

  /* O companheiro anda atrás, nunca à frente: quem guia é o jogador.
     Ele tem corpo de verdade — cai, colide e PULA para acompanhar em
     plataforma. Um cachorro que atravessa parede não é companhia, é HUD. */
  updateFollower(dt) {
    const f = this.follower;
    if (!f || !f.scene || !f.body) return;
    const r = this.robot;
    const behind = this.robotC.scaleX < 0 ? 56 : -56;
    const acima = (r.y - f.y) < -34;
    /* Andando no plano ele fica ATRÁS (quem guia é o jogador). Mas para
       subir precisa mirar embaixo do robô: o ponto atrás costuma ficar fora
       da plataforma, e aí ele pula a vida inteira sem nunca alcançar. */
    const target = acima ? r.x : r.x + behind;
    const dx = target - f.x;
    const grounded = f.body.blocked.down;

    const perto = acima ? 8 : 16;              // subindo, precisa de pontaria melhor
    if (Math.abs(dx) > perto) {
      f.setVelocityX(Math.sign(dx) * 168);
      f.setFlipX(dx < 0);
    } else if (grounded) {
      f.setVelocityX(0);
    }

    /* pula quando o robô está acima, ou quando esbarrou em degrau/parede */
    const travado = f.body.blocked.left || f.body.blocked.right;
    if (grounded && (acima || (travado && Math.abs(dx) > 16))) f.setVelocityY(-470);

    /* perdeu o robô de vista (caiu num vão, ficou preso): reaparece atrás.
       Companheiro nunca vira problema de gerenciamento. */
    if (f.y > WORLD.h + 200 || Math.abs(r.x - f.x) > 900) {
      f.setPosition(target, r.y - 24).setVelocity(0, 0);
    }
  }

  /* ---------- multidão da rua ----------
     A avenida precisa estar VIVA antes do grito, senão a fuga não custa
     nada: só se perde uma rua cheia. */
  buildCrowd() {
    /* A rua já esvaziou nesta partida: continuar de um save posterior ao
       grito não pode repovoar a avenida — seria desfazer a cena. */
    if (Save.flag('st_cidade_monstro')) { this.crowd = []; return; }
    this.crowd = (WORLD.crowd || []).map(c => {
      const o = this.world(this.add.image(c.x, GROUND_Y - (c.key === 'crianca' ? 18 : 28), c.key)
        .setDepth(c.d || 7).setScale(AS * (c.s || 1)));
      o.setFlipX(c.dir < 0);
      o.homeX = c.x; o.dir = c.dir || 1; o.state = 'idle'; o.wait = Math.random() * 2000;
      return o;
    });
  }

  updateCrowd(dt) {
    if (!this.crowd) return;
    for (const o of this.crowd) {
      if (!o.scene) continue;
      if (o.state === 'idle') {
        // vaivém curto: gente parada em ponto fixo parece cenário, não gente
        o.wait -= dt;
        if (o.wait <= 0) { o.dir *= -1; o.wait = 1800 + Math.random() * 2600; o.setFlipX(o.dir < 0); }
        o.x += o.dir * 0.012 * dt;
        if (Math.abs(o.x - o.homeX) > 46) { o.dir *= -1; o.setFlipX(o.dir < 0); }
      } else if (o.state === 'flee') {
        o.x += o.fleeDir * 0.34 * dt;
      }
    }
  }

  /* O grito espalha. Cada um foge para o lado oposto ao robô — ninguém
     precisa dizer nada, a rua esvaziando já é a fala. */
  panicCrowd() {
    if (!this.crowd) return;
    this.crowd.forEach((o, i) => {
      if (!o.scene || o.state === 'flee') return;
      this.time.delayedCall(120 * i + Math.random() * 300, () => {
        if (!o.scene) return;
        o.state = 'flee';
        o.fleeDir = o.x >= this.robot.x ? 1 : -1;
        o.setFlipX(o.fleeDir < 0);
        this.tweens.add({ targets: o, alpha: 0, duration: 2200, delay: 900,
          onComplete: () => o.destroy() });
      });
    });
  }

  /* Com o olho nível 1, só metade da tela existe: a UI migra para o centro
     dessa metade E encolhe a quebra de linha. Sem encolher, o texto vaza
     para o lado cego — que é justamente o que o jogador não pode ler. */
  narrowUI() {
    this.uiCX = W / 4;
    [this.thoughtTxt, this.toastTxt, this.hint, this.actionHint,
     this.sayWho, this.sayTxt].forEach(t => t.setX(W / 4));
    this.thoughtTxt.setWordWrapWidth(400);
    this.toastTxt.setWordWrapWidth(400);
  }

  /* A alavanca é o teste do corpo: sem Braços ele encosta e não move.
     A recusa é informação, não obstáculo — ensina o que falta. */
  pullLever() {
    if (this.gateOpen) return;
    if (!Parts.has('arms')) { vib(90); Snd.buzz(); this.toast(T('leverNoArms'), 2600); return; }
    this.gateOpen = true;
    Save.setFlag('gateOpen');
    Snd.clank(); vib([40, 40, 90]);
    this.tweens.add({ targets: this.lever, angle: -40, duration: 420 });
    this.tweens.add({ targets: this.gate, y: this.gate.y - 118, duration: 1100, ease: 'Quad.out' });
    this.time.delayedCall(1100, () => { this.gate.body.enable = false; });
    this.toast(T('leverOpen'), 2600);
  }

  /* Aquisição genérica de parte. Toda parte entra por aqui: o banner, o
     custo e a persistência ficam num lugar só, e beat novo não reimplementa
     aquisição. */
  acquirePart(o) {
    const d = o.def;
    if (!Parts.acquire(d.part)) return;
    this.pickups = this.pickups.filter(x => x !== o);
    o.destroy();
    if (Parts.has('ear')) { Snd.chime(); }
    vib([30, 60, 30]);
    this.banner(d.part + 'Get', d.part + 'Desc', 3800);
  }

  /* O tique-taque do puzzle. Separado porque o "continuar" precisa religá-lo
     sem repetir a cena de aquisição da orelha. */
  startTick() {
    if (this.tickTimer) return;
    this.tickTimer = this.time.addEvent({
      delay: 800, loop: true,
      callback: () => {
        if (this.doorOpen) return;
        const pan = (this.tickPipe.px - this.robot.x) / 500;
        if (Math.abs(this.tickPipe.px - this.robot.x) < 700) Snd.tick(pan);
      }
    });
  }

  /* Continuar: o save tem partes, então o prólogo às cegas já foi vivido.
     Reconstrói o estado em vez de repetir a cena — o prólogo é único, e só
     se revê no replay pós-créditos (GDD 2.2b). */
  resumeFromSave() {
    this.hammerTimer.remove();
    this.hint.setText('');
    this.headImg.setTexture('r_head_eye');
    this.coverL.setAlpha(0);
    this.divider.setAlpha(.6);
    this.narrowUI();
    // Gepeto caído: o mundo lembra do que aconteceu, mesmo que o robô não
    this.gepeto.setPosition(1225, GROUND_Y - 12).setAngle(90);
    this.d1open = true;
    this.door1.y -= 118; this.door1.body.enable = false;
    if (Parts.has('ear')) { this.earItem.destroy(); Snd.enable(); this.startTick(); }
    if (this.doorOpen) { this.door3.y -= 118; this.door3.body.enable = false; }
    this.toast(T('resumed'), 2200);
  }

  tryPipe(p) {
    if (this.doorOpen) return;
    if (p === this.tickPipe && this.hasEar) {
      this.doorOpen = true;
      Save.setFlag('doorOpen');
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
        this.ui(this.add.rectangle(W / 2, H / 2, W, H, 0x000000, .78).setScrollFactor(0).setDepth(d)),
        this.ui(this.add.text(W / 2, 150, T('pause'), { fontFamily: FONT, fontSize: '34px', color: INK, letterSpacing: 8 }).setOrigin(.5).setScrollFactor(0).setDepth(d + 1))
      ];
      const btn = (y, label, cb) => {
        const t = this.add.text(W / 2, y, label, {
          fontFamily: FONT, fontSize: '20px', color: AMBER, letterSpacing: 3,
          backgroundColor: '#16161a', padding: { x: 26, y: 10 }
        }).setOrigin(.5).setScrollFactor(0).setDepth(d + 1).setInteractive({ useHandCursor: true });
        this.ui(t); t.on('pointerdown', cb); this.pauseUI.push(t); return t;
      };
      btn(240, T('resume'), () => this.togglePause());
      btn(302, T('restart'), () => { Save.reset(); Parts.reset(); this.closePause(); this.paused = false; this.time.paused = false; this.scene.restart(); });
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

  /* Quebra de ato. A grade não encerra o jogo: ela é o corte entre o Ato 1
     e o Ato 2. `finished` continua sendo só do fim do jogo inteiro — é o
     gatilho do replay do prólogo (GDD 2.2b) e não pode disparar aqui. */
  actBreak() {
    if (this.ended) return;
    this.ended = true;
    Save.setFlag('ato1');
    const d = 950;
    const bg = this.ui(this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0).setScrollFactor(0).setDepth(d));
    this.tweens.add({ targets: bg, fillAlpha: 1, duration: 1600 });
    this.time.delayedCall(1800, () => {
      const t1 = this.ui(this.add.text(W / 2, 226, T('act1End'), { fontFamily: FONT, fontSize: '30px', color: DIM, letterSpacing: 8 }).setOrigin(.5).setScrollFactor(0).setDepth(d + 1).setAlpha(0));
      const t2 = this.ui(this.add.text(W / 2, 286, T('act2Title'), { fontFamily: FONT, fontSize: '38px', color: INK, letterSpacing: 10 }).setOrigin(.5).setScrollFactor(0).setDepth(d + 1).setAlpha(0));
      const t3 = this.ui(this.add.text(W / 2, 336, T('act2Sub'), { fontFamily: FONT, fontSize: '17px', color: '#6e6e78' }).setOrigin(.5).setScrollFactor(0).setDepth(d + 1).setAlpha(0));
      this.tweens.add({ targets: [t1, t2, t3], alpha: 1, duration: 1200, yoyo: true, hold: 3600,
        onComplete: () => {
          [t1, t2, t3].forEach(t => t.destroy());
          // corte: ele desce. A queda em si não se joga — é a virada de ato.
          const sp = WORLD.ato2Spawn;
          this.checkpoint = { x: sp.x, y: sp.y };
          Save.set('spawn', this.checkpoint);
          this.robot.setPosition(sp.x, sp.y).setVelocity(0, 0);
          this.robotC.setPosition(sp.x, sp.y);
          if (this.follower) this.follower.setPosition(sp.x - 50, sp.y).setVelocity(0, 0);
          this.zone = zoneAt(sp.x);
          this.cam.setZoom(this.zone.zoom);
          this.cam.setFollowOffset(this.camLead(this.zone.zoom), 0);
          this.ended = false;
          vib([200, 120, 60, 60, 200]);
          this.tweens.add({ targets: bg, fillAlpha: 0, duration: 2200, onComplete: () => bg.destroy() });
        } });
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

    /* Pernas N1 é a diferença entre alcançar e não alcançar — por isso o
       valor sai do registro de partes, não de uma constante. */
    if (jump && grounded) { r.setVelocityY(Parts.has('legs') ? -565 : -430); vib(15); }

    /* --- animação segmentada: dura, mas viva --- */
    const c = this.robotC;
    c.setPosition(r.x, r.y);

    /* zoom por zona: interior aproxima (o robô enche a sala), exterior afasta
       (a cidade é grande e ele é pequeno). A folga da câmera à frente é
       corrigida junto, senão o robô sai de quadro ao aproximar. */
    const z = zoneAt(r.x);
    if (z !== this.zone) {
      this.zone = z;
      this.cam.zoomTo(z.zoom, 1100, 'Sine.easeInOut');
      this.tweens.add({ targets: this.cam.followOffset, x: this.camLead(z.zoom), duration: 1100, ease: 'Sine.easeInOut' });
    }
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

    // partes espalhadas
    for (const o of this.pickups) {
      if (!o.scene) continue;
      if (o.def.needs && !o.def.needs.every(pt => Parts.has(pt))) continue;
      // parte que alguém entrega só existe depois da cena da entrega
      if (o.def.afterFlag && !Save.flag(o.def.afterFlag)) continue;
      if (Math.abs(r.x - o.x) < 34 && Math.abs(r.y - o.def.y) < 60) { this.acquirePart(o); break; }
    }

    // porta 3 trancada
    if (!this.doorOpen && r.x > 3250 && r.x < 3480 && time - this.lastToast > 3000) {
      this.lastToast = time;
      this.toast(this.hasEar ? T('doorEar') : T('doorNoEar'), 2600);
    }

    // checkpoints (src/world.js) — salvos, para o "continuar" cair aqui
    for (const cp of WORLD.checkpoints) {
      if (r.x > cp.at && this.checkpoint.x < cp.x) {
        this.checkpoint = { x: cp.x, y: cp.y };
        Save.set('spawn', this.checkpoint);
      }
    }

    // história e companheiro
    this.checkBeats(r.x);
    this.updateFollower(dt);
    this.updateCrowd(dt);

    // queda = remontagem (era lata: sem game over)
    if (r.y > WORLD.h + 120) {
      vib([120, 80, 120]);
      this.cameras.main.flash(300, 10, 10, 12);
      r.setPosition(this.checkpoint.x, this.checkpoint.y).setVelocity(0, 0);
      this.toast(T('remade'), 1800);
    }

    // fim
    /* Fim do Ato 1 na grade. Só depois da cena do Sheriff (é ela que empurra
       o robô para baixo) e nunca no meio de um beat, senão o ato termina por
       cima de uma fala. */
    if (!Save.flag('ato1') && Save.flag('st_ato1_sheriff') && !this.beatBusy && r.x > WORLD.finishX) this.actBreak();

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

