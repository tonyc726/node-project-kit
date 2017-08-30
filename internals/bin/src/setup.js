#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

import mustache from 'mustache';
import logSymbols from 'log-symbols';
import ora from 'ora';
import inquirer from 'inquirer';

// 项目根目录
const PROJECT_ROOT = path.join(__dirname, '../../');

// 检查运行环境
process.stdout.write(`\n-------- ${logSymbols.info} Check the operating environment --------\n`);

const checkNode = ora('Check Node.js Version').start();
try {
  const nodeVersion = execSync('node --version');
  if (parseFloat(nodeVersion, 10) < 6) {
    checkNPM.fail('Unsupported node.js version, minimum support v6.');
    process.exit(1);
  }
  checkNode.stop();
  checkNode.stream.write(`${logSymbols.success} Node.js - ${nodeVersion}`);
} catch (error) {
  checkNPM.fail(error || 'Please make sure you have the Node.js ready!');
  process.exit(1);
}

let hasNPM = false;
const checkNPM = ora('Check NPM Version').start();
try {
  const npmVersion = execSync('npm --version');
  checkNPM.stop();
  checkNPM.stream.write(`${logSymbols.success} NPM version - v${npmVersion}`);
  if (parseFloat(npmVersion, 10) < 4) {
    process.stdout.write(`${logSymbols.warning} We suggest using npm 5 or Yarn.`);
  }
  hasNPM = true;
} catch (error) {
  checkNPM.fail(error || 'Please make sure you have the NPM ready!');
  process.exit(1);
}

let hasYarn = false;
const checkYarn = ora('Check Yarn Version').start();
try {
  const yarnVersion = execSync('yarn --version');
  checkYarn.stop();
  checkYarn.stream.write(`${logSymbols.success} Yarn version - v${yarnVersion}`);
  hasYarn = true;
} catch (error) {
  checkYarn.fail(error || 'Please make sure you have the NPM ready!');
  process.exit(1);
}

process.stdout.write(`\n-------- ${logSymbols.info} Please complete the configuration --------\n`);
// inquirer prompts
const prompts = [
  {
    type: 'input',
    name: 'name',
    message: 'project name: ',
    default() {
      const projectPathParse = path.parse(process.cwd());
      return projectPathParse && projectPathParse.name ? projectPathParse.name : '';
    },
  },
  {
    type: 'confirm',
    name: 'private',
    message: 'private: ',
    default: true,
  },
  {
    type: 'input',
    name: 'description',
    message: 'description: ',
  },
  {
    type: 'input',
    name: 'version',
    message: 'version: ',
    default: '0.0.0',
  },
  {
    type: 'input',
    name: 'main',
    message: 'entry point: ',
    default: 'index.js',
  },
  {
    type: 'input',
    name: 'repository',
    message: 'repository url: ',
  },
  {
    name: 'author',
    message: 'author: ',
  },
  {
    type: 'input',
    name: 'license',
    message: 'license: ',
    default: 'MIT',
  },
];

if (hasNPM && hasYarn) {
  //
}

inquirer
  .prompt(prompts)
  .then((answers) => {
    process.stdout.write(`\n-------- ${logSymbols.info} Project start revitalizing --------\n`);
    // make LICESEN
    const makeLicense = ora('start make license file').start();
    if (answers.license && answers.license.length !== 0) {
      if ((/(APACHE|BSD|GPL|MIT|MPL)/i).test(answers.license.toUpperCase())) {
        const year = (new Date()).getUTCFullYear();
        try {
          const licenseTpl = fs.readFileSync(path.join(PROJECT_ROOT, 'internals/templates/licenses', answers.license.toUpperCase()), { encoding: 'utf8' });
          const licenseContent = mustache.render(licenseTpl, {
            year,
            author: answers.author,
          });
          fs.writeFileSync(path.join(PROJECT_ROOT, 'LICENSE'), licenseContent, { encoding: 'utf8' });
          makeLicense.stop();
          makeLicense.stream.write(`${logSymbols.success} LICENSE, create success by ${answers.license} template.`);
        } catch (error) {
          makeLicense.fail(error || 'LICENSE, make fail');
        }
      } else {
        fs.writeFileSync(path.join(PROJECT_ROOT, 'LICENSE'), '', { encoding: 'utf8' });
        makeLicense.stop();
        makeLicense.stream.write(`${logSymbols.success} LICENSE, clean success`);
      }
    } else {
      makeLicense.stream.write('license config unfound, delete the license file');
      execSync(`rm -f ${path.join(PROJECT_ROOT, 'LICENSE')}`);
      makeLicense.stop();
      makeLicense.stream.write(`${logSymbols.success} LICENSE, delete success`);
    }

    // make package.json
    const makePackage = ora('start make package.json').start();
    try {
      makePackage.text = 'read package template file.';
      const packageTpl = fs.readFileSync(path.join(PROJECT_ROOT, 'package.json'), { encoding: 'utf8' });

      makePackage.text = 'parse package template to plain object.';
      const packageTplPlainObject = JSON.parse(packageTpl);

      makePackage.text = 'merge answers.';
      Object.assign(packageTplPlainObject, answers);

      makePackage.text = 'clean keywords.';
      packageTplPlainObject.keywords = [];

      makePackage.text = 'clean scripts.';
      packageTplPlainObject.scripts = Object.keys(packageTplPlainObject.scripts)
        .filter((scriptName) => ([
          'prebuild', 'build', 'lint', 'test', 'semantic-release',
        ].includes(scriptName)))
        .reduce((scripts, scriptName) => (
          Object.assign({}, scripts, {
            [scriptName]: packageTplPlainObject.scripts[scriptName],
          })
        ), {});

      makePackage.text = 'clean dependencies.';
      packageTplPlainObject.dependencies = {};
      // packageTplPlainObject.dependencies = Object.keys(packageTplPlainObject.dependencies)
      //   .filter((moduleName) => ([
      //     'babel-runtime',
      //   ].includes(moduleName)))
      //   .reduce((dependencies, moduleName) => (
      //     Object.assign({}, dependencies, {
      //       [moduleName]: packageTplPlainObject.dependencies[moduleName],
      //     })
      //   ), {});

      makePackage.text = 'write package.json file.';
      fs.writeFileSync(path.join(PROJECT_ROOT, 'package.json'), JSON.stringify(packageTplPlainObject, null, 2), { encoding: 'utf8' });

      makePackage.stop();
      makePackage.stream.write(`${logSymbols.success} package.json, make success`);
    } catch (error) {
      makePackage.fail(error || 'package.json, make fail');
    }

    // clean yarn & npm cache
    const cleanCache = ora('clean npm cache').start();
    try {
      execSync(`rm -f ${path.join(PROJECT_ROOT, 'package-lock.json')}`);
      execSync(`rm -f ${path.join(PROJECT_ROOT, 'yarn.lock')}`);
      execSync(`rm -rf ${path.join(PROJECT_ROOT, 'node_modules')}`);
      execSync(`rm -rf ${path.join(PROJECT_ROOT, 'internals')}`);
      cleanCache.succeed('npm cache, clean success!');
    } catch (error) {
      cleanCache.fail(error || 'npm cache, clean fail');
    }

    // install dependencies
    const installDependencies = ora(`${hasYarn ? 'yarn' : 'npm'} install dependencies`).start();
    try {
      const installResult = execSync(`${hasYarn ? 'yarn' : 'npm'} install`);
      process.stdout.write(installResult);
      installDependencies.succeed('npm dependencies, install success!');
    } catch (error) {
      installDependencies.fail(error || 'npm dependencies, install fail');
    }

    // reset git
    const reinitGit = ora('git repository reinitialization').start();
    try {
      reinitGit.text = 'remove old git repository data';
      execSync(`rm -rf ${path.join(PROJECT_ROOT, '.git')}`);

      reinitGit.text = 'git repository reinitializing';
      execSync('git init && git add . && git commit -m "Initial commit"');

      reinitGit.succeed('git repository reinitialize success!');
    } catch (error) {
      reinitGit.fail(error || 'git repository, reinitialize fail');
    }

    process.stdout.write(`\n======== ${logSymbols.info} Project revitalizing done ========\n`);
  })
  .catch((err) => {
    process.stdout.write(`${logSymbols.error} ${err}`);
    process.exit(1);
  });
