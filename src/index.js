import Phaser from 'phaser';
import options from './assets/options.json';

let previewScene;
let previewIndex = 0;
let crop = document.createElement('canvas');
crop.width = 64;
crop.height = 64;
let cropContext = crop.getContext('2d');

const tilesetConfig = {
    type: Phaser.AUTO,
    parent: 'tileset',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.NONE,
        width: 64,
        height: 65,
        zoom: 2
    },
    scene: {
        preload: preloadTileset,
        create: createTileset
    }
};

const tileset = new Phaser.Game(tilesetConfig);

function preloadTileset() {
    this.load.image('plainbg', 'assets/plainbg.png');
    //this.load.image('plainfg', 'assets/plainfg.png');
    Object.keys(options).forEach((option) => {
        if (option !== 'colors') {
            options[option].forEach((key) => {
                this.load.image(key, 'assets/' + key + '.png');
            });
        }
    });
}

function createTileset() {
    this.bg = this.add.image(32, 32, 'plainbg');
    Object.keys(options).forEach((option) => {
        if (option !== 'colors') {
            options[option].forEach((key) => {
                this[option] = this.add.image(32, 32, options[option][0]);
            });
        }
    });

    let button = document.getElementById('generate-button');
    button.addEventListener('click', () => {
        let palette = options.colors[Math.floor(Math.random() * options.colors.length)].split('-');
        let bgColor = Number('0x' + palette.splice(Math.floor(Math.random() * palette.length), 1));
        let easyColor = Number('0x' + palette.splice(Math.floor(Math.random() * palette.length), 1));
        let solidColor = Number('0x' + palette.splice(Math.floor(Math.random() * palette.length), 1));
        let topColor = Number('0x' + palette.splice(Math.floor(Math.random() * palette.length), 1));
        let randomColor = Number('0x' + palette.splice(Math.floor(Math.random() * palette.length), 1));
        this.bg.tint = bgColor;
        this.checkeredbg.setTexture(options.checkeredbg[Math.floor(Math.random() * options.checkeredbg.length)]);
        this.checkeredbg.tint = bgColor;
        this.randombg.setTexture(options.randombg[Math.floor(Math.random() * options.randombg.length)]);
        this.randombg.tint = bgColor;
        this.advanced.setTexture(options.advanced[Math.floor(Math.random() * options.advanced.length)]);
        this.advanced.tint = solidColor;
        this.easy.setTexture(options.easy[Math.floor(Math.random() * options.easy.length)]);
        this.easy.tint = easyColor;
        this.checkeredfill.setTexture(options.checkeredfill[Math.floor(Math.random() * options.checkeredfill.length)]);
        this.checkeredfill.tint = solidColor;
        this.randomfill.setTexture(options.randomfill[Math.floor(Math.random() * options.randomfill.length)]);
        this.randomfill.tint = randomColor;
        this.topping.setTexture(options.topping[Math.floor(Math.random() * options.topping.length)]);
        this.topping.tint = topColor;

        if (previewScene) {
            tileset.renderer.snapshot((image) => {
                cropContext.drawImage(image, 0, -1);
                previewIndex++;
                let previewName = 'tiles' + previewIndex;
                //previewScene.textures.addImage(previewName, image);
                let data = crop.toDataURL();
                previewScene.textures.addBase64(previewName, data);
                //document.body.appendChild(image);
                document.getElementById('export-button').setAttribute('href', data);
                setTimeout(() => {
                    previewScene.tiles.setImage(previewScene.textures.get(previewName));
                    // destroy old textures
                    if (previewScene.textures.exists('tiles' + (previewIndex - 1))) {
                        previewScene.textures.remove('tiles' + (previewIndex - 1));
                    }
                }, 500);
            });
        }
    });
}

const previewConfig = {
    type: Phaser.AUTO,
    parent: 'preview',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.NONE,
        width: 160,
        height: 128,
        zoom: 2
    },
    scene: {
        preload: preloadPreview,
        create: createPreview
    }
};

const preview = new Phaser.Game(previewConfig);

function preloadPreview() {
    previewScene = this;
    this.load.image('tiles', 'assets/tiles.png');
    this.load.tilemapTiledJSON('map', 'assets/map.json');
}

function createPreview() {
    this.map = this.make.tilemap({ key: 'map' });
    this.tiles = this.map.addTilesetImage('tiles', 'tiles');
    this.layer = this.map.createDynamicLayer(0, this.tiles, 0, 0);
}
