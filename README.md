# random-tileset-generator
Generate 8x8 tilesets

Demo: https://quinten.github.io/random-tileset-generator/

Also on itch.io: https://supernapie.itch.io/random-tileset-generator

Generated tileset license: [CC0](https://tldrlegal.com/license/creative-commons-cc0-1.0-universal)

### Adding patterns

Feel free to submit pull requests for patterns. Art must be drawn in white and grey tones, preferable the ones already used. (The colors are applied in code)

To make a clean PR: only submit the png asset in `src/assets` and change `src/assets/options.json` i will take care of generating and building the rest. See [this commit](https://github.com/Quinten/random-tileset-generator/commit/9bd653cbaa157ce8a2ba02b0e7664f0d57d4f076) as an example.

Do not touch files in `pub` or commit a modified `tiles.psd`.

### Messing with the code

(The usual npm and webpack stack)

Install node dependencies with npm

```
npm install
```

Run local dev server

```
npm start
```

Make a build

```
npm run build
```

The code is built with [Phaser 3](http://phaser.io/) and [Knockout](https://knockoutjs.com/)
