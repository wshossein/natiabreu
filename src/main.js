'use strict';
/* boot: espera i18n + fontes, depois sobe o Phaser */
function boot() {
  new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: W, height: H,
    backgroundColor: '#0a0a0c',
    physics: { default: 'arcade', arcade: { gravity: { y: 900 }, debug: false } },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    input: { activePointers: 4 },
    scene: [TitleScene, GameScene]
  });
}

const fontsReady = (document.fonts && document.fonts.ready)
  ? Promise.race([document.fonts.ready, new Promise(res => setTimeout(res, 1500))])
  : Promise.resolve();

Promise.all([fontsReady, I18N.load()]).then(boot);
