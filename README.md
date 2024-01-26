# Introduction

Welcome to the BrightSign Dev Cookbook! Here you will find example code and projects for your BrightSign devices that demonstrate various capabilities. 

# Prerequisites

We recommend managing your node.js version using `nvm`. The preferred version is `14.17.6`.

# Feedback/Contributing

If you find any bugs or have suggestions for new examples, please let us know by opening an issue.

## Getting Started

This monorepo uses `yarn workspaces` to manage dependencies. Simply run `yarn install` from the workspace root and explore the examples!

### example-node-simple-server

### 


### Building on M1 Mac
You might see an error like `npm ERR! Error: Cannot find module 'node-bin-darwin-arm64/package.json'`

Run the following commands
```
> node -v
v14.17.6
> node -p process.arch
arm64
> arch -x86_64 zsh
> nvm uninstall 14.17.6 && nvm install 14.17.6
```

You might need to do this each time you restart your terminal.

https://stackoverflow.com/questions/68896696/having-trouble-installing-npm-on-mac-m1