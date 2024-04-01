# Introduction

Welcome to the BrightSign Dev Cookbook! Here you will find example code and projects for your [BrightSign](https://www.brightsign.biz/) digital signage devices that demonstrate various capabilities.

Whether you're a beginner eager to dive into BrightSign development, or an advanced developer looking to expand your skills, this cookbook offers a wide range of examples to demonstrate the capabilities of these devices.

# Project structure

Here's an overview of the project structure and what each part is responsible for:

`cra-template-*`    : React templates for new projects with custom configurations tailored for BrightSign development.
`example-*`         : A collection of examples demonstrating different capabilities and how to implement them on your BrightSign device.
`.github/`          : Contains GitHub Actions configurations for automated build and deployment processes.
`scripts/`          : Utility scripts to facilitate build, deployment, and development workflows.
`.eslintrc`         : Lint configuration to ensure code quality and consistency across the project.
`package.json`      : Manages project dependencies and scripts for an efficient development workflow.


# Prerequisites

This repo is intended for developers who are familiar with Node.js, React, and running scripts that connect to devices over a local network.

We recommend managing your node.js version using [nvm](https://github.com/nvm-sh/nvm/blob/master/README.md). The preferred version is `14.17.6` since this is the version currently pre-installed on most Brightsign devices.

# Quickstart

```zsh
# Install the correct node.js version
nvm install 14.17.6

# Clone the repo
git clone https://github.com/brightsign/dev-cookbook.git

# Bootstrap a new React application:
npx create-react-app bs-app --template file:./dev-cookbook/cra-template-brightsign-app

# Run the example locally
cd bs-app
yarn && yarn start

# (Optional) Push the example to your Brightsign device
PLAYER=your.device.ip.address PLAYER_PW=yourdeviceserialnumber yarn run put:prod 

```

Replace `your.device.ip.address` and `yourdeviceserialnumber` with your actual device IP and serial number. The serial number is typically the default password.

# What are the cra-template-* examples?
They are React [Custom Templates](https://create-react-app.dev/docs/custom-templates/). They allow developers to quickly bootstrap a React application with custom code tailored to Brightsign development. 

COMING SOON: You can install any of our templates by running `npx create-react-app bs-app --template [template-name]`, without having to pull the `dev-cookbook` repo.

`cra-template-brightsign-app` is a minimal example of displaying a web app on a device. 

`cra-template-brightsign-dashboard` is a more complete example that leverages `@brightsign/` built-in packages to display device data.

# Feedback/Contributing

## Contributing Guidelines

- **Code Style:** Please adhere to the coding conventions as defined in `.eslintrc`. Run `yarn format` before submitting.
- **Commit Messages:** Write clear, concise commit messages that explain the changes made.
- **Pull Requests:** For substantial changes, it's best to open an issue for discussion before submitting a pull request.

We look forward to your contributions and suggestions!

## Getting Started

This monorepo uses [yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/) to manage dependencies and run commands. Simply run `yarn install` from the workspace root and explore the examples!

To run the tests for every example, run `yarn workspaces run test` or the shortcut `yarn test`.

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