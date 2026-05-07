# Welcome

Thank you for contributing to the BrightSign Dev Cookbook! 

## Contributing Guidelines

- **Code Style:** Please adhere to the coding conventions as defined in `.eslintrc`. Run `yarn format` before submitting.
- **Commit Messages:** Write clear, concise commit messages that explain the changes made. Use [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/) style messages.
- **Pull Requests:** For substantial changes, it's best to open an issue for discussion before submitting a pull request.

We look forward to your contributions and suggestions!


# Adding new examples

When adding a new example, follow these conventions:

1. **Place it in the correct subdirectory** based on its Node.js requirement:
   - `examples/browser/` for HTML/BrightScript examples with no Node.js dependency
   - `examples/node-14/` for examples targeting BrightSign OS 8.x (Node 14.17.6)
   - `examples/node-18/` for examples requiring BrightSign OS 9.x (Node 18+)

2. **Include an `.nvmrc` file** in every Node.js example declaring the minimum required version (e.g., `14.17.6` or `18`).

3. **Add an `engines` field** in `package.json` (if the example has one):
   ```json
   "engines": {
       "node": ">=18"
   }
   ```

4. **Add version badges** at the top of the example's README, right after the title:
   - Browser: `![Runtime: Browser](https://img.shields.io/badge/runtime-browser-blue)` and `![BrightSign OS: 8.x | 9.x](https://img.shields.io/badge/BrightSign_OS-8.x_%7C_9.x-purple)`
   - Node on player: `![Node.js: >=18](https://img.shields.io/badge/node.js-%3E%3D18-green)` and `![BrightSign OS: 9.x](https://img.shields.io/badge/BrightSign_OS-9.x-purple)`
   - Dev machine tool: `![Node.js: >=18](https://img.shields.io/badge/node.js-%3E%3D18-green)` and `![Runs on: Dev Machine](https://img.shields.io/badge/runs_on-dev_machine-orange)`

5. **Update the compatibility matrix** in `examples/README.md` with the new example.


# How to submit changes

To contribute enhancements or fixes to `dev-cookbook`, please follow these steps:

1. Fork and Clone: Start by forking the `dev-cookbook` repository. Then, clone your fork locally to make changes.

2. Make Changes: Navigate to the specific template or example you wish to improve within the `dev-cookbook` directory. Apply your changes there.

3. Test Locally: Test the template by instantiating using the command mentioned in the "Using the Template" section. This step ensures your changes work as expected within the `create-react-app` workflow. If it is an `example-*`, test your changes according to the instructions in the example Readme.

4. Commit Changes: After testing your changes, commit them to your fork. Ensure your commit messages clearly describe the enhancements or fixes made. Push your commits to GitHub.

5. Submit a Pull Request (PR): Submit a pull request to the main dev-cookbook repository. Be sure to fill out the predefined PR sections as fully as possible.

6. Code Review: Once your PR is submitted, it will be reviewed by a BrightSign team member. Be open to feedback and ready to make further adjustments based on their suggestions.

# Modifying cra-template-* examples

`cra-template-*` examples can be run on your development machine (via `yarn start`) for rapid iteration, with some caveats. The full functionality of `@brightsign` API modules are only available on the device, but we have added partial mock implementations for you to develop with locally. Please refer to the [JavaScript API Documentation](https://brightsign.atlassian.net/wiki/spaces/DOC/pages/370678188/JavaScript+APIs) for further details on each API so that you may extend the existing mocks.

You can also extend or create new tests (`App.test.js`) and run them with `yarn run test` in each example directory `dev-cookbook`, or in every workspace by running `yarn run test` at the root of the project.

If you want to contribute improvements back to `dev-cookbook`, either make your changes directly in the repo or copy them from your `create-react-app` project after you have verified them locally and on a device. Be sure to maintain the same directory structure.


# Git hooks

`dev-cookbook` uses [husky](https://typicode.github.io/husky/) to automatically run `eslint` and `prettier` on commit to maintain code quality. There is also a hook to run tests before pushing to a remote branch. If you would like to suggest improvements, take a look at the hooks configuration in the `.husky` directory.


# How to report a bug

Create a new issue. Be sure to describe the bug and provide clear repro steps.

# How to request new examples

Create a new issue. Describe the problem you are trying to solve and why a new example would be useful. A BrightSign team member will review.

# Copyright

By contributing to this repo, you agree to license any code submitted under the MIT license. For larger contributions, we may request a Contributor License Agreement.