import Phaser from 'phaser';
import ko from 'knockout';
import options from './assets/options.json';

let previewScene;
let previewIndex = 0;

let tileScene;

let crop = document.createElement('canvas');
crop.width = 64;
crop.height = 64;
let cropContext = crop.getContext('2d');

const bgColor = ko.observable('ffffff');
const solidColor = ko.observable('ffffff');
const randomColor = ko.observable('ffffff');
const topColor = ko.observable('ffffff');
const easyColor = ko.observable('ffffff');
const attrColor = ko.observable('ffffff');

ko.applyBindings({bgColor, solidColor, randomColor, topColor, easyColor, attrColor});

bgColor.subscribe((newValue) => {
    if (!tileScene) {
        return;
    }
    let color = Number('0x' + newValue);
    tileScene.bg.tint = color;
    tileScene.checkeredbg.tint = color;
    tileScene.randombg.tint = color;
    renderPreview();
});

solidColor.subscribe((newValue) => {
    if (!tileScene) {
        return;
    }
    let color = Number('0x' + newValue);
    tileScene.advanced.tint = color;
    tileScene.checkeredfill.tint = color;
    renderPreview();
});

randomColor.subscribe((newValue) => {
    if (!tileScene) {
        return;
    }
    let color = Number('0x' + newValue);
    tileScene.randomfill.tint = color;
    renderPreview();
});

topColor.subscribe((newValue) => {
    if (!tileScene) {
        return;
    }
    let color = Number('0x' + newValue);
    tileScene.topping.tint = color;
    renderPreview();
});

easyColor.subscribe((newValue) => {
    if (!tileScene) {
        return;
    }
    let color = Number('0x' + newValue);
    tileScene.easy.tint = color;
    renderPreview();
});

attrColor.subscribe((newValue) => {
    if (!tileScene) {
        return;
    }
    let color = Number('0x' + newValue);
    tileScene.attributes.tint = color;
    renderPreview();
});

function randomizeColors() {
    let palette = options.colors[Math.floor(Math.random() * options.colors.length)].split('-');
    bgColor(palette.splice(Math.floor(Math.random() * palette.length), 1));
    solidColor(palette.splice(Math.floor(Math.random() * palette.length), 1));
    randomColor(palette.splice(Math.floor(Math.random() * palette.length), 1));
    topColor(palette.splice(Math.floor(Math.random() * palette.length), 1));
    easyColor((Math.random() > .5) ? randomColor() : topColor());
    attrColor(palette.splice(Math.floor(Math.random() * palette.length), 1));
}

let renderTO = 0;
function renderPreview() {
    clearTimeout(renderTO);
    renderTO = setTimeout(function () {
        if (!previewScene || !tileset) {
            return;
        }
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
    }, 500);
}

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
            this[option] = this.add.image(32, 32, options[option][0]);
        }
    });

    let button = document.getElementById('generate-button');
    button.addEventListener('click', () => {
        randomizeColors();
        this.checkeredbg.setTexture(options.checkeredbg[Math.floor(Math.random() * options.checkeredbg.length)]);
        this.randombg.setTexture(options.randombg[Math.floor(Math.random() * options.randombg.length)]);
        this.advanced.setTexture(options.advanced[Math.floor(Math.random() * options.advanced.length)]);
        this.easy.setTexture(options.easy[Math.floor(Math.random() * options.easy.length)]);
        this.checkeredfill.setTexture(options.checkeredfill[Math.floor(Math.random() * options.checkeredfill.length)]);
        this.randomfill.setTexture(options.randomfill[Math.floor(Math.random() * options.randomfill.length)]);
        this.topping.setTexture(options.topping[Math.floor(Math.random() * options.topping.length)]);
        this.attributes.setTexture(options.attributes[Math.floor(Math.random() * options.attributes.length)]);
    });
    tileScene = this;
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
    this.load.image('tiles', 'assets/tiles.png');
    this.load.tilemapTiledJSON('map', 'assets/map.json');
}

function createPreview() {
    this.map = this.make.tilemap({ key: 'map' });
    this.tiles = this.map.addTilesetImage('tiles', 'tiles');
    this.layer = this.map.createDynamicLayer(0, this.tiles, 0, 0);
    previewScene = this;
}
