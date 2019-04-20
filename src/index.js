import Phaser from 'phaser';
import tiles from "./assets/tiles.png";

const config = {
    type: Phaser.AUTO,
    width: 512,
    height: 512,
    scene: {
        preload: preload,
        create: create
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('tiles', tiles);
}

function create() {
    const logo = this.add.image(32, 32, 'tiles');
}
