# Node.js Project Kit

[![Build Status](https://travis-ci.org/tonyc726/node-project-kit.svg?style=flat-square&branch=master)](https://travis-ci.org/tonyc726/node-project-kit)
[![node](https://img.shields.io/node/v/gh-badges.svg?style=flat-square)](https://github.com/tonyc726/node-project-kit)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://github.com/tonyc726/node-project-kit)

A boilerplate helps you create node project easier.

## Usage

1. Fork this repository to your git account
2. Change remote set URL to your own repository
3. Change package.json, readme.md and license with your project relevant information
4. Replace contents in src/*, as per your requirements
5. Install dependencies
```
npm install
```

## Dependencies

### Modules for development
1. Transpiler:
    * "babel-cli" -> Command Line Interface for Babel (Convert ES6 -> ES5)
    * "babel-preset-env" -> Babel preset that automatically determines the Babel plugins you need based on your supported environments
    * "babel-runtime" & "babel-plugin-transform-runtime" -> Babel runtime transform plugin
2. Testing:
    * "Jest" -> Delightful JavaScript Testing
3. Linting:
    * "eslint" -> AST based pattern checker for JavaScript
4. Utilities:
    * "rimraf" -> deep deletion module platform-independent
    * "cross-env" -> set node environment variables platform-independent
    * "npm-run-all" -> Command Line Interface to run multiple npm-scripts in parallel or sequential

### Configuration Files

1. .babelrc -> options to configure Babel Transpiler
2. .editorconfig -> define and maintain consistent coding styles
3. .eslintrc -> options for ES Lint checking tool
4. .eslintignore -> ignore list for ES Lint
5. .travis.yml -> automation script for Travis CI
6. .gitattributes -> attributes to configure git
7. .gitignore -> ignore generated files and folders
8. webpack.config.babel.js -> options for Webpack module bundler

## Directory Layout
```
├── .babelrc
├── .editorconfig
├── .eslintignore
├── .eslintrc
├── .gitattributes
├── .gitignore
├── .travis.yml
├── LICENSE
├── README.md
├── dist
│   └── index.js
├── package.json
├── src
│   ├── index.js
│   └── index.test.js
└── yarn.lock
```

## License

Copyright © 2017-present. This source code is licensed under the MIT license found in the
[LICENSE](https://github.com/tonyc726/node-project-kit/blob/master/LICENSE) file.

---
Made with ♥ by Tony ([blog](https://itony.net))
