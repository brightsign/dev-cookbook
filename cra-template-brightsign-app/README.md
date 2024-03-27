## Using the template

Ensure that you have the right version of Node.js installed (`14.17.6`) as this is what is best supported by BrightSign devices at the moment.

This project is a custom `create-react-app` template. Clone the repo and then run the following command in the root of your project directory to instantiate the project. Be sure to set the `file:/` path correctly.

```
npx create-react-app bsignapp --template file:/path/to/dev-cookbook/cra-template-brightsign-app
```

Once the app is ready, simply follow the instructions in the project `readme` to deploy to your device. Be aware that it is not possible to build and run the app locally if you are using `@brightsign/` packages (for example in `src/App.js`), since they are currently only available on-device.

## Contributing to the template

If you wish to make changes to the template, make your changes in `dev-cookbook` and run `npx create-react-app` again to copy your changes over. Feel free to submit a PR if you want to contribute to the main project.
