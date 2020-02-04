#!/usr/bin/env node
'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _child_process = require('child_process');

var _mustache = require('mustache');

var _mustache2 = _interopRequireDefault(_mustache);

var _logSymbols = require('log-symbols');

var _logSymbols2 = _interopRequireDefault(_logSymbols);

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PROJECT_ROOT = _path2.default.join(__dirname, '../../');

process.stdout.write('\n-------- ' + _logSymbols2.default.info + ' Check the operating environment --------\n');

var checkNode = (0, _ora2.default)('Check Node.js Version').start();
try {
  var nodeVersion = (0, _child_process.execSync)('node --version');
  if (parseFloat(nodeVersion, 10) < 6) {
    checkNPM.fail('Unsupported node.js version, minimum support v6.');
    process.exit(1);
  }
  checkNode.stop();
  checkNode.stream.write(_logSymbols2.default.success + ' Node.js - ' + nodeVersion);
} catch (error) {
  checkNPM.fail(error || 'Please make sure you have the Node.js ready!');
  process.exit(1);
}

var hasNPM = false;
var checkNPM = (0, _ora2.default)('Check NPM Version').start();
try {
  var npmVersion = (0, _child_process.execSync)('npm --version');
  checkNPM.stop();
  checkNPM.stream.write(_logSymbols2.default.success + ' NPM version - v' + npmVersion);
  if (parseFloat(npmVersion, 10) < 4) {
    process.stdout.write(_logSymbols2.default.warning + ' We suggest using npm 5 or Yarn.');
  }
  hasNPM = true;
} catch (error) {
  checkNPM.fail(error || 'Please make sure you have the NPM ready!');
  process.exit(1);
}

var hasYarn = false;
var checkYarn = (0, _ora2.default)('Check Yarn Version').start();
try {
  var yarnVersion = (0, _child_process.execSync)('yarn --version');
  checkYarn.stop();
  checkYarn.stream.write(_logSymbols2.default.success + ' Yarn version - v' + yarnVersion);
  hasYarn = true;
} catch (error) {
  checkYarn.fail(error || 'Please make sure you have the NPM ready!');
  process.exit(1);
}

process.stdout.write('\n-------- ' + _logSymbols2.default.info + ' Please complete the configuration --------\n');

var prompts = [{
  type: 'input',
  name: 'name',
  message: 'project name: ',
  default: function _default() {
    var projectPathParse = _path2.default.parse(process.cwd());
    return projectPathParse && projectPathParse.name ? projectPathParse.name : '';
  }
}, {
  type: 'confirm',
  name: 'private',
  message: 'private: ',
  default: true
}, {
  type: 'input',
  name: 'description',
  message: 'description: '
}, {
  type: 'input',
  name: 'version',
  message: 'version: ',
  default: '0.0.0'
}, {
  type: 'input',
  name: 'main',
  message: 'entry point: ',
  default: 'index.js'
}, {
  type: 'input',
  name: 'repository',
  message: 'repository url: '
}, {
  name: 'author',
  message: 'author: '
}, {
  type: 'list',
  name: 'license',
  message: 'choose license: ',
  choices: ['none', 'APACHE', 'BSD', 'GPL', 'MIT', 'MPL']
}, {
  type: 'list',
  name: 'template',
  message: 'choose template: ',
  choices: ['none', {
    name: 'F.I.S',
    value: 'fis'
  }, {
    name: 'Webpack',
    value: 'webpack'
  }]
}];

if (hasNPM && hasYarn) {}

_inquirer2.default.prompt(prompts).then(function (answers) {
  process.stdout.write('\n-------- ' + _logSymbols2.default.info + ' Project start revitalizing --------\n');

  var makeLicense = (0, _ora2.default)('start make license file').start();
  switch (answers.license.toUpperCase()) {
    case 'APACHE':
    case 'BSD':
    case 'GPL':
    case 'MIT':
    case 'MPL':
      {
        var year = new Date().getUTCFullYear();
        try {
          var licenseTpl = _fs2.default.readFileSync(_path2.default.join(PROJECT_ROOT, 'internals/templates/licenses', answers.license.toUpperCase()), { encoding: 'utf8' });
          var licenseContent = _mustache2.default.render(licenseTpl, {
            year: year,
            author: answers.author
          });
          _fs2.default.writeFileSync(_path2.default.join(PROJECT_ROOT, 'LICENSE'), licenseContent, {
            encoding: 'utf8'
          });
          makeLicense.stop();
          makeLicense.stream.write(_logSymbols2.default.success + ' LICENSE, create success by ' + answers.license + ' template.');
        } catch (error) {
          makeLicense.fail(error || 'LICENSE, make fail');
        }
        break;
      }
    case 'NONE':
    default:
      {
        makeLicense.stream.write('license unneeded');
        (0, _child_process.execSync)('rm -f ' + _path2.default.join(PROJECT_ROOT, 'LICENSE'));
        makeLicense.stop();
        makeLicense.stream.write(_logSymbols2.default.success + ' LICENSE, delete success');
      }
  }

  if (answers.template === 'fis') {
    var useTemplate = (0, _ora2.default)('start sync template file').start();
    var templatePath = _path2.default.join(PROJECT_ROOT, 'internals/templates/fis');
    try {
      makeLicense.stream.write('clean old project file');
      (0, _child_process.execSync)('rm -Rf ' + _path2.default.join(PROJECT_ROOT, 'src'));
      (0, _child_process.execSync)('rm -Rf ' + _path2.default.join(PROJECT_ROOT, 'dist'));

      makeLicense.stream.write('sync template file');
      (0, _child_process.execSync)('cp -f ' + _path2.default.join(templatePath, '.babelrc') + ' ' + _path2.default.join(PROJECT_ROOT, '.babelrc'));
      (0, _child_process.execSync)('cp -f ' + _path2.default.join(templatePath, 'fis-conf.js') + ' ' + _path2.default.join(PROJECT_ROOT, 'fis-conf.js'));
      (0, _child_process.execSync)('rm -Rf ' + _path2.default.join(PROJECT_ROOT, 'dist'));

      useTemplate.stop();
      useTemplate.stream.write(_logSymbols2.default.success + ' LICENSE, delete success');
    } catch (error) {
      useTemplate.fail(error || 'sync template fail');
    }
  } else if (answers.template === 'webpack') {
    var _useTemplate = (0, _ora2.default)('start sync template file').start();
  }

  var makePackage = (0, _ora2.default)('start make package.json').start();
  try {
    makePackage.text = 'read package template file.';
    var packageTpl = _fs2.default.readFileSync(_path2.default.join(PROJECT_ROOT, 'package.json'), { encoding: 'utf8' });

    makePackage.text = 'parse package template to plain object.';
    var packageTplPlainObject = JSON.parse(packageTpl);

    makePackage.text = 'merge answers.';
    (0, _assign2.default)(packageTplPlainObject, answers);

    makePackage.text = 'clean keywords.';
    packageTplPlainObject.keywords = [];

    makePackage.text = 'clean scripts.';
    packageTplPlainObject.scripts = (0, _keys2.default)(packageTplPlainObject.scripts).filter(function (scriptName) {
      return ['prebuild', 'build', 'lint', 'test', 'semantic-release'].includes(scriptName);
    }).reduce(function (scripts, scriptName) {
      return (0, _assign2.default)({}, scripts, (0, _defineProperty3.default)({}, scriptName, packageTplPlainObject.scripts[scriptName]));
    }, {});

    makePackage.text = 'clean dependencies.';
    packageTplPlainObject.dependencies = {};


    makePackage.text = 'write package.json file.';
    _fs2.default.writeFileSync(_path2.default.join(PROJECT_ROOT, 'package.json'), (0, _stringify2.default)(packageTplPlainObject, null, 2), { encoding: 'utf8' });

    makePackage.stop();
    makePackage.stream.write(_logSymbols2.default.success + ' package.json, make success');
  } catch (error) {
    makePackage.fail(error || 'package.json, make fail');
  }

  var cleanCache = (0, _ora2.default)('clean npm cache').start();
  try {
    (0, _child_process.execSync)('rm -f ' + _path2.default.join(PROJECT_ROOT, 'package-lock.json'));
    (0, _child_process.execSync)('rm -f ' + _path2.default.join(PROJECT_ROOT, 'yarn.lock'));
    (0, _child_process.execSync)('rm -rf ' + _path2.default.join(PROJECT_ROOT, 'node_modules'));
    (0, _child_process.execSync)('rm -rf ' + _path2.default.join(PROJECT_ROOT, 'internals'));
    cleanCache.succeed('npm cache, clean success!');
  } catch (error) {
    cleanCache.fail(error || 'npm cache, clean fail');
  }

  var installDependencies = (0, _ora2.default)((hasYarn ? 'yarn' : 'npm') + ' install dependencies').start();
  try {
    var installResult = (0, _child_process.execSync)((hasYarn ? 'yarn' : 'npm') + ' install');
    process.stdout.write(installResult);
    installDependencies.succeed('npm dependencies, install success!');
  } catch (error) {
    installDependencies.fail(error || 'npm dependencies, install fail');
  }

  var reinitGit = (0, _ora2.default)('git repository reinitialization').start();
  try {
    reinitGit.text = 'remove old git repository data';
    (0, _child_process.execSync)('rm -rf ' + _path2.default.join(PROJECT_ROOT, '.git'));

    reinitGit.text = 'git repository reinitializing';
    (0, _child_process.execSync)('git init && git add . && git commit -m "Initial commit"');

    reinitGit.succeed('git repository reinitialize success!');
  } catch (error) {
    reinitGit.fail(error || 'git repository, reinitialize fail');
  }

  process.stdout.write('\n======== ' + _logSymbols2.default.info + ' Project revitalizing done ========\n');
}).catch(function (err) {
  process.stdout.write(_logSymbols2.default.error + ' ' + err);
  process.exit(1);
});
