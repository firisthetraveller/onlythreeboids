# ThreeTemplate

With this template, you can easily create a project using Three.js.
We use here the bundler Vite, and ESLint as the linter.

## Installation

```sh
npm install
```
should put in your project folder everything necessary inside `/node_modules`.

## Change linter

```sh
npx eslint --init
```
This command should prompt you your coding style and save it either as a Javascript file / JSON / other.
This template comes with a JSON file (`.eslintrc.json`) that you can change or remove if necessary.

## Starting the development server

```sh
npx vite
```
After using this command, you can preview your website using the link given in the terminal.
Other commands are available while the server is running.

## Using boids as a module
- Copy `boids.js` and `tools.js` in the same directory.
- Write this line in your Javascript file.
```js
import BoidEnvironment from './<directory>/boids';
// Replace <directory> path with the one you selected just before.
```

- Add them to your scene.
```js
// Boids
let boidEnvironment = new BoidEnvironment();
scene.add(boidEnvironment.anchor);
```

- Before starting the render loop :
```js
// Boids
boidEnvironment.create();
```

- In your animation render callback :
```js
boidEnvironment.update();
boidEnvironment.render();
```