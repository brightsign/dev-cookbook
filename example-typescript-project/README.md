# TypeScript Template Project

This template directory holds all files needed to begin your BrightSign Typescript project. Use these BrightSign-recommended typescript workflows to make on-player development incredibly easy.

## Build Process

BrightSign uses [`tsc`](https://www.npmjs.com/package/tsc), [`tsup`](https://www.npmjs.com/package/tsup) and [`webpack`](https://www.npmjs.com/package/webpack) to build our typescript projects. These three build steps are combined into one npm command: `npm run build`. 

### Build Outputs

The build results will be compiled into two directories: `dist/` and `bin/`. The output of `tsup` is in `dist/` and the output of `webpack` is in `bin/`. This means that the code you want to deploy to the player is contained in `bin/`. 

### SD File Structure

```bash
SD .
+-- bundle.js
+-- autorun.brs
`-- misc
  +-- media.jpg
  +-- supportingData.json
```

__Uploading with the CLI__:

v1:

```
bsc putfile playerName bin/bundle.js
bsc putfile playerName src/autorun.brs
```

v2:

```
bslc file --upload --player playerName -d SD/ -f bin/bundle.js
bslc file --upload --player playerName -d SD/ -f src/autorun.brs
```

