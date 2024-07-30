# Templates

## Quickstart

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
```

The template can be quickly published to your BrightSign with the DWS enabled. Replace `your.device.ip.address` and `yourdeviceserialnumber` with your actual device IP and serial number. The serial number is typically the default password.

```
# (Optional) Push the template to your Brightsign device
PLAYER=your.device.ip.address PLAYER_PW=yourdeviceserialnumber yarn run put:prod 
```

## What are the cra-template-* examples?

They are React [Custom Templates](https://create-react-app.dev/docs/custom-templates/). They allow developers to quickly bootstrap a React application with custom code tailored to Brightsign development.

COMING SOON: You can install any of our templates by running `npx create-react-app bs-app --template [template-name]`, without having to pull the `dev-cookbook` repo.

`cra-template-brightsign-app` is a minimal example of displaying a web app on a device.

`cra-template-brightsign-dashboard` is a more complete example that leverages `@brightsign/` built-in packages to display device data.