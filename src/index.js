import Phaser from 'phaser';
import tiles from "./assets/tiles.png";

let previewScene;
let previewIndex = 0;

const tilesetConfig = {
    type: Phaser.CANVAS,
    parent: 'tileset',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.NONE,
        width: 64,
        height: 64,
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
    const logo = this.add.image(32, 32, 'tiles');
    let button = document.getElementById('generate-button');
    button.addEventListener('click', () => {
        console.log(this.sys.canvas.toDataURL());
        if (previewScene) {
            previewIndex++;
            let previewName = 'tiles' + previewIndex;
            previewScene.textures.addBase64(previewName, this.sys.canvas.toDataURL());
            setTimeout(() => {

                console.log(previewScene.add.image(32, 32, previewName));
                // destroy old textures
            }, 500);
        }
    });
}

const previewConfig = {
    type: Phaser.CANVAS,
    parent: 'preview',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.NONE,
        width: 128,
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
    //this.load.image('tiles', tiles);
}

function createPreview() {
    //const logo = this.add.image(32, 32, 'tiles');
}
