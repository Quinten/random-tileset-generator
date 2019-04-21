import Phaser from 'phaser';
import tiles from './assets/tiles.png';
import map from './assets/map.json';

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
    this.load.image('tiles', tiles);
}

function createTileset() {
    let logo = this.add.sprite(32, 32, 'tiles');
    let button = document.getElementById('generate-button');
    button.addEventListener('click', () => {
        logo.tint = Math.floor(Math.random() * 0xffffff);
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
                    //previewScene.logo.setTexture(previewName);
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
    this.load.image('tiles', tiles);
    this.load.tilemapTiledJSON('map', map);
}

function createPreview() {
    this.map = this.make.tilemap({ key: 'map' });
    this.tiles = this.map.addTilesetImage('tiles', 'tiles');
    this.layer = this.map.createDynamicLayer(0, this.tiles, 0, 0);
    //this.logo = this.add.image(32, 32, 'tiles');
}
