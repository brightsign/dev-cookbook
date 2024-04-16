## Using the template

Ensure that you have the right version of Node.js installed (`14.17.6`) as this is what is best supported by BrightSign devices at the moment.

This project is a custom `create-react-app` template. Clone the repo and then run the following command in the root of your project directory to instantiate the project. Be sure to set the `file:/` path to the location where `/template` and `/template.json` reside.

```
npx create-react-app bs-app --template file:/path/to/dev-cookbook/cra-template-brightsign-app
```

Once the app is ready, simply follow the instructions in the project `readme` to deploy to your device. When you run the app locally using `yarn start`, mocked `@brightsign/` JavaScript APIs will be used.

**For more info**, see [/template/README.md](./template/README.md)

## Contributing to the template

To contribute enhancements or fixes to the template, please follow these steps:

1. Fork and Clone: Start by forking the `dev-cookbook` repository. Then, clone your fork locally to make changes.

2. Make Changes: Navigate to the specific template you wish to improve within the dev-cookbook directory. Apply your changes there.

3. Test Locally: Test the template by instantiating using the command mentioned in the "Using the Template" section. This step ensures your changes work as expected within the create-react-app workflow.

4. Commit Changes: After testing your changes, commit them to your fork. Ensure your commit messages clearly describe the enhancements or fixes made. Push your commits to GitHub.

5. Submit a Pull Request (PR): Submit a pull request to the main dev-cookbook repository. Be sure to fill out the predefined PR sections as fully as possible.

6. Code Review: Once your PR is submitted, it will be reviewed by a BrightSign team member. Be open to feedback and ready to make further adjustments based on their suggestions.
